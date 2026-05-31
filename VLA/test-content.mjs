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
assert.ok(Array.isArray(data.equations), "equations should be an array");
assert.ok(data.equations.length >= 5, "should include at least 5 rendered equations");
assert.ok(Array.isArray(data.paradigms), "paradigms should be an array");
assert.ok(data.paradigms.length >= 5, "should compare at least 5 VLA paradigms");
assert.ok(Array.isArray(data.designAxes), "designAxes should be an array");
assert.equal(data.designAxes.length, 6, "should include the 6-paper-reading VLA design axes");
assert.ok(Array.isArray(data.architectureDiagrams), "architectureDiagrams should be an array");
assert.ok(data.architectureDiagrams.length >= 4, "should include at least 4 architecture diagrams");
assert.ok(Array.isArray(data.paperFigureGuides), "paperFigureGuides should be an array");
assert.ok(data.paperFigureGuides.length >= 5, "should include at least 5 paper figure guides");
assert.ok(Array.isArray(data.caseStudies), "caseStudies should be an array");
assert.ok(data.caseStudies.length >= 2, "should include Figure case studies");

const allRefs = data.routes.flatMap((route) => route.references ?? []);
assert.ok(allRefs.length >= 50, "should include at least 50 references");

const requiredNames = [
  "RT-2",
  "OpenVLA",
  "Octo",
  "pi0.7",
  "GR00T N1.7",
  "Figure Helix",
  "Helix-02 Bedroom Tidy",
  "Helix 02 Kitchen",
  "DreamZero",
  "StarVLA",
  "SpatialVLA",
  "DROID",
  "LIBERO",
];

const searchable = JSON.stringify(data).toLowerCase();
for (const name of requiredNames) {
  assert.ok(searchable.includes(name.toLowerCase()), `missing required topic: ${name}`);
}

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

for (const figure of data.paperFigureGuides) {
  assert.ok(figure.title, "paper figure guide needs title");
  assert.ok(figure.sourceTitle, `${figure.title} needs sourceTitle`);
  assert.ok(figure.sourceUrl?.startsWith("http"), `${figure.title} needs source URL`);
  assert.ok(figure.imageUrl?.startsWith("./assets/figures/"), `${figure.title} should use a local figure asset`);
  assert.ok(existsSync(path.join(__dirname, figure.imageUrl.replace("./", ""))), `${figure.title} local figure asset should exist`);
  assert.ok(figure.originalFigure, `${figure.title} needs original figure description`);
  assert.ok(Array.isArray(figure.simplified) && figure.simplified.length >= 3, `${figure.title} needs simplified steps`);
}

for (const study of data.caseStudies) {
  assert.ok(study.title, "case study needs title");
  assert.ok(study.answer, `${study.title} needs answer`);
  assert.ok(study.sourceUrl?.startsWith("http"), `${study.title} needs source URL`);
  assert.ok(Array.isArray(study.flow) && study.flow.length >= 3, `${study.title} needs mechanism flow`);
  assert.ok(Array.isArray(study.notes) && study.notes.length >= 1, `${study.title} needs notes`);
}

const html = await readFile(indexPath, "utf8");
for (const id of ["route-tabs", "route-detail", "reference-grid", "timeline", "search-input", "formula-grid", "paradigm-grid", "design-axis-grid", "architecture-gallery", "case-study-grid", "paper-figure-guides", "evidence-legend", "route-match-count"]) {
  assert.ok(html.includes(id), `index should expose #${id}`);
}

const app = await readFile(appPath, "utf8");
for (const fn of ["renderRouteTabs", "renderRouteDetail", "renderReferences", "renderRouteReferenceGroup", "renderTimeline", "renderEquations", "renderParadigms", "renderDesignAxes", "renderArchitectureDiagrams", "renderCaseStudies", "renderPaperFigureGuides", "renderEvidenceLegend", "normalizeQuery", "applyFilters"]) {
  assert.ok(app.includes(fn), `app should include ${fn}`);
}
assert.ok(!app.includes("innerHTML = `<strong>${reference.title}"), "mini refs should not interpolate titles with innerHTML");

const styles = await readFile(stylePath, "utf8");
for (const className of ["reference-groups", "reference-route-group", "route-reference-grid", "route-group-head", "design-axis-grid", "axis-card"]) {
  assert.ok(styles.includes(className), `styles should include ${className}`);
}

console.log(`OK: ${data.routes.length} routes, ${allRefs.length} references`);
