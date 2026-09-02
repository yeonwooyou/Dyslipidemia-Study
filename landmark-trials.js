(() => {
  const data = globalThis.LandmarkTrialData;
  let activeCategory = "all";

  const select = (selector) => document.querySelector(selector);

  const element = (tag, options = {}) => {
    const node = document.createElement(tag);
    if (options.className) {
      node.className = options.className;
    }
    if (options.text) {
      node.textContent = options.text;
    }
    return node;
  };

  const definitionList = (items) => {
    const root = element("dl", { className: "definition-list compact" });
    const nodes = items.flatMap(([term, description]) => [element("dt", { text: term }), element("dd", { text: description })]);
    root.replaceChildren(...nodes);
    return root;
  };

  const renderTabs = () => {
    const tabs = select("#landmarkTrialTabs");
    if (!tabs || !data) {
      return;
    }
    const buttons = data.landmarkCategories.map((category) => {
      const button = element("button", { text: category.label });
      button.type = "button";
      button.className = category.id === activeCategory ? "is-active" : "";
      button.setAttribute("aria-pressed", String(category.id === activeCategory));
      button.addEventListener("click", () => {
        activeCategory = category.id;
        renderTabs();
        renderTrials();
      });
      return button;
    });
    tabs.replaceChildren(...buttons);
  };

  const trialCard = (trial) => {
    const article = element("article", { className: "landmark-trial-card" });
    article.replaceChildren(
      element("span", { className: "landmark-year", text: trial.year }),
      element("h3", { text: trial.title }),
      definitionList([
        ["Population", trial.population],
        ["Intervention", trial.intervention],
        ["Comparator", trial.comparator],
        ["Endpoint", trial.endpoint],
        ["Result", trial.result],
        ["PM use", trial.pmUse],
        ["Guardrail", trial.guardrail]
      ])
    );
    return article;
  };

  const renderTrials = () => {
    const grid = select("#landmarkTrialGrid");
    if (!grid || !data) {
      return;
    }
    const trials = data.getLandmarkTrialsByCategory(activeCategory);
    grid.replaceChildren(...trials.map(trialCard));
  };

  renderTabs();
  renderTrials();
})();
