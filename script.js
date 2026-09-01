(() => {
  const data = globalThis.StudyData;
  let state = {
    activeGuidelineId: data.guidelineSummaries[0].id,
    activeAtlasCategory: "all",
    atlasSearch: "",
    quizIndex: 0,
    isAnswerVisible: false
  };

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

  const list = (items, className) => {
    const ul = element("ul", { className });
    const children = items.map((item) => element("li", { text: item }));
    ul.replaceChildren(...children);
    return ul;
  };

  const definitionList = (items, className = "definition-list compact") => {
    const body = element("dl", { className });
    const nodes = items.flatMap(([term, description]) => [element("dt", { text: term }), element("dd", { text: description })]);
    body.replaceChildren(...nodes);
    return body;
  };

  const normalizeText = (value) => String(value || "").toLocaleLowerCase("ko-KR");

  const relevanceLabel = (value) => {
    const labels = {
      class: "Class",
      context: "Context",
      direct: "Brand direct",
      strategy: "Strategy"
    };
    return labels[value] || "Evidence";
  };

  const relevanceClass = (value) => {
    const classes = {
      class: "relevance-class",
      context: "relevance-context",
      direct: "relevance-direct",
      strategy: "relevance-strategy"
    };
    return classes[value] || "relevance-context";
  };

  const studySearchText = (study) => {
    const fields = [
      study.title,
      study.year,
      study.design,
      study.population,
      study.intervention,
      study.comparator,
      study.endpoint,
      study.result,
      study.pmUse,
      study.limitations
    ];
    return normalizeText(fields.join(" "));
  };

  const renderSimpleTable = (root, headers, rows) => {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.replaceChildren(...headers.map((header) => element("th", { text: header })));
    thead.replaceChildren(headerRow);

    const tbody = document.createElement("tbody");
    const bodyRows = rows.map((row) => {
      const tr = document.createElement("tr");
      tr.replaceChildren(...row.map((cell) => element("td", { text: cell })));
      return tr;
    });
    tbody.replaceChildren(...bodyRows);
    root.replaceChildren(thead, tbody);
  };

  const renderGuidelineTabs = () => {
    const root = select("#guidelineTabs");
    const buttons = data.guidelineSummaries.map((guideline) => {
      const button = element("button", { text: guideline.society });
      button.type = "button";
      button.role = "tab";
      button.setAttribute("aria-selected", String(guideline.id === state.activeGuidelineId));
      button.addEventListener("click", () => {
        state = { ...state, activeGuidelineId: guideline.id };
        renderGuidelines();
      });
      return button;
    });
    root.replaceChildren(...buttons);
  };

  const renderGuidelinePanel = () => {
    const guideline = data.getGuidelineById(state.activeGuidelineId);
    const root = select("#guidelinePanel");

    const title = element("h3", { text: `${guideline.society} · ${guideline.edition}` });
    const status = element("p", { className: "status-note", text: guideline.currentStatus });
    const frame = element("p", { className: "panel-lead", text: guideline.frame });
    const anchors = list(guideline.anchors, "check-list");
    const implication = element("p", { className: "pm-note", text: guideline.pmImplication });
    const table = element("table");
    const tbody = document.createElement("tbody");
    const rows = guideline.targets.map(([risk, target]) => {
      const row = document.createElement("tr");
      row.replaceChildren(element("th", { text: risk }), element("td", { text: target }));
      return row;
    });
    tbody.replaceChildren(...rows);
    table.replaceChildren(tbody);

    const link = element("a", { className: "source-link", text: "원문/공식 출처", href: guideline.sourceUrl });
    root.replaceChildren(title, status, frame, anchors, table, implication, link);
  };

  const renderGuidelines = () => {
    renderGuidelineTabs();
    renderGuidelinePanel();
  };

  const renderCalculator = () => {
    const baselineInput = select("#baselineLdl");
    const targetSelect = select("#targetSelect");
    const output = select("#ldlResult");

    const options = data.riskTargets.map((target) => {
      const option = element("option", { text: `${target.label} · <${target.target}` });
      option.value = String(target.target);
      option.dataset.context = target.context;
      return option;
    });
    targetSelect.replaceChildren(...options);

    const update = () => {
      const selected = targetSelect.selectedOptions[0];
      const result = data.computeLdlGap(baselineInput.value, targetSelect.value);
      const headline = result.pressure === "at-target"
        ? "현재 목표 이하"
        : `${result.absoluteGap} mg/dL gap · ${result.reductionPercent}% reduction 필요`;
      const pressureText = {
        invalid: "값을 다시 확인",
        low: "작은 간극",
        high: "중간 이상 간극",
        "very-high": "강한 목표 압박",
        "at-target": "목표 도달"
      }[result.pressure];

      output.replaceChildren(
        element("strong", { text: headline }),
        element("span", { text: pressureText }),
        element("p", { text: selected.dataset.context })
      );
    };

    baselineInput.addEventListener("input", update);
    targetSelect.addEventListener("change", update);
    update();
  };

  const renderTargetMatrix = () => {
    renderSimpleTable(
      select("#targetMatrix"),
      ["Risk", "KSoLA", "ESC/EAS", "ACC/AHA", "PM Angle"],
      data.guidelineTargetMatrix.map((row) => [row.risk, row.ksola, row.esc, row.acc, row.pmAngle])
    );
  };

  const renderCaseSimulator = () => {
    const archetypeSelect = select("#caseArchetype");
    const therapySelect = select("#caseTherapy");
    const baselineInput = select("#caseBaseline");
    const output = select("#caseResult");

    const archetypeOptions = data.patientArchetypes.map((item) => {
      const option = element("option", { text: item.label });
      option.value = item.id;
      return option;
    });
    const therapyOptions = data.currentTherapies.map((item) => {
      const option = element("option", { text: item.label });
      option.value = item.id;
      return option;
    });
    archetypeSelect.replaceChildren(...archetypeOptions);
    therapySelect.replaceChildren(...therapyOptions);
    therapySelect.value = "moderate-statin";

    const update = () => {
      const summary = data.buildCaseSummary({
        archetypeId: archetypeSelect.value,
        baselineLdl: baselineInput.value,
        currentTherapyId: therapySelect.value
      });
      const headline = `${summary.archetypeLabel} · target <${summary.target} mg/dL`;
      const gapText = summary.gap.pressure === "at-target"
        ? "목표 도달 상태"
        : `${summary.gap.absoluteGap} mg/dL gap, ${summary.gap.reductionPercent}% reduction 필요`;

      output.replaceChildren(
        element("strong", { text: headline }),
        element("span", { text: gapText }),
        definitionList([
          ["지침 프레임", summary.guidelineFrame],
          ["치료 이력", summary.therapyFrame],
          ["용량 초점", summary.suggestedDoseFocus],
          ["Field context", summary.fieldContext]
        ])
      );
    };

    archetypeSelect.addEventListener("change", update);
    baselineInput.addEventListener("input", update);
    therapySelect.addEventListener("change", update);
    update();
  };

  const renderRosuzet = () => {
    const profile = data.rosuzetProfile;
    const root = select("#rosuzetPanel");

    const buildBlock = (title, body) => {
      const article = element("article", { className: "product-card" });
      article.replaceChildren(element("h3", { text: title }), body);
      return article;
    };

    const identity = element("dl", { className: "definition-list" });
    const identityItems = [
      ["성분", profile.generic],
      ["WHO ATC", profile.whoAtc],
      ["시장분류", profile.marketClass],
      ["용법", profile.dosing]
    ].flatMap(([term, description]) => {
      return [element("dt", { text: term }), element("dd", { text: description })];
    });
    identity.replaceChildren(...identityItems);

    const strengths = element("div", { className: "strength-stack" });
    strengths.replaceChildren(...profile.strengths.map((strength) => element("span", { text: strength })));

    root.replaceChildren(
      buildBlock("Basic Profile", identity),
      buildBlock("Dose Line-up", strengths),
      buildBlock("Label Scope", list(profile.labelScope, "check-list")),
      buildBlock("PM Watchouts", list(profile.watchouts, "check-list"))
    );
  };

  const renderDoseMap = () => {
    const cards = data.dosePositioning.map((dose) => {
      const article = element("article", { className: "dose-card" });
      article.replaceChildren(
        element("p", { className: "dose-strength", text: dose.strength }),
        element("h3", { text: dose.segment }),
        definitionList([
          ["LDL gap", dose.ldlGap],
          ["근거", dose.anchor],
          ["메시지", dose.message],
          ["주의", dose.caution]
        ])
      );
      return article;
    });
    select("#doseGrid").replaceChildren(...cards);
  };

  const renderAtc = () => {
    const root = select("#atcGrid");
    const cards = data.atcFrameworks.map((framework) => {
      const article = element("article", { className: "atc-card" });
      const code = element("p", { className: "code-chip", text: framework.rosuzetCode });
      const title = element("h3", { text: framework.title });
      const use = element("p", { text: framework.useCase });
      const nodes = element("ol", { className: "node-list" });
      const nodeItems = framework.nodes.map(([codeValue, label]) => {
        const item = element("li");
        item.replaceChildren(element("strong", { text: codeValue }), element("span", { text: label }));
        return item;
      });
      nodes.replaceChildren(...nodeItems);
      const caution = element("p", { className: "caution-note", text: framework.caution });
      article.replaceChildren(code, title, use, nodes, caution);
      return article;
    });
    root.replaceChildren(...cards);
  };

  const renderCompetitors = () => {
    const cards = data.competitorGroups.map((group) => {
      const article = element("article", { className: "competitor-card" });
      article.replaceChildren(
        element("h3", { text: group.group }),
        list(group.examples, "inline-list"),
        definitionList([
          ["ATC lens", group.atcLens],
          ["위협", group.threat],
          ["대응", group.response]
        ])
      );
      return article;
    });
    select("#competitorGrid").replaceChildren(...cards);
  };

  const renderEvidence = () => {
    const root = select("#evidenceGrid");
    const cards = data.evidenceCards.map((study) => {
      const article = element("article", { className: "evidence-card" });
      const meta = element("p", { className: "study-type", text: study.type });
      const title = element("h3", { text: study.title });
      const body = element("dl", { className: "definition-list compact" });
      const items = [
        ["대상", study.population],
        ["비교", study.comparator],
        ["결과", study.result],
        ["PM 활용", study.pmUse]
      ].flatMap(([term, description]) => [element("dt", { text: term }), element("dd", { text: description })]);
      body.replaceChildren(...items);
      const link = element("a", { className: "source-link", text: "근거 보기", href: study.sourceUrl });
      article.replaceChildren(meta, title, body, link);
      return article;
    });
    root.replaceChildren(...cards);
  };

  const renderPico = () => {
    const cards = data.picoCards.map((study) => {
      const article = element("article", { className: "pico-card" });
      article.replaceChildren(
        element("h3", { text: study.title }),
        definitionList([
          ["P", study.population],
          ["I", study.intervention],
          ["C", study.comparator],
          ["O", study.outcome],
          ["Limitation", study.limitation],
          ["PM", study.pmMessage]
        ])
      );
      return article;
    });
    select("#picoGrid").replaceChildren(...cards);
  };

  const renderDirectStudies = () => {
    const cards = data.directStudyDeepDives.map((study) => {
      const article = element("article", { className: "deep-study-card" });
      const meta = element("div", { className: "study-card-meta" });
      meta.replaceChildren(
        element("span", { className: "source-tier", text: `Tier ${study.sourceTier}` }),
        element("span", { className: `relevance-chip ${relevanceClass(study.productRelevance)}`, text: relevanceLabel(study.productRelevance) }),
        element("span", { className: "year-chip", text: study.year })
      );

      article.replaceChildren(
        meta,
        element("h3", { text: study.title }),
        definitionList([
          ["Design", study.design],
          ["Population", study.population],
          ["Intervention", study.intervention],
          ["Comparator", study.comparator],
          ["Endpoint", study.endpoint],
          ["Result", study.result],
          ["PM use", study.pmUse],
          ["Guardrail", study.claimGuardrail]
        ]),
        element("a", { className: "source-link", text: "근거 확인", href: study.sourceUrl })
      );
      return article;
    });
    select("#directStudyGrid").replaceChildren(...cards);
  };

  const renderEvidenceAtlas = () => {
    const categorySelect = select("#atlasCategory");
    const searchInput = select("#atlasSearch");
    const count = select("#atlasCount");
    const grid = select("#evidenceAtlasGrid");
    const options = data.evidenceCategories.map((category) => {
      const option = element("option", { text: category.label });
      option.value = category.id;
      return option;
    });

    categorySelect.replaceChildren(...options);
    categorySelect.value = state.activeAtlasCategory;
    searchInput.value = state.atlasSearch;

    const query = normalizeText(state.atlasSearch);
    const studies = data.getEvidenceByCategory(state.activeAtlasCategory);
    const filteredStudies = studies.filter((study) => !query || studySearchText(study).includes(query));
    const cards = filteredStudies.map((study) => {
      const article = element("article", { className: "atlas-card" });
      const meta = element("div", { className: "study-card-meta" });
      meta.replaceChildren(
        element("span", { className: "source-tier", text: `Tier ${study.sourceTier}` }),
        element("span", { className: `relevance-chip ${relevanceClass(study.productRelevance)}`, text: relevanceLabel(study.productRelevance) }),
        element("span", { className: "year-chip", text: study.year })
      );
      article.replaceChildren(
        meta,
        element("h3", { text: study.title }),
        definitionList([
          ["Design", study.design],
          ["Population", study.population],
          ["Intervention", study.intervention],
          ["Endpoint", study.endpoint],
          ["Result", study.result],
          ["PM use", study.pmUse],
          ["Limit", study.limitations]
        ]),
        element("a", { className: "source-link", text: "Source", href: study.sourceUrl })
      );
      return article;
    });

    const emptyState = element("p", { className: "empty-state", text: "검색 조건에 맞는 근거가 없습니다." });
    count.textContent = `${filteredStudies.length} / ${data.evidenceAtlas.length} studies`;
    grid.replaceChildren(...(cards.length > 0 ? cards : [emptyState]));
  };

  const bindEvidenceAtlas = () => {
    select("#atlasCategory").addEventListener("change", (event) => {
      state = { ...state, activeAtlasCategory: event.target.value };
      renderEvidenceAtlas();
    });
    select("#atlasSearch").addEventListener("input", (event) => {
      state = { ...state, atlasSearch: event.target.value };
      renderEvidenceAtlas();
    });
  };

  const renderClaims = () => {
    const groups = [
      ["Allowed", data.claimGuardrails.allowed, "claim-card allowed"],
      ["Use Carefully", data.claimGuardrails.cautious, "claim-card cautious"],
      ["Avoid", data.claimGuardrails.avoid, "claim-card avoid"]
    ];
    const columns = groups.map(([title, items, className]) => {
      const article = element("article", { className });
      article.replaceChildren(element("h3", { text: title }), list(items, "check-list"));
      return article;
    });
    select("#claimColumns").replaceChildren(...columns);
  };

  const renderObjections = () => {
    const rows = data.objectionBank.map((item) => {
      const article = element("article", { className: "objection-card" });
      article.replaceChildren(
        element("h3", { text: item.objection }),
        definitionList([
          ["답변 구조", item.response],
          ["근거", item.evidence],
          ["가드레일", item.guardrail]
        ])
      );
      return article;
    });
    select("#objectionList").replaceChildren(...rows);
  };

  const renderUpdateTracker = () => {
    const cards = data.updateTracker.map((item) => {
      const article = element("article", { className: "tracker-card" });
      article.replaceChildren(
        element("span", { className: "priority-chip", text: item.priority }),
        element("h3", { text: item.topic }),
        definitionList([
          ["현재", item.current],
          ["Watch", item.watch],
          ["Action", item.action]
        ])
      );
      return article;
    });
    select("#updateTracker").replaceChildren(...cards);
  };

  const renderTimeline = () => {
    const root = select("#learningTimeline");
    const items = data.learningModules.map(([week, title, detail]) => {
      const item = element("li");
      item.replaceChildren(
        element("span", { className: "week-chip", text: week }),
        element("strong", { text: title }),
        element("p", { text: detail })
      );
      return item;
    });
    root.replaceChildren(...items);
  };

  const renderQuiz = () => {
    const current = data.quizQuestions[state.quizIndex];
    const progress = select("#quizProgress");
    const question = select("#quizQuestion");
    const answer = select("#quizAnswer");
    const toggle = select("#toggleAnswer");

    progress.textContent = `${state.quizIndex + 1} / ${data.quizQuestions.length}`;
    question.textContent = current.question;
    answer.textContent = current.answer;
    answer.hidden = !state.isAnswerVisible;
    toggle.textContent = state.isAnswerVisible ? "정답 숨기기" : "정답 보기";
  };

  const bindQuiz = () => {
    select("#prevQuiz").addEventListener("click", () => {
      const nextIndex = state.quizIndex === 0 ? data.quizQuestions.length - 1 : state.quizIndex - 1;
      state = { ...state, quizIndex: nextIndex, isAnswerVisible: false };
      renderQuiz();
    });
    select("#nextQuiz").addEventListener("click", () => {
      const nextIndex = (state.quizIndex + 1) % data.quizQuestions.length;
      state = { ...state, quizIndex: nextIndex, isAnswerVisible: false };
      renderQuiz();
    });
    select("#toggleAnswer").addEventListener("click", () => {
      state = { ...state, isAnswerVisible: !state.isAnswerVisible };
      renderQuiz();
    });
  };

  const renderSources = () => {
    const root = select("#sourceLinks");
    const links = data.sourceLinks.map(([label, url]) => element("a", { text: label, href: url }));
    root.replaceChildren(...links);
  };

  const init = () => {
    renderGuidelines();
    renderTargetMatrix();
    renderCalculator();
    renderCaseSimulator();
    renderRosuzet();
    renderDoseMap();
    renderAtc();
    renderCompetitors();
    renderEvidence();
    renderPico();
    renderDirectStudies();
    renderEvidenceAtlas();
    renderClaims();
    renderObjections();
    renderUpdateTracker();
    renderTimeline();
    renderQuiz();
    bindQuiz();
    bindEvidenceAtlas();
    renderSources();
  };

  init();
})();
