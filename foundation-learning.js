(() => {
  const definitionData = globalThis.DefinitionData;
  const mechanismData = globalThis.MechanismData;
  const statinProfileData = globalThis.StatinProfileData;

  const select = (selector) => document.querySelector(selector);

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

  const list = (items, className = "inline-list") => {
    const root = element("ul", { className });
    root.replaceChildren(...items.map((item) => element("li", { text: item })));
    return root;
  };

  const definitionCard = (section) => {
    const article = element("article", { className: "foundation-card" });
    article.replaceChildren(
      element("span", { className: "foundation-chip", text: section.id }),
      element("h3", { text: section.title }),
      element("p", { text: section.summary }),
      list(section.learn, "foundation-list"),
      element("strong", { className: "pm-note", text: section.pmUse })
    );
    return article;
  };

  const mechanismCard = (step) => {
    const article = element("article", { className: "mechanism-card" });
    article.replaceChildren(
      element("h3", { text: step.title }),
      element("p", { text: step.summary }),
      element("span", { text: step.learn }),
      element("strong", { className: "pm-note", text: step.pmUse })
    );
    return article;
  };

  const timelineItem = ([year, title, detail]) => {
    const item = element("li");
    item.replaceChildren(
      element("span", { text: year }),
      element("strong", { text: title }),
      element("p", { text: detail })
    );
    return item;
  };

  const statinCard = (profile) => {
    const article = element("article", { className: "statin-profile-card" });
    article.replaceChildren(
      element("span", { className: "foundation-chip", text: profile.originatorBrand }),
      element("h3", { text: profile.ingredientName }),
      list([
        profile.solubility,
        profile.metabolism,
        profile.prodrug,
        profile.halfLife
      ], "inline-list"),
      element("p", { text: profile.characteristic }),
      element("strong", { className: "pm-note", text: profile.pmUse })
    );
    return article;
  };

  const priceCard = (item) => {
    const article = element("article", { className: "price-card" });
    const price = element("strong", { text: `${item.ceilingPriceWon.toLocaleString("ko-KR")}원` });
    article.replaceChildren(
      element("span", { className: "foundation-chip", text: item.code }),
      element("h3", { text: item.product }),
      element("p", { text: item.ingredientText }),
      price,
      element("small", { text: `${item.company} · ${item.source}` }),
      element("a", { className: "source-link", href: item.sourceUrl, text: "가격 출처" })
    );
    return article;
  };

  const renderDefinitions = () => {
    const root = select("#definitionGrid");
    if (!root || !definitionData) {
      return;
    }
    root.replaceChildren(...definitionData.definitionSections.map(definitionCard));
    const frame = select("#definitionFrame");
    if (frame) {
      frame.textContent = definitionData.pmLearningFrame;
    }
  };

  const renderMechanisms = () => {
    const root = select("#mechanismGrid");
    if (!root || !mechanismData) {
      return;
    }
    root.replaceChildren(...mechanismData.statinMechanismSteps.map(mechanismCard));
    const rationale = select("#combinationRationale");
    if (rationale) {
      rationale.textContent = mechanismData.combinationRationale;
    }
  };

  const renderStatinProfiles = () => {
    if (!statinProfileData) {
      return;
    }
    const timeline = select("#statinTimeline");
    const profileGrid = select("#statinProfileGrid");
    const priceGrid = select("#statinPriceGrid");
    const priceNote = select("#priceSourceNote");
    const priceGuardrail = select("#priceUseGuardrail");

    if (timeline) {
      timeline.replaceChildren(...statinProfileData.statinDevelopmentTimeline.map(timelineItem));
    }
    if (profileGrid) {
      profileGrid.replaceChildren(...statinProfileData.statinIngredientProfiles.map(statinCard));
    }
    if (priceGrid) {
      priceGrid.replaceChildren(...statinProfileData.priceBenchmarks.map(priceCard));
    }
    if (priceNote) {
      priceNote.textContent = statinProfileData.priceSourceNote;
    }
    if (priceGuardrail) {
      priceGuardrail.textContent = statinProfileData.priceUseGuardrail;
    }
  };

  renderDefinitions();
  renderMechanisms();
  renderStatinProfiles();
})();
