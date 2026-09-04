const SourceData = (() => {
  const sourceStatusOptions = [
    { id: "all", label: "All" },
    { id: "found", label: "Found" },
    { id: "follow-up", label: "Follow-up" }
  ];

  const sourceHubItems = [
    source({
      archiveState: "linked-only",
      category: "역학",
      extractionFocus: ["유병률 funnel", "치료율/조절률", "고위험군 규모"],
      id: "ksola-fact-2024",
      pmUse: "Fact Sheet 수치와 시장 sizing 가정을 연결한다.",
      priority: "P0",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12488789/",
      status: "found",
      summary: "KNHANES/NHIS 기반 국내 prevalence, awareness, treatment, control funnel.",
      title: "Dyslipidemia Fact Sheet 2024 (KSoLA)"
    }),
    source({
      archiveState: "linked-only",
      category: "지침",
      extractionFocus: ["위험군 정의", "LDL-C target", "nonstatin add-on 문장"],
      id: "ksola-guideline-2022",
      pmUse: "국내 자료의 1차 backbone으로 둔다.",
      priority: "P0",
      sourceUrl: "https://new.lipid.or.kr/reference/guideline.php?boardid=guideline&category=&idx=1281&mode=view",
      status: "found",
      summary: "국내 LDL-C target, 위험군, nonstatin add-on의 기준 축.",
      title: "KSoLA 2022 제5판 진료지침"
    }),
    source({
      archiveState: "linked-only",
      category: "지침",
      extractionFocus: ["focused update 범위", "Lp(a)/CAC", "조기 intensification"],
      id: "esc-eas-2025",
      pmUse: "글로벌 KOL discussion과 지침 diff에 사용한다.",
      priority: "P1",
      sourceUrl: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/",
      status: "found",
      summary: "Lp(a), CAC, 조기 intensification, newer LLT 업데이트.",
      title: "ESC/EAS 2025 Focused Update"
    }),
    source({
      archiveState: "linked-only",
      category: "지침",
      extractionFocus: ["PREVENT", "ApoB/Lp(a)", "LDL-C/non-HDL-C target"],
      id: "acc-aha-2026",
      pmUse: "KSoLA와 미국식 threshold/target language를 구분한다.",
      priority: "P1",
      sourceUrl: "https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia",
      status: "found",
      summary: "LDL-C/non-HDL-C target, PREVENT, ApoB/Lp(a), CAC, newer LLT 반영.",
      title: "ACC/AHA 2026 Dyslipidemia Guideline"
    }),
    source({
      archiveState: "linked-only",
      category: "분류",
      extractionFocus: ["C10BA06 hierarchy", "C10C와 구분", "market class 주석"],
      id: "who-atc-c10ba06",
      pmUse: "C10C 시장분류와 혼동하지 않게 자료 첫 장에 둔다.",
      priority: "P0",
      sourceUrl: "https://atcddd.fhi.no/atc_ddd_index/?code=C10BA06",
      status: "found",
      summary: "로수젯 성분 조합의 공식 ATC 코드.",
      title: "WHO ATC C10BA06 rosuvastatin and ezetimibe"
    }),
    source({
      archiveState: "linked-only",
      category: "Trial",
      extractionFocus: ["PICO", "3년 outcome", "LDL-C <70 mg/dL 도달률"],
      id: "racing",
      pmUse: "로수젯 10/10 mg 인접 strategy 근거로 사용하되 브랜드 outcome claim은 제한한다.",
      priority: "P0",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/35863366/",
      status: "found",
      summary: "한국 ASCVD 환자에서 rosuvastatin 10 mg+ezetimibe 10 mg 전략과 rosuvastatin 20 mg 비교.",
      title: "RACING trial"
    }),
    source({
      archiveState: "linked-only",
      category: "Trial",
      extractionFocus: ["ACS 대상", "ezetimibe class outcome", "claim 범위"],
      id: "improve-it",
      pmUse: "ezetimibe outcome class 근거로 사용하고 rosuvastatin/ezetimibe 직접 근거와 분리한다.",
      priority: "P0",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/26039521/",
      status: "found",
      summary: "ACS 이후 simvastatin+ezetimibe가 simvastatin 대비 LDL-C 추가 저하와 outcome 개선을 보인 class anchor.",
      title: "IMPROVE-IT"
    }),
    source({
      archiveState: "linked-only",
      category: "Trial",
      extractionFocus: ["T2DM switch-in", "12주 LDL-C endpoint", "outcome claim 제한"],
      id: "eroica",
      pmUse: "내분비 segment에서 lipid efficacy 근거로 쓰며 outcome claim은 피한다.",
      priority: "P0",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/41190361/",
      status: "found",
      summary: "T2DM 환자 switch-in lipid endpoint 중심 직접성 높은 근거 후보.",
      title: "EROICA rosuvastatin/ezetimibe FDC"
    }),
    source({
      archiveState: "needed",
      category: "가격",
      extractionFocus: ["제품코드", "적용일", "상한금액"],
      id: "hira-2026-price",
      pmUse: "가격표 외부 사용 전 제품코드, 적용일, 상한금액을 재확인한다.",
      priority: "P0",
      sourceUrl: "https://www.hira.or.kr/",
      status: "follow-up",
      summary: "현재 사이트의 급여가격 snapshot을 최신 고시 원문과 대조해야 한다.",
      title: "HIRA September 2026 약제급여목록"
    }),
    source({
      archiveState: "needed",
      category: "허가",
      extractionFocus: ["효능효과", "용법용량", "금기/주의"],
      id: "rosuzet-label-mfds",
      pmUse: "제품 소개와 safety guardrail을 허가사항 문장으로 고정한다.",
      priority: "P0",
      sourceUrl: "https://nedrug.mfds.go.kr/",
      status: "follow-up",
      summary: "로수젯 허가사항 원문에서 PM 자료의 표현 경계를 추출해야 한다.",
      title: "로수젯 의약품안전나라 허가사항"
    }),
    source({
      archiveState: "needed",
      category: "아카이브",
      extractionFocus: ["공식 PDF 링크", "파일명", "표 번호"],
      id: "ksola-pdf-direct",
      pmUse: "PDF 파일명과 표 번호를 로컬 archive index에 매핑한다.",
      priority: "P1",
      sourceUrl: "https://www.lipid.or.kr/",
      status: "follow-up",
      summary: "공식 PDF 직접 링크와 파일명, 발간일, 표 번호를 로컬 archive index에 매핑한다.",
      title: "KSoLA Fact Sheet PDF 원문 파일"
    }),
    source({
      archiveState: "needed",
      category: "Trial",
      extractionFocus: ["publication 여부", "mixed dyslipidemia", "diabetes segment"],
      id: "rembrandt-full",
      pmUse: "학회 발표와 논문화 상태를 분리해 claim 등급을 조정한다.",
      priority: "P1",
      sourceUrl: "https://clinicaltrials.gov/",
      status: "follow-up",
      summary: "mixed dyslipidemia와 diabetes segment에서 결과 공개 여부를 추적한다.",
      title: "REMBRANDT publication/results"
    }),
    source({
      archiveState: "needed",
      category: "Trial",
      extractionFocus: ["등록번호", "논문화 상태", "회사 발표 원문"],
      id: "easy-rosuzet",
      pmUse: "브랜드 자료에 넣을 수 있는 source grade를 확정한다.",
      priority: "P2",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=EASY-ROSUZET",
      status: "follow-up",
      summary: "회사 발표 중심 자산의 등록번호, 논문, 세부 대상자 정의를 추적한다.",
      title: "EASY-ROSUZET study source trail"
    }),
    source({
      archiveState: "needed",
      category: "Trial",
      extractionFocus: ["subgroup PMID", "interaction", "figure/table"],
      id: "racing-subgroups",
      pmUse: "심장내과/내분비/고령 계정별 objection 카드로 재배치한다.",
      priority: "P1",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=RACING+trial+ezetimibe+subgroup",
      status: "follow-up",
      summary: "very-high-risk, PCI, diabetes, elderly subgroup의 interaction과 한계를 세그먼트별로 정리한다.",
      title: "RACING subgroup papers"
    })
  ];

  function source(item) {
    return {
      archiveState: "needed",
      extractionFocus: [],
      localArchivePath: "",
      priority: "P2",
      ...item
    };
  }

  const sourceCategories = [...new Set(sourceHubItems.map((item) => item.category))];
  const sourceCategoryOptions = [
    { id: "all", label: "All categories" },
    ...sourceCategories.map((category) => ({ id: category, label: category }))
  ];

  const getSourceItemById = (id) => sourceHubItems.find((item) => item.id === id);
  const getSourceItemsByFilters = ({ category = "all", status = "all" } = {}) => {
    return sourceHubItems.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesCategory = category === "all" || item.category === category;
      return matchesStatus && matchesCategory;
    });
  };
  const getSourceItemsByStatus = (status) => getSourceItemsByFilters({ status });
  const getArchiveSummary = () => {
    const localArchivePaths = sourceHubItems
      .filter((item) => item.archiveState === "local-file" && item.localArchivePath)
      .map((item) => item.localArchivePath);

    return {
      followUpCount: getSourceItemsByStatus("follow-up").length,
      linkedOnlyCount: sourceHubItems.filter((item) => item.archiveState === "linked-only").length,
      localFileCount: new Set(localArchivePaths).size,
      neededCount: sourceHubItems.filter((item) => item.archiveState === "needed").length,
      p0Count: sourceHubItems.filter((item) => item.priority === "P0").length,
      totalCount: sourceHubItems.length
    };
  };

  return {
    getArchiveSummary,
    getSourceItemById,
    getSourceItemsByFilters,
    getSourceItemsByStatus,
    sourceCategories,
    sourceCategoryOptions,
    sourceHubItems,
    sourceStatusOptions
  };
})();

globalThis.SourceData = SourceData;
