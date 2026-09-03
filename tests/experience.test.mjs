import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const readText = (path) => readFile(new URL(path, import.meta.url), "utf8");

const loadExperienceData = async () => {
  const files = [
    "../metadata-data.js",
    "../definition-data.js",
    "../mechanism-data.js",
    "../statin-profile-data.js",
    "../fact-sheet-data.js",
    "../landmark-trials-data.js",
    "../evidence-data.js",
    "../statin-evidence-data.js",
    "../library-data.js",
    "../strategy-data.js",
    "../site-data.js",
    "../source-data.js",
    "../experience-data.js"
  ];
  const context = { globalThis: {} };
  vm.createContext(context);
  for (const file of files) {
    vm.runInContext(await readText(file), context);
  }
  return context.globalThis.ExperienceData;
};

test("experience shell adds search, source hub, glossary, and responsive controls", async () => {
  const html = await readText("../index.html");
  const css = await readText("../experience.css");
  const tools = await readText("../experience-tools.js");
  const packageJson = JSON.parse(await readText("../package.json"));

  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.match(html, /<link rel="stylesheet" href="experience\.css">/);
  assert.match(html, /<script src="metadata-data\.js" defer><\/script>/);
  assert.match(html, /<script src="source-data\.js" defer><\/script>/);
  assert.match(html, /<script src="experience-data\.js" defer><\/script>/);
  assert.match(html, /<script src="experience-tools\.js" defer><\/script>/);
  assert.match(html, /id="contentVersionNote"/);
  assert.match(html, /id="archiveVersionNote"/);
  assert.match(html, /data-page-link="sources"/);
  assert.match(html, /id="globalSearch"/);
  assert.match(html, /id="globalSearchResults"/);
  assert.match(html, /aria-controls="globalSearchResults"/);
  assert.match(html, /id="viewModeToggle"/);
  assert.match(html, /id="glossaryToggle"/);
  assert.match(html, /id="sectionJumpNav"/);
  assert.match(html, /<section id="learning-progress"/);
  assert.match(html, /<section id="guideline-segment-diff"/);
  assert.match(html, /<section id="competitor-matrix"/);
  assert.match(html, /<section id="detail-script-generator"/);
  assert.match(html, /<section id="source-hub"/);
  assert.match(html, /id="sourceCategoryFilter"/);
  assert.match(html, /id="sourceArchiveSummary"/);
  assert.match(html, /id="glossaryDrawer"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(css, /body\[data-view-mode="compact"\]/);
  assert.match(css, /\.global-search/);
  assert.match(css, /\.glossary-drawer/);
  assert.match(tools, /localStorage/);
  assert.match(tools, /dataset\.viewMode/);
  assert.match(tools, /sectionJumpNav/);
  assert.match(tools, /lastActiveElement/);
  assert.match(tools, /focusableElements/);
  assert.match(tools, /renderMetadata/);
  assert.match(tools, /renderSourceCategoryFilter/);
  assert.match(tools, /getSourceItemsByFilters/);
  assert.match(tools, /source-archive-status/);
  assert.doesNotMatch(tools, /innerHTML/);
});

test("metadata and source hub data are centralized for screen and archive use", async () => {
  const files = [
    "../metadata-data.js",
    "../source-data.js",
    "../experience-data.js"
  ];
  const context = { globalThis: {} };
  vm.createContext(context);
  for (const file of files) {
    vm.runInContext(await readText(file), context);
  }
  const metadata = context.globalThis.SiteMetadata;
  const sourceData = context.globalThis.SourceData;
  const experience = context.globalThis.ExperienceData;
  const readme = await readText("../README.md");

  assert.equal(metadata.contentLastChecked, "2026-09-02");
  assert.equal(metadata.siteUpdatedAt, "2026-09-03");
  assert.equal(metadata.pageCount, 7);
  assert.equal(experience.sourceHubItems, sourceData.sourceHubItems);
  assert.equal(sourceData.getSourceItemsByStatus("follow-up").some((item) => item.title.includes("HIRA")), true);
  assert.equal(sourceData.getSourceItemById("ksola-fact-2024").status, "found");
  assert.equal(sourceData.getSourceItemById("ksola-fact-2024").archiveState, "local-file");
  assert.match(sourceData.getSourceItemById("ksola-fact-2024").localArchivePath, /evidence_archive/);
  assert.equal(Array.isArray(sourceData.getSourceItemById("ksola-fact-2024").extractionFocus), true);
  assert.match(sourceData.getSourceItemById("eroica").sourceUrl, /41190361/);
  assert.equal(sourceData.sourceCategoryOptions.some((item) => item.id === "Trial"), true);
  assert.equal(sourceData.getSourceItemsByFilters({ status: "found", category: "Trial" }).some((item) => item.id === "racing"), true);
  const uniqueLocalFileCount = new Set(sourceData.sourceHubItems
    .filter((item) => item.archiveState === "local-file" && item.localArchivePath)
    .map((item) => item.localArchivePath)).size;
  assert.equal(sourceData.getArchiveSummary().localFileCount, uniqueLocalFileCount);
  assert.match(readme, /7개 페이지/);
  assert.match(readme, /metadata-data\.js/);
  assert.match(readme, /source-data\.js/);
  assert.match(readme, /experience-data\.js/);
  assert.match(readme, /source intake/i);
});

test("experience data powers global search and source status tracking", async () => {
  const experience = await loadExperienceData();
  const racingResults = experience.searchAll("RACING");
  const ksolaResults = experience.searchAll("KSoLA 2024");
  const followUps = experience.getSourceItemsByStatus("follow-up");

  assert.equal(experience.searchIndex.length >= 120, true);
  assert.equal(racingResults.some((item) => item.title.includes("RACING")), true);
  assert.equal(ksolaResults.some((item) => item.title.includes("Fact Sheet")), true);
  assert.equal(followUps.some((item) => item.title.includes("HIRA")), true);
  assert.equal(experience.sourceHubItems.some((item) => item.status === "found"), true);
  assert.equal(experience.sourceHubItems.some((item) => item.status === "follow-up"), true);
});

test("experience data adds segment diff, competitor matrix, scripts, prices, progress, and glossary", async () => {
  const experience = await loadExperienceData();
  const script = experience.buildDetailScript({ segmentId: "cardiology", objectionId: "high-statin" });
  const rosuzetPrice = experience.getPriceComparatorById("rosuzet-10-10");

  assert.equal(experience.guidelineSegmentDiffs.length >= 7, true);
  assert.equal(experience.guidelineSegmentDiffs.some((row) => row.segment === "ASCVD"), true);
  assert.equal(experience.guidelineSegmentDiffs.some((row) => row.segment === "TG"), true);
  assert.equal(experience.competitorMatrix.length >= 7, true);
  assert.equal(experience.competitorMatrix.some((row) => /동일성분/.test(row.className)), true);
  assert.equal(experience.competitorMatrix.some((row) => /PCSK9/.test(row.className)), true);
  assert.match(script.thirtySecond, /RACING|LDL-C/);
  assert.match(script.sixtySecond, /KSoLA|target/);
  assert.match(script.medicalBackup, /claim|근거/);
  assert.equal(rosuzetPrice.monthlyCostWon, 32610);
  assert.equal(experience.progressModules.length >= 10, true);
  assert.equal(experience.glossaryTerms.length >= 14, true);
  assert.match(experience.getGlossaryTerm("ApoB").definition, /particle|입자/);
});

test("landmark trials expose expandable PICO details", async () => {
  const dataCode = await readText("../landmark-trials-data.js");
  const renderer = await readText("../landmark-trials.js");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(dataCode, context);
  const racing = context.globalThis.LandmarkTrialData.getLandmarkTrialById("racing");

  assert.equal(Boolean(racing.pico), true);
  assert.match(racing.pico.population, /ASCVD/);
  assert.match(racing.pico.intervention, /ezetimibe/);
  assert.match(renderer, /createElement\("details"\)/);
  assert.match(renderer, /createElement\("summary"\)/);
});
