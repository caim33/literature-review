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
assert.equal(data.meta.title, "WM Learning Map");
assert.ok(Array.isArray(data.routes), "routes should be an array");
assert.ok(data.routes.length >= 8, "should cover at least 8 world model routes");
assert.ok(Array.isArray(data.equations), "equations should be an array");
assert.ok(data.equations.length >= 5, "should include at least 5 rendered equations");
assert.ok(Array.isArray(data.paradigms), "paradigms should be an array");
assert.ok(data.paradigms.length >= 5, "should compare at least 5 world model paradigms");
assert.ok(Array.isArray(data.foundations), "foundations should be an array");
assert.ok(data.foundations.length >= 6, "should explain at least 6 beginner WM concepts");
assert.ok(Array.isArray(data.modelFreeVsModelBased), "modelFreeVsModelBased should be an array");
assert.ok(data.modelFreeVsModelBased.length >= 4, "should compare model-free and model-based learning");
assert.ok(Array.isArray(data.predictionTargets), "predictionTargets should be an array");
assert.ok(data.predictionTargets.length >= 6, "should explain what WM can predict");
assert.ok(Array.isArray(data.robotWorkflow), "robotWorkflow should be an array");
assert.ok(data.robotWorkflow.length >= 5, "should explain robot VLA + WM workflow");
assert.ok(Array.isArray(data.misconceptions), "misconceptions should be an array");
assert.ok(data.misconceptions.length >= 5, "should include common WM misconceptions");
assert.ok(data.systemArchitecture, "should include a system architecture diagram");
assert.ok(Array.isArray(data.systemArchitecture.nodes), "system architecture should include nodes");
assert.ok(data.systemArchitecture.nodes.length >= 6, "system architecture should show at least 6 modules");
assert.ok(Array.isArray(data.paperFigures), "paperFigures should be an array");
assert.ok(data.paperFigures.length >= 5, "should include at least 5 simplified paradigm figures");
for (const figure of data.paperFigures) {
  assert.ok(figure.title, "figure needs title");
  assert.ok(figure.source, `${figure.title} needs source`);
  assert.ok(Array.isArray(figure.nodes) && figure.nodes.length >= 4, `${figure.title} needs nodes`);
  assert.ok(Array.isArray(figure.edges) && figure.edges.length >= 3, `${figure.title} needs edges`);
  assert.ok(Array.isArray(figure.readingFocus) && figure.readingFocus.length >= 3, `${figure.title} needs readingFocus`);
}

const allRefs = data.routes.flatMap((route) => route.references ?? []);
assert.ok(allRefs.length >= 60, "should include at least 60 references");

const requiredNames = [
  "World Models",
  "PlaNet",
  "DreamerV3",
  "TD-MPC2",
  "Visual Foresight",
  "DayDreamer",
  "UniSim",
  "RoboDreamer",
  "IRASim",
  "GR-1",
  "V-JEPA 2",
  "Cosmos",
  "Genie 2",
  "GAIA-1",
];

const searchable = JSON.stringify(data).toLowerCase();
for (const name of requiredNames) {
  assert.ok(searchable.includes(name.toLowerCase()), `missing required topic: ${name}`);
}

const autoRoute = data.routes.find((route) => route.id === "driving-3d-sim");
assert.ok(autoRoute, "should keep an autonomous-driving/3D simulation route");
assert.ok((autoRoute.references ?? []).length <= 8, "driving route should stay lightweight");

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

const html = await readFile(indexPath, "utf8");
for (const id of ["architecture-diagram", "figure-grid", "foundation-grid", "model-comparison", "prediction-targets", "robot-workflow", "misconception-list", "route-tabs", "route-detail", "reference-grid", "timeline", "search-input", "formula-grid", "paradigm-grid", "evidence-legend", "route-match-count"]) {
  assert.ok(html.includes(id), `index should expose #${id}`);
}

const app = await readFile(appPath, "utf8");
for (const fn of ["renderArchitecture", "renderPaperFigures", "renderFigure", "renderFoundations", "renderModelComparison", "renderPredictionTargets", "renderRobotWorkflow", "renderMisconceptions", "renderRouteTabs", "renderRouteDetail", "renderReferences", "renderTimeline", "renderEquations", "renderParadigms", "renderEvidenceLegend", "normalizeQuery", "applyFilters"]) {
  assert.ok(app.includes(fn), `app should include ${fn}`);
}
assert.ok(!app.includes("innerHTML = `<strong>${reference.title}"), "mini refs should not interpolate titles with innerHTML");

console.log(`OK: ${data.routes.length} routes, ${allRefs.length} references`);
