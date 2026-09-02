(() => {
  const data = globalThis.ExperienceData;
  const PROGRESS_KEY = "rosuzet-learning-progress-v1";
  const VIEW_MODE_KEY = "rosuzet-view-mode-v1";
  let activeSourceStatus = "all";

  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => [...document.querySelectorAll(selector)];

  const element = (tag, options = {}) => {
    const node = document.createElement(tag);
    if (options.className) {
      node.className = options.className;
    }
    if (options.text) {
      node.textContent = options.text;
    }
    if (options.href) {
      node.href = options.href;
      if (/^https?:/.test(options.href)) {
        node.target = "_blank";
        node.rel = "noreferrer";
      }
    }
    return node;
  };

  const readStorage = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
    return true;
  };

  const definitionList = (items) => {
    const root = element("dl", { className: "definition-list compact" });
    const nodes = items.flatMap(([term, detail]) => [element("dt", { text: term }), element("dd", { text: detail })]);
    root.replaceChildren(...nodes);
    return root;
  };

  const renderGlobalSearchResults = (query) => {
    const root = select("#globalSearchResults");
    if (!root || !data) {
      return;
    }
    const results = data.searchAll(query);
    if (results.length === 0) {
      root.hidden = true;
      root.replaceChildren();
      return;
    }
    const items = results.map((item) => {
      const link = element("a", { className: "search-result", href: item.href });
      link.addEventListener("click", () => {
        root.hidden = true;
      });
      link.replaceChildren(
        element("span", { text: item.type }),
        element("strong", { text: item.title }),
        element("small", { text: item.summary })
      );
      return link;
    });
    root.replaceChildren(...items);
    root.hidden = false;
  };

  const bindGlobalSearch = () => {
    const input = select("#globalSearch");
    if (!input || !data) {
      return;
    }
    input.addEventListener("input", (event) => renderGlobalSearchResults(event.target.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        renderGlobalSearchResults("");
      }
    });
  };

  const renderSourceFilters = () => {
    const root = select("#sourceStatusFilter");
    if (!root || !data) {
      return;
    }
    const buttons = data.sourceStatusOptions.map((status) => {
      const button = element("button", { text: status.label });
      button.type = "button";
      button.className = status.id === activeSourceStatus ? "is-active" : "";
      button.setAttribute("aria-pressed", String(status.id === activeSourceStatus));
      button.addEventListener("click", () => {
        activeSourceStatus = status.id;
        renderSourceFilters();
        renderSourceHub();
      });
      return button;
    });
    root.replaceChildren(...buttons);
  };

  const renderSourceHub = () => {
    const grid = select("#sourceHubGrid");
    const count = select("#sourceHubCount");
    if (!grid || !data) {
      return;
    }
    const items = data.getSourceItemsByStatus(activeSourceStatus);
    if (count) {
      count.textContent = `${items.length} sources`;
    }
    const cards = items.map((item) => {
      const card = element("article", { className: `source-card source-${item.status}` });
      card.replaceChildren(
        element("span", { className: "source-status", text: `${item.status} · ${item.category}` }),
        element("h3", { text: item.title }),
        element("p", { text: item.summary }),
        definitionList([["PM 적용", item.pmUse]]),
        element("a", { className: "source-link", href: item.sourceUrl, text: "출처 확인" })
      );
      return card;
    });
    grid.replaceChildren(...cards);
  };

  const renderGuidelineSegmentDiff = () => {
    const root = select("#guidelineSegmentGrid");
    if (!root || !data) {
      return;
    }
    const cards = data.guidelineSegmentDiffs.map((item) => {
      const card = element("article", { className: "experience-card segment-card" });
      card.replaceChildren(
        element("h3", { text: item.segment }),
        definitionList([
          ["KSoLA", item.ksola],
          ["ESC/EAS", item.esc],
          ["ACC/AHA", item.acc],
          ["PM Action", item.pmAction]
        ])
      );
      return card;
    });
    root.replaceChildren(...cards);
  };

  const renderCompetitorMatrix = () => {
    const root = select("#competitorMatrixGrid");
    if (!root || !data) {
      return;
    }
    const cards = data.competitorMatrix.map((item) => {
      const card = element("article", { className: "experience-card competitor-matrix-card" });
      card.replaceChildren(
        element("span", { className: "matrix-examples", text: item.examples }),
        element("h3", { text: item.className }),
        definitionList([
          ["Threat", item.threat],
          ["Response", item.response],
          ["Guardrail", item.guardrail]
        ])
      );
      return card;
    });
    root.replaceChildren(...cards);
  };

  const fillSelect = (selectNode, items) => {
    selectNode.replaceChildren(...items.map((item) => {
      const option = element("option", { text: item.label });
      option.value = item.id;
      return option;
    }));
  };

  const renderScript = () => {
    const output = select("#scriptOutput");
    const segment = select("#scriptSegment");
    const objection = select("#scriptObjection");
    if (!output || !segment || !objection || !data) {
      return;
    }
    const script = data.buildDetailScript({ objectionId: objection.value, segmentId: segment.value });
    output.replaceChildren(
      definitionList([
        ["30초", script.thirtySecond],
        ["60초", script.sixtySecond],
        ["Medical backup", script.medicalBackup]
      ])
    );
  };

  const bindScriptGenerator = () => {
    const segment = select("#scriptSegment");
    const objection = select("#scriptObjection");
    if (!segment || !objection || !data) {
      return;
    }
    fillSelect(segment, data.scriptSegments);
    fillSelect(objection, data.scriptObjections);
    segment.addEventListener("change", renderScript);
    objection.addEventListener("change", renderScript);
    renderScript();
  };

  const renderLearningProgress = () => {
    const grid = select("#learningProgressGrid");
    const count = select("#learningProgressCount");
    if (!grid || !data) {
      return;
    }
    const completed = new Set(readStorage(PROGRESS_KEY, []));
    const items = data.progressModules.map((module) => {
      const label = element("label", { className: "progress-item" });
      const checkbox = element("input");
      checkbox.type = "checkbox";
      checkbox.checked = completed.has(module.id);
      checkbox.addEventListener("change", () => {
        const nextCompleted = new Set(readStorage(PROGRESS_KEY, []));
        if (checkbox.checked) {
          nextCompleted.add(module.id);
        } else {
          nextCompleted.delete(module.id);
        }
        writeStorage(PROGRESS_KEY, [...nextCompleted]);
        renderLearningProgress();
      });
      const link = element("a", { href: module.href, text: module.title });
      const page = element("span", { text: module.page });
      label.replaceChildren(checkbox, link, page);
      return label;
    });
    if (count) {
      count.textContent = `${completed.size} / ${data.progressModules.length}`;
    }
    grid.replaceChildren(...items);
  };

  const renderGlossaryTerms = (query = "") => {
    const root = select("#glossaryList");
    if (!root || !data) {
      return;
    }
    const needle = String(query || "").toLocaleLowerCase("ko-KR");
    const terms = data.glossaryTerms.filter((item) => {
      const haystack = `${item.term} ${item.definition} ${item.category}`.toLocaleLowerCase("ko-KR");
      return !needle || haystack.includes(needle);
    });
    const cards = terms.map((item) => {
      const card = element("article", { className: "glossary-card" });
      card.replaceChildren(
        element("span", { text: item.category }),
        element("h3", { text: item.term }),
        element("p", { text: item.definition })
      );
      return card;
    });
    root.replaceChildren(...cards);
  };

  const bindGlossary = () => {
    const drawer = select("#glossaryDrawer");
    const openButton = select("#glossaryToggle");
    const closeButton = select("#glossaryClose");
    const search = select("#glossarySearch");
    if (!drawer || !openButton || !closeButton || !search) {
      return;
    }
    openButton.addEventListener("click", () => {
      drawer.hidden = false;
      drawer.classList.add("is-open");
      renderGlossaryTerms(search.value);
      search.focus();
    });
    closeButton.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      drawer.hidden = true;
    });
    search.addEventListener("input", (event) => renderGlossaryTerms(event.target.value));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !drawer.hidden) {
        drawer.classList.remove("is-open");
        drawer.hidden = true;
      }
    });
    renderGlossaryTerms();
  };

  const bindViewMode = () => {
    const button = select("#viewModeToggle");
    if (!button) {
      return;
    }
    const initialMode = readStorage(VIEW_MODE_KEY, "expanded") === "compact" ? "compact" : "expanded";
    document.body.dataset.viewMode = initialMode;
    button.textContent = initialMode === "compact" ? "Expanded" : "Compact";
    button.addEventListener("click", () => {
      const nextMode = document.body.dataset.viewMode === "compact" ? "expanded" : "compact";
      document.body.dataset.viewMode = nextMode;
      writeStorage(VIEW_MODE_KEY, nextMode);
      button.textContent = nextMode === "compact" ? "Expanded" : "Compact";
    });
  };

  const resolveSectionTitle = (section) => section.querySelector("h1, h2")?.textContent || section.id;

  const renderSectionJumpNav = () => {
    const sectionJumpNav = select("#sectionJumpNav");
    if (!sectionJumpNav) {
      return;
    }
    const currentPage = document.body.dataset.currentPage || "home";
    const sections = selectAll(`[data-page="${currentPage}"]`).filter((section) => section.id && !section.hidden);
    const links = sections.map((section) => element("a", { href: `#${section.id}`, text: resolveSectionTitle(section) }));
    sectionJumpNav.replaceChildren(...links);
  };

  const init = () => {
    if (!data) {
      return;
    }
    bindGlobalSearch();
    bindScriptGenerator();
    bindGlossary();
    bindViewMode();
    renderLearningProgress();
    renderSourceFilters();
    renderSourceHub();
    renderGuidelineSegmentDiff();
    renderCompetitorMatrix();
    renderSectionJumpNav();
    document.addEventListener("pagechange", renderSectionJumpNav);
    window.addEventListener("hashchange", renderSectionJumpNav);
  };

  init();
})();
