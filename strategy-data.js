const StrategyData = (() => {
  const segmentPlaybooks = [
    {
      id: "cardiology",
      label: "Cardiology",
      patient: "CAD, post-PCI, recurrent ASCVD, very-high-risk",
      coreQuestion: "LDL-C <55 mg/dL와 50% 이상 감소를 어떻게 빠르게 달성할 것인가?",
      evidenceIds: ["racing", "racing-vhr", "racing-pci", "prove-it", "tnt"],
      message: "RACING과 high-intensity statin evidence를 함께 두고 statin 증량 vs ezetimibe 추가의 trade-off를 설명.",
      guardrail: "RACING은 전략 근거다. 모든 CAD 환자에서 브랜드 우월 claim으로 확대하지 않는다.",
      action: "post-PCI, 목표 미달, 고강도 statin 불편감 계정을 분리해 detail sequence를 설계."
    },
    {
      id: "endocrinology",
      label: "Endocrinology",
      patient: "T2DM, organ damage, mixed dyslipidemia, high TG",
      coreQuestion: "LDL-C, non-HDL-C, ApoB, TG 중 어떤 지표를 앞세울 것인가?",
      evidenceIds: ["eroica", "rembrandt", "cards", "racing-diabetes", "sattar-diabetes-meta"],
      message: "EROICA는 10/2.5 mg T2DM switch story, REMBRANDT는 mixed dyslipidemia 추적 이슈로 분리.",
      guardrail: "T2DM에서 TG 메시지와 LDL-C 목표 메시지를 섞지 않는다.",
      action: "LDL-C 미달 statin 단독 환자와 TG residual-risk 환자 세그먼트를 다른 deck으로 관리."
    },
    {
      id: "neurology",
      label: "Neurology",
      patient: "Ischemic stroke, TIA, statin monotherapy after stroke",
      coreQuestion: "재발 예방에서 LDL-C <70 또는 더 낮은 목표를 어떻게 설득할 것인가?",
      evidenceIds: ["switch", "rosetta-stroke", "sparcl", "racing"],
      message: "SWITCH와 ROSETTA-Stroke는 stroke segment의 switch-in 근거, SPARCL은 statin foundation.",
      guardrail: "관찰연구와 90일 lipid endpoint를 장기 outcome superiority로 말하지 않는다.",
      action: "stroke 후 statin 단독 목표 미달 환자를 실제 switch 후보군으로 정의."
    },
    {
      id: "nephrology",
      label: "Nephrology",
      patient: "CKD, proteinuria, dialysis boundary, renal transplant",
      coreQuestion: "CKD에서 statin/ezetimibe class evidence와 dialysis neutral trial을 어떻게 구분할 것인가?",
      evidenceIds: ["sharp", "aurora", "four-d", "alert", "planet-i-ii"],
      message: "SHARP는 CKD class outcome anchor, AURORA/4D는 dialysis context에서 neutral evidence.",
      guardrail: "투석 환자 자료를 일반 CKD 또는 로수젯 직접 근거처럼 확장하지 않는다.",
      action: "신기능, 금기, 용량 주의, 전문의 judgement가 필요한 환자를 교육자료에 명확히 표시."
    },
    {
      id: "primary-care",
      label: "Primary Care",
      patient: "검진 LDL-C 상승, 중등도 위험, 복약 부담이 큰 장기 관리 환자",
      coreQuestion: "초기 치료, 생활습관, 장기 adherence를 어떤 순서로 설명할 것인가?",
      evidenceIds: ["woscops-main", "jupiter", "hope-3", "low-dose-r25-e10", "korea-fact-sheet-2024"],
      message: "10/2.5 mg은 lower statin exposure 기반 초기 병용 후보지만 과치료 메시지를 피해야 한다.",
      guardrail: "저위험군에서는 생활습관과 위험도 평가가 선행된다.",
      action: "검진-재방문-처방전환 funnel을 따로 보고 재진 지속률을 KPI로 둔다."
    }
  ];

  const treatmentOptions = [
    { id: "lifestyle", option: "Lifestyle only", ldlReduction: 10, role: "저위험 또는 target 도달 상태에서 기본축" },
    { id: "moderate-statin", option: "Moderate-intensity statin", ldlReduction: 40, role: "대부분 초기 약물치료의 표준 출발점" },
    { id: "high-statin", option: "High-intensity statin", ldlReduction: 52, role: "ASCVD 또는 큰 LDL-C gap에서 기본 비교축" },
    { id: "rosuzet-10-2-5", option: "Rosuzet 10/2.5 mg", ldlReduction: 45, role: "초기 병용, lower statin exposure, EROICA 연결" },
    { id: "rosuzet-10-5", option: "Rosuzet 10/5 mg", ldlReduction: 52, role: "T2DM, mixed dyslipidemia, 중등도 이상 gap" },
    { id: "rosuzet-10-10", option: "Rosuzet 10/10 mg", ldlReduction: 58, role: "ASCVD, post-PCI, RACING strategy" },
    { id: "rosuzet-10-20", option: "Rosuzet 10/20 mg", ldlReduction: 63, role: "매우 큰 gap, 고강도 statin exposure 허용 시" },
    { id: "pcsk9", option: "PCSK9 / Inclisiran add-on", ldlReduction: 70, role: "oral therapy 이후 very-high-risk 목표 미달 환자" }
  ];

  const currentTherapyOptions = [
    { id: "naive", label: "치료 전" },
    { id: "low-statin", label: "저강도 statin" },
    { id: "moderate-statin", label: "중강도 statin" },
    { id: "high-statin", label: "고강도 statin" },
    { id: "combo", label: "statin + ezetimibe" }
  ];

  const competitorWarRoom = [
    {
      group: "동일성분 FDC",
      examples: "rosuvastatin+ezetimibe 후발품",
      threat: "가격, 생동, 공급 안정성, 제형 convenience",
      response: "브랜드 직접 근거, 용량 라인업, field education, 심의된 자료 완성도",
      watch: "대조약 변화, ODT/소형정, 약가 인하"
    },
    {
      group: "Atorvastatin+ezetimibe",
      examples: "atorvastatin 기반 FDC",
      threat: "처방 습관과 generic familiarity",
      response: "rosuvastatin potency, RACING strategy, 10/2.5-10/20 range",
      watch: "cardiology KOL preference"
    },
    {
      group: "Pitavastatin+ezetimibe",
      examples: "당뇨병/대사 안전성 중심 positioning",
      threat: "diabetes safety narrative",
      response: "EROICA, diabetes subgroup evidence, statin diabetes signal의 절대위험 균형",
      watch: "T2DM 계정별 objection 변화"
    },
    {
      group: "PCSK9 mAb",
      examples: "evolocumab, alirocumab",
      threat: "강력한 LDL-C lowering과 outcome evidence",
      response: "oral FDC 접근성, 단계적 intensification, 급여/주사 부담",
      watch: "very-high-risk 미달 환자에서 전환 속도"
    },
    {
      group: "Inclisiran",
      examples: "siRNA twice-yearly maintenance",
      threat: "adherence burden을 바꾸는 dosing story",
      response: "국내 허가/급여, outcome maturity, oral therapy before injectable",
      watch: "장기 outcome update와 계정별 사용 기준"
    },
    {
      group: "Bempedoic acid",
      examples: "statin intolerance oral nonstatin",
      threat: "근육 증상 환자의 oral 대안",
      response: "국내 access와 대상 환자 차이, ezetimibe/statin foundation",
      watch: "CLEAR Outcomes 인용 증가"
    },
    {
      group: "TG / residual risk",
      examples: "fenofibrate, omega-3, icosapent ethyl",
      threat: "TG 높은 당뇨병 환자에서 메시지 혼선",
      response: "LDL-C goal attainment와 TG residual risk를 다른 decision tree로 분리",
      watch: "TG 500 mg/dL 이상 pancreatitis risk vs ASCVD risk"
    }
  ];

  const guidelineDiffRows = [
    { theme: "Very-high-risk LDL-C", ksola: "<55 mg/dL + 50% 이상 감소", esc: "<55 mg/dL + 50% 이상 감소", acc: "<55 mg/dL와 non-HDL-C 목표", pm: "10/10, 10/20, RACING strategy" },
    { theme: "High-risk ASCVD", ksola: "<70 mg/dL", esc: "<70 mg/dL + 50% 이상 감소", acc: "<70 mg/dL", pm: "statin 단독 목표 미달 switch-in" },
    { theme: "Diabetes", ksola: "위험도 세분화", esc: "risk category별 목표", acc: "risk enhancer와 ApoB/non-HDL-C", pm: "EROICA, REMBRANDT, CARDS 연결" },
    { theme: "Nonstatin add-on", ksola: "ezetimibe/PCSK9 중요도 상승", esc: "combination therapy 강조", acc: "threshold 기반 intensification", pm: "statin 증량 vs ezetimibe 추가" },
    { theme: "Lp(a), ApoB", ksola: "2026 update watch", esc: "Lp(a) 반영 강화", acc: "risk enhancer로 반영", pm: "직접 제품 claim보다 risk stratification backup" },
    { theme: "TG residual risk", ksola: "TG와 secondary causes 관리", esc: "TG/residual risk 업데이트", acc: "non-HDL-C와 TG 맥락", pm: "LDL-C와 TG 메시지 분리" }
  ];

  const publicationTracker = [
    { asset: "EROICA", status: "PubMed publication 확인", nextStep: "full text 세부 subgroup, safety table 확인", owner: "Medical/PM", priority: "High" },
    { asset: "REMBRANDT", status: "ClinicalTrials.gov completed, posted results 없음", nextStep: "학회 발표와 논문화 상태 추적", owner: "Medical", priority: "High" },
    { asset: "EASY-ROSUZET", status: "회사 발표 근거 중심", nextStep: "등록번호, 논문, 세부 대상자 정의 확인", owner: "PM", priority: "Medium" },
    { asset: "SWITCH", status: "PubMed publication 확인", nextStep: "stroke severity, baseline statin, target subgroup 확인", owner: "Medical/PM", priority: "High" },
    { asset: "ROSETTA-Stroke", status: "PMC full text 확인", nextStep: "neurology deck에 90일 endpoint 한계 표시", owner: "PM", priority: "Medium" },
    { asset: "RACING subgroup", status: "very-high-risk, elderly, PCI, diabetes 축 존재", nextStep: "계정별 objection 대응 카드로 재배치", owner: "PM", priority: "High" },
    { asset: "KSoLA 2026", status: "2026-09 이후 launch watch", nextStep: "LDL-C target, nonstatin, ApoB/Lp(a), TG 변경점 diff", owner: "PM/Medical", priority: "High" },
    { asset: "Competitor ODT/FDC", status: "허가/출시 뉴스 watch", nextStep: "동일성분 대응자료와 claim guardrail 업데이트", owner: "PM/Sales", priority: "Medium" }
  ];

  const monthlyBriefBlocks = [
    { title: "Guideline Watch", body: "KSoLA 2026 launch 여부와 ESC/EAS 2025, ACC/AHA 2026 인용 문장을 비교." },
    { title: "Evidence Watch", body: "EROICA, SWITCH, REMBRANDT, EASY-ROSUZET publication status를 등급화." },
    { title: "Field Objection", body: "고강도 statin, 동일성분 FDC, TG 치료제, 주사제 objection의 빈도 변화 확인." },
    { title: "Market Signal", body: "용량 mix, 신규/전환 처방, statin 단독 목표 미달 환자 pool 추정." },
    { title: "Claim Hygiene", body: "브랜드 직접 근거, class outcome, strategy evidence를 구분해 자료 문장 점검." },
    { title: "Next Action", body: "상위 계정별로 1개 segment message와 1개 evidence card만 선택해 실행." }
  ];

  const trainingScenarios = [
    { prompt: "고강도 statin 쓰면 되지 로수젯을 왜 쓰나요?", answer: "목표 LDL-C, 내약성, 다른 기전 추가를 분리하고 RACING은 strategy evidence로 설명한다.", guardrail: "무조건 우월 claim 금지" },
    { prompt: "EROICA로 심혈관 사건 감소를 말해도 되나요?", answer: "아니다. EROICA는 T2DM switch-in lipid endpoint 직접 근거로 쓰고 outcome claim은 피한다.", guardrail: "single-arm 12주 연구 한계 표시" },
    { prompt: "제네릭 동일성분과 무엇이 다른가요?", answer: "임상 우월보다 근거 package, 용량 라인업, 공급, 교육자료, 계정 실행력을 이야기한다.", guardrail: "동일성분 우월 단정 금지" },
    { prompt: "TG가 높은 당뇨병 환자는 fibrate가 먼저 아닌가요?", answer: "LDL-C 목표와 TG/pancreatitis risk를 먼저 분리하고, non-HDL-C/ApoB를 보조축으로 둔다.", guardrail: "LDL-C와 TG endpoint 혼합 금지" },
    { prompt: "PCSK9가 더 강력한데 oral FDC가 의미 있나요?", answer: "강한 LDL-C lowering은 인정하고, 환자군, 급여, 주사 부담, oral 단계적 강화 위치를 설명한다.", guardrail: "head-to-head 없는 우열 단정 금지" },
    { prompt: "저위험 환자에게도 10/2.5 mg을 밀면 되나요?", answer: "생활습관과 위험도 평가가 우선이고, LDL-C gap과 장기 노출을 확인한 뒤 제한적으로 논의한다.", guardrail: "과치료 메시지 금지" }
  ];

  const qualityStudyIds = ["eroica", "racing", "switch", "rosetta-stroke", "improve-it", "four-s", "jupiter", "sattar-diabetes-meta"];

  const marketSizingDefaults = {
    adults: 38000000,
    dyslipidemiaPrevalence: 0.409,
    diagnosedRate: 0.72,
    treatedRate: 0.68,
    statinMonoShare: 0.52,
    goalFailureRate: 0.45,
    targetShare: 0.12,
    annualRxValue: 480000
  };

  const roundPercent = (value) => Number(value.toFixed(1));

  const computeLdlStrategy = ({ baselineLdl, currentTherapyId, targetLdl }) => {
    const baseline = Number(baselineLdl);
    const target = Number(targetLdl);
    const absoluteGap = Math.max(0, Math.round(baseline - target));
    const neededReductionPercent = baseline > 0 ? roundPercent((absoluteGap / baseline) * 100) : 0;
    const rows = treatmentOptions.map((item) => {
      const projectedLdl = Math.round(baseline * (1 - item.ldlReduction / 100));
      const targetFit = projectedLdl < target ? "Target 가능" : "Target 미달 가능";
      return { ...item, projectedLdl, targetFit };
    });
    const recommendation = neededReductionPercent >= 60
      ? "로수젯 10/20 mg 또는 injectable add-on까지 early planning"
      : neededReductionPercent >= 55
        ? "로수젯 10/10 또는 10/20 mg 중심으로 oral FDC escalation 검토"
        : neededReductionPercent >= 45
          ? "로수젯 10/5 또는 10/10 mg으로 statin 증량 대비 ezetimibe 추가 전략 비교"
          : "10/2.5 mg 또는 생활습관/중강도 statin 옵션을 risk discussion 후 검토";
    const currentTherapy = currentTherapyOptions.find((item) => item.id === currentTherapyId) || currentTherapyOptions[0];

    return {
      absoluteGap,
      currentTherapy: currentTherapy.label,
      neededReductionPercent,
      recommendation,
      rows
    };
  };

  const computeMarketSizing = (input = {}) => {
    const values = { ...marketSizingDefaults, ...input };
    const tamPatients = Math.round(values.adults * values.dyslipidemiaPrevalence);
    const diagnosedPatients = Math.round(tamPatients * values.diagnosedRate);
    const treatedPatients = Math.round(diagnosedPatients * values.treatedRate);
    const samPatients = Math.round(treatedPatients * values.statinMonoShare * values.goalFailureRate);
    const somPatients = Math.round(samPatients * values.targetShare);
    const annualRevenue = somPatients * values.annualRxValue;

    return {
      annualRevenue,
      diagnosedPatients,
      samPatients,
      somPatients,
      tamPatients,
      treatedPatients
    };
  };

  const normalize = (value) => String(value || "").toLocaleLowerCase("ko-KR");

  const evaluateClaim = (claim) => {
    const text = normalize(claim);
    const hasOutcome = /심혈관|사건|event|outcome|mortality|mace/.test(text);
    const hasRosuzet = /로수젯|rosuzet/.test(text);
    const hasSuperiority = /우월|superior|better|모든 환자|부작용.*없/.test(text);

    if (/c10c.*who|who.*c10c|부작용.*없/.test(text) || (hasRosuzet && hasSuperiority)) {
      return { level: "avoid", rationale: "근거 범위를 넘어선 우월/무위험 claim 가능성이 큼.", rewrite: "비교 근거와 대상 환자를 제한해 표현한다." };
    }
    if (/eroica|switch|rosetta/.test(text) && hasOutcome) {
      return { level: "cautious", rationale: "lipid endpoint 또는 관찰/단기 연구를 outcome claim으로 확대할 위험.", rewrite: "LDL-C 변화, 목표 도달률, 연구 디자인을 함께 명시한다." };
    }
    if (/fixed-dose|고정용량|rosuvastatin.*ezetimibe|c10ba06/.test(text)) {
      return { level: "allowed", rationale: "성분, 제형, 분류처럼 확인 가능한 factual claim.", rewrite: "허가사항과 공식 분류 출처를 함께 둔다." };
    }
    return { level: "cautious", rationale: "문장에 근거, 대상, endpoint가 충분히 제한되어 있는지 확인 필요.", rewrite: "연구명, 대상, 비교군, endpoint를 붙여 다시 작성한다." };
  };

  const scoreEvidence = (study = {}) => {
    const design = normalize(study.design);
    const endpoint = normalize(`${study.endpoint} ${study.result}`);
    const directness = { direct: 25, strategy: 18, class: 12, context: 8 }[study.productRelevance] || 8;
    const designScore = design.includes("randomized") ? 25 : design.includes("prospective") ? 18 : 12;
    const outcomeScore = /death|mortality|event|mace|cardiovascular|cv/.test(endpoint) ? 25 : 12;
    const koreaScore = /korean|japanese|asia|한국|일본/.test(normalize(`${study.population} ${study.design}`)) ? 15 : 8;
    const limitationPenalty = /single-arm|open-label|observational|surrogate|post hoc/.test(normalize(study.limitations)) ? 10 : 0;
    const total = Math.max(0, Math.min(100, directness + designScore + outcomeScore + koreaScore - limitationPenalty));

    return {
      designScore,
      directness,
      koreaScore,
      outcomeScore,
      total
    };
  };

  return {
    competitorWarRoom,
    computeLdlStrategy,
    computeMarketSizing,
    currentTherapyOptions,
    evaluateClaim,
    guidelineDiffRows,
    marketSizingDefaults,
    monthlyBriefBlocks,
    publicationTracker,
    qualityStudyIds,
    scoreEvidence,
    segmentPlaybooks,
    trainingScenarios,
    treatmentOptions
  };
})();

globalThis.StrategyData = StrategyData;
