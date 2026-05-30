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
assert.ok(data.systemArchitecture.caption.includes("候选动作生成器"), "system architecture should position VLA as an action proposal module");
const architectureLabels = data.systemArchitecture.nodes.map((node) => node.label);
for (const label of ["VLA Policy", "Candidate Actions", "World Model", "Scorer / Safety", "Low-Level Controller"]) {
  assert.ok(architectureLabels.includes(label), `system architecture should include ${label}`);
}
assert.ok(Array.isArray(data.paperFigures), "paperFigures should be an array");
assert.ok(data.paperFigures.length >= 5, "should include at least 5 simplified paradigm figures");
const expectedPipelineFigures = [
  "Dreamer / PlaNet：Latent Imagination",
  "Visual Foresight：Video Prediction + MPC",
  "TD-MPC / TD-MPC2：Task-Oriented Latent MPC",
  "Genie / UniSim / IRASim：Interactive Simulator",
  "VLA + WM Hybrid：Proposal, Rollout, Rerank",
];
for (const title of expectedPipelineFigures) {
  const figure = data.paperFigures.find((item) => item.title === title);
  assert.ok(figure, `should include ${title}`);
  assert.ok(figure.cardClass?.includes("wide"), `${title} should use a full-width card for readable pipeline diagrams`);
  assert.equal(figure.diagramClass, "pipeline", `${title} should use the pipeline diagram layout`);
  assert.ok(figure.viewBox, `${title} should set a spacious viewBox`);
  assert.ok(Array.isArray(figure.stages) && figure.stages.length >= 3, `${title} should include stage/lane backgrounds`);
  assert.ok((figure.edges ?? []).some((edge) => typeof edge === "object" && edge.label), `${title} should label key arrows`);
}
const tdMpcFigure = data.paperFigures.find((figure) => figure.title.includes("TD-MPC"));
const hasEdge = (figure, fromId, toId) => figure.edges.some((edge) => {
  const [from, to] = Array.isArray(edge) ? edge : [edge.from, edge.to];
  return from === fromId && to === toId;
});
assert.ok(tdMpcFigure, "should include a TD-MPC figure");
assert.ok(tdMpcFigure.thesis.includes("像素重建") && tdMpcFigure.thesis.includes("terminal value"), "TD-MPC should explain decoder-free task-oriented control");
assert.ok(tdMpcFigure.detail?.includes("decoder-free") && tdMpcFigure.detail?.includes("CEM"), "TD-MPC should include a concrete decoder-free and CEM planning explanation");
assert.ok(tdMpcFigure.detail?.includes("短 horizon") && tdMpcFigure.detail?.includes("误差"), "TD-MPC should explain why short rollouts reduce compounding error");
assert.equal(tdMpcFigure.diagramClass, "pipeline", "TD-MPC simplified figure should use the roomier pipeline layout");
assert.ok(tdMpcFigure.cardClass?.includes("wide"), "TD-MPC card should use full-width space for a readable pipeline");
const tdMpcLabels = tdMpcFigure.nodes.map((node) => node.label);
for (const label of ["Replay Buffer", "Encoder h", "Latent z_t", "TOLD Dynamics d", "Reward r", "Q / Terminal Value", "Policy Prior π", "CEM / MPPI Planner", "Action Sequences", "Execute a_t only"]) {
  assert.ok(tdMpcLabels.includes(label), `TD-MPC simplified pipeline should include ${label}`);
}
assert.ok(hasEdge(tdMpcFigure, "prior", "planner"), "TD-MPC planner should be guided by a policy prior");
assert.ok(hasEdge(tdMpcFigure, "planner", "seq"), "TD-MPC planner should sample action sequences");
assert.ok(hasEdge(tdMpcFigure, "seq", "dyn"), "TD-MPC action sequences should drive latent dynamics rollouts");
assert.ok(hasEdge(tdMpcFigure, "value", "return"), "TD-MPC terminal value should contribute to trajectory return");
assert.ok(hasEdge(tdMpcFigure, "return", "act"), "TD-MPC trajectory return should select the executed action");
for (const figure of data.paperFigures) {
  assert.ok(figure.title, "figure needs title");
  assert.ok(figure.source, `${figure.title} needs source`);
  assert.ok(figure.originalMedia, `${figure.title} needs original paper/project media`);
  assert.ok(["image", "video"].includes(figure.originalMedia.type), `${figure.title} media needs a supported type`);
  assert.ok(figure.originalMedia.src?.startsWith("assets/paper-figures/"), `${figure.title} media should use a local asset`);
  assert.equal(existsSync(path.join(__dirname, figure.originalMedia.src)), true, `${figure.title} local media asset should exist`);
  assert.ok(figure.originalMedia.caption, `${figure.title} media needs a caption`);
  assert.ok(figure.originalMedia.sourceUrl?.startsWith("https://"), `${figure.title} media needs a source URL`);
  assert.ok(figure.originalMedia.sourceLabel, `${figure.title} media needs a source label`);
  assert.ok(figure.originalMedia.alt, `${figure.title} media needs alt text`);
  for (const media of figure.supportingMedia ?? []) {
    assert.ok(["image", "video"].includes(media.type), `${figure.title} supporting media needs a supported type`);
    assert.ok(media.src?.startsWith("assets/paper-figures/"), `${figure.title} supporting media should use a local asset`);
    assert.equal(existsSync(path.join(__dirname, media.src)), true, `${figure.title} supporting media asset should exist`);
    assert.ok(media.caption, `${figure.title} supporting media needs a caption`);
    assert.ok(media.sourceUrl?.startsWith("https://"), `${figure.title} supporting media needs a source URL`);
    assert.ok(media.sourceLabel, `${figure.title} supporting media needs a source label`);
    assert.ok(media.alt, `${figure.title} supporting media needs alt text`);
  }
  assert.ok(Array.isArray(figure.nodes) && figure.nodes.length >= 4, `${figure.title} needs nodes`);
  assert.ok(Array.isArray(figure.edges) && figure.edges.length >= 3, `${figure.title} needs edges`);
  assert.ok(figure.deepDive, `${figure.title} needs a collapsible detailed interpretation`);
  assert.ok(figure.deepDive.summary, `${figure.title} deepDive needs summary text`);
  assert.ok(Array.isArray(figure.deepDive.sections) && figure.deepDive.sections.length >= 4, `${figure.title} deepDive needs at least 4 sections`);
  for (const section of figure.deepDive.sections) {
    assert.ok(section.title, `${figure.title} deepDive section needs title`);
    assert.ok(section.body && section.body.length >= 40, `${figure.title} deepDive section needs a substantial explanation`);
  }
  const nodeIds = new Set(figure.nodes.map((node) => node.id));
  assert.equal(nodeIds.size, figure.nodes.length, `${figure.title} node ids should be unique`);
  for (const edge of figure.edges) {
    const [from, to] = Array.isArray(edge) ? edge : [edge.from, edge.to];
    assert.ok(nodeIds.has(from), `${figure.title} edge starts from missing node ${from}`);
    assert.ok(nodeIds.has(to), `${figure.title} edge points to missing node ${to}`);
  }
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
for (const fn of ["renderArchitecture", "renderPaperFigures", "renderOriginalMedia", "renderFigure", "renderFoundations", "renderModelComparison", "renderPredictionTargets", "renderRobotWorkflow", "renderMisconceptions", "renderRouteTabs", "renderRouteDetail", "renderReferences", "renderReferenceCard", "renderTimeline", "renderEquations", "renderParadigms", "renderEvidenceLegend", "normalizeQuery", "applyFilters"]) {
  assert.ok(app.includes(fn), `app should include ${fn}`);
}
assert.ok(app.includes("paper-original-media"), "app should render original paper/project media");
assert.ok(app.includes("figure-detail"), "app should render detailed paradigm explanations when present");
assert.ok(app.includes("renderDeepDive"), "app should render collapsible detailed paper interpretations");
assert.ok(app.includes("paper-deep-dive"), "app should use a dedicated deep dive details component");
assert.ok(app.includes("diagramClass"), "app should allow figures to opt into clearer diagram layouts");
assert.ok(app.includes("cardClass"), "app should allow complex figure cards to opt into wider layouts");
assert.ok(app.includes("figure.stages"), "app should render stage backgrounds for pipeline figures");
assert.ok(app.includes("figure-edge-label"), "app should render labels on important figure edges");
assert.ok(app.includes("reference-route"), "references should render route groups");
assert.ok(app.includes("reference-route-grid"), "references should keep papers grouped within each route");
assert.ok(app.includes("route.references.map"), "references should be grouped from each route, not one global flat list");
assert.ok(!app.includes("innerHTML = `<strong>${reference.title}"), "mini refs should not interpolate titles with innerHTML");

console.log(`OK: ${data.routes.length} routes, ${allRefs.length} references`);
