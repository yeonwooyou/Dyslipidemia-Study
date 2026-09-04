const FactSheetData = (() => {
  const factSheets = [
    {
      id: "ksola-2024-dyslipidemia-fact-sheet",
      title: "Dyslipidemia Fact Sheet in Korea 2024",
      publisher: "KSoLA",
      factSheetYear: "2024",
      journalYear: "2025",
      population: "Korean adults aged 20 years or older",
      evidenceBase: "KNHANES 2007-2022 and NHIS-NSC 2002-2019 analysis",
      officialSourceUrl: "https://new.lipid.or.kr/uploaded/board/factsheet/_1714d7c76807f2bc2746c00add38b0c92.pdf",
      journalSourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12488789/",
      useScope: "국내 이상지질혈증 burden, diagnosis-treatment-control gap, 동반질환 segment sizing에 사용한다."
    }
  ];

  const factSheetMetrics = [
    metric("dyslipidemia-prevalence-standard", "Dyslipidemia prevalence", "40.9%", "2016-2022 조유병률. HDL-C 기준을 남녀 공통 <40 mg/dL로 정의한 값.", "시장 크기와 TAM의 출발점."),
    metric("dyslipidemia-prevalence-hdl-modified", "Modified HDL-C definition prevalence", "47.4%", "HDL-C 기준을 남성 <40 mg/dL, 여성 <50 mg/dL로 정의한 값.", "정의 변화에 따라 pool size가 달라짐을 보여준다."),
    metric("hypercholesterolemia-2022", "Hypercholesterolemia prevalence", "27.4%", "2022년 total cholesterol >=240 mg/dL 또는 lipid-lowering medication 기준 조유병률.", "LDL-C 중심 치료 pool을 설명하는 보조 지표."),
    metric("hypercholesterolemia-awareness", "Awareness", "68.0%", "2022년 hypercholesterolemia 인지율.", "진단 전환 gap과 질환 인식 캠페인 포인트."),
    metric("hypercholesterolemia-treatment", "Treatment", "61.2%", "2022년 hypercholesterolemia 치료율.", "진단 이후 실제 치료 전환의 병목."),
    metric("hypercholesterolemia-control", "Overall control", "54.1%", "2022년 전체 hypercholesterolemia 조절률.", "치료 중이라도 목표 도달 gap을 별도로 봐야 한다."),
    metric("treated-control", "Control among treated", "재확인 필요", "치료자 중 조절률로 기록된 값. 원문 표와 분모 확인 전에는 확정 수치로 사용하지 않는다.", "치료 지속성과 치료 강도 조정 메시지를 분리한다."),
    metric("diabetes-comorbidity", "Diabetes comorbidity", "87.0%", "당뇨병 동반 성인에서 dyslipidemia prevalence.", "내분비내과/T2DM segment의 질환 burden."),
    metric("hypertension-comorbidity", "Hypertension comorbidity", "72.4%", "고혈압 동반 성인에서 dyslipidemia prevalence.", "복합위험 1차의료/순환기 segment."),
    metric("obesity-comorbidity", "Obesity comorbidity", "55.2%", "비만 동반 성인에서 dyslipidemia prevalence.", "대사증후군, TG, non-HDL-C 학습 연결.")
  ];

  const pmInterpretation = {
    marketSizing: "기본 TAM은 dyslipidemia prevalence 40.9%를 출발점으로 두고, 여성 HDL-C 기준을 반영한 sensitivity scenario는 47.4%로 둔다.",
    funnel: "인지율 68.0%, 치료율 61.2%, 전체 조절률 54.1%를 diagnosis-treatment-control funnel로 놓고 계정별 병목을 나눠 본다.",
    segment: "당뇨병 87.0%, 고혈압 72.4%, 비만 55.2%의 동반 burden은 endocrinology, cardiology, primary care 메시지 우선순위를 정하는 데 쓴다.",
    claimGuardrail: "Fact Sheet는 역학 근거다. 로수젯 제품 효과, superiority, cardiovascular outcome claim으로 직접 확장하지 않는다."
  };

  function metric(id, label, value, note, pmUse) {
    return { id, label, note, pmUse, value };
  }

  const getFactSheetById = (id) => factSheets.find((sheet) => sheet.id === id);
  const getFactSheetMetricById = (id) => factSheetMetrics.find((item) => item.id === id);

  return {
    factSheetMetrics,
    factSheets,
    getFactSheetById,
    getFactSheetMetricById,
    pmInterpretation
  };
})();

globalThis.FactSheetData = FactSheetData;
