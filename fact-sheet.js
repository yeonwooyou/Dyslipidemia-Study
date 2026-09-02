(() => {
  const data = globalThis.FactSheetData;
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

  const metricCard = (metric) => {
    const article = element("article", { className: "fact-metric-card" });
    article.replaceChildren(
      element("span", { text: metric.label }),
      element("strong", { text: metric.value }),
      element("p", { text: metric.note }),
      element("small", { text: metric.pmUse })
    );
    return article;
  };

  const interpretationCard = ([label, body]) => {
    const article = element("article", { className: "fact-interpretation-card" });
    article.replaceChildren(
      element("h3", { text: label }),
      element("p", { text: body })
    );
    return article;
  };

  const renderFactSheet = () => {
    if (!data) {
      return;
    }
    const sheet = data.getFactSheetById("ksola-2024-dyslipidemia-fact-sheet");
    const grid = select("#factSheetGrid");
    const interpretation = select("#factSheetInterpretation");
    const sources = select("#factSheetSources");

    if (grid) {
      grid.replaceChildren(...data.factSheetMetrics.map(metricCard));
    }
    if (interpretation) {
      interpretation.replaceChildren(...Object.entries(data.pmInterpretation).map(interpretationCard));
    }
    if (sources && sheet) {
      sources.replaceChildren(
        element("a", { className: "source-link", href: sheet.officialSourceUrl, text: "KSoLA Fact Sheet page" }),
        element("a", { className: "source-link", href: sheet.journalSourceUrl, text: "JLA / PMC article" })
      );
    }
  };

  renderFactSheet();
})();
