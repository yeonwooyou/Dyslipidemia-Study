import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const readText = (path) => readFile(new URL(path, import.meta.url), "utf8");

const loadExperienceData = async () => {
  const files = [
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
  assert.match(html, /<script src="experience-data\.js" defer><\/script>/);
  assert.match(html, /<script src="experience-tools\.js" defer><\/script>/);
  assert.match(html, /data-page-link="sources"/);
  assert.match(html, /id="globalSearch"/);
  assert.match(html, /id="globalSearchResults"/);
  assert.match(html, /id="viewModeToggle"/);
  assert.match(html, /id="glossaryToggle"/);
  assert.match(html, /id="sectionJumpNav"/);
  assert.match(html, /<section id="learning-progress"/);
  assert.match(html, /<section id="guideline-segment-diff"/);
  assert.match(html, /<section id="competitor-matrix"/);
  assert.match(html, /<section id="detail-script-generator"/);
  assert.match(html, /<section id="source-hub"/);
  assert.match(html, /id="glossaryDrawer"/);
  assert.match(css, /body\[data-view-mode="compact"\]/);
  assert.match(css, /\.global-search/);
  assert.match(css, /\.glossary-drawer/);
  assert.match(tools, /localStorage/);
  assert.match(tools, /dataset\.viewMode/);
  assert.match(tools, /sectionJumpNav/);
  assert.doesNotMatch(tools, /innerHTML/);
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
