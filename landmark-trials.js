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
    const picoDetails = document.createElement("details");
    picoDetails.className = "landmark-pico";
    const picoSummary = document.createElement("summary");
    picoSummary.textContent = "PICO / Guardrail";
    picoDetails.replaceChildren(
      picoSummary,
      definitionList([
        ["Population", trial.pico.population],
        ["Intervention", trial.pico.intervention],
        ["Comparator", trial.pico.comparator],
        ["Outcome", trial.pico.outcome],
        ["Guardrail", trial.guardrail]
      ])
    );
    article.replaceChildren(
      element("span", { className: "landmark-year", text: trial.year }),
      element("h3", { text: trial.title }),
      definitionList([
        ["Result", trial.result],
        ["PM use", trial.pmUse]
      ]),
      picoDetails
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
