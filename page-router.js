(() => {
  const library = globalThis.LibraryData;
  const pageLabels = {
    home: "Home",
    foundation: "Foundation",
    strategy: "Strategy",
    evidence: "Evidence",
    execution: "Execution",
    library: "Library",
    sources: "Sources"
  };
  const pages = Object.keys(pageLabels);
  let libraryState = { category: "all", query: "" };

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
      node.target = "_blank";
      node.rel = "noreferrer";
    }
    return node;
  };

  const list = (items) => {
    const root = element("ul", { className: "check-list" });
    root.replaceChildren(...items.map((item) => element("li", { text: item })));
    return root;
  };

  const definitionList = (items) => {
    const root = element("dl", { className: "definition-list compact" });
    const nodes = items.flatMap(([term, detail]) => [element("dt", { text: term }), element("dd", { text: detail })]);
    root.replaceChildren(...nodes);
    return root;
  };

  const resolvePage = () => {
    const hash = window.location.hash.replace("#", "");
    if (pages.includes(hash)) {
      return hash;
    }
    const section = hash ? document.getElementById(hash) : null;
    return section?.dataset.page || "home";
  };

  const closeMenu = () => {
    const nav = select("#pageNav");
    const button = select("#menuToggle");
    nav?.classList.remove("is-open");
    button?.setAttribute("aria-expanded", "false");
  };

  const updateLinks = (activePage) => {
    selectAll("[data-page-link]").forEach((link) => {
      const isActive = link.dataset.pageLink === activePage;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
        return;
      }
      link.removeAttribute("aria-current");
    });
  };

  const showPage = (page) => {
    document.body.dataset.currentPage = page;
    selectAll("[data-page]").forEach((section) => {
      const isActive = section.dataset.page === page;
      section.hidden = !isActive;
      section.classList.toggle("is-active-page", isActive);
    });
    const title = select("#activePageTitle");
    if (title) {
      title.textContent = pageLabels[page];
    }
    updateLinks(page);
    closeMenu();
    document.dispatchEvent(new CustomEvent("pagechange", { detail: { page } }));
  };

  const renderLibrarySummary = () => {
    const root = select("#librarySummaryGrid");
    if (!root || !library) {
      return;
    }
    const cards = library.libraryCategories.map((category) => {
      const count = library.getModulesByCategory(category.id).length;
      const card = element("button", { className: "library-summary-card", text: category.label });
      card.type = "button";
      card.dataset.categoryId = category.id;
      card.append(element("span", { text: category.focus }));
      card.append(element("strong", { text: `${count} modules` }));
      card.addEventListener("click", () => {
        libraryState = { ...libraryState, category: category.id };
        select("#libraryCategory").value = category.id;
        renderLibraryGrid();
      });
      return card;
    });
    root.replaceChildren(...cards);
  };

  const filterLibraryModules = () => {
    const queryMatches = library.searchLibrary(libraryState.query);
    if (libraryState.category === "all") {
      return queryMatches;
    }
    return queryMatches.filter((item) => item.category === libraryState.category);
  };

  const renderLibraryGrid = () => {
    const grid = select("#libraryGrid");
    const count = select("#libraryCount");
    if (!grid || !library) {
      return;
    }
    const modules = filterLibraryModules();
    const cards = modules.map(renderLibraryCard);
    const emptyState = element("p", { className: "empty-state", text: "검색 조건에 맞는 학습 모듈이 없습니다." });
    if (count) {
      count.textContent = `${modules.length} / ${library.libraryModules.length} modules`;
    }
    grid.replaceChildren(...(cards.length > 0 ? cards : [emptyState]));
  };

  const renderLibraryCard = (item) => {
    const category = library.libraryCategories.find((entry) => entry.id === item.category);
    const card = element("article", { className: "library-card" });
    const meta = element("div", { className: "library-card-meta" });
    meta.replaceChildren(
      element("span", { text: category?.label || "Module" }),
      element("span", { text: item.sourceNote })
    );
    card.replaceChildren(
      meta,
      element("h3", { text: item.title }),
      element("p", { text: item.summary }),
      list(item.learn),
      definitionList([["PM 적용", item.pmUse]]),
      element("a", { className: "source-link", text: "출처/확인", href: item.sourceUrl })
    );
    return card;
  };

  const bindLibraryControls = () => {
    const categorySelect = select("#libraryCategory");
    const searchInput = select("#librarySearch");
    if (!categorySelect || !searchInput || !library) {
      return;
    }
    const options = [
      { id: "all", label: "전체 모듈" },
      ...library.libraryCategories
    ].map((category) => {
      const option = element("option", { text: category.label });
      option.value = category.id;
      return option;
    });
    categorySelect.replaceChildren(...options);
    categorySelect.addEventListener("change", (event) => {
      libraryState = { ...libraryState, category: event.target.value };
      renderLibraryGrid();
    });
    searchInput.addEventListener("input", (event) => {
      libraryState = { ...libraryState, query: event.target.value };
      renderLibraryGrid();
    });
  };

  const bindMenu = () => {
    const button = select("#menuToggle");
    const nav = select("#pageNav");
    button?.addEventListener("click", () => {
      if (!nav) {
        return;
      }
      const nextState = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", nextState);
      button.setAttribute("aria-expanded", String(nextState));
    });
    selectAll("[data-page-link]").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  };

  const init = () => {
    bindMenu();
    bindLibraryControls();
    renderLibrarySummary();
    renderLibraryGrid();
    showPage(resolvePage());
    window.addEventListener("hashchange", () => showPage(resolvePage()));
  };

  init();
})();
