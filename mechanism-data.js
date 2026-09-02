const MechanismData = (() => {
  const statinMechanismSteps = [
    {
      id: "hmg-coa-reductase",
      title: "1. HMG-CoA reductase 억제",
      summary: "Statin은 간세포의 cholesterol synthesis rate-limiting enzyme인 HMG-CoA reductase를 억제한다.",
      learn: "효과의 시작점은 혈중 LDL-C를 직접 녹이는 것이 아니라 간 내 cholesterol synthesis를 줄이는 것이다.",
      pmUse: "기전 설명은 '합성 억제'에서 시작하고, LDL receptor 증가로 연결해야 정확하다."
    },
    {
      id: "hepatic-cholesterol-pool",
      title: "2. 간 내 cholesterol pool 감소",
      summary: "간세포 내 cholesterol pool이 줄어들면 세포는 혈중 LDL particle을 더 많이 회수하는 방향으로 보상한다.",
      learn: "이 단계가 있어야 statin의 혈중 LDL-C 감소가 설명된다.",
      pmUse: "환자 교육에서는 '간이 혈액 속 LDL을 더 잘 걷어간다'는 구조로 단순화할 수 있다."
    },
    {
      id: "ldl-receptor-upregulation",
      title: "3. LDL receptor 발현 증가",
      summary: "SREBP pathway가 활성화되면서 hepatocyte surface의 LDL receptor 발현이 증가한다.",
      learn: "LDL receptor가 늘수록 circulating LDL particle clearance가 증가한다.",
      pmUse: "LDL receptor biology는 statin potency와 치료 반응 차이를 설명하는 핵심 축이다."
    },
    {
      id: "plasma-ldl-clearance",
      title: "4. 혈중 LDL-C clearance 증가",
      summary: "간에서 LDL particle uptake가 증가하며 plasma LDL-C가 낮아진다. 이 변화가 ASCVD risk reduction 근거와 연결된다.",
      learn: "LDL-C 감소는 surrogate endpoint지만, statin outcome trial과 CTT meta-analysis가 임상 사건 감소 근거를 제공한다.",
      pmUse: "LDL-C 수치 변화와 outcome evidence를 같은 층위로 섞지 않고 순서대로 설명한다."
    },
    {
      id: "rule-of-six",
      title: "5. Statin 증량의 rule of six",
      summary: "Statin 용량을 두 배로 올릴 때 LDL-C 추가 감소는 대략 6%p 수준으로 설명되는 경우가 많다.",
      learn: "증량만으로 target gap을 메우기 어려운 상황에서 다른 기전 추가를 검토한다.",
      pmUse: "고강도 statin 단독 질문에는 목표 gap, 내약성, 추가 기전을 함께 제시한다."
    },
    {
      id: "ezetimibe-complement",
      title: "6. Ezetimibe 보완 기전",
      summary: "Ezetimibe는 장관 NPC1L1 경로의 cholesterol absorption을 억제해 statin의 간 합성 억제와 다른 축을 막는다.",
      learn: "합성 억제와 흡수 억제를 결합하면 LDL-C lowering을 기전적으로 보완할 수 있다.",
      pmUse: "로수젯은 statin을 대체하는 메시지가 아니라 dual inhibition으로 target gap을 줄이는 메시지로 설명한다."
    }
  ];

  const combinationRationale = "Statin은 간 cholesterol synthesis를 줄이고, ezetimibe는 장 cholesterol 흡수를 줄인다. 두 기전은 서로 다른 유입 경로를 낮춰 LDL-C 목표 도달 가능성을 높이는 보완 구조다.";
  const getMechanismStepById = (id) => statinMechanismSteps.find((step) => step.id === id);

  return {
    combinationRationale,
    getMechanismStepById,
    statinMechanismSteps
  };
})();

globalThis.MechanismData = MechanismData;
