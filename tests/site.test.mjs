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

const loadAuthGate = async () => {
  const code = await readText("../auth.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.AuthGate;
};

const loadFactSheetData = async () => {
  const code = await readText("../fact-sheet-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.FactSheetData;
};

const loadLandmarkTrialData = async () => {
  const code = await readText("../landmark-trials-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.LandmarkTrialData;
};

const loadDefinitionData = async () => {
  const code = await readText("../definition-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.DefinitionData;
};

const loadMechanismData = async () => {
  const code = await readText("../mechanism-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.MechanismData;
};

const loadStatinProfileData = async () => {
  const code = await readText("../statin-profile-data.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.globalThis.StatinProfileData;
};

test("site shell uses external assets and CSP without unsafe-inline", async () => {
  const html = await readText("../index.html");
  const favicon = await readText("../assets/favicon.svg");

  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /unsafe-inline/);
  assert.doesNotMatch(html, /http-equiv="Content-Security-Policy"[\s\S]*frame-ancestors/);
  assert.match(html, /<link rel="icon" href="assets\/favicon\.svg" type="image\/svg\+xml">/);
  assert.match(favicon, /<svg/);
  assert.match(favicon, /Rosuzet/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<link rel="stylesheet" href="pages\.css">/);
  assert.match(html, /<link rel="stylesheet" href="auth\.css">/);
  assert.match(html, /<link rel="stylesheet" href="foundation-learning\.css">/);
  assert.match(html, /<link rel="stylesheet" href="fact-sheet\.css">/);
  assert.match(html, /<link rel="stylesheet" href="landmark-trials\.css">/);
  assert.match(html, /<link rel="stylesheet" href="mobile\.css">/);
  assert.match(html, /<script src="definition-data\.js" defer><\/script>/);
  assert.match(html, /<script src="mechanism-data\.js" defer><\/script>/);
  assert.match(html, /<script src="statin-profile-data\.js" defer><\/script>/);
  assert.match(html, /<script src="fact-sheet-data\.js" defer><\/script>/);
  assert.match(html, /<script src="landmark-trials-data\.js" defer><\/script>/);
  assert.match(html, /<script src="evidence-data\.js" defer><\/script>/);
  assert.match(html, /<script src="statin-evidence-data\.js" defer><\/script>/);
  assert.match(html, /<script src="library-data\.js" defer><\/script>/);
  assert.match(html, /<script src="strategy-data\.js" defer><\/script>/);
  assert.match(html, /<script src="site-data\.js" defer><\/script>/);
  assert.match(html, /<script src="script\.js" defer><\/script>/);
  assert.match(html, /<script src="foundation-learning\.js" defer><\/script>/);
  assert.match(html, /<script src="fact-sheet\.js" defer><\/script>/);
  assert.match(html, /<script src="landmark-trials\.js" defer><\/script>/);
  assert.match(html, /<script src="strategy-tools\.js" defer><\/script>/);
  assert.match(html, /<script src="page-router\.js" defer><\/script>/);
  assert.match(html, /<script src="auth\.js" defer><\/script>/);
  assert.match(html, /<section id="dyslipidemia-definition"/);
  assert.match(html, /id="definitionGrid"/);
  assert.match(html, /<section id="statin-mechanism"/);
  assert.match(html, /id="mechanismGrid"/);
  assert.match(html, /<section id="statin-profiles"/);
  assert.match(html, /id="statinProfileGrid"/);
  assert.match(html, /id="statinPriceGrid"/);
  assert.match(html, /<section id="guidelines"/);
  assert.match(html, /<section id="fact-sheet-2024"/);
  assert.match(html, /id="factSheetGrid"/);
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
  assert.match(html, /<section id="landmark-trials"/);
  assert.match(html, /id="landmarkTrialGrid"/);
  assert.match(html, /<section id="evidence-atlas"/);
  assert.match(html, /<section id="library"/);
  assert.match(html, /<section id="quiz"/);
});

test("mobile stylesheet protects small screens from layout overflow", async () => {
  const html = await readText("../index.html");
  const css = await readText("../mobile.css");
  const experienceIndex = html.indexOf('href="experience.css"');
  const mobileIndex = html.indexOf('href="mobile.css"');

  assert.equal(experienceIndex > -1, true);
  assert.equal(mobileIndex > experienceIndex, true);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.app-header\s*\{/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*max-content/);
  assert.match(css, /\.page-nav\.is-open\s*\{/);
  assert.match(css, /\.session-actions\s*\{/);
  assert.match(css, /\.global-search-results\s*\{/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /\.section-jump-nav\s*\{/);
  assert.match(css, /flex-wrap:\s*wrap/);
  assert.match(css, /\.section-intro\s*\{/);
  assert.match(css, /grid-template-columns:\s*1fr/);
  assert.match(css, /\.table-shell\s*\{/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /\.statin-price-grid/);
});

test("header layout prevents navigation and session controls from overlapping", async () => {
  const pagesCss = await readText("../pages.css");
  const experienceCss = await readText("../experience.css");
  const mobileCss = await readText("../mobile.css");

  assert.match(pagesCss, /grid-template-areas:\s*"brand nav actions"/);
  assert.match(pagesCss, /\.brand\s*\{[^}]*grid-area:\s*brand/s);
  assert.match(pagesCss, /\.page-nav\s*\{[^}]*grid-area:\s*nav/s);
  assert.match(pagesCss, /\.page-nav\s*\{[^}]*min-width:\s*0/s);
  assert.match(pagesCss, /\.page-nav\s*\{[^}]*max-width:\s*100%/s);
  assert.match(pagesCss, /\.page-nav\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(pagesCss, /@media \(max-width:\s*1180px\)[\s\S]*grid-template-areas:\s*"brand actions"\s*"nav nav"/);
  assert.match(experienceCss, /\.session-actions\s*\{[^}]*grid-area:\s*actions/s);
  assert.match(experienceCss, /\.session-actions\s*\{[^}]*display:\s*grid/s);
  assert.match(experienceCss, /\.session-actions\s*\{[^}]*grid-template-columns:\s*minmax\(14rem,\s*20rem\)\s*max-content\s*max-content\s*max-content/s);
  assert.match(experienceCss, /\.global-search\s*\{[^}]*min-width:\s*0/s);
  assert.match(experienceCss, /\.global-search-results\[hidden\][\s\S]*display:\s*none\s*!important/);
  assert.match(experienceCss, /\.section-jump-nav\s*\{[^}]*width:\s*100%/s);
  assert.match(experienceCss, /\.section-jump-nav\s*\{[^}]*max-width:\s*none/s);
  assert.match(mobileCss, /\.session-actions\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
});

test("KSoLA 2024 fact sheet module captures epidemiology and PM interpretation", async () => {
  const factSheet = await loadFactSheetData();
  const ksola = factSheet.getFactSheetById("ksola-2024-dyslipidemia-fact-sheet");
  const metricIds = new Set(factSheet.factSheetMetrics.map((metric) => metric.id));

  assert.equal(ksola.publisher, "KSoLA");
  assert.equal(ksola.factSheetYear, "2024");
  assert.match(ksola.officialSourceUrl, /ksola\.or\.kr|lipid\.or\.kr/);
  assert.match(ksola.journalSourceUrl, /10\.12997\/jla\.2025\.14\.3\.298|PMC12488789/);
  assert.equal(factSheet.factSheetMetrics.length >= 8, true);

  [
    "dyslipidemia-prevalence-standard",
    "dyslipidemia-prevalence-hdl-modified",
    "hypercholesterolemia-2022",
    "hypercholesterolemia-awareness",
    "hypercholesterolemia-treatment",
    "hypercholesterolemia-control",
    "diabetes-comorbidity",
    "hypertension-comorbidity"
  ].forEach((id) => assert.equal(metricIds.has(id), true));

  assert.match(factSheet.pmInterpretation.marketSizing, /40\.9%/);
  assert.match(factSheet.pmInterpretation.claimGuardrail, /역학|제품/);
});

test("dyslipidemia definition module starts with classification structure", async () => {
  const definition = await loadDefinitionData();
  const sectionIds = new Set(definition.definitionSections.map((section) => section.id));

  assert.equal(definition.definitionSections.length >= 5, true);
  [
    "core-definition",
    "lipid-parameters",
    "phenotypes",
    "primary-secondary",
    "risk-linked-treatment"
  ].forEach((id) => assert.equal(sectionIds.has(id), true));

  assert.match(definition.definitionSections[0].title, /정의/);
  assert.match(definition.getDefinitionSectionById("phenotypes").summary, /LDL-C|TG|HDL-C/);
  assert.match(definition.pmLearningFrame, /정의.*분류.*위험도/);
});

test("statin mechanism module explains LDL receptor biology and combination rationale", async () => {
  const mechanism = await loadMechanismData();
  const stepIds = new Set(mechanism.statinMechanismSteps.map((step) => step.id));

  assert.equal(mechanism.statinMechanismSteps.length >= 5, true);
  [
    "hmg-coa-reductase",
    "hepatic-cholesterol-pool",
    "ldl-receptor-upregulation",
    "plasma-ldl-clearance",
    "rule-of-six",
    "ezetimibe-complement"
  ].forEach((id) => assert.equal(stepIds.has(id), true));

  assert.match(mechanism.getMechanismStepById("hmg-coa-reductase").summary, /HMG-CoA reductase/);
  assert.match(mechanism.getMechanismStepById("ldl-receptor-upregulation").pmUse, /LDL receptor/);
  assert.match(mechanism.combinationRationale, /ezetimibe|흡수/);
});

test("statin profile module compares development, ingredient traits, originals, and prices", async () => {
  const profile = await loadStatinProfileData();
  const ingredientIds = new Set(profile.statinIngredientProfiles.map((item) => item.id));
  const priceIds = new Set(profile.priceBenchmarks.map((item) => item.id));

  assert.equal(profile.statinDevelopmentTimeline.length >= 7, true);
  assert.equal(profile.statinIngredientProfiles.length, 7);
  [
    "lovastatin",
    "pravastatin",
    "simvastatin",
    "fluvastatin",
    "atorvastatin",
    "rosuvastatin",
    "pitavastatin"
  ].forEach((id) => assert.equal(ingredientIds.has(id), true));

  const rosuvastatin = profile.getStatinIngredientById("rosuvastatin");
  const atorvastatin = profile.getStatinIngredientById("atorvastatin");
  assert.match(rosuvastatin.originatorBrand, /Crestor|크레스토/);
  assert.match(rosuvastatin.metabolism, /CYP2C9/);
  assert.match(rosuvastatin.halfLife, /19/);
  assert.match(atorvastatin.originatorBrand, /Lipitor|리피토/);
  assert.match(atorvastatin.metabolism, /CYP3A4/);

  [
    "rosuzet-10-2-5",
    "rosuzet-10-5",
    "rosuzet-10-10",
    "rosuzet-10-20",
    "crestor-10",
    "lipitor-10"
  ].forEach((id) => assert.equal(priceIds.has(id), true));

  assert.equal(profile.getPriceBenchmarkById("rosuzet-10-10").ceilingPriceWon, 1087);
  assert.match(profile.priceSourceNote, /HIRA|약제급여목록/);
  assert.match(profile.priceUseGuardrail, /최신 고시|재확인/);
});

test("landmark trial module keeps statin outcome anchors in a separate category", async () => {
  const landmark = await loadLandmarkTrialData();
  const trialIds = new Set(landmark.landmarkTrials.map((trial) => trial.id));
  const categoryIds = new Set(landmark.landmarkCategories.map((category) => category.id));

  assert.equal(landmark.landmarkTrials.length >= 14, true);
  assert.equal(categoryIds.has("all"), true);
  assert.equal(categoryIds.has("strategy-combination"), true);
  assert.equal(categoryIds.has("primary-prevention"), true);
  assert.equal(categoryIds.has("secondary-prevention"), true);
  assert.equal(categoryIds.has("intensive-strategy"), true);
  assert.equal(categoryIds.has("broad-high-risk"), true);

  [
    "racing",
    "prove-it-timi-22",
    "ideal",
    "care",
    "lipid",
    "four-s",
    "tnt",
    "hps",
    "hope-3",
    "ascot-lla",
    "afcaps-texcaps",
    "woscops",
    "improve-it",
    "ewtopia-75"
  ].forEach((id) => assert.equal(trialIds.has(id), true));

  assert.match(landmark.getLandmarkTrialById("racing").pmUse, /로수젯|ezetimibe/);
  assert.match(landmark.getLandmarkTrialById("improve-it").pmUse, /ezetimibe/);
  assert.match(landmark.getLandmarkTrialById("ewtopia-75").guardrail, /고령|일본|open-label/);
  assert.equal(landmark.getLandmarkTrialsByCategory("secondary-prevention").some((trial) => trial.id === "four-s"), true);
  assert.equal(landmark.getLandmarkTrialsByCategory("primary-prevention").some((trial) => trial.id === "woscops"), true);
});

test("evidence archive documents currently used guidelines and papers", async () => {
  const archiveReadme = await readText("../evidence_archive/README.md");
  const guidelines = await readText("../evidence_archive/guidelines.md");
  const landmarks = await readText("../evidence_archive/landmark_trials.md");
  const rosuzet = await readText("../evidence_archive/rosuzet_and_nonstatin_evidence.md");

  assert.match(archiveReadme, /로컬 원문 파일은 공개 배포물에 자동 포함하지 않는다/);
  assert.match(archiveReadme, /last checked/);
  assert.match(guidelines, /Dyslipidemia Fact Sheet 2024/);
  assert.match(guidelines, /KSoLA/);
  assert.match(guidelines, /ESC\/EAS/);
  assert.match(guidelines, /ACC\/AHA/);
  assert.match(guidelines, /WHO ATC/);
  assert.match(guidelines, /C10BA06/);
  assert.match(guidelines, /EPHMRA/);
  assert.match(landmarks, /RACING/);
  assert.match(landmarks, /PROVE-IT/);
  assert.match(landmarks, /IDEAL/);
  assert.match(landmarks, /CARE/);
  assert.match(landmarks, /LIPID/);
  assert.match(landmarks, /4S/);
  assert.match(landmarks, /TNT/);
  assert.match(landmarks, /HPS/);
  assert.match(landmarks, /HOPE-3/);
  assert.match(landmarks, /ASCOT/);
  assert.match(landmarks, /AFCAPS\/TexCAPS/);
  assert.match(landmarks, /WOSCOPS/);
  assert.match(landmarks, /IMPROVE-IT/);
  assert.match(landmarks, /EWTOPIA 75/);
  assert.match(rosuzet, /EROICA/);
  assert.match(rosuzet, /FOURIER/);
  assert.match(rosuzet, /REDUCE-IT/);
  assert.match(rosuzet, /claim guardrail/);
});

test("paper search CSV expands abbreviations into searchable titles", async () => {
  const csv = await readText("../evidence_archive/paper_search_list.csv");

  assert.match(csv, /search_title/);
  assert.match(csv, /Long-term efficacy and safety of moderate-intensity statin with ezetimibe combination therapy/);
  assert.match(csv, /Efficacy and safety of switching to ezetimibe 10/);
  assert.match(csv, /Dyslipidemia Fact Sheet in South Korea, 2024/);
  assert.match(csv, /RACING diabetes subgroup 원논문 탐색/);
  assert.match(csv, /현재 사이트 링크 수정 필요/);
  assert.match(csv, /"MRS-ROZE".*"local-file","evidence_archive\/Paper\/3\. MRS-ROZE\.pdf"/);
  assert.match(csv, /41190361/);
  assert.match(csv, /NCT04700436/);
});

test("login gate blocks the app shell until CVD1 credentials are entered", async () => {
  const html = await readText("../index.html");
  const css = await readText("../auth.css");
  const auth = await loadAuthGate();

  assert.match(html, /<body class="auth-locked">/);
  assert.match(html, /id="loginScreen"/);
  assert.match(html, /id="loginForm"/);
  assert.match(html, /id="loginId"/);
  assert.match(html, /id="loginPassword"/);
  assert.match(html, /id="logoutButton"/);
  assert.equal((html.match(/data-auth-content/g) || []).length >= 3, true);
  assert.match(css, /body\.auth-locked \[data-auth-content\]/);
  assert.match(css, /\.login-screen/);
  assert.match(css, /\.logout-button/);
  assert.equal(auth.authenticate({ username: "CVD1", password: "CVD1" }), true);
  assert.equal(auth.authenticate({ username: " CVD1 ", password: "CVD1" }), true);
  assert.equal(auth.authenticate({ username: "CVD1", password: "wrong" }), false);
  assert.equal(auth.authenticate({ username: "wrong", password: "CVD1" }), false);
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

  ["home", "foundation", "strategy", "evidence", "execution", "library", "sources"].forEach((page) => {
    assert.match(html, new RegExp(`data-page-link="${page}"`));
    assert.match(html, new RegExp(`data-page="${page}"`));
  });

  assert.equal(pageLinks.length, 7);
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

test("netlify deployment builds a public static dist with security headers", async () => {
  const packageJson = JSON.parse(await readText("../package.json"));
  const config = await readText("../netlify.toml");
  const browserSmoke = await readText("../tests/browser-smoke.mjs");

  assert.equal(packageJson.scripts.build, "rm -rf dist && mkdir -p dist/assets && cp index.html *.css *.js dist/ && cp assets/*.svg dist/assets/");
  assert.match(config, /\[build\]/);
  assert.match(config, /command = "npm test && npm run build"/);
  assert.match(config, /publish = "dist"/);
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /Strict-Transport-Security/);
  assert.match(config, /X-Content-Type-Options = "nosniff"/);
  assert.match(config, /X-Frame-Options = "DENY"/);
  assert.match(config, /Referrer-Policy/);
  assert.match(config, /Permissions-Policy/);
  assert.equal(packageJson.scripts["test:browser"], "node tests/browser-smoke.mjs");
  assert.match(browserSmoke, /global search form submit is prevented/);
  assert.match(browserSmoke, /source hub shows an empty state/);
  assert.match(browserSmoke, /viewport layout has no global horizontal overflow or header overlap/);
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
  const racingDiabetes = getEvidenceById("racing-diabetes");
  assert.equal(eroica.productRelevance, "direct");
  assert.match(eroica.pmUse, /T2DM/);
  assert.match(eroica.limitations, /publication|출처|확인/i);
  assert.match(racingDiabetes.sourceUrl, /RACING\+trial\+diabetes/);
  assert.doesNotMatch(racingDiabetes.sourceUrl, /PMC12428817/);
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
  assert.match(getEvidenceById("lips").sourceUrl, /12076217/);
  assert.match(getEvidenceById("stomp").sourceUrl, /23183941/);
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
