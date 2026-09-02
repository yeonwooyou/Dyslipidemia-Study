const StatinProfileData = (() => {
  const statinDevelopmentTimeline = [
    ["1976", "Compactin/mevastatin", "Akira Endo가 HMG-CoA reductase inhibitor 계열의 출발점을 만들었다."],
    ["1987", "Lovastatin", "첫 상업화 statin. Mevacor가 초기 오리지널 브랜드로 자리잡았다."],
    ["1991", "Pravastatin", "수용성 성격과 낮은 CYP 의존성을 가진 statin으로 확장됐다."],
    ["1991", "Simvastatin", "4S와 HPS를 통해 secondary prevention landmark evidence를 만들었다."],
    ["1994", "Fluvastatin", "CYP2C9 중심 대사 statin으로 선택지가 넓어졌다."],
    ["1997", "Atorvastatin", "Lipitor가 고강도 statin 시대와 PROVE-IT/TNT/IDEAL evidence를 만들었다."],
    ["2003", "Rosuvastatin", "Crestor가 강한 LDL-C lowering과 긴 반감기, 낮은 CYP3A4 의존성을 내세웠다."],
    ["2003+", "Pitavastatin", "Livalo/Livaro 계열. 상대적으로 낮은 CYP 대사 의존성과 아시아 처방 경험이 있다."]
  ];

  const statinIngredientProfiles = [
    ingredient("lovastatin", "Lovastatin", "Mevacor", "Lipophilic", "CYP3A4", "Prodrug", "2-3 h", "초기 statin. 음식 영향과 CYP3A4 상호작용을 함께 본다.", "WOSCOPS/4S 이전 statin era 이해용."),
    ingredient("pravastatin", "Pravastatin", "Pravachol / Mevalotin", "Hydrophilic", "Minimal CYP", "Active drug", "1.8 h", "CARE, LIPID, WOSCOPS의 핵심 성분. CYP 상호작용 부담이 낮은 축.", "고전 outcome trial의 성분으로 기억한다."),
    ingredient("simvastatin", "Simvastatin", "Zocor", "Lipophilic", "CYP3A4", "Prodrug", "2 h", "4S, HPS, IMPROVE-IT의 statin backbone. CYP3A4와 고용량 안전성 이슈를 함께 본다.", "Outcome 근거는 강하지만 현재 고용량 전략과는 분리한다."),
    ingredient("fluvastatin", "Fluvastatin", "Lescol", "Lipophilic", "CYP2C9", "Active drug", "3 h", "상대적으로 LDL-C lowering potency가 낮은 축. LIPS 같은 특수 근거를 확인한다.", "주요 시장축보다는 class understanding에 사용한다."),
    ingredient("atorvastatin", "Atorvastatin", "Lipitor / 리피토", "Lipophilic", "CYP3A4", "Active drug", "14 h", "고강도 statin 대표. PROVE-IT, TNT, IDEAL과 연결한다.", "CYP3A4 DDI와 고강도 statin comparator 질문에 대비한다."),
    ingredient("rosuvastatin", "Rosuvastatin", "Crestor / 크레스토", "Hydrophilic", "CYP2C9 minor", "Active drug", "19 h", "강한 LDL-C lowering, 긴 반감기, 낮은 CYP3A4 의존성이 특징.", "로수젯의 statin 축. ezetimibe와 dual inhibition으로 연결한다."),
    ingredient("pitavastatin", "Pitavastatin", "Livalo / Livaro / 리바로", "Lipophilic", "CYP2C9 minor", "Active drug", "12 h", "아시아 처방 경험과 상대적으로 낮은 CYP 의존성을 강조하는 성분.", "당뇨/상호작용 질문에서 비교 후보로 등장한다.")
  ];

  const priceBenchmarks = [
    price("rosuzet-10-2-5", "로수젯정 10/2.5 mg", "한미약품", "rosuvastatin 2.5 mg + ezetimibe 10 mg", 712, "643508470", "YakCheck/HIRA snapshot", "https://www.yakcheck.co.kr/medicine/643508470"),
    price("rosuzet-10-5", "로수젯정 10/5 mg", "한미약품", "rosuvastatin 5 mg + ezetimibe 10 mg", 779, "643507280", "Doccent/YakCheck/HIRA snapshot", "https://doccent.com/drugwiki/drug/r4xibta6"),
    price("rosuzet-10-10", "로수젯정 10/10 mg", "한미약품", "rosuvastatin 10 mg + ezetimibe 10 mg", 1087, "643507260", "YakCheck/HIRA snapshot", "https://www.yakcheck.co.kr/medicine/643507260"),
    price("rosuzet-10-20", "로수젯정 10/20 mg", "한미약품", "rosuvastatin 20 mg + ezetimibe 10 mg", 1093, "643507270", "YakCheck/HIRA snapshot", "https://www.yakcheck.co.kr/medicine/643507270"),
    price("crestor-10", "크레스토정 10 mg", "한국아스트라제네카", "rosuvastatin 10 mg", 602, "650700520", "Doccent/HIRA snapshot", "https://doccent.com/drugwiki/drug/tl8k1koy"),
    price("lipitor-10", "리피토정 10 mg", "비아트리스코리아", "atorvastatin 10 mg", 638, "073400340", "YakCheck/HIRA snapshot", "https://www.yakcheck.co.kr/medicine/073400340"),
    price("livaro-2", "리바로정 2 mg", "JW중외제약", "pitavastatin 2 mg", 547, "644900800", "YakCheck/HIRA snapshot", "https://www.yakcheck.co.kr/medicine/644900800")
  ];

  const priceSourceNote = "급여가격은 HIRA 약제급여목록 및 급여상한금액표 기반 공개 페이지를 2026-09-02에 확인한 snapshot이다. 일부 공개 페이지는 2026-08-01 고시 기준으로 표시되므로, 2026-09-01 시행 최신 고시와 대조가 필요하다.";
  const priceUseGuardrail = "외부 발표, 가격 비교표, 영업자료에는 최신 고시 원문과 제품코드별 적용일을 재확인한 뒤 사용한다.";

  function ingredient(id, ingredientName, originatorBrand, solubility, metabolism, prodrug, halfLife, characteristic, pmUse) {
    return {
      characteristic,
      halfLife,
      id,
      ingredientName,
      metabolism,
      originatorBrand,
      pmUse,
      prodrug,
      solubility
    };
  }

  function price(id, product, company, ingredientText, ceilingPriceWon, code, source, sourceUrl) {
    return { ceilingPriceWon, code, company, id, ingredientText, product, source, sourceUrl };
  }

  const getPriceBenchmarkById = (id) => priceBenchmarks.find((item) => item.id === id);
  const getStatinIngredientById = (id) => statinIngredientProfiles.find((item) => item.id === id);

  return {
    getPriceBenchmarkById,
    getStatinIngredientById,
    priceBenchmarks,
    priceSourceNote,
    priceUseGuardrail,
    statinDevelopmentTimeline,
    statinIngredientProfiles
  };
})();

globalThis.StatinProfileData = StatinProfileData;
