const ExperienceData = (() => {
  const definition = globalThis.DefinitionData || {};
  const mechanism = globalThis.MechanismData || {};
  const statin = globalThis.StatinProfileData || {};
  const fact = globalThis.FactSheetData || {};
  const landmark = globalThis.LandmarkTrialData || {};
  const study = globalThis.StudyData || {};
  const library = globalThis.LibraryData || {};
  const strategy = globalThis.StrategyData || {};
  const sourceData = globalThis.SourceData || {
    getArchiveSummary: () => ({ followUpCount: 0, linkedOnlyCount: 0, localFileCount: 0, neededCount: 0, p0Count: 0, totalCount: 0 }),
    getSourceItemsByFilters: () => [],
    getSourceItemsByStatus: () => [],
    sourceCategoryOptions: [],
    sourceHubItems: [],
    sourceStatusOptions: []
  };

  const sourceHubItems = sourceData.sourceHubItems;
  const sourceStatusOptions = sourceData.sourceStatusOptions;
  const sourceCategoryOptions = sourceData.sourceCategoryOptions;

  const guidelineSegmentDiffs = [
    segment("ASCVD", "CAD 초고위험은 <55 mg/dL + 50% 이상 감소, 그 외 ASCVD 고위험은 <70 mg/dL 축.", "Very-high-risk는 <55 mg/dL + 50% 이상 감소, 조기 병용 강화 흐름.", "Very-high-risk ASCVD는 LDL-C <55 mg/dL, non-HDL-C <85 mg/dL.", "baseline LDL-C gap, RACING, 10/10 mg 전략을 먼저 연결한다."),
    segment("Diabetes", "유병기간, 표적장기손상, ASCVD 동반 여부에 따라 <70 또는 <55 mg/dL까지 세분화.", "위험도별 target과 SCORE2-Diabetes 맥락을 함께 본다.", "diabetes risk enhancer, ApoB/Lp(a), TG 평가를 병행.", "EROICA는 lipid endpoint 직접 근거, statin diabetes signal은 benefit-risk로 설명한다."),
    segment("CKD", "CKD는 위험도 상승 축이며 신기능별 약제 용량 주의가 필요.", "CKD는 high/very-high risk modifier로 적극 치료하지만 dialysis evidence는 별도.", "CKD는 risk enhancer와 comorbidity 축으로 반영.", "SHARP class evidence와 rosuvastatin renal dose guardrail을 분리한다."),
    segment("Stroke/TIA", "허혈성 뇌졸중/TIA는 대체로 <70 mg/dL, 일부 초고위험은 더 낮게 고려.", "ASCVD risk 기반으로 target을 낮게 잡고 recurrent event prevention을 강조.", "ASCVD not very high/very high에 따라 threshold를 달리 적용.", "SWITCH/ROSETTA-Stroke는 단기 lipid/관찰 근거로 제한한다."),
    segment("TG", "TG, non-HDL-C, secondary cause, pancreatitis risk를 LDL-C 목표와 분리.", "TG residual risk와 icosapent ethyl 근거는 대상·제제를 엄격히 제한.", "persistent TG는 LDL-C 관리 이후 residual risk로 접근.", "로수젯을 TG 치료제로 말하지 않고 LDL-C first를 고정한다."),
    segment("FH", "LDL-C >=190 mg/dL, 조기 ASCVD 가족력, FH 의심 시 강한 치료와 family screening.", "FH는 lifetime exposure와 조기 병용/주사제 escalation 가능성이 큼.", "severe hypercholesterolemia는 위험도에 따라 더 낮은 목표를 적용.", "oral FDC는 단계 중 하나이며 중증 FH 전체 솔루션처럼 말하지 않는다."),
    segment("Elderly", "연령만으로 치료 배제하지 않고 frailty, 신기능, polypharmacy를 함께 확인.", "SCORE2-OP와 biological age, patient preference를 함께 본다.", "shared decision making과 comorbidity burden을 강조.", "EWTOPIA 75는 고령 ezetimibe 논의 backup이지만 open-label 한계를 붙인다.")
  ];

  const competitorMatrix = [
    competitor("동일성분 FDC", "rosuvastatin+ezetimibe 후발품", "생동/가격/공급 안정성", "직접 임상 우월보다 자산 품질, 용량 라인업, 교육 완성도로 대응", "동일성분 간 우월 claim 금지"),
    competitor("Atorvastatin+ezetimibe", "atorvastatin 기반 FDC", "처방 습관, Lipitor heritage, CYP3A4 familiarity", "rosuvastatin potency, 긴 반감기, RACING strategy를 분리해 설명", "head-to-head 없는 성분 우열 단정 금지"),
    competitor("Pitavastatin+ezetimibe", "pitavastatin 기반 FDC", "당뇨병/대사 안전성 narrative", "EROICA, T2DM lipid endpoint, statin diabetes signal의 절대위험 균형", "당뇨병 예방/개선 claim 금지"),
    competitor("고강도 statin 단독", "rosuvastatin 20 mg, atorvastatin 40/80 mg", "단순하고 outcome evidence가 강함", "LDL-C gap, tolerability, ezetimibe add-on, RACING noninferiority로 재구성", "대체/우월보다 선택지 언어 사용"),
    competitor("PCSK9 mAb", "evolocumab, alirocumab", "강력한 LDL-C lowering과 outcome evidence", "oral FDC 접근성, 급여, 주사 부담, 단계적 intensification 위치", "주사제보다 낫다는 표현 금지"),
    competitor("Inclisiran", "PCSK9 siRNA", "투여 간격과 adherence narrative", "국내 access, outcome maturity, oral therapy before injectable 프레임", "장기 outcome 확정 전 과장 금지"),
    competitor("Bempedoic acid", "ACL inhibitor", "statin intolerance oral option", "국내 access와 CLEAR Outcomes 대상 환자를 구분하고 statin/ezetimibe foundation 유지", "근육 증상 전체 해법처럼 말하지 않기"),
    competitor("TG/residual risk", "fenofibrate, omega-3, icosapent ethyl", "T2DM 고TG 환자에서 메시지 혼선", "LDL-C goal attainment와 TG/pancreatitis decision tree를 분리", "TG endpoint와 LDL-C claim 혼합 금지")
  ];

  const scriptSegments = [
    scriptSegment("cardiology", "Cardiology", "ASCVD, post-PCI, very-high-risk", "RACING, IMPROVE-IT, PROVE-IT, TNT", "LDL-C target과 3년 outcome strategy를 함께 묻는다."),
    scriptSegment("endocrinology", "Endocrinology", "T2DM, mixed dyslipidemia, TG", "EROICA, CARDS, Sattar meta-analysis", "LDL-C, ApoB, TG를 분리하고 당뇨병 safety 질문에 대비한다."),
    scriptSegment("neurology", "Neurology", "ischemic stroke, TIA", "SPARCL, ROSETTA-Stroke, SWITCH", "재발 예방과 단기 lipid endpoint의 claim 한계를 함께 말한다."),
    scriptSegment("primary-care", "Primary Care", "검진 LDL-C 상승, 복약 부담", "WOSCOPS, HOPE-3, KSoLA Fact Sheet", "위험도 평가와 장기 adherence를 먼저 둔다."),
    scriptSegment("nephrology", "Nephrology", "CKD, proteinuria, renal dose", "SHARP, AURORA, 4D", "CKD outcome evidence와 rosuvastatin 용량 주의를 분리한다.")
  ];

  const scriptObjections = [
    scriptObjection("high-statin", "고강도 statin 단독이면 충분", "고강도 statin은 표준축이지만 LDL-C target 미달, 내약성, ezetimibe 추가 효과를 분리한다."),
    scriptObjection("generic", "동일성분 제네릭과 차이", "우월성보다 용량 라인업, 자료 품질, 공급, 교육 지원과 claim hygiene로 말한다."),
    scriptObjection("pcsk9", "PCSK9가 더 강력", "강한 lowering은 인정하고 oral FDC 접근성, 급여, 주사 부담, 단계적 강화 위치를 설명한다."),
    scriptObjection("tg", "TG가 더 중요", "LDL-C target과 TG residual risk를 분리하고 non-HDL-C/ApoB를 보조 지표로 둔다."),
    scriptObjection("eroica-outcome", "EROICA로 outcome claim 가능?", "EROICA는 lipid endpoint 직접 근거로 쓰고 심혈관 사건 감소 claim으로 확대하지 않는다.")
  ];

  const progressModules = [
    progress("definition", "이상지질혈증 정의와 분류", "foundation", "#dyslipidemia-definition"),
    progress("moa", "스타틴 작용기전과 ezetimibe 보완", "foundation", "#statin-mechanism"),
    progress("statin-profile", "스타틴 성분별 특성과 오리지널", "foundation", "#statin-profiles"),
    progress("price", "대표 급여가격과 최신 고시 guardrail", "foundation", "#statin-profiles"),
    progress("fact-sheet", "KSoLA 2024 Fact Sheet funnel", "foundation", "#fact-sheet-2024"),
    progress("guideline-diff", "환자군별 지침 diff", "strategy", "#guideline-segment-diff"),
    progress("competitor", "경쟁군별 threat/response", "strategy", "#competitor-matrix"),
    progress("landmark", "랜드마크 Trial PICO", "evidence", "#landmark-trials"),
    progress("claim", "Claim guardrail와 반론 대응", "execution", "#claim-checker"),
    progress("script", "Detail script generator", "execution", "#detail-script-generator"),
    progress("source", "Source Hub follow-up 확인", "sources", "#source-hub")
  ];

  const glossaryTerms = [
    term("ApoB", "atherogenic lipoprotein particle/입자 수를 반영하는 단백질 지표. TG가 높거나 LDL-C와 risk가 discordant할 때 유용하다.", "Risk marker"),
    term("LDL-C", "Low-density lipoprotein cholesterol. 대부분 지침에서 1차 치료 목표로 사용하는 핵심 수치.", "Primary target"),
    term("non-HDL-C", "total cholesterol에서 HDL-C를 뺀 값으로, remnant cholesterol까지 포함하는 atherogenic cholesterol 지표.", "Secondary target"),
    term("Lp(a)", "유전 영향이 큰 독립 위험인자. 현재는 LDL-C 등 수정 가능한 위험인자 최적화가 핵심이다.", "Risk enhancer"),
    term("TG", "Triglyceride. pancreatitis risk와 residual ASCVD risk 논의를 구분해야 한다.", "Residual risk"),
    term("C10BA06", "WHO ATC에서 rosuvastatin and ezetimibe를 뜻하는 공식 조합 코드.", "Classification"),
    term("C10C", "EPHMRA/Intellus 시장분류에서 조합 지질조절제를 뜻하는 market class.", "Market class"),
    term("MACE", "Major adverse cardiovascular events. 연구마다 구성요소가 다르므로 정의를 확인해야 한다.", "Endpoint"),
    term("NNT", "Number needed to treat. 특정 기간 사건 하나를 예방하기 위해 치료해야 하는 환자 수.", "Evidence"),
    term("HR", "Hazard ratio. 시간-사건 자료에서 두 군의 사건 발생 위험을 비교하는 지표.", "Statistics"),
    term("95% CI", "추정치의 불확실성을 보여주는 confidence interval. 1 포함 여부와 임상적 의미를 함께 본다.", "Statistics"),
    term("Noninferiority", "미리 정한 margin 안에서 대조군보다 임상적으로 열등하지 않음을 보이는 연구 설계.", "Trial design"),
    term("Treat-to-target", "위험군별 LDL-C 목표에 도달하도록 치료 강도를 조정하는 접근.", "Guideline"),
    term("SAMS", "Statin-associated muscle symptoms. causality, CK, 재도전, 상호작용 평가가 필요하다.", "Safety"),
    term("Residual risk", "LDL-C 치료 후에도 TG, Lp(a), inflammation, diabetes 등으로 남는 위험.", "Risk"),
    term("Claim guardrail", "연구 설계, 대상, endpoint, 허가사항을 넘어선 표현을 제한하는 검수 기준.", "Compliance")
  ];

  const priceComparatorRows = (statin.priceBenchmarks || []).map((item) => ({
    ...item,
    monthlyCostWon: item.ceilingPriceWon * 30
  }));

  function segment(segmentName, ksola, esc, acc, pmAction) {
    return { acc, esc, ksola, pmAction, segment: segmentName };
  }

  function competitor(className, examples, threat, response, guardrail) {
    return { className, examples, guardrail, response, threat };
  }

  function scriptSegment(id, label, focus, anchors, opening) {
    return { anchors, focus, id, label, opening };
  }

  function scriptObjection(id, label, answer) {
    return { answer, id, label };
  }

  function progress(id, title, page, href) {
    return { href, id, page, title };
  }

  function term(label, definitionText, category) {
    return { category, definition: definitionText, term: label };
  }

  const normalize = (value) => String(value || "").toLocaleLowerCase("ko-KR");
  const flattenText = (value) => Array.isArray(value) ? value.map(flattenText).join(" ") : String(value || "");
  const entry = (type, title, summary, href, keywords = []) => ({
    href,
    keywords,
    searchText: normalize([title, summary, ...keywords].map(flattenText).join(" ")),
    summary,
    title,
    type
  });

  const entriesFrom = (type, items, mapper) => (items || []).map((item) => {
    const mapped = mapper(item);
    return entry(type, mapped.title, mapped.summary, mapped.href, mapped.keywords);
  });

  const searchIndex = [
    ...entriesFrom("Definition", definition.definitionSections, (item) => ({ href: "#dyslipidemia-definition", keywords: [item.bullets, item.pmUse], summary: item.summary, title: item.title })),
    ...entriesFrom("Mechanism", mechanism.statinMechanismSteps, (item) => ({ href: "#statin-mechanism", keywords: [item.pmUse], summary: item.summary, title: item.title })),
    ...entriesFrom("Statin", statin.statinIngredientProfiles, (item) => ({ href: "#statin-profiles", keywords: [item.originatorBrand, item.metabolism, item.characteristic, item.pmUse], summary: `${item.solubility} · ${item.halfLife}`, title: item.ingredientName })),
    ...entriesFrom("Price", priceComparatorRows, (item) => ({ href: "#statin-profiles", keywords: [item.company, item.ingredientText, item.code, item.monthlyCostWon], summary: `${item.ceilingPriceWon}원/정 · 30일 ${item.monthlyCostWon}원`, title: item.product })),
    ...entriesFrom("Fact Sheet", fact.factSheetMetrics, (item) => ({ href: "#fact-sheet-2024", keywords: [item.pmUse], summary: `${item.value} · ${item.note}`, title: item.label })),
    ...entriesFrom("Guideline", study.guidelineSummaries, (item) => ({ href: "#guidelines", keywords: [item.society, item.edition, item.anchors, item.targets, item.pmImplication], summary: item.frame, title: `${item.society} ${item.edition}` })),
    ...entriesFrom("Evidence", study.evidenceCards, (item) => ({ href: "#evidence", keywords: [item.population, item.comparator, item.result, item.pmUse], summary: item.type, title: item.title })),
    ...entriesFrom("PICO", study.picoCards, (item) => ({ href: "#pico", keywords: [item.population, item.intervention, item.comparator, item.outcome, item.limitation, item.message], summary: item.message, title: item.title })),
    ...entriesFrom("Atlas", study.evidenceAtlas, (item) => ({ href: "#evidence-atlas", keywords: [item.design, item.population, item.endpoint, item.result, item.pmUse, item.limitations, item.category], summary: item.pmUse || item.result, title: item.title })),
    ...entriesFrom("Direct", study.directStudyDeepDives, (item) => ({ href: "#direct-studies", keywords: [item.design, item.population, item.endpoint, item.result, item.claimGuardrail], summary: item.pmUse || item.result, title: item.title })),
    ...entriesFrom("Landmark", landmark.landmarkTrials, (item) => ({ href: "#landmark-trials", keywords: [item.population, item.intervention, item.comparator, item.endpoint, item.result, item.pmUse, item.guardrail], summary: item.result, title: item.title })),
    ...entriesFrom("Library", library.libraryModules, (item) => ({ href: "#library", keywords: [item.learn, item.pmUse, item.sourceNote, item.category], summary: item.summary, title: item.title })),
    ...entriesFrom("Segment", guidelineSegmentDiffs, (item) => ({ href: "#guideline-segment-diff", keywords: [item.ksola, item.esc, item.acc, item.pmAction], summary: item.pmAction, title: item.segment })),
    ...entriesFrom("Competitor", competitorMatrix, (item) => ({ href: "#competitor-matrix", keywords: [item.examples, item.threat, item.response, item.guardrail], summary: item.response, title: item.className })),
    ...entriesFrom("Source", sourceHubItems, (item) => ({ href: "#source-hub", keywords: [item.category, item.status, item.pmUse, item.sourceUrl, item.archiveState, item.localArchivePath, item.priority, item.extractionFocus], summary: item.summary, title: item.title })),
    ...entriesFrom("Glossary", glossaryTerms, (item) => ({ href: "#library", keywords: [item.category], summary: item.definition, title: item.term })),
    ...entriesFrom("War Room", strategy.competitorWarRoom, (item) => ({ href: "#war-room", keywords: [item.examples, item.threat, item.response, item.watch], summary: item.response, title: item.group })),
    ...entriesFrom("Objection", strategy.trainingScenarios, (item) => ({ href: "#objection-training", keywords: [item.answer, item.guardrail], summary: item.answer, title: item.prompt }))
  ].filter((item) => item.title);

  const searchAll = (query) => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      return [];
    }
    return searchIndex.filter((item) => tokens.every((token) => item.searchText.includes(token))).slice(0, 30);
  };

  const getSourceItemsByStatus = (status) => sourceData.getSourceItemsByStatus(status);
  const getSourceItemsByFilters = (filters) => sourceData.getSourceItemsByFilters(filters);
  const getArchiveSummary = () => sourceData.getArchiveSummary();
  const getPriceComparatorById = (id) => priceComparatorRows.find((item) => item.id === id);
  const getGlossaryTerm = (label) => glossaryTerms.find((item) => normalize(item.term) === normalize(label));

  const buildDetailScript = ({ segmentId, objectionId }) => {
    const selectedSegment = scriptSegments.find((item) => item.id === segmentId) || scriptSegments[0];
    const objection = scriptObjections.find((item) => item.id === objectionId) || scriptObjections[0];
    return {
      medicalBackup: `claim 근거는 ${selectedSegment.anchors}로 제한하고, 허가사항·endpoint·대상 환자 밖으로 확대하지 않는다. 반론 포인트: ${objection.answer}`,
      objectionId: objection.id,
      segmentId: selectedSegment.id,
      sixtySecond: `${selectedSegment.label}에서는 KSoLA target부터 확인하고 baseline LDL-C gap, 현재 statin 강도, 순응도를 묻는다. 이후 ${selectedSegment.anchors}를 근거 축으로 두고 로수젯은 oral FDC intensification option으로 제시한다.`,
      thirtySecond: `${selectedSegment.focus} 환자에서 LDL-C target 미달을 먼저 확인한다. ${selectedSegment.opening} ${objection.answer} RACING은 전략 근거로 연결한다.`
    };
  };

  return {
    buildDetailScript,
    competitorMatrix,
    getArchiveSummary,
    getGlossaryTerm,
    getPriceComparatorById,
    getSourceItemsByFilters,
    getSourceItemsByStatus,
    glossaryTerms,
    guidelineSegmentDiffs,
    priceComparatorRows,
    progressModules,
    scriptObjections,
    scriptSegments,
    searchAll,
    searchIndex,
    sourceCategoryOptions,
    sourceHubItems,
    sourceStatusOptions
  };
})();

globalThis.ExperienceData = ExperienceData;
