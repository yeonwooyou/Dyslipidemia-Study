const LandmarkTrialData = (() => {
  const landmarkCategories = [
    { id: "all", label: "All landmark trials" },
    { id: "strategy-combination", label: "Combination / strategy" },
    { id: "primary-prevention", label: "Primary prevention" },
    { id: "secondary-prevention", label: "Secondary prevention" },
    { id: "intensive-strategy", label: "Intensive statin" },
    { id: "broad-high-risk", label: "Broad high-risk" },
    { id: "ezetimibe-outcome", label: "Ezetimibe outcome" }
  ];

  const landmarkTrials = [
    trial("racing", "RACING", "2022", "strategy-combination", "ASCVD, 3,780 Korean patients", "Rosuvastatin 10 mg + ezetimibe 10 mg", "Rosuvastatin 20 mg", "3-year composite CV endpoint", "Combination strategy was noninferior and improved LDL-C <70 mg/dL attainment and intolerance-related measures.", "로수젯 10/10 mg와 가까운 strategy evidence. 브랜드 직접 outcome claim이 아니라 rosuvastatin+ezetimibe 전략 근거로 쓴다.", "Open-label Korean ASCVD strategy trial."),
    trial("prove-it-timi-22", "PROVE-IT TIMI 22", "2004/2005", "intensive-strategy", "Recent ACS, 4,162 patients", "Atorvastatin 80 mg", "Pravastatin 40 mg", "Death, MI, UA hospitalization, revascularization, stroke", "Intensive statin therapy reduced clinical events versus standard statin therapy after ACS.", "ACS 이후 강한 LDL-C lowering의 landmark. 병용 전략과는 구분한다.", "Statin intensity trial, not ezetimibe or FDC evidence."),
    trial("ideal", "IDEAL", "2005", "intensive-strategy", "Prior MI, 8,888 patients", "Atorvastatin 80 mg", "Simvastatin 20-40 mg", "Major coronary events", "Primary endpoint did not significantly differ, while several secondary CV endpoints favored intensive therapy.", "고강도 statin 증량의 이득과 endpoint hierarchy를 함께 설명한다.", "Open-label blinded-endpoint design."),
    trial("care", "CARE", "1996", "secondary-prevention", "Prior MI with average cholesterol, 4,159 patients", "Pravastatin 40 mg", "Placebo", "Fatal CHD or nonfatal MI", "Pravastatin reduced recurrent coronary events after MI.", "LDL-C 절대치만이 아니라 ASCVD history 자체가 치료 강도를 움직인다는 근거.", "Older pravastatin-era background care."),
    trial("lipid", "LIPID", "1998", "secondary-prevention", "Prior MI or unstable angina", "Pravastatin 40 mg", "Placebo", "CHD death and all-cause mortality", "Pravastatin reduced CHD death, total mortality, and major CV events.", "secondary prevention에서 장기 statin benefit을 설명한다.", "Moderate statin and 1990s practice context."),
    trial("four-s", "4S", "1994", "secondary-prevention", "CHD with hypercholesterolemia, 4,444 patients", "Simvastatin", "Placebo", "All-cause mortality and major coronary events", "Simvastatin reduced mortality and major coronary events.", "statin outcome evidence의 출발점으로 사용한다.", "Pre-modern revascularization and background therapy era."),
    trial("tnt", "TNT", "2005", "intensive-strategy", "Stable CHD, 10,001 patients", "Atorvastatin 80 mg", "Atorvastatin 10 mg", "First major cardiovascular event", "More intensive LDL-C lowering reduced major cardiovascular events.", "stable CHD에서 lower LDL-C target rationale을 설명한다.", "Higher-dose statin safety/lab signal을 함께 본다."),
    trial("hps", "HPS", "2002", "broad-high-risk", "High-risk individuals, 20,536 adults", "Simvastatin 40 mg", "Placebo", "Major vascular events", "Simvastatin reduced major vascular events across broad high-risk groups.", "고위험군 absolute benefit과 장기 치료 논리를 설명한다.", "Simvastatin era and broad population."),
    trial("hope-3", "HOPE-3", "2016", "primary-prevention", "Intermediate-risk adults without CVD", "Rosuvastatin 10 mg", "Placebo", "Composite cardiovascular events", "Rosuvastatin reduced cardiovascular events in intermediate-risk primary prevention.", "1차 예방에서 risk-based statin initiation을 설명하는 rosuvastatin anchor.", "Not treat-to-target or combination evidence."),
    trial("ascot-lla", "ASCOT-LLA", "2003", "primary-prevention", "Hypertension with additional risk factors", "Atorvastatin 10 mg", "Placebo", "Nonfatal MI and fatal CHD", "Atorvastatin reduced coronary events and stroke; trial stopped early.", "고혈압 복합위험 환자에서 statin의 event reduction을 설명한다.", "Hypertension trial subset and early termination."),
    trial("afcaps-texcaps", "AFCAPS/TexCAPS", "1998", "primary-prevention", "Average LDL-C and low HDL-C, 6,605 adults", "Lovastatin", "Placebo", "First acute major coronary event", "Lovastatin reduced first major coronary events.", "LDL-C뿐 아니라 HDL-C/overall risk 맥락을 이해하는 고전 근거.", "Lovastatin-era evidence."),
    trial("woscops", "WOSCOPS", "1995", "primary-prevention", "Men with hypercholesterolemia and no MI history", "Pravastatin 40 mg", "Placebo", "Nonfatal MI or CHD death", "Pravastatin reduced first major coronary events.", "고LDL 1차 예방의 statin benefit 출발점.", "Middle-aged male population."),
    trial("improve-it", "IMPROVE-IT", "2015", "ezetimibe-outcome", "Recent ACS, 18,144 patients", "Simvastatin 40 mg + ezetimibe 10 mg", "Simvastatin 40 mg", "Composite CV outcome over median 6 years", "Ezetimibe addition lowered LDL-C further and improved cardiovascular outcomes.", "ezetimibe 추가의 class-level outcome anchor. 로수젯 직접 근거와 구분한다.", "Simvastatin-based trial, not rosuvastatin/ezetimibe direct evidence."),
    trial("ewtopia-75", "EWTOPIA 75", "2019", "ezetimibe-outcome", "Japanese adults >=75 years, elevated LDL-C, no CAD history", "Ezetimibe 10 mg", "Usual care", "Composite atherosclerotic CV events", "Ezetimibe reduced the primary outcome, with cautious interpretation needed.", "고령 1차 예방에서 ezetimibe outcome discussion backup으로 쓴다.", "고령 일본인 대상 open-label trial이며 premature termination/follow-up 이슈를 함께 표시한다.")
  ];

  function trial(id, title, year, category, population, intervention, comparator, endpoint, result, pmUse, guardrail) {
    return { category, comparator, endpoint, guardrail, id, intervention, pmUse, population, result, title, year };
  }

  const getLandmarkTrialById = (id) => landmarkTrials.find((trialItem) => trialItem.id === id);
  const getLandmarkTrialsByCategory = (categoryId) => {
    if (categoryId === "all") {
      return landmarkTrials;
    }
    return landmarkTrials.filter((trialItem) => trialItem.category === categoryId);
  };

  return {
    getLandmarkTrialById,
    getLandmarkTrialsByCategory,
    landmarkCategories,
    landmarkTrials
  };
})();

globalThis.LandmarkTrialData = LandmarkTrialData;
