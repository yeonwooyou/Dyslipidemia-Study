(() => {
  const strategy = globalThis.StrategyData;
  const study = globalThis.StudyData;
  let trainingState = { index: 0, isAnswerVisible: false };

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

  const list = (items, className = "check-list") => {
    const root = element("ul", { className });
    root.replaceChildren(...items.map((item) => element("li", { text: item })));
    return root;
  };

  const definitionList = (items, className = "definition-list compact") => {
    const root = element("dl", { className });
    const nodes = items.flatMap(([term, description]) => [element("dt", { text: term }), element("dd", { text: description })]);
    root.replaceChildren(...nodes);
    return root;
  };

  const renderTable = (root, headers, rows) => {
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.replaceChildren(...headers.map((header) => element("th", { text: header })));
    thead.replaceChildren(headRow);

    const tbody = document.createElement("tbody");
    const bodyRows = rows.map((row) => {
      const tr = document.createElement("tr");
      tr.replaceChildren(...row.map((cell) => element("td", { text: cell })));
      return tr;
    });
    tbody.replaceChildren(...bodyRows);
    root.replaceChildren(thead, tbody);
  };

  const numberInput = ({ id, label, max, min, step, value }) => {
    const input = element("input");
    input.id = id;
    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    const wrapper = element("label", { text: label });
    wrapper.append(input);
    return { input, wrapper };
  };

  const renderSegmentPlaybook = () => {
    const cards = strategy.segmentPlaybooks.map((segment) => {
      const card = element("article", { className: "strategy-card" });
      card.replaceChildren(
        element("h3", { text: segment.label }),
        definitionList([
          ["Patient", segment.patient],
          ["Question", segment.coreQuestion],
          ["Message", segment.message],
          ["Guardrail", segment.guardrail],
          ["Action", segment.action]
        ]),
        list(segment.evidenceIds, "inline-list")
      );
      return card;
    });
    select("#segmentPlaybookGrid").replaceChildren(...cards);
  };

  const renderStrategyRows = (rows) => {
    return rows.map((row) => {
      const card = element("article", { className: "strategy-row" });
      const fitClass = row.targetFit.includes("미달") ? "fit-chip is-miss" : "fit-chip";
      card.replaceChildren(
        element("strong", { text: row.option }),
        element("span", { className: fitClass, text: row.targetFit }),
        element("span", { text: `예상 LDL-C ${row.projectedLdl} mg/dL` }),
        element("p", { text: row.role })
      );
      return card;
    });
  };

  const renderStrategySimulator = () => {
    const baseline = numberInput({ id: "simBaseline", label: "Baseline LDL-C", min: 30, max: 300, step: 1, value: 132 });
    const target = numberInput({ id: "simTarget", label: "Target LDL-C", min: 30, max: 160, step: 1, value: 55 });
    const therapySelect = element("select");
    const therapyWrapper = element("label", { text: "Current therapy" });
    therapySelect.replaceChildren(...strategy.currentTherapyOptions.map((item) => {
      const option = element("option", { text: item.label });
      option.value = item.id;
      return option;
    }));
    therapySelect.value = "moderate-statin";
    therapyWrapper.append(therapySelect);

    const form = element("form", { className: "strategy-form" });
    const output = element("div", { className: "simulator-result" });
    form.replaceChildren(baseline.wrapper, target.wrapper, therapyWrapper);
    form.addEventListener("submit", (event) => event.preventDefault());

    const update = () => {
      const result = strategy.computeLdlStrategy({
        baselineLdl: baseline.input.value,
        currentTherapyId: therapySelect.value,
        targetLdl: target.input.value
      });
      output.replaceChildren(
        element("h3", { text: `${result.absoluteGap} mg/dL gap · ${result.neededReductionPercent}% reduction 필요` }),
        definitionList([
          ["현재 치료", result.currentTherapy],
          ["추천 축", result.recommendation]
        ]),
        element("div", { className: "strategy-rows" })
      );
      output.querySelector(".strategy-rows").replaceChildren(...renderStrategyRows(result.rows));
    };

    [baseline.input, target.input, therapySelect].forEach((node) => node.addEventListener("input", update));
    [therapySelect].forEach((node) => node.addEventListener("change", update));
    select("#strategySimulatorRoot").replaceChildren(form, output);
    update();
  };

  const renderWarRoom = () => {
    const cards = strategy.competitorWarRoom.map((item) => {
      const card = element("article", { className: "war-card" });
      card.replaceChildren(
        element("h3", { text: item.group }),
        definitionList([
          ["Examples", item.examples],
          ["Threat", item.threat],
          ["Response", item.response],
          ["Watch", item.watch]
        ])
      );
      return card;
    });
    select("#warRoomGrid").replaceChildren(...cards);
  };

  const renderGuidelineDiff = () => {
    renderTable(
      select("#guidelineDiffTable"),
      ["Theme", "KSoLA", "ESC/EAS", "ACC/AHA", "PM Impact"],
      strategy.guidelineDiffRows.map((row) => [row.theme, row.ksola, row.esc, row.acc, row.pm])
    );
  };

  const renderEvidenceQuality = () => {
    const cards = strategy.qualityStudyIds.map((id) => study.getEvidenceById(id)).filter(Boolean).map((item) => {
      const score = strategy.scoreEvidence(item);
      const meter = element("meter");
      meter.min = 0;
      meter.max = 100;
      meter.value = score.total;
      const scoreBox = element("div", { className: "quality-score" });
      scoreBox.replaceChildren(element("strong", { text: `${score.total} / 100` }), meter);
      const card = element("article", { className: "quality-card" });
      card.replaceChildren(
        element("h3", { text: item.title }),
        scoreBox,
        definitionList([
          ["Direct", String(score.directness)],
          ["Design", String(score.designScore)],
          ["Outcome", String(score.outcomeScore)],
          ["Korea/Asia", String(score.koreaScore)]
        ], "quality-components"),
        element("p", { text: item.pmUse })
      );
      return card;
    });
    select("#evidenceQualityGrid").replaceChildren(...cards);
  };

  const renderClaimChecker = () => {
    const textarea = element("textarea");
    textarea.value = "RACING으로 로수젯은 고강도 statin보다 모든 환자에서 우월하다";
    const label = element("label", { text: "Claim draft" });
    const form = element("form", { className: "claim-form" });
    const resultBox = element("article", { className: "claim-result" });
    label.append(textarea);
    form.replaceChildren(label);
    form.addEventListener("submit", (event) => event.preventDefault());

    const update = () => {
      const result = strategy.evaluateClaim(textarea.value);
      resultBox.replaceChildren(
        element("span", { className: `claim-level ${result.level}`, text: result.level }),
        definitionList([
          ["Rationale", result.rationale],
          ["Rewrite", result.rewrite]
        ])
      );
    };

    textarea.addEventListener("input", update);
    const layout = element("div", { className: "claim-layout" });
    layout.replaceChildren(form, resultBox);
    select("#claimCheckerRoot").replaceChildren(layout);
    update();
  };

  const renderObjectionTraining = () => {
    const current = strategy.trainingScenarios[trainingState.index];
    const question = element("p", { className: "training-question", text: current.prompt });
    const answer = element("div", { className: "training-answer" });
    answer.hidden = !trainingState.isAnswerVisible;
    answer.replaceChildren(
      element("strong", { text: current.answer }),
      element("span", { text: current.guardrail })
    );

    const toggle = element("button", { text: trainingState.isAnswerVisible ? "답변 숨기기" : "답변 보기" });
    const next = element("button", { text: "다음 질문" });
    toggle.type = "button";
    next.type = "button";
    toggle.addEventListener("click", () => {
      trainingState = { ...trainingState, isAnswerVisible: !trainingState.isAnswerVisible };
      renderObjectionTraining();
    });
    next.addEventListener("click", () => {
      trainingState = { index: (trainingState.index + 1) % strategy.trainingScenarios.length, isAnswerVisible: false };
      renderObjectionTraining();
    });

    const actions = element("div", { className: "training-actions" });
    actions.replaceChildren(toggle, next);
    select("#objectionTrainingRoot").replaceChildren(
      element("span", { className: "study-type", text: `${trainingState.index + 1} / ${strategy.trainingScenarios.length}` }),
      question,
      answer,
      actions
    );
  };

  const formatNumber = (value) => new Intl.NumberFormat("ko-KR").format(value);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0, style: "currency", currency: "KRW" }).format(value);
  };

  const marketField = (key, label, max, step) => {
    const value = strategy.marketSizingDefaults[key];
    const input = numberInput({ id: `market-${key}`, label, min: 0, max, step, value });
    input.input.dataset.key = key;
    return input;
  };

  const renderMarketSizing = () => {
    const fields = [
      marketField("adults", "Adults", 60000000, 100000),
      marketField("dyslipidemiaPrevalence", "Prevalence", 1, 0.001),
      marketField("diagnosedRate", "Diagnosed", 1, 0.01),
      marketField("treatedRate", "Treated", 1, 0.01),
      marketField("statinMonoShare", "Statin mono", 1, 0.01),
      marketField("goalFailureRate", "Goal failure", 1, 0.01),
      marketField("targetShare", "Target share", 1, 0.01),
      marketField("annualRxValue", "Annual Rx value", 2000000, 10000)
    ];
    const form = element("form", { className: "market-form" });
    const output = element("div", { className: "market-metrics" });
    form.replaceChildren(...fields.map((field) => field.wrapper));
    form.addEventListener("submit", (event) => event.preventDefault());

    const update = () => {
      const inputValues = fields.reduce((values, field) => {
        return { ...values, [field.input.dataset.key]: Number(field.input.value) };
      }, {});
      const result = strategy.computeMarketSizing(inputValues);
      output.replaceChildren(
        marketMetric("TAM", formatNumber(result.tamPatients), "prevalent adults"),
        marketMetric("SAM", formatNumber(result.samPatients), "statin mono + goal failure"),
        marketMetric("SOM", formatNumber(result.somPatients), "target share"),
        marketMetric("Value", formatCurrency(result.annualRevenue), "annual gross Rx estimate")
      );
    };

    fields.forEach((field) => field.input.addEventListener("input", update));
    select("#marketSizingRoot").replaceChildren(form, output);
    update();
  };

  const marketMetric = (label, value, detail) => {
    const card = element("article", { className: "market-metric" });
    card.replaceChildren(element("span", { className: "study-type", text: label }), element("strong", { text: value }), element("p", { text: detail }));
    return card;
  };

  const renderPublicationTracker = () => {
    const cards = strategy.publicationTracker.map((item) => {
      const card = element("article", { className: "publication-card" });
      card.replaceChildren(
        element("h3", { text: item.asset }),
        definitionList([
          ["Status", item.status],
          ["Next", item.nextStep],
          ["Owner", item.owner],
          ["Priority", item.priority]
        ])
      );
      return card;
    });
    select("#publicationTrackerGrid").replaceChildren(...cards);
  };

  const renderMonthlyBrief = () => {
    const cards = strategy.monthlyBriefBlocks.map((item) => {
      const card = element("article", { className: "brief-card" });
      card.replaceChildren(element("h3", { text: item.title }), element("p", { text: item.body }));
      return card;
    });
    select("#monthlyBriefGrid").replaceChildren(...cards);
  };

  const init = () => {
    renderSegmentPlaybook();
    renderStrategySimulator();
    renderWarRoom();
    renderGuidelineDiff();
    renderEvidenceQuality();
    renderClaimChecker();
    renderObjectionTraining();
    renderMarketSizing();
    renderPublicationTracker();
    renderMonthlyBrief();
  };

  init();
})();
