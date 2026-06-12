import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const dataPath = path.join(__dirname, "data.js");
const indexPath = path.join(__dirname, "index.html");
const appPath = path.join(__dirname, "app.js");
const stylePath = path.join(__dirname, "styles.css");

assert.equal(existsSync(dataPath), true, "data.js should exist");
assert.equal(existsSync(indexPath), true, "index.html should exist");
assert.equal(existsSync(appPath), true, "app.js should exist");
assert.equal(existsSync(stylePath), true, "styles.css should exist");

const data = require(dataPath);
assert.ok(Array.isArray(data.routes), "routes should be an array");
assert.ok(data.routes.length >= 8, "should cover at least 8 VLA learning routes");
assert.ok(Array.isArray(data.tocGroups), "tocGroups should be an array");
assert.ok(data.tocGroups.length >= 3, "should include grouped page contents");
assert.ok(Array.isArray(data.equations), "equations should be an array");
assert.ok(data.equations.length >= 5, "should include at least 5 rendered equations");
assert.ok(Array.isArray(data.paradigms), "paradigms should be an array");
assert.ok(data.paradigms.length >= 5, "should compare at least 5 VLA paradigms");
assert.ok(Array.isArray(data.designAxes), "designAxes should be an array");
assert.equal(data.designAxes.length, 6, "should include the 6-paper-reading VLA design axes");
assert.ok(data.applicationDomains, "applicationDomains should exist");
assert.ok(Array.isArray(data.applicationDomains.domains), "applicationDomains domains should be an array");
assert.equal(data.applicationDomains.domains.length, 2, "should distinguish manipulation VLA and whole-body VLA");
assert.ok(Array.isArray(data.applicationDomains.boundaries) && data.applicationDomains.boundaries.length >= 4, "applicationDomains should include boundary axes");
assert.ok(Array.isArray(data.architectureDiagrams), "architectureDiagrams should be an array");
assert.ok(data.architectureDiagrams.length >= 4, "should include at least 4 architecture diagrams");
assert.ok(Array.isArray(data.paperFigureGuides), "paperFigureGuides should be an array");
assert.ok(data.paperFigureGuides.length >= 5, "should include at least 5 paper figure guides");
assert.ok(Array.isArray(data.trainingRecipes), "trainingRecipes should be an array");
assert.ok(data.trainingRecipes.length >= 8, "should include at least 8 data/training recipe entries");
assert.ok(data.figureSystem, "figureSystem should exist");
assert.ok(Array.isArray(data.figureSystem.demos), "figureSystem demos should be an array");
assert.ok(data.figureSystem.demos.length >= 4, "should include at least 4 Figure demos");

const allRefs = data.routes.flatMap((route) => route.references ?? []);
assert.ok(allRefs.length >= 50, "should include at least 50 references");

const requiredNames = [
  "RT-2",
  "OpenVLA",
  "Manipulation VLA",
  "Whole-body VLA",
  "Octo",
  "pi0.7",
  "GR00T N1.7",
  "Figure Helix",
  "Helix-02 Bedroom Tidy",
  "Helix 02 Kitchen",
  "GENE-26.5",
  "Qwen-VLA",
  "Galaxea G0.5",
  "XPENG Robotics Fe0",
  "DreamZero",
  "StarVLA",
  "SpatialVLA",
  "Cosmos",
  "world model support",
  "DROID",
  "LIBERO",
];

const searchable = JSON.stringify(data).toLowerCase();
for (const name of requiredNames) {
  assert.ok(searchable.includes(name.toLowerCase()), `missing required topic: ${name}`);
}
assert.ok(
  searchable.includes("cosmos") &&
    searchable.includes("wm / physical ai support") &&
    searchable.includes("vla") &&
    searchable.includes("policy"),
  "VLA page should cross-link Cosmos as WM support rather than the main VLA policy family"
);
assert.ok(
  searchable.includes("large vlm/llm backbone") &&
    searchable.includes("action head") &&
    searchable.includes("action expert"),
  "VLA definition should stay focused on large VLM/LLM backbone plus action head/action expert"
);

for (const route of data.routes) {
  assert.ok(route.id, "route needs id");
  assert.ok(route.title, `route ${route.id} needs title`);
  assert.ok(route.question, `route ${route.id} needs a core question`);
  assert.ok(route.takeaway, `route ${route.id} needs takeaway`);
  assert.ok(Array.isArray(route.branches) && route.branches.length >= 2, `${route.id} needs branches`);
  assert.ok(Array.isArray(route.references) && route.references.length >= 3, `${route.id} needs references`);
}

for (const ref of allRefs) {
  assert.ok(ref.title, "reference needs title");
  assert.ok(ref.year, `${ref.title} needs year`);
  assert.ok(ref.url?.startsWith("http"), `${ref.title} needs a web URL`);
  assert.ok(ref.value, `${ref.title} needs learning value`);
  assert.ok(ref.evidence, `${ref.title} needs evidence level`);
}

for (const equation of data.equations) {
  assert.ok(equation.title, "equation needs title");
  assert.ok(equation.mathml?.includes("<math"), `${equation.title} should use MathML`);
  assert.ok(!equation.mathml.includes("\\("), `${equation.title} should not use raw TeX delimiters`);
  assert.ok(equation.explain, `${equation.title} needs explanation`);
}

for (const diagram of data.architectureDiagrams) {
  assert.ok(diagram.title, "architecture diagram needs title");
  assert.ok(Array.isArray(diagram.nodes) && diagram.nodes.length >= 3, `${diagram.title} needs nodes`);
  assert.ok(Array.isArray(diagram.edges) && diagram.edges.length >= 2, `${diagram.title} needs edges`);
  assert.ok(diagram.takeaway, `${diagram.title} needs takeaway`);
}

for (const axis of data.designAxes) {
  assert.ok(axis.title, "design axis needs title");
  assert.ok(axis.question, `${axis.title} needs guiding question`);
  assert.ok(axis.summary, `${axis.title} needs summary`);
  assert.ok(axis.why, `${axis.title} needs why`);
  assert.ok(Array.isArray(axis.options) && axis.options.length >= 3, `${axis.title} needs options`);
  assert.ok(axis.probe, `${axis.title} needs paper-reading probe`);
  assert.ok(axis.trap, `${axis.title} needs common trap`);
}

for (const domain of data.applicationDomains.domains) {
  assert.ok(domain.id, "application domain needs id");
  assert.ok(domain.title, `${domain.id} needs title`);
  assert.ok(domain.summary, `${domain.id} needs summary`);
  assert.ok(domain.actionSpace, `${domain.id} needs actionSpace`);
  assert.ok(domain.data, `${domain.id} needs data description`);
  assert.ok(domain.metrics, `${domain.id} needs metrics`);
  assert.ok(Array.isArray(domain.examples) && domain.examples.length >= 4, `${domain.id} needs examples`);
}

for (const figure of data.paperFigureGuides) {
  assert.ok(figure.title, "paper figure guide needs title");
  assert.ok(figure.sourceTitle, `${figure.title} needs sourceTitle`);
  assert.ok(figure.sourceUrl?.startsWith("http"), `${figure.title} needs source URL`);
  assert.ok(figure.imageUrl?.startsWith("./assets/figures/"), `${figure.title} should use a local figure asset`);
  assert.ok(existsSync(path.join(__dirname, figure.imageUrl.replace("./", ""))), `${figure.title} local figure asset should exist`);
  assert.ok(figure.originalFigure, `${figure.title} needs original figure description`);
  assert.ok(Array.isArray(figure.simplified) && figure.simplified.length >= 3, `${figure.title} needs simplified steps`);
}

for (const recipe of data.trainingRecipes) {
  assert.ok(recipe.title, "training recipe needs title");
  assert.ok(recipe.year, `${recipe.title} needs year`);
  assert.ok(recipe.family, `${recipe.title} needs family`);
  assert.ok(recipe.evidence, `${recipe.title} needs evidence`);
  assert.ok(recipe.paradigm, `${recipe.title} needs paradigm`);
  assert.ok(recipe.action, `${recipe.title} needs action/trajectory notes`);
  assert.ok(recipe.readAs, `${recipe.title} needs reading note`);
  assert.ok(recipe.domain, `${recipe.title} needs application domain tag`);
  assert.ok(Array.isArray(recipe.sources) && recipe.sources.length >= 1, `${recipe.title} needs sources`);
  assert.ok(Array.isArray(recipe.dataMix) && recipe.dataMix.length >= 4, `${recipe.title} needs data mix entries`);
  assert.ok(Array.isArray(recipe.training) && recipe.training.length >= 3, `${recipe.title} needs training stages`);
  assert.ok(Array.isArray(recipe.unknowns) && recipe.unknowns.length >= 2, `${recipe.title} needs unknowns/caveats`);
  for (const source of recipe.sources) {
    assert.ok(source.title, `${recipe.title} source needs title`);
    assert.ok(source.url?.startsWith("http"), `${recipe.title} source needs web URL`);
  }
  for (const item of recipe.dataMix) {
    assert.ok(item.label, `${recipe.title} data mix item needs label`);
    assert.ok(item.role, `${recipe.title} data mix item needs role`);
    if (item.share !== undefined) {
      assert.equal(typeof item.share, "number", `${recipe.title} data mix share should be numeric`);
      assert.ok(item.share > 0, `${recipe.title} data mix share should be positive`);
    }
  }
  const shares = recipe.dataMix.map((item) => item.share).filter((share) => share !== undefined);
  if (shares.length) {
    assert.equal(shares.length, recipe.dataMix.length, `${recipe.title} should either share all data mix items or none`);
    const shareTotal = shares.reduce((sum, share) => sum + share, 0);
    assert.ok(shareTotal > 99 && shareTotal <= 101, `${recipe.title} shared data mix should add up to roughly 100%`);
  }
  for (const stage of recipe.training) {
    assert.ok(stage.stage, `${recipe.title} training item needs stage`);
    assert.ok(stage.title, `${recipe.title} training item needs title`);
    assert.ok(stage.detail, `${recipe.title} training item needs detail`);
  }
}

assert.ok(data.figureSystem.title, "figure system needs title");
assert.ok(data.figureSystem.summary, "figure system needs summary");
assert.ok(Array.isArray(data.figureSystem.architecture) && data.figureSystem.architecture.length >= 4, "figure system needs architecture nodes");
for (const demo of data.figureSystem.demos) {
  assert.ok(demo.title, "Figure demo needs title");
  assert.ok(demo.version, `${demo.title} needs version`);
  assert.ok(demo.scene, `${demo.title} needs scene`);
  assert.ok(demo.capability, `${demo.title} needs capability`);
  assert.ok(demo.mechanism, `${demo.title} needs mechanism`);
  assert.ok(demo.sourceUrl?.startsWith("http"), `${demo.title} needs source URL`);
  assert.ok(demo.videoUrl?.startsWith("https://videos.ctfassets.net/"), `${demo.title} needs official video URL`);
  assert.ok(Array.isArray(demo.tags) && demo.tags.length >= 2, `${demo.title} needs tags`);
}

const html = await readFile(indexPath, "utf8");
for (const group of data.tocGroups) {
  assert.ok(group.title, "toc group needs title");
  assert.ok(Array.isArray(group.items) && group.items.length >= 3, `${group.title} needs at least 3 links`);
  for (const item of group.items) {
    assert.ok(item.target, `${group.title} toc item needs target`);
    assert.ok(item.title, `${group.title} toc item needs title`);
    assert.ok(item.note, `${group.title} toc item needs note`);
    assert.ok(html.includes(`id="${item.target}"`), `toc target #${item.target} should exist in index`);
  }
}

for (const id of ["contents", "page-toc", "route-tabs", "route-detail", "reference-grid", "timeline", "search-input", "formula-grid", "paradigm-grid", "design-axis-grid", "architecture-gallery", "application-domains", "application-domain-map", "training-recipes", "training-recipe-list", "figure-system-case", "paper-figure-guides", "evidence-legend", "route-match-count"]) {
  assert.ok(html.includes(id), `index should expose #${id}`);
}

const app = await readFile(appPath, "utf8");
for (const fn of ["renderPageToc", "updateActivePageToc", "scrollToTocTarget", "bindPageTocTracking", "renderRouteTabs", "renderRouteDetail", "renderReferences", "renderRouteReferenceGroup", "renderTimeline", "renderEquations", "renderParadigms", "renderDesignAxes", "renderArchitectureDiagrams", "renderApplicationDomains", "renderTrainingRecipes", "renderRecipeDataMix", "renderRecipeDonut", "renderRecipePyramid", "renderRecipeBlock", "renderFigureSystem", "renderPaperFigureGuides", "renderEvidenceLegend", "normalizeQuery", "applyFilters"]) {
  assert.ok(app.includes(fn), `app should include ${fn}`);
}
assert.ok(!app.includes("innerHTML = `<strong>${reference.title}"), "mini refs should not interpolate titles with innerHTML");

const styles = await readFile(stylePath, "utf8");
for (const className of ["reference-groups", "reference-route-group", "route-reference-grid", "route-group-head", "toc-band", "page-toc", "toc-card", "toc-link.active", "design-axis-grid", "axis-card", "domain-band", "application-domain-map", "domain-card-grid", "domain-boundary-matrix", "domain-bridge-grid", "recipe-band", "training-recipe-list", "recipe-card", "recipe-badge.domain", "recipe-donut", "recipe-mix-legend", "recipe-pyramid", "recipe-item-grid", "figure-system-case", "figure-demo-card", "figure-architecture"]) {
  assert.ok(styles.includes(className), `styles should include ${className}`);
}

console.log(`OK: ${data.routes.length} routes, ${allRefs.length} references`);
