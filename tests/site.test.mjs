import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const readText = (path) => readFile(new URL(path, import.meta.url), "utf8");

const loadStudyData = async () => {
  const evidenceCode = await readText("../evidence-data.js");
  const statinCode = await readText("../statin-evidence-data.js");
  const code = await readText("../site-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(evidenceCode, context);
  vm.runInContext(statinCode, context);
  vm.runInContext(code, context);
  return context.globalThis.StudyData;
};

const loadStrategyData = async () => {
  const code = await readText("../strategy-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.StrategyData;
};

const loadLibraryData = async () => {
  const code = await readText("../library-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.LibraryData;
};

test("site shell uses external assets and CSP without unsafe-inline", async () => {
  const html = await readText("../index.html");

  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /unsafe-inline/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<link rel="stylesheet" href="pages\.css">/);
  assert.match(html, /<script src="evidence-data\.js" defer><\/script>/);
  assert.match(html, /<script src="statin-evidence-data\.js" defer><\/script>/);
  assert.match(html, /<script src="library-data\.js" defer><\/script>/);
  assert.match(html, /<script src="strategy-data\.js" defer><\/script>/);
  assert.match(html, /<script src="site-data\.js" defer><\/script>/);
  assert.match(html, /<script src="script\.js" defer><\/script>/);
  assert.match(html, /<script src="strategy-tools\.js" defer><\/script>/);
  assert.match(html, /<script src="page-router\.js" defer><\/script>/);
  assert.match(html, /<section id="guidelines"/);
  assert.match(html, /<section id="cases"/);
  assert.match(html, /<section id="targets"/);
  assert.match(html, /<section id="dose-map"/);
  assert.match(html, /<section id="competitors"/);
  assert.match(html, /<section id="claims"/);
  assert.match(html, /<section id="objections"/);
  assert.match(html, /<section id="tracker"/);
  assert.match(html, /<section id="atc"/);
  assert.match(html, /<section id="segment-playbook"/);
  assert.match(html, /<section id="strategy-simulator"/);
  assert.match(html, /<section id="evidence-grading"/);
  assert.match(html, /<section id="war-room"/);
  assert.match(html, /<section id="guideline-diff"/);
  assert.match(html, /<section id="claim-checker"/);
  assert.match(html, /<section id="objection-training"/);
  assert.match(html, /<section id="market-sizing"/);
  assert.match(html, /<section id="publication-tracker"/);
  assert.match(html, /<section id="monthly-brief"/);
  assert.match(html, /<section id="direct-studies"/);
  assert.match(html, /<section id="evidence-atlas"/);
  assert.match(html, /<section id="library"/);
  assert.match(html, /<section id="quiz"/);
});

test("theme refresh replaces the serif-heavy font system", async () => {
  const html = await readText("../index.html");
  const css = await readText("../theme-refresh.css");

  assert.match(html, /<link rel="stylesheet" href="theme-refresh\.css">/);
  assert.match(css, /--font-display: "Avenir Next"/);
  assert.match(css, /--font-body: "Pretendard"/);
  assert.doesNotMatch(css, /ui-serif/);
});

test("layout refresh groups navigation and categorizes the workbench", async () => {
  const html = await readText("../index.html");
  const css = await readText("../layout-refresh.css");
  const categoryMatches = html.match(/data-category="/g) || [];

  assert.match(html, /<link rel="stylesheet" href="layout-refresh\.css">/);
  assert.match(html, /<section id="category-map"/);
  assert.match(html, /data-category="foundation"/);
  assert.match(html, /data-category="strategy"/);
  assert.match(html, /data-category="evidence"/);
  assert.match(html, /data-category="execution"/);
  assert.equal(categoryMatches.length >= 20, true);
  assert.match(css, /--space-section-tight/);
  assert.match(css, /--component-gap/);
  assert.match(css, /\.category-map-grid/);
  assert.match(css, /\.section\[data-category/);
  assert.match(css, /\.strategy-card,\n\.war-card/);
});

test("multi-page shell exposes clean responsive page navigation", async () => {
  const html = await readText("../index.html");
  const css = await readText("../pages.css");
  const router = await readText("../page-router.js");
  const pageLinks = html.match(/data-page-link="/g) || [];

  ["home", "foundation", "strategy", "evidence", "execution", "library"].forEach((page) => {
    assert.match(html, new RegExp(`data-page-link="${page}"`));
    assert.match(html, new RegExp(`data-page="${page}"`));
  });

  assert.equal(pageLinks.length, 6);
  assert.match(html, /id="menuToggle"/);
  assert.match(html, /id="pageNav"/);
  assert.match(html, /id="activePageTitle"/);
  assert.match(css, /\[data-page\]\[hidden\]/);
  assert.match(css, /\.page-nav/);
  assert.match(css, /\.menu-toggle/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(router, /hashchange/);
  assert.match(router, /aria-current/);
  assert.doesNotMatch(router, /innerHTML/);
});

test("deep learning library adds categorized PM study content", async () => {
  const library = await loadLibraryData();
  const categoryIds = new Set(library.libraryCategories.map((category) => category.id));

  assert.equal(library.libraryCategories.length >= 9, true);
  assert.equal(library.libraryModules.length >= 44, true);
  [
    "lipid-basics",
    "risk-stratification",
    "guideline-workflow",
    "treatment",
    "safety",
    "market",
    "field",
    "evidence-reading",
    "glossary"
  ].forEach((id) => assert.equal(categoryIds.has(id), true));

  assert.equal(library.getModulesByCategory("safety").length >= 4, true);
  assert.equal(library.getModulesByCategory("treatment").some((item) => /로수젯/.test(item.title)), true);
  assert.equal(library.searchLibrary("ApoB").some((item) => /ApoB/.test(item.title + item.summary)), true);
  assert.equal(library.searchLibrary("EROICA").some((item) => /EROICA/.test(item.title + item.summary)), true);
});

test("guideline data distinguishes current and upcoming Korean guidance", async () => {
  const { getGuidelineById, guidelineSummaries } = await loadStudyData();
  const ksola = getGuidelineById("ksola-2022");
  const esc = getGuidelineById("esc-2025");
  const acc = getGuidelineById("acc-aha-2026");

  assert.equal(ksola.edition, "2022 제5판, 2023-05-22 수정본");
  assert.match(ksola.currentStatus, /2026-08-31/);
  assert.match(ksola.currentStatus, /2026년 9월 이후/);
  assert.equal(esc.edition, "2025 Focused Update");
  assert.equal(acc.edition, "2026 Guideline");
  assert.equal(guidelineSummaries.length >= 3, true);
});

test("rosuzet and ATC data model preserves PM classification distinction", async () => {
  const { atcFrameworks, rosuzetProfile } = await loadStudyData();
  assert.equal(rosuzetProfile.whoAtc, "C10BA06");
  assert.equal(rosuzetProfile.marketClass, "C10C");
  assert.deepEqual([...rosuzetProfile.strengths], ["10/2.5 mg", "10/5 mg", "10/10 mg", "10/20 mg"]);

  const who = atcFrameworks.find((framework) => framework.id === "who-atc");
  const ephmra = atcFrameworks.find((framework) => framework.id === "ephmra");

  assert.equal(who.rosuzetCode, "C10BA06");
  assert.equal(ephmra.rosuzetCode, "C10C");
  assert.notEqual(who.rosuzetCode, ephmra.rosuzetCode);
});

test("LDL-C gap calculator returns deterministic target pressure", async () => {
  const { computeLdlGap } = await loadStudyData();
  assert.deepEqual({ ...computeLdlGap(120, 55) }, {
    absoluteGap: 65,
    reductionPercent: 54.2,
    pressure: "very-high"
  });

  assert.deepEqual({ ...computeLdlGap(82, 70) }, {
    absoluteGap: 12,
    reductionPercent: 14.6,
    pressure: "low"
  });
});

test("quiz has enough PM self-check questions with answers", async () => {
  const { quizQuestions } = await loadStudyData();
  assert.equal(quizQuestions.length >= 8, true);
  assert.equal(quizQuestions.every((item) => item.question && item.answer), true);
});

test("expanded PM tools include all requested learning blocks", async () => {
  const {
    claimGuardrails,
    competitorGroups,
    dosePositioning,
    guidelineTargetMatrix,
    objectionBank,
    picoCards,
    updateTracker
  } = await loadStudyData();

  assert.equal(guidelineTargetMatrix.length >= 5, true);
  assert.equal(dosePositioning.length, 4);
  assert.equal(competitorGroups.length >= 4, true);
  assert.equal(claimGuardrails.allowed.length >= 4, true);
  assert.equal(claimGuardrails.avoid.length >= 4, true);
  assert.equal(objectionBank.length >= 6, true);
  assert.equal(picoCards.length >= 4, true);
  assert.equal(updateTracker.length >= 5, true);
});

test("patient case simulator maps LDL-C gap to a practical PM study frame", async () => {
  const { buildCaseSummary } = await loadStudyData();
  const cadCase = buildCaseSummary({
    archetypeId: "cad-post-pci",
    baselineLdl: 132,
    currentTherapyId: "moderate-statin"
  });

  assert.equal(cadCase.target, 55);
  assert.equal(cadCase.gap.pressure, "very-high");
  assert.match(cadCase.suggestedDoseFocus, /10\/10/);
  assert.match(cadCase.guidelineFrame, /KSoLA/);

  const lowRiskCase = buildCaseSummary({
    archetypeId: "primary-low",
    baselineLdl: 126,
    currentTherapyId: "naive"
  });

  assert.equal(lowRiskCase.target, 130);
  assert.equal(lowRiskCase.gap.pressure, "at-target");
  assert.match(lowRiskCase.suggestedDoseFocus, /생활습관/);
});

test("evidence atlas includes EROICA and broad dyslipidemia landmark evidence", async () => {
  const { evidenceAtlas, evidenceCategories, getEvidenceById } = await loadStudyData();
  const ids = new Set(evidenceAtlas.map((study) => study.id));

  assert.equal(evidenceAtlas.length >= 30, true);
  assert.equal(evidenceCategories.length >= 7, true);
  assert.equal(ids.has("eroica"), true);
  assert.equal(ids.has("rembrandt"), true);
  assert.equal(ids.has("switch"), true);
  assert.equal(ids.has("rosetta-stroke"), true);
  assert.equal(ids.has("racing-diabetes"), true);
  assert.equal(ids.has("fourier"), true);
  assert.equal(ids.has("clear-outcomes"), true);
  assert.equal(ids.has("reduce-it"), true);

  const eroica = getEvidenceById("eroica");
  assert.equal(eroica.productRelevance, "direct");
  assert.match(eroica.pmUse, /T2DM/);
  assert.match(eroica.limitations, /publication|출처|확인/i);
});

test("direct study deep dives separate publication grade from claim use", async () => {
  const { directStudyDeepDives } = await loadStudyData();
  const eroica = directStudyDeepDives.find((study) => study.id === "eroica");

  assert.equal(directStudyDeepDives.length >= 6, true);
  assert.equal(eroica.id, "eroica");
  assert.equal(Boolean(eroica.claimGuardrail), true);
  assert.match(eroica.claimGuardrail, /확인|구분|확대/);
});

test("statin evidence extension adds broad class trial coverage", async () => {
  const { evidenceAtlas, evidenceCategories, getEvidenceByCategory, getEvidenceById } = await loadStudyData();
  const categoryIds = new Set(evidenceCategories.map((category) => category.id));
  const ids = new Set(evidenceAtlas.map((study) => study.id));
  const statinStudies = evidenceAtlas.filter((study) => study.category.startsWith("statin-"));

  assert.equal(evidenceAtlas.length >= 75, true);
  assert.equal(statinStudies.length >= 35, true);
  assert.equal(categoryIds.has("statin-primary-prevention"), true);
  assert.equal(categoryIds.has("statin-secondary-prevention"), true);
  assert.equal(categoryIds.has("statin-intensive-strategy"), true);
  assert.equal(categoryIds.has("statin-imaging"), true);
  assert.equal(categoryIds.has("statin-special-populations"), true);
  assert.equal(categoryIds.has("statin-asia"), true);
  assert.equal(categoryIds.has("statin-safety"), true);

  [
    "four-s",
    "woscops-main",
    "care",
    "lipid",
    "afcaps-texcaps",
    "ascot-lla",
    "cards",
    "prove-it",
    "miracl",
    "tnt",
    "ideal",
    "sparcl",
    "jupiter",
    "hope-3",
    "ctt-intensive",
    "sattar-diabetes-meta",
    "reversal",
    "asteroid",
    "saturn",
    "aurora",
    "mega",
    "japan-acs"
  ].forEach((id) => assert.equal(ids.has(id), true));

  assert.match(getEvidenceById("jupiter").intervention, /Rosuvastatin 20 mg/);
  assert.match(getEvidenceById("sattar-diabetes-meta").limitations, /diabetes/i);
  assert.equal(getEvidenceByCategory("statin-intensive-strategy").some((study) => study.id === "prove-it"), true);
});

test("strategy workbench data covers PM execution modules", async () => {
  const strategy = await loadStrategyData();

  assert.equal(strategy.segmentPlaybooks.length >= 5, true);
  assert.equal(strategy.competitorWarRoom.length >= 6, true);
  assert.equal(strategy.guidelineDiffRows.length >= 6, true);
  assert.equal(strategy.publicationTracker.length >= 7, true);
  assert.equal(strategy.monthlyBriefBlocks.length >= 5, true);
  assert.equal(strategy.trainingScenarios.length >= 6, true);

  const segments = new Set(strategy.segmentPlaybooks.map((segment) => segment.id));
  assert.equal(segments.has("cardiology"), true);
  assert.equal(segments.has("endocrinology"), true);
  assert.equal(segments.has("neurology"), true);
});

test("LDL-C strategy simulator recommends oral FDC escalation when target gap is high", async () => {
  const { computeLdlStrategy } = await loadStrategyData();
  const result = computeLdlStrategy({
    baselineLdl: 132,
    currentTherapyId: "moderate-statin",
    targetLdl: 55
  });

  assert.equal(result.neededReductionPercent, 58.3);
  assert.match(result.recommendation, /10\/10|10\/20/);
  assert.equal(result.rows.some((row) => row.option.includes("PCSK9")), true);
});

test("claim checker flags overextended superiority and outcome claims", async () => {
  const { evaluateClaim } = await loadStrategyData();
  const avoid = evaluateClaim("RACING으로 로수젯은 고강도 statin보다 모든 환자에서 우월하다");
  const cautious = evaluateClaim("EROICA로 로수젯은 T2DM 환자에서 심혈관 사건을 줄인다");
  const allowed = evaluateClaim("로수젯은 rosuvastatin과 ezetimibe의 fixed-dose combination이다");

  assert.equal(avoid.level, "avoid");
  assert.equal(cautious.level, "cautious");
  assert.equal(allowed.level, "allowed");
});

test("market sizing model returns TAM SAM SOM without mutating defaults", async () => {
  const { computeMarketSizing, marketSizingDefaults } = await loadStrategyData();
  const before = { ...marketSizingDefaults };
  const result = computeMarketSizing({
    adults: 38000000,
    dyslipidemiaPrevalence: 0.409,
    diagnosedRate: 0.72,
    treatedRate: 0.68,
    statinMonoShare: 0.52,
    goalFailureRate: 0.45,
    targetShare: 0.12,
    annualRxValue: 480000
  });

  assert.equal(result.tamPatients, 15542000);
  assert.equal(result.samPatients, 1780591);
  assert.equal(result.somPatients, 213671);
  assert.deepEqual({ ...marketSizingDefaults }, before);
});
