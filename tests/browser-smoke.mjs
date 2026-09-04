import { spawn } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, relative, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

const assertCondition = (condition, detail) => {
  if (!condition) {
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
};

const getFreePort = () => new Promise((resolvePort, reject) => {
  const server = createServer();
  server.on("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    server.close(() => resolvePort(port));
  });
});

const startStaticServer = () => new Promise((resolveServer, reject) => {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      const relativePath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
      const filePath = resolve(join(rootDir, relativePath));
      const traversal = relative(rootDir, filePath).startsWith("..");
      assertCondition(!traversal, "Path traversal blocked");
      const body = await readFile(filePath);
      res.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  server.on("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    resolveServer({ port, server });
  });
});

const closeServer = (server) => new Promise((resolveClose) => server.close(resolveClose));

const requestJson = (port, method, path) => new Promise((resolveJson, reject) => {
  const outgoing = httpRequest({ host: "127.0.0.1", port, path, method }, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      try {
        resolveJson(JSON.parse(body));
      } catch (error) {
        reject(new Error(`Invalid JSON response: ${body.slice(0, 160)} (${error.message})`));
      }
    });
  });
  outgoing.on("error", reject);
  outgoing.end();
});

const findChromeBinary = () => {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);
  const chrome = candidates.find((candidate) => existsSync(candidate));
  assertCondition(chrome, "Set CHROME_BIN to a Chrome or Chromium executable.");
  return chrome;
};

const waitForChrome = async (port) => {
  const start = Date.now();
  while (Date.now() - start < 7000) {
    try {
      const version = await requestJson(port, "GET", "/json/version");
      if (version.webSocketDebuggerUrl) {
        return version;
      }
    } catch {
      await delay(100);
    }
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
};

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
    this.logs = [];
  }

  async connect() {
    assertCondition(typeof WebSocket !== "undefined", "Node with global WebSocket support is required.");
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onmessage = (event) => this.handleMessage(event);
    await new Promise((resolveOpen, reject) => {
      this.ws.onopen = resolveOpen;
      this.ws.onerror = reject;
    });
  }

  handleMessage(event) {
    const msg = JSON.parse(event.data);
    if (msg.id && this.pending.has(msg.id)) {
      const { resolveCommand, rejectCommand } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) {
        rejectCommand(new Error(msg.error.message));
        return;
      }
      resolveCommand(msg.result || {});
      return;
    }
    if (msg.method === "Runtime.exceptionThrown") {
      this.logs.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    }
    if (msg.method === "Runtime.consoleAPICalled" && !["debug", "info"].includes(msg.params.type)) {
      this.logs.push(msg.params.args.map((arg) => arg.value || arg.description || "").join(" "));
    }
    if (msg.method === "Log.entryAdded" && ["error", "warning"].includes(msg.params.entry.level)) {
      this.logs.push(msg.params.entry.text);
    }
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveCommand, rejectCommand) => {
      this.pending.set(id, { resolveCommand, rejectCommand });
      setTimeout(() => {
        if (!this.pending.has(id)) {
          return;
        }
        this.pending.delete(id);
        rejectCommand(new Error(`CDP timeout: ${method}`));
      }, 7000);
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result?.value;
  }

  async waitFor(expression, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = await this.evaluate(expression);
      if (value) {
        return value;
      }
      await delay(80);
    }
    throw new Error(`Timed out waiting for ${expression}`);
  }

  close() {
    this.ws?.close();
  }
}

const check = async (checks, name, fn) => {
  try {
    const detail = await fn();
    checks.push({ detail, name, status: "pass" });
  } catch (error) {
    checks.push({ detail: error.message, name, status: "fail" });
  }
};

const launchChrome = async (debugPort, userDataDir) => {
  const chrome = spawn(findChromeBinary(), [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ], { stdio: "ignore" });
  await waitForChrome(debugPort);
  return chrome;
};

const main = async () => {
  const { port: sitePort, server } = await startStaticServer();
  const chromePort = await getFreePort();
  const userDataDir = await mkdtemp(join(tmpdir(), "rosuzet-browser-smoke-"));
  let browser = null;
  let cdp = null;

  try {
    browser = await launchChrome(chromePort, userDataDir);
    const tab = await requestJson(chromePort, "PUT", `/json/new?${encodeURIComponent("about:blank")}`);
    cdp = new CdpClient(tab.webSocketDebuggerUrl);
    await cdp.connect();
    const checks = [];
    const siteUrl = `http://127.0.0.1:${sitePort}/`;

    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Page.enable");
    await cdp.send("Page.navigate", { url: siteUrl });
    await cdp.waitFor("document.readyState === 'complete'");
    await cdp.evaluate("sessionStorage.clear(); localStorage.clear(); location.reload(); true");
    await cdp.waitFor("document.readyState === 'complete' && !!document.querySelector('#loginForm')");

    await check(checks, "login gate locked by default", () => cdp.evaluate(`(() => ({
      locked: document.body.classList.contains("auth-locked"),
      loginHidden: document.querySelector("#loginScreen").hidden,
      contentInert: [...document.querySelectorAll("[data-auth-content]")].every((node) => node.inert)
    }))()`).then((result) => {
      assertCondition(result.locked && !result.loginHidden && result.contentInert, result);
      return result;
    }));

    await check(checks, "valid login unlocks app", () => cdp.evaluate(`(() => {
      document.querySelector("#loginId").value = "CVD1";
      document.querySelector("#loginPassword").value = "CVD1";
      document.querySelector("#loginForm").dispatchEvent(new SubmitEvent("submit", { bubbles: true, cancelable: true }));
      return {
        unlocked: document.body.classList.contains("auth-unlocked"),
        loginHidden: document.querySelector("#loginScreen").hidden,
        contentReady: [...document.querySelectorAll("[data-auth-content]")].every((node) => !node.inert)
      };
    })()`).then((result) => {
      assertCondition(result.unlocked && result.loginHidden && result.contentReady, result);
      return result;
    }));

    await check(checks, "top page navigation shows one page group at a time", async () => {
      const pages = ["home", "foundation", "strategy", "evidence", "execution", "library", "sources"];
      const results = [];
      for (const page of pages) {
        await cdp.evaluate(`document.querySelector('[data-page-link="${page}"]').click(); true`);
        await cdp.waitFor(`document.body.dataset.currentPage === "${page}"`);
        const result = await cdp.evaluate(`(() => ({
            page: document.body.dataset.currentPage,
            activeLinks: [...document.querySelectorAll("[data-page-link].is-active")].map((node) => node.dataset.pageLink),
            visiblePages: [...new Set([...document.querySelectorAll("[data-page]:not([hidden])")].map((node) => node.dataset.page))]
          }))()`);
        results.push({ requested: page, ...result });
      }
      const bad = results.filter((result) => result.page !== result.requested || result.activeLinks[0] !== result.requested || result.visiblePages.some((page) => page !== result.requested));
      assertCondition(bad.length === 0, bad);
      return results;
    });

    await check(checks, "global search form submit is prevented", () => cdp.evaluate(`(() => {
      const input = document.querySelector("#globalSearch");
      const root = document.querySelector("#globalSearchResults");
      input.value = "RACING";
      input.dispatchEvent(new InputEvent("input", { bubbles: true }));
      const event = new SubmitEvent("submit", { bubbles: true, cancelable: true });
      const dispatchAllowed = input.closest("form").dispatchEvent(event);
      return {
        defaultPrevented: event.defaultPrevented,
        dispatchAllowed,
        resultCount: root.querySelectorAll("a").length
      };
    })()`).then((result) => {
      assertCondition(result.defaultPrevented && !result.dispatchAllowed && result.resultCount > 0, result);
      return result;
    }));

    await check(checks, "source hub filters results", async () => {
      await cdp.evaluate(`location.hash = "#sources"; true`);
      await cdp.waitFor(`document.body.dataset.currentPage === "sources"`);
      return cdp.evaluate(`(() => {
        const category = document.querySelector("#sourceCategoryFilter");
        const button = [...document.querySelectorAll("#sourceStatusFilter button")].find((node) => node.textContent.includes("Follow"));
        category.value = "가격";
        category.dispatchEvent(new Event("change", { bubbles: true }));
        button.click();
        return {
          count: document.querySelector("#sourceHubCount").textContent,
          text: document.querySelector("#sourceHubGrid").textContent
        };
      })()`).then((result) => {
        assertCondition(result.count === "1 sources" && /HIRA|급여/.test(result.text), result);
        return result;
      });
    });

    await check(checks, "source hub shows an empty state", async () => {
      await cdp.evaluate(`location.hash = "#sources"; true`);
      await cdp.waitFor(`document.body.dataset.currentPage === "sources"`);
      return cdp.evaluate(`(() => {
        const category = document.querySelector("#sourceCategoryFilter");
        const button = [...document.querySelectorAll("#sourceStatusFilter button")].find((node) => node.textContent === "Found");
        category.value = "허가";
        category.dispatchEvent(new Event("change", { bubbles: true }));
        button.click();
        return {
          count: document.querySelector("#sourceHubCount").textContent,
          text: document.querySelector("#sourceHubGrid").textContent
        };
      })()`).then((result) => {
        assertCondition(result.count === "0 sources" && result.text.includes("검색 조건에 맞는 출처가 없습니다."), result);
        return result;
      });
    });

    const viewportChecks = [];
    for (const viewport of [
      { height: 720, scale: 1, width: 2048 },
      { height: 820, scale: 1, width: 1180 },
      { height: 844, scale: 2, width: 390 }
    ]) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: viewport.scale,
        height: viewport.height,
        mobile: viewport.width < 760,
        width: viewport.width
      });
      await cdp.evaluate("location.hash = '#foundation'; true");
      await cdp.waitFor("document.body.dataset.currentPage === 'foundation'");
      viewportChecks.push(await cdp.evaluate(`(() => {
        const visible = (selector) => [...document.querySelectorAll(selector)].filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
        });
        const headerNodes = visible(".app-header > .brand, .app-header > .page-nav, .app-header > .session-actions");
        const overlapPairs = [];
        for (let i = 0; i < headerNodes.length; i += 1) {
          for (let j = i + 1; j < headerNodes.length; j += 1) {
            const a = headerNodes[i].getBoundingClientRect();
            const b = headerNodes[j].getBoundingClientRect();
            const area = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            if (area > 2) {
              overlapPairs.push([headerNodes[i].className, headerNodes[j].className, area]);
            }
          }
        }
        return {
          activePage: document.body.dataset.currentPage,
          overflowX: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - document.documentElement.clientWidth,
          overlapPairs,
          width: innerWidth
        };
      })()`));
    }
    checks.push({
      detail: viewportChecks,
      name: "viewport layout has no global horizontal overflow or header overlap",
      status: viewportChecks.every((item) => item.overflowX <= 1 && item.overlapPairs.length === 0) ? "pass" : "fail"
    });

    checks.push({
      detail: cdp.logs,
      name: "browser console has no warnings or errors",
      status: cdp.logs.length === 0 ? "pass" : "fail"
    });

    const failures = checks.filter((result) => result.status !== "pass");
    assertCondition(failures.length === 0, { failures });
    process.stdout.write(`${JSON.stringify({ checks: checks.map(({ name, status }) => ({ name, status })), status: "pass" }, null, 2)}\n`);
  } finally {
    cdp?.close();
    browser?.kill();
    await rm(userDataDir, { force: true, recursive: true });
    await closeServer(server);
  }
};

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
