(() => {
  const data = globalThis.ExperienceData;
  const metadata = globalThis.SiteMetadata || {};
  const PROGRESS_KEY = "rosuzet-learning-progress-v1";
  const VIEW_MODE_KEY = "rosuzet-view-mode-v1";
  let activeSourceCategory = "all";
  let activeSourceStatus = "all";
  let lastActiveElement = null;

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

  const renderMetadata = () => {
    const versionNote = select("#contentVersionNote");
    const archiveNote = select("#archiveVersionNote");
    if (versionNote && metadata.formatHeaderNote) {
      versionNote.textContent = metadata.formatHeaderNote();
    }
    if (archiveNote && metadata.formatArchiveNote) {
      archiveNote.textContent = metadata.formatArchiveNote();
    }
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

  const renderSourceCategoryFilter = () => {
    const selectNode = select("#sourceCategoryFilter");
    if (!selectNode || !data) {
      return;
    }
    fillSelect(selectNode, data.sourceCategoryOptions);
    selectNode.value = activeSourceCategory;
    selectNode.addEventListener("change", (event) => {
      activeSourceCategory = event.target.value;
      renderSourceHub();
    });
  };

  const getArchiveLabel = (item) => {
    if (item.archiveState === "local-file") {
      return "Local file archived";
    }
    if (item.archiveState === "linked-only") {
      return "Linked source only";
    }
    return "Source still needed";
  };

  const getArchiveDetail = (item) => {
    if (item.localArchivePath) {
      return item.localArchivePath;
    }
    return getArchiveLabel(item);
  };

  const renderSourceArchiveSummary = () => {
    const root = select("#sourceArchiveSummary");
    if (!root || !data) {
      return;
    }
    const summary = data.getArchiveSummary();
    root.replaceChildren(
      element("span", { text: `${summary.totalCount} tracked` }),
      element("strong", { text: `${summary.localFileCount} local files` }),
      element("span", { text: `${summary.neededCount} still needed` }),
      element("span", { text: `${summary.p0Count} P0` })
    );
  };

  const renderSourceHub = () => {
    const grid = select("#sourceHubGrid");
    const count = select("#sourceHubCount");
    if (!grid || !data) {
      return;
    }
    const items = data.getSourceItemsByFilters({
      category: activeSourceCategory,
      status: activeSourceStatus
    });
    if (count) {
      count.textContent = `${items.length} sources`;
    }
    const cards = items.map((item) => {
      const archiveStatus = element("span", {
        className: "source-archive-status",
        text: getArchiveLabel(item)
      });
      const card = element("article", { className: `source-card source-${item.status} source-${item.archiveState}` });
      card.replaceChildren(
        element("span", { className: "source-status", text: `${item.status} · ${item.category}` }),
        archiveStatus,
        element("h3", { text: item.title }),
        element("p", { text: item.summary }),
        definitionList([
          ["PM 적용", item.pmUse],
          ["Archive", getArchiveDetail(item)],
          ["Priority", item.priority],
          ["Next extraction", item.extractionFocus.join(" · ")]
        ]),
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
      const card = element("article", { className: "progress-item" });
      const label = element("label", { className: "progress-check" });
      const checkbox = element("input");
      checkbox.id = `progress-${module.id}`;
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
      const title = element("span", { className: "progress-title", text: module.title });
      const page = element("span", { text: module.page });
      const link = element("a", { className: "progress-open", href: module.href, text: "Open" });
      label.setAttribute("for", checkbox.id);
      label.replaceChildren(checkbox, title);
      card.replaceChildren(label, page, link);
      return card;
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

  const getFocusableElements = (root) => {
    const focusableElements = [
      ...root.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")
    ].filter((node) => !node.disabled && node.tabIndex !== -1 && !node.hidden);
    return focusableElements;
  };

  const closeGlossary = (drawer) => {
    drawer.classList.remove("is-open");
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    lastActiveElement?.focus();
  };

  const openGlossary = (drawer, search) => {
    lastActiveElement = document.activeElement;
    drawer.hidden = false;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    renderGlossaryTerms(search.value);
    search.focus();
  };

  const focusTrap = (event, drawer) => {
    if (event.key !== "Tab" || drawer.hidden) {
      return;
    }
    const focusableElements = getFocusableElements(drawer);
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const bindGlossary = () => {
    const drawer = select("#glossaryDrawer");
    const openButton = select("#glossaryToggle");
    const closeButton = select("#glossaryClose");
    const search = select("#glossarySearch");
    if (!drawer || !openButton || !closeButton || !search) {
      return;
    }
    openButton.addEventListener("click", () => openGlossary(drawer, search));
    closeButton.addEventListener("click", () => closeGlossary(drawer));
    search.addEventListener("input", (event) => renderGlossaryTerms(event.target.value));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !drawer.hidden) {
        closeGlossary(drawer);
        return;
      }
      focusTrap(event, drawer);
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
    renderMetadata();
    bindGlobalSearch();
    bindScriptGenerator();
    bindGlossary();
    bindViewMode();
    renderLearningProgress();
    renderSourceFilters();
    renderSourceCategoryFilter();
    renderSourceArchiveSummary();
    renderSourceHub();
    renderGuidelineSegmentDiff();
    renderCompetitorMatrix();
    renderSectionJumpNav();
    document.addEventListener("pagechange", renderSectionJumpNav);
    window.addEventListener("hashchange", renderSectionJumpNav);
  };

  init();
})();
