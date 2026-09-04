const StudyData = (() => {
  const externalEvidence = globalThis.StudyEvidence || {
    directStudyDeepDives: [],
    evidenceAtlas: [],
    evidenceCategories: [],
    getEvidenceByCategory: () => [],
    getEvidenceById: () => undefined
  };
  const statinEvidence = globalThis.StatinEvidence || {
    evidenceAtlas: [],
    evidenceCategories: []
  };

  const rosuzetProfile = {
    brand: "로수젯정",
    generic: "ezetimibe 10 mg + rosuvastatin calcium",
    whoAtc: "C10BA06",
    marketClass: "C10C",
    strengths: ["10/2.5 mg", "10/5 mg", "10/10 mg", "10/20 mg"],
    labelScope: [
      "원발성 고콜레스테롤혈증",
      "혼합형 이상지질혈증",
      "식이요법 보조로 total-C, LDL-C, ApoB, TG, non-HDL-C 감소와 HDL-C 증가"
    ],
    dosing: "식사와 관계없이 1일 1회. 시작 또는 증량 후 4주 이상 간격으로 지질 수치를 확인한다.",
    watchouts: [
      "활동성 간질환, 근질환, 중증 신부전, cyclosporine 병용, 임부·수유부 등은 허가사항 확인",
      "제품 메시지는 허가사항과 판촉 심의 기준 안에서만 구성",
      "RACING은 rosuvastatin 10 mg + ezetimibe 10 mg 전략 근거로 읽어야 함"
    ]
  };

  const riskTargets = [
    {
      id: "cad",
      label: "관상동맥질환 / very high",
      target: 55,
      context: "KSoLA 2022와 ESC/EAS, ACC/AHA 모두 secondary prevention 고위험군에서 강한 LDL-C lowering을 강조한다."
    },
    {
      id: "ascvd",
      label: "ASCVD high",
      target: 70,
      context: "stroke, TIA, PAD 등은 국내 지침에서 대체로 <70 mg/dL 축으로 학습한다. 일부 초고위험 상황은 더 낮게 본다."
    },
    {
      id: "diabetes-high",
      label: "당뇨병 고위험",
      target: 70,
      context: "유병기간, 표적장기손상, 주요 위험인자 수에 따라 <70 또는 <55 mg/dL까지 세분화한다."
    },
    {
      id: "moderate",
      label: "중등도 위험",
      target: 100,
      context: "주요 위험인자와 한국인 위험도 평가를 함께 본다."
    },
    {
      id: "low",
      label: "저위험",
      target: 130,
      context: "생활습관, baseline LDL-C, 장기 위험 노출을 함께 확인한다."
    }
  ];

  const guidelineSummaries = [
    {
      id: "ksola-2022",
      society: "KSoLA",
      edition: "2022 제5판, 2023-05-22 수정본",
      currentStatus: "2026-08-31 기준 공개 최신판. 학회 공지는 2026년 9월 이후 2026년판 발간 준비 예정이라고 안내한다.",
      sourceUrl: "https://new.lipid.or.kr/reference/guideline.php?boardid=guideline&category=&idx=1281&mode=view",
      frame: "한국 환자와 국내 진료환경에 맞춘 treat-to-target 구조",
      anchors: [
        "관상동맥질환 LDL-C 목표를 <55 mg/dL와 기저치 대비 50% 이상 감소로 강화",
        "당뇨병은 유병기간, 표적장기손상, 주요 위험인자에 따라 목표를 세분화",
        "뇌졸중, 말초혈관질환, 경동맥질환, 복부 대동맥류는 고위험군 축으로 학습",
        "ezetimibe와 PCSK9 inhibitor의 권고 수준이 이전판 대비 중요해짐"
      ],
      pmImplication: "로수젯은 낮아진 LDL-C 목표와 실제 목표 도달률의 간극을 설명하는 제품축이다.",
      targets: [
        ["관상동맥질환", "<55 mg/dL + 50% 이상 감소"],
        ["뇌졸중/TIA/PAD 등 고위험", "<70 mg/dL"],
        ["당뇨병 + CVD", "<55 mg/dL + 50% 이상 감소"],
        ["당뇨병 고위험", "<70 mg/dL, 일부는 <55 mg/dL 선택 고려"],
        ["중등도/저위험", "위험인자 수와 LDL-C 수치에 따라 <100 또는 <130 mg/dL 축"]
      ]
    },
    {
      id: "esc-2025",
      society: "ESC/EAS",
      edition: "2025 Focused Update",
      currentStatus: "2019 ESC/EAS dyslipidaemia guideline의 focused update. 2025-03-31까지의 새 근거를 반영한다.",
      sourceUrl: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/",
      frame: "risk category별 LDL-C target 유지 + SCORE2/SCORE2-OP, Lp(a), CAC, ACS 입원 중 조기 강화",
      anchors: [
        "2019 guideline의 LDL-C target과 risk category를 유지",
        "SCORE2와 SCORE2-OP를 primary prevention risk estimation에 반영",
        "Lp(a), CAC, subclinical atherosclerosis를 risk modifier로 사용",
        "ACS index hospitalisation에서 lipid-lowering intensification을 더 적극적으로 다룸",
        "bempedoic acid와 statin intolerance 관련 권고가 추가됨"
      ],
      pmImplication: "ESC 업데이트는 조기 강화와 병용요법의 근거 흐름을 읽는 데 유용하다.",
      targets: [
        ["Very high risk", "<55 mg/dL + 50% 이상 감소"],
        ["High risk", "<70 mg/dL + 50% 이상 감소"],
        ["Moderate risk", "<100 mg/dL"],
        ["Low risk", "<116 mg/dL"]
      ]
    },
    {
      id: "acc-aha-2026",
      society: "ACC/AHA",
      edition: "2026 Guideline",
      currentStatus: "2026-03-13 공개. 2018 blood cholesterol guideline을 대체하고 dyslipidemia guideline으로 범위를 확장했다.",
      sourceUrl: "https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia",
      frame: "LDL-C와 non-HDL-C 목표의 복귀, PREVENT-ASCVD, ApoB/Lp(a), CAC, newer LLT 반영",
      anchors: [
        "primary prevention에서 PREVENT-ASCVD equations를 사용",
        "Lp(a)는 적어도 한 번 측정하는 방향으로 제시",
        "ASCVD very high risk 목표를 LDL-C <55 mg/dL와 non-HDL-C <85 mg/dL로 제시",
        "not very high risk ASCVD는 LDL-C <70 mg/dL 축",
        "ezetimibe, PCSK9 mAb, bempedoic acid, inclisiran을 degree of LDL-C lowering과 환자 선호에 맞춰 선택"
      ],
      pmImplication: "로수젯 메시지를 LDL-C뿐 아니라 non-HDL-C, ApoB, TG까지 넓혀 학습할 근거가 강화됐다.",
      targets: [
        ["ASCVD very high risk", "LDL-C <55 mg/dL, non-HDL-C <85 mg/dL"],
        ["ASCVD not very high risk", "LDL-C <70 mg/dL, non-HDL-C <100 mg/dL"],
        ["Primary prevention high risk", "LDL-C <70 mg/dL, non-HDL-C <100 mg/dL"],
        ["Severe hypercholesterolemia", "위험도에 따라 <100, <70, <55 mg/dL"]
      ]
    },
    {
      id: "ada-2026",
      society: "ADA",
      edition: "Standards of Care in Diabetes 2026",
      currentStatus: "당뇨병 동반 환자 lipid management 보조 지침으로 사용한다.",
      sourceUrl: "https://diabetesjournals.org/care/article/49/Supplement_1/S216/163933/10-Cardiovascular-Disease-and-Risk-Management",
      frame: "diabetes에서 ASCVD risk, TG, combination therapy의 경계가 중요",
      anchors: [
        "당뇨병 환자의 lipid-lowering은 ASCVD risk와 치료목표 기반으로 접근",
        "statin + fibrate 또는 niacin 조합은 CV risk reduction 목적으로 일반 권장되지 않음",
        "TG가 높은 환자는 pancreatitis risk와 ASCVD risk를 분리해 읽음"
      ],
      pmImplication: "당뇨병 세그먼트에서 LDL-C, non-HDL-C, ApoB, TG 메시지를 구분하는 훈련에 좋다.",
      targets: [
        ["Diabetes + ASCVD", "매우 적극적 LDL-C lowering"],
        ["Diabetes + multiple risk factors", "risk-based target"],
        ["Persistent TG elevation", "LDL-C 기반 치료 후 TG 전략 분리"]
      ]
    }
  ];

  const atcFrameworks = [
    {
      id: "who-atc",
      title: "WHO ATC/DDD",
      rosuzetCode: "C10BA06",
      useCase: "논문, 약물역학, 국제 사용량, DDD 기준",
      nodes: [
        ["C10", "Lipid modifying agents"],
        ["C10A", "Lipid modifying agents, plain"],
        ["C10AA", "HMG CoA reductase inhibitors"],
        ["C10AX", "Other lipid modifying agents"],
        ["C10B", "Lipid modifying agents, combinations"],
        ["C10BA", "Combinations of various lipid modifying agents"],
        ["C10BA06", "rosuvastatin and ezetimibe"]
      ],
      caution: "WHO ATC에는 C10C가 없다."
    },
    {
      id: "ephmra",
      title: "EPHMRA/Intellus",
      rosuzetCode: "C10C",
      useCase: "제약시장 basket, 처방시장, competitor set",
      nodes: [
        ["C10", "Lipid-regulating/anti-atheroma products"],
        ["C10A", "Lipid-regulating products"],
        ["C10A1", "Statins"],
        ["C10A9", "Lipid-regulating products, other"],
        ["C10C", "Lipid regulators in combination with other lipid regulators"],
        ["C11A", "Lipid-regulating cardiovascular multitherapy combinations"]
      ],
      caution: "C10C는 시장분류다. WHO ATC 코드처럼 사용하면 안 된다."
    }
  ];

  const evidenceCards = [
    {
      id: "mrs-roze",
      title: "MRS-ROZE",
      type: "8주 lipid efficacy",
      population: "국내 원발성 고콜레스테롤혈증 환자",
      comparator: "동일 용량 rosuvastatin 단독",
      result: "ezetimibe 10 mg + rosuvastatin 5/10/20 mg 조합이 LDL-C, total-C, TG 개선에서 우수했다.",
      pmUse: "로수젯 lipid efficacy의 foundational story",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/27506635/"
    },
    {
      id: "low-dose",
      title: "R2.5 + E10",
      type: "저용량 3상",
      population: "한국 15개 기관, 279명",
      comparator: "E10, R2.5, R5 단독",
      result: "로수젯 10/2.5 mg은 기저치 대비 약 46% LDL-C 감소로 보고됐다.",
      pmUse: "초기 병용과 lower statin exposure 전략",
      sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0149291821002617"
    },
    {
      id: "racing",
      title: "RACING",
      type: "3년 outcome strategy",
      population: "한국 ASCVD 환자 3,780명",
      comparator: "rosuvastatin 20 mg 단독",
      result: "rosuvastatin 10 mg + ezetimibe 10 mg은 3년 composite outcome에서 비열등했고 LDL-C <70 mg/dL 도달률이 높았다.",
      pmUse: "secondary prevention에서 10/10 mg 전략의 핵심 근거",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/35863366/"
    },
    {
      id: "eroica",
      title: "EROICA",
      type: "T2DM switch-in direct evidence",
      population: "T2DM + 이상지질혈증, statin 단독에도 LDL-C >=70 mg/dL",
      comparator: "parallel control 없음",
      result: "로수젯 10/2.5 mg 12주 전환 후 FAS 586명 중 62.3%가 LDL-C <70 mg/dL에 도달했다. HbA1c는 0.15%p, 공복혈당은 3.6 mg/dL 증가했다.",
      pmUse: "당뇨병 환자에서 10/2.5 mg switch story의 핵심 직접 근거. 단기 혈당 변화와 outcome 부재를 함께 설명한다.",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/41190361/"
    },
    {
      id: "improve-it",
      title: "IMPROVE-IT",
      type: "ezetimibe class outcome",
      population: "ACS 이후 환자",
      comparator: "simvastatin 단독",
      result: "statin에 ezetimibe를 추가해 LDL-C를 더 낮추고 cardiovascular outcome 개선을 보였다.",
      pmUse: "ezetimibe 추가의 class-level outcome 신뢰도",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/26039521/"
    }
  ];

  const learningModules = [
    ["1주차", "질환과 LDL-C 목표", "KSoLA/ESC/ACC의 risk category와 LDL-C target을 비교한다."],
    ["2주차", "로수젯 label", "성분, 용량, 금기, 주의, 허가상 표현 가능 범위를 정리한다."],
    ["3주차", "근거 읽기", "MRS-ROZE, R2.5+E10, EROICA, SWITCH, RACING을 PICO 형식으로 요약한다."],
    ["4주차", "ATC와 시장", "WHO C10BA06과 EPHMRA C10C를 분리하고 경쟁 basket을 만든다."],
    ["5주차", "PM 실행", "segment message, objection handling, KPI dashboard를 구성한다."]
  ];

  const quizQuestions = [
    {
      question: "로수젯의 WHO ATC code와 EPHMRA 시장분류는 각각 무엇인가?",
      answer: "WHO ATC는 C10BA06, EPHMRA/Intellus 시장분류는 C10C다."
    },
    {
      question: "C10C를 WHO ATC라고 부르면 왜 문제가 되는가?",
      answer: "WHO ATC의 C10 하위에는 C10A와 C10B가 있고 C10C는 없다. C10C는 EPHMRA/Intellus 시장분류다."
    },
    {
      question: "KSoLA 2022에서 로수젯 story와 가장 직접적으로 연결되는 변화는 무엇인가?",
      answer: "관상동맥질환 LDL-C 목표가 <55 mg/dL와 50% 이상 감소로 강화되어 목표 도달 간극이 커진 점이다."
    },
    {
      question: "ESC/EAS 2025 Focused Update의 PM 학습 포인트는 무엇인가?",
      answer: "LDL-C target은 유지하면서 SCORE2/SCORE2-OP, Lp(a), CAC, ACS 입원 중 조기 강화, bempedoic acid를 반영한 점이다."
    },
    {
      question: "ACC/AHA 2026 guideline에서 로수젯 메시지에 영향을 주는 변화는 무엇인가?",
      answer: "LDL-C와 non-HDL-C 목표가 다시 명확히 제시되고, ApoB/Lp(a), CAC, newer LLT가 치료 intensification 판단에 포함된 점이다."
    },
    {
      question: "RACING은 브랜드 근거인가, 치료 전략 근거인가?",
      answer: "rosuvastatin 10 mg + ezetimibe 10 mg 병용 전략 근거로 읽는 것이 정확하다."
    },
    {
      question: "로수젯 10/2.5 mg의 PM 포지셔닝은 무엇인가?",
      answer: "단순히 약한 용량이 아니라 초기 병용과 lower statin exposure로 LDL-C 목표 도달을 노리는 옵션이다. T2DM switch-in에서는 EROICA를 함께 본다."
    },
    {
      question: "EROICA를 로수젯 PM 메시지에 쓸 때 가장 중요한 가드레일은 무엇인가?",
      answer: "로수젯 10/2.5 mg 직접 근거라는 장점은 크지만, single-arm open-label 12주 lipid endpoint 연구이므로 장기 cardiovascular outcome claim으로 확대하면 안 된다."
    },
    {
      question: "동일성분 경쟁품과 넓은 LDL-C lowering 경쟁군을 어떻게 나누는가?",
      answer: "좁게는 rosuvastatin+ezetimibe fixed-dose combination, 넓게는 statin+ezetimibe, PCSK9, bempedoic acid, inclisiran까지 본다."
    }
  ];

  const patientArchetypes = [
    {
      id: "cad-post-pci",
      label: "CAD post-PCI",
      target: 55,
      guidelineFrame: "KSoLA/ESC/ACC 모두 secondary prevention very-high-risk 축으로 학습",
      segment: "cardiology",
      context: "반복 사건 위험, LDL-C goal attainment, RACING strategy를 함께 본다."
    },
    {
      id: "stroke-history",
      label: "Stroke/TIA history",
      target: 70,
      guidelineFrame: "KSoLA 고위험군 축. 일부 초고위험 상황은 더 낮은 목표 논의",
      segment: "neurology",
      context: "재발 예방과 statin tolerability discussion을 균형 있게 본다."
    },
    {
      id: "diabetes-organ-damage",
      label: "T2DM + organ damage",
      target: 55,
      guidelineFrame: "KSoLA 당뇨병 세분화, ACC/AHA non-HDL-C/ApoB 흐름과 연결",
      segment: "endocrinology",
      context: "LDL-C, non-HDL-C, ApoB, TG를 함께 설명할 수 있어야 한다."
    },
    {
      id: "ckd-high",
      label: "CKD high risk",
      target: 70,
      guidelineFrame: "고위험군 접근. 신기능과 허가사항상 용량 주의 확인",
      segment: "nephrology",
      context: "SHARP 등 statin/ezetimibe class evidence와 안전성 확인이 중요하다."
    },
    {
      id: "primary-low",
      label: "Primary prevention low risk",
      target: 130,
      guidelineFrame: "KSoLA 저위험/중등도 위험. 생활습관과 장기 위험 노출 확인",
      segment: "primary care",
      context: "과치료 메시지보다 위험도 평가와 추적 관찰을 먼저 학습한다."
    }
  ];

  const currentTherapies = [
    { id: "naive", label: "치료 전", implication: "생활습관, baseline LDL-C, risk category를 먼저 맞춘다." },
    { id: "low-statin", label: "저강도 statin", implication: "목표 간극이 크면 단순 유지보다 intensification 질문이 생긴다." },
    { id: "moderate-statin", label: "중강도 statin", implication: "statin 증량과 ezetimibe 추가의 trade-off를 설명한다." },
    { id: "high-statin", label: "고강도 statin", implication: "목표 미달이면 nonstatin 추가와 injectable option을 같이 본다." },
    { id: "combo", label: "statin + ezetimibe", implication: "adherence, dose mix, 다음 단계 PCSK9/bempedoic acid를 검토한다." }
  ];

  const guidelineTargetMatrix = [
    {
      risk: "ASCVD very high / CAD",
      ksola: "<55 mg/dL + 50% 이상 감소",
      esc: "<55 mg/dL + 50% 이상 감소",
      acc: "<55 mg/dL, non-HDL-C <85 mg/dL",
      pmAngle: "RACING, 조기 병용, goal attainment"
    },
    {
      risk: "ASCVD high",
      ksola: "<70 mg/dL",
      esc: "<70 mg/dL + 50% 이상 감소",
      acc: "<70 mg/dL, non-HDL-C <100 mg/dL",
      pmAngle: "statin 단독 목표 미달 환자의 intensification"
    },
    {
      risk: "T2DM + CVD/organ damage",
      ksola: "<55 또는 <70 mg/dL 축",
      esc: "위험도에 따라 <55 또는 <70 mg/dL",
      acc: "ASCVD 동반 여부와 risk enhancer 기반",
      pmAngle: "LDL-C + non-HDL-C + ApoB story"
    },
    {
      risk: "Primary prevention high",
      ksola: "위험도별 <70 또는 <100 mg/dL",
      esc: "<70 mg/dL + 50% 이상 감소",
      acc: "<70 mg/dL, non-HDL-C <100 mg/dL",
      pmAngle: "초기 병용 후보와 lifestyle 우선순위 구분"
    },
    {
      risk: "Moderate / low risk",
      ksola: "<100 또는 <130 mg/dL 축",
      esc: "<100 또는 <116 mg/dL",
      acc: "PREVENT-ASCVD 기반 shared decision",
      pmAngle: "10/2.5 mg positioning과 과잉 claim 방지"
    }
  ];

  const dosePositioning = [
    {
      strength: "10/2.5 mg",
      segment: "초치료, 저·중등도 위험, lower statin exposure 선호",
      ldlGap: "약 30-45% 감소 필요 상황에서 학습",
      anchor: "Low-dose R2.5+E10 3상, EROICA T2DM switch",
      message: "약한 용량이 아니라 초기 병용 전략의 입구로 설명",
      caution: "outcome trial 근거처럼 확대하지 않음"
    },
    {
      strength: "10/5 mg",
      segment: "당뇨병, mixed dyslipidemia, statin 단독 부족",
      ldlGap: "중등도 이상의 target gap",
      anchor: "MRS-ROZE, 당뇨병 세그먼트 real-world 후보",
      message: "LDL-C와 broader lipid profile을 함께 학습",
      caution: "TG 중심 환자는 fibrate/omega-3 전략과 구분"
    },
    {
      strength: "10/10 mg",
      segment: "ASCVD, CAD, post-PCI, secondary prevention",
      ldlGap: "큰 LDL-C gap 또는 <55/<70 목표 압박",
      anchor: "RACING",
      message: "고강도 statin 단독 증량과 다른 기전 추가 전략 비교",
      caution: "RACING은 rosuvastatin/ezetimibe strategy 근거"
    },
    {
      strength: "10/20 mg",
      segment: "더 강한 LDL-C lowering이 필요한 환자",
      ldlGap: "매우 큰 gap, 목표 미달 지속",
      anchor: "MRS-ROZE 고용량 arm",
      message: "라인업 완결성과 강도 조절 옵션",
      caution: "고용량 statin 주의사항과 금기 확인"
    }
  ];

  const competitorGroups = [
    {
      group: "동일성분 FDC",
      examples: ["로수바미브", "로바젯", "크레젯", "다비듀오", "에제로수"],
      atcLens: "WHO C10BA06, EPHMRA C10C",
      threat: "가격, 공급, 대조약/생동, 영업 커버리지",
      response: "근거, 용량 라인업, field execution, 브랜드 신뢰도"
    },
    {
      group: "다른 statin + ezetimibe",
      examples: ["atorvastatin+ezetimibe", "pitavastatin+ezetimibe", "simvastatin+ezetimibe"],
      atcLens: "WHO C10BA05/C10BA13/C10BA02",
      threat: "기존 statin loyalty와 physician habit",
      response: "rosuvastatin potency, RACING, 한국인 근거"
    },
    {
      group: "Injectable / advanced nonstatin",
      examples: ["evolocumab", "alirocumab", "inclisiran"],
      atcLens: "WHO C10AX",
      threat: "very-high-risk goal failure에서 강한 LDL-C lowering",
      response: "oral FDC 접근성, 단계적 intensification, adherence"
    },
    {
      group: "Emerging oral nonstatin",
      examples: ["bempedoic acid", "bempedoic acid+ezetimibe"],
      atcLens: "WHO C10AX15, C10BA10",
      threat: "statin intolerance 담론",
      response: "국내 허가·급여·근거·대상 환자 차이를 분리"
    },
    {
      group: "TG / mixed dyslipidemia",
      examples: ["fenofibrate", "omega-3", "statin+fibrate"],
      atcLens: "WHO C10AB/C10BA09/C10BA15",
      threat: "TG 중심 환자에서 메시지 overlap",
      response: "LDL-C target과 TG/pancreatitis risk를 분리해 설명"
    }
  ];

  const picoCards = [
    {
      title: "RACING",
      population: "ASCVD 환자 3,780명",
      intervention: "rosuvastatin 10 mg + ezetimibe 10 mg",
      comparator: "rosuvastatin 20 mg",
      outcome: "3년 composite cardiovascular outcome 비열등, LDL-C <70 mg/dL 도달률 우수",
      limitation: "open-label, 한국 환자, 전략 근거",
      pmMessage: "10/10 mg secondary prevention story의 핵심"
    },
    {
      title: "MRS-ROZE",
      population: "원발성 고콜레스테롤혈증 국내 환자",
      intervention: "ezetimibe 10 mg + rosuvastatin 5/10/20 mg",
      comparator: "동일 용량 rosuvastatin 단독",
      outcome: "LDL-C, total-C, TG 개선",
      limitation: "8주 surrogate endpoint",
      pmMessage: "로수젯 lipid efficacy foundational evidence"
    },
    {
      title: "Low-dose R2.5+E10",
      population: "한국 15개 기관 279명",
      intervention: "rosuvastatin 2.5 mg + ezetimibe 10 mg",
      comparator: "E10, R2.5, R5 단독",
      outcome: "LDL-C 약 46% 감소 보고",
      limitation: "outcome trial 아님",
      pmMessage: "10/2.5 mg 초기 병용 포지셔닝"
    },
    {
      title: "EROICA",
      population: "T2DM + 이상지질혈증, statin 단독에도 LDL-C >=70 mg/dL",
      intervention: "로수젯 10/2.5 mg 12주 전환",
      comparator: "parallel control 없음",
      outcome: "LDL-C <70 mg/dL 달성률 62.3%, LDL-C 26.0% 감소, adherence 97.5%",
      limitation: "single-arm, open-label, 12주 lipid endpoint",
      pmMessage: "T2DM switch-in에서 10/2.5 mg 직접 근거"
    },
    {
      title: "SWITCH",
      population: "statin 단독에도 LDL-C >=70 mg/dL인 stroke 환자",
      intervention: "rosuvastatin+ezetimibe 5/10, 10/10, 20/10 mg 전환",
      comparator: "전환 전 statin monotherapy baseline",
      outcome: "follow-up 994명 중 6개월 LDL-C <70 mg/dL 달성률 71.2%",
      limitation: "관찰연구, target stringency별 세부 해석 필요",
      pmMessage: "neurology/stroke switch-in story"
    },
    {
      title: "IMPROVE-IT",
      population: "ACS 이후 환자",
      intervention: "simvastatin + ezetimibe",
      comparator: "simvastatin 단독",
      outcome: "LDL-C 추가 감소와 cardiovascular outcome 개선",
      limitation: "rosuvastatin/ezetimibe 직접 근거는 아님",
      pmMessage: "ezetimibe 추가의 class-level outcome 근거"
    }
  ];

  const claimGuardrails = {
    allowed: [
      "로수젯은 rosuvastatin과 ezetimibe의 fixed-dose combination이다.",
      "WHO ATC 기준 로수젯 성분 조합은 C10BA06이다.",
      "EPHMRA/Intellus 시장분류에서 statin+ezetimibe 조합은 C10C basket으로 볼 수 있다.",
      "RACING은 rosuvastatin 10 mg + ezetimibe 10 mg 전략이 rosuvastatin 20 mg 대비 ASCVD 환자에서 비열등함을 보인 연구다.",
      "KSoLA 2022는 관상동맥질환 LDL-C 목표를 <55 mg/dL와 50% 이상 감소로 강화했다."
    ],
    cautious: [
      "로수젯 브랜드 자체 outcome claim은 연구 디자인과 제품 사용 여부를 확인해 표현한다.",
      "저용량 10/2.5 mg은 lipid endpoint 근거와 outcome 근거를 구분한다.",
      "PCSK9, inclisiran, bempedoic acid와의 비교는 직접 head-to-head가 아니라 치료 단계와 접근성 관점으로 설명한다.",
      "당뇨병/TG 메시지는 LDL-C 중심 치료목표와 TG 중심 치료목표를 섞지 않는다."
    ],
    avoid: [
      "부작용이 없다.",
      "모든 환자에서 고강도 statin보다 우월하다.",
      "RACING 결과를 모든 1차 예방 환자에게 적용할 수 있다.",
      "C10C는 WHO ATC 코드다.",
      "동일성분 경쟁품보다 임상적으로 우월하다."
    ]
  };

  const objectionBank = [
    {
      objection: "고강도 statin 쓰면 되지 않나요?",
      response: "LDL-C 목표 도달과 내약성, 다른 기전 추가의 장단점을 비교하는 질문으로 전환한다.",
      evidence: "RACING",
      guardrail: "무조건 우월 claim 금지"
    },
    {
      objection: "ezetimibe 추가가 outcome 근거가 있나요?",
      response: "IMPROVE-IT는 class-level outcome 근거, RACING은 rosuvastatin/ezetimibe 전략 근거로 구분한다.",
      evidence: "IMPROVE-IT, RACING",
      guardrail: "브랜드 직접 근거와 class 근거 분리"
    },
    {
      objection: "10/2.5 mg은 너무 약하지 않나요?",
      response: "statin 용량만 보지 말고 dual inhibition과 LDL-C target gap 관점으로 본다.",
      evidence: "Low-dose R2.5+E10",
      guardrail: "outcome 근거처럼 확대하지 않음"
    },
    {
      objection: "동일성분 제네릭과 무엇이 다른가요?",
      response: "동일성분이면 임상적 우월 claim보다 근거 축, 용량 라인업, 공급, 교육자료, field support로 구분한다.",
      evidence: "허가사항, 제품정보",
      guardrail: "근거 없는 superiority 금지"
    },
    {
      objection: "당뇨병 환자에서는 TG가 더 중요한 것 아닌가요?",
      response: "LDL-C 목표를 먼저 놓고 non-HDL-C, ApoB, TG를 보조축으로 정리한다.",
      evidence: "KSoLA, ACC/AHA, ADA",
      guardrail: "TG와 LDL-C 목표 혼합 금지"
    },
    {
      objection: "주사제가 더 강력하지 않나요?",
      response: "강한 LDL-C lowering은 인정하되 환자군, 급여, 단계, oral adherence, 치료 접근성을 나눠 본다.",
      evidence: "ESC/EAS, ACC/AHA",
      guardrail: "직접 비교 없는 우월/열등 단정 금지"
    }
  ];

  const updateTracker = [
    {
      topic: "KSoLA 2026년판",
      current: "2026-08-31 기준 2022 제5판 수정본이 공개 최신판",
      watch: "2026년 9월 이후 발간 공지",
      action: "LDL-C target, nonstatin 권고, ApoB/Lp(a), TG 파트 비교",
      priority: "High"
    },
    {
      topic: "ACC/AHA 2026",
      current: "LDL-C와 non-HDL-C 목표 복귀, PREVENT-ASCVD, Lp(a) 반영",
      watch: "국내 발표자료가 2026 guideline을 어떻게 인용하는지 확인",
      action: "field message의 non-HDL-C/ApoB 문장 업데이트",
      priority: "High"
    },
    {
      topic: "ESC/EAS 2025",
      current: "focused update로 ACS 조기 강화, Lp(a), bempedoic acid 반영",
      watch: "KSoLA 2026 반영 여부",
      action: "global slide backup에 추가",
      priority: "Medium"
    },
    {
      topic: "신규 nonstatin",
      current: "bempedoic acid, inclisiran 등 옵션 확대",
      watch: "국내 허가·급여·launch timing",
      action: "C10AX/C10BA future threat map 작성",
      priority: "Medium"
    },
    {
      topic: "동일성분 경쟁",
      current: "동일성분 FDC 다수 존재",
      watch: "ODT, 약가, 공급, 생동, 대조약 변화",
      action: "월별 competitor table 업데이트",
      priority: "High"
    },
    {
      topic: "Real-world evidence",
      current: "EROICA와 SWITCH는 PubMed publication 확인, EASY-ROSUZET과 REMBRANDT는 등록/발표 근거 추적 필요",
      watch: "peer-reviewed full publication 여부",
      action: "출처 등급을 C에서 B/A로 승격 가능한지 검토",
      priority: "Medium"
    }
  ];

  const sourceLinks = [
    ["KSoLA 2022 제5판", "https://new.lipid.or.kr/reference/guideline.php?boardid=guideline&category=&idx=1281&mode=view"],
    ["ESC/EAS 2025 Focused Update", "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/"],
    ["AHA Professional Heart Daily 2026", "https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia"],
    ["ACC Guidelines Library", "https://www.acc.org/Guidelines"],
    ["WHO ATC C10BA06", "https://atcddd.fhi.no/atc_ddd_index/?code=C10BA06"],
    ["EPHMRA Anatomical Classification", "https://www.ephmra.org/anatomical-classification"],
    ["한미약품 로수젯 제품정보", "https://www.hanmi.co.kr/business/product/finder/detail-741.hm?prodSeq=741"],
    ["EROICA PubMed", "https://pubmed.ncbi.nlm.nih.gov/41190361/"],
    ["SWITCH PubMed", "https://pubmed.ncbi.nlm.nih.gov/41225467/"],
    ["ROSETTA-Stroke PMC", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10250871/"],
    ["RACING PubMed", "https://pubmed.ncbi.nlm.nih.gov/35863366/"],
    ["IMPROVE-IT PubMed", "https://pubmed.ncbi.nlm.nih.gov/26039521/"],
    ["4S PubMed", "https://pubmed.ncbi.nlm.nih.gov/7968073/"],
    ["WOSCOPS PubMed", "https://pubmed.ncbi.nlm.nih.gov/7566020/"],
    ["CTT Intensive Statin PubMed", "https://pubmed.ncbi.nlm.nih.gov/21067804/"],
    ["Statin Diabetes Meta-analysis PubMed", "https://pubmed.ncbi.nlm.nih.gov/20167359/"],
    ["Korea Dyslipidemia Fact Sheet 2024", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12488789/"]
  ];

  const evidenceAtlas = [
    ...externalEvidence.evidenceAtlas,
    ...statinEvidence.evidenceAtlas
  ];
  const evidenceCategories = [
    ...externalEvidence.evidenceCategories,
    ...statinEvidence.evidenceCategories
  ].reduce((categories, category) => {
    if (categories.some((item) => item.id === category.id)) {
      return categories;
    }
    return [...categories, category];
  }, []);

  const getEvidenceById = (id) => evidenceAtlas.find((study) => study.id === id);

  const getEvidenceByCategory = (category) => {
    if (category === "all") {
      return evidenceAtlas;
    }
    return evidenceAtlas.filter((study) => study.category === category);
  };

  const getGuidelineById = (id) => guidelineSummaries.find((item) => item.id === id);

  const computeLdlGap = (baseline, target) => {
    const baselineValue = Number(baseline);
    const targetValue = Number(target);

    if (!Number.isFinite(baselineValue) || !Number.isFinite(targetValue) || baselineValue <= 0 || targetValue <= 0) {
      return { absoluteGap: 0, reductionPercent: 0, pressure: "invalid" };
    }

    const absoluteGap = Math.max(0, Math.round(baselineValue - targetValue));
    const reductionPercent = Number(((absoluteGap / baselineValue) * 100).toFixed(1));
    const pressure = reductionPercent >= 50 ? "very-high" : reductionPercent >= 30 ? "high" : absoluteGap > 0 ? "low" : "at-target";

    return { absoluteGap, reductionPercent, pressure };
  };

  const determineDoseFocus = (archetype, therapy, gap) => {
    if (gap.pressure === "at-target") {
      return "생활습관, adherence, follow-up interval을 먼저 확인";
    }
    if (archetype.id === "cad-post-pci" || gap.pressure === "very-high") {
      return "10/10 mg 중심으로 RACING과 KSoLA <55 mg/dL 목표를 연결";
    }
    if (therapy.id === "high-statin") {
      return "10/20 mg 또는 다음 단계 nonstatin/PCSK9 접근을 구분";
    }
    if (archetype.id === "primary-low") {
      return "10/2.5 mg 후보성은 LDL-C gap과 risk discussion 이후 제한적으로 검토";
    }
    return "10/5 mg 또는 10/10 mg으로 statin 증량 대비 ezetimibe 추가 전략을 비교";
  };

  const buildCaseSummary = ({ archetypeId, baselineLdl, currentTherapyId }) => {
    const archetype = patientArchetypes.find((item) => item.id === archetypeId) || patientArchetypes[0];
    const therapy = currentTherapies.find((item) => item.id === currentTherapyId) || currentTherapies[0];
    const gap = computeLdlGap(baselineLdl, archetype.target);

    return {
      archetypeLabel: archetype.label,
      target: archetype.target,
      gap,
      guidelineFrame: archetype.guidelineFrame,
      therapyFrame: therapy.implication,
      suggestedDoseFocus: determineDoseFocus(archetype, therapy, gap),
      fieldContext: archetype.context
    };
  };

  return {
    atcFrameworks,
    buildCaseSummary,
    claimGuardrails,
    competitorGroups,
    computeLdlGap,
    currentTherapies,
    directStudyDeepDives: externalEvidence.directStudyDeepDives,
    evidenceCards,
    evidenceAtlas,
    evidenceCategories,
    getEvidenceByCategory,
    getEvidenceById,
    getGuidelineById,
    guidelineTargetMatrix,
    guidelineSummaries,
    learningModules,
    objectionBank,
    patientArchetypes,
    picoCards,
    quizQuestions,
    riskTargets,
    rosuzetProfile,
    sourceLinks,
    dosePositioning,
    updateTracker
  };
})();

globalThis.StudyData = StudyData;
