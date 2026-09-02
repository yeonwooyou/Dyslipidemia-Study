const DefinitionData = (() => {
  const definitionSections = [
    {
      id: "core-definition",
      title: "이상지질혈증의 정의",
      summary: "이상지질혈증은 LDL-C, non-HDL-C, TG가 높거나 HDL-C가 낮은 상태를 포괄한다. 임상에서는 단일 숫자보다 죽상경화성 심혈관질환 위험도와 함께 해석한다.",
      learn: [
        "고콜레스테롤혈증은 LDL-C 또는 total cholesterol 상승이 중심이다.",
        "고중성지방혈증은 TG 상승과 remnant cholesterol, 대사질환 맥락을 함께 본다.",
        "낮은 HDL-C는 위험 marker로 읽되, HDL-C를 올리는 것 자체가 outcome benefit이라는 식으로 말하지 않는다."
      ],
      pmUse: "첫 학습 질문은 '어떤 지질 이상인가'와 '위험도상 치료 목표가 어디인가'를 분리하는 것이다."
    },
    {
      id: "lipid-parameters",
      title: "지질 항목별 의미",
      summary: "LDL-C는 치료 목표의 중심이고, non-HDL-C와 ApoB는 atherogenic particle burden을 보조한다. TG는 pancreatitis risk와 ASCVD residual risk를 구분해 읽는다.",
      learn: [
        "LDL-C: 대부분 지침에서 1차 치료 목표로 사용한다.",
        "Non-HDL-C: TG가 높거나 mixed dyslipidemia일 때 잔여 위험을 설명한다.",
        "ApoB: 입자 수를 반영해 diabetes, metabolic syndrome, hypertriglyceridemia에서 유용하다.",
        "TG: 매우 높은 수치에서는 pancreatitis 예방, 중등도 상승에서는 residual risk 문맥으로 본다."
      ],
      pmUse: "로수젯 label의 LDL-C, ApoB, TG, non-HDL-C, HDL-C 항목을 endpoint별로 정확히 연결한다."
    },
    {
      id: "phenotypes",
      title: "표현형 분류",
      summary: "실무 표현형은 LDL-C 중심형, TG 중심형, mixed dyslipidemia, low HDL-C 동반형으로 나눠 학습한다. LDL-C, TG, HDL-C 조합이 진료과별 메시지를 바꾼다.",
      learn: [
        "LDL-C dominant: statin 기반 LDL-C lowering과 목표 도달이 중심이다.",
        "Mixed dyslipidemia: LDL-C 목표와 TG/non-HDL-C 잔여 위험을 함께 본다.",
        "TG dominant: 원인 평가, 생활습관, 당뇨/비만/음주/약물 영향을 먼저 확인한다.",
        "Low HDL-C 동반: risk marker로 쓰되 HDL-C 상승 claim을 과장하지 않는다."
      ],
      pmUse: "내분비내과와 1차의료에서는 mixed/TG 맥락, 심장내과와 신경과에서는 LDL-C target gap을 우선 배치한다."
    },
    {
      id: "primary-secondary",
      title: "원발성 vs 이차성",
      summary: "원발성 이상지질혈증은 유전·체질적 요인이 중심이고, 이차성은 당뇨병, 갑상샘저하증, 신질환, 간질환, 약물, 음주, 비만 같은 원인을 찾는다.",
      learn: [
        "LDL-C가 매우 높거나 가족력이 강하면 familial hypercholesterolemia 가능성을 확인한다.",
        "TG가 높으면 조절되지 않는 당뇨병, 음주, 비만, 약물 원인을 먼저 점검한다.",
        "이차성 원인을 교정해도 목표 미달이면 LDL-C 목표 기반 약물 전략으로 돌아온다."
      ],
      pmUse: "제품 메시지는 원인 평가를 건너뛰지 않는 균형 잡힌 질환 교육 위에 올린다."
    },
    {
      id: "risk-linked-treatment",
      title: "위험도와 치료 목표 연결",
      summary: "같은 LDL-C라도 ASCVD, 당뇨병, CKD, 고혈압, 흡연, 연령, 가족력에 따라 치료 강도가 달라진다. 지침 학습은 수치 기준보다 위험도-목표 연결을 먼저 익히는 편이 효율적이다.",
      learn: [
        "초고위험/고위험군은 낮은 LDL-C 목표와 강한 치료 강화 논리가 붙는다.",
        "중등도/저위험군은 절대위험, 생활습관, 장기 노출을 같이 본다.",
        "KSoLA와 ESC/EAS는 treat-to-target 언어가 강하고, ACC/AHA는 threshold와 goal language를 함께 읽는다."
      ],
      pmUse: "로수젯 후보군은 '진단명'이 아니라 '목표 미달 gap + 위험도 + 현재 치료' 조합으로 정의한다."
    }
  ];

  const pmLearningFrame = "정의 -> 분류 -> 위험도 -> LDL-C target gap -> 치료 전략 순서로 학습해야 제품 메시지가 흔들리지 않는다.";
  const getDefinitionSectionById = (id) => definitionSections.find((section) => section.id === id);

  return {
    definitionSections,
    getDefinitionSectionById,
    pmLearningFrame
  };
})();

globalThis.DefinitionData = DefinitionData;
