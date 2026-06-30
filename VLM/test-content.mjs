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
const siteIndexPath = path.join(__dirname, "..", "index.html");

assert.equal(existsSync(dataPath), true, "data.js should exist");
assert.equal(existsSync(indexPath), true, "index.html should exist");
assert.equal(existsSync(appPath), true, "app.js should exist");
assert.equal(existsSync(stylePath), true, "styles.css should exist");
assert.equal(existsSync(siteIndexPath), true, "site index.html should exist");

const data = require(dataPath);

assert.ok(data.meta, "meta should exist");
assert.equal(data.meta.title, "VLM Learning Map", "page title should describe VLM");
assert.ok(Array.isArray(data.tocGroups), "tocGroups should be an array");
assert.ok(data.tocGroups.length >= 3, "should include grouped page contents");
assert.ok(Array.isArray(data.principles), "principles should be an array");
assert.ok(data.principles.length >= 4, "should include at least 4 mental model principles");
assert.ok(Array.isArray(data.learningStages), "learningStages should be an array");
assert.ok(data.learningStages.length >= 5, "should include at least 5 learning stages");
assert.ok(Array.isArray(data.families), "families should be an array");
assert.ok(data.families.length >= 6, "should include at least 6 VLM families");
assert.ok(Array.isArray(data.paradigmDiagrams), "paradigmDiagrams should be an array");
assert.ok(data.paradigmDiagrams.length >= 8, "should include at least 8 visual paradigm diagrams");
assert.ok(Array.isArray(data.keyModels), "keyModels should be an array");
assert.ok(data.keyModels.length >= 18, "should include at least 18 key models");
assert.ok(Array.isArray(data.unifiedModels), "unifiedModels should be an array");
assert.ok(data.unifiedModels.length >= 10, "should include at least 10 unified understanding/generation models");
assert.ok(data.bagelResources, "BAGEL resources should exist");
assert.ok(Array.isArray(data.benchmarks), "benchmarks should be an array");
assert.ok(data.benchmarks.length >= 24, "should include at least 24 datasets or benchmarks");
assert.ok(Array.isArray(data.references), "references should be an array");
assert.ok(data.references.length >= 45, "should include at least 45 reference items");
assert.ok(Array.isArray(data.glossary), "glossary should be an array");
assert.ok(data.glossary.length >= 10, "should include at least 10 glossary terms");

const searchable = JSON.stringify(data).toLowerCase();
const requiredTopics = [
  "clip",
  "align",
  "blip-2",
  "flamingo",
  "llava",
  "qwen2.5-vl",
  "internvl",
  "molmo",
  "bagel",
  "mixture-of-transformer-experts",
  "chameleon",
  "janus-pro",
  "mmmu",
  "mathvista",
  "video-mme",
  "pope"
];

for (const topic of requiredTopics) {
  assert.ok(searchable.includes(topic), `missing required topic: ${topic}`);
}

for (const group of data.tocGroups) {
  assert.ok(group.title, "toc group needs title");
  assert.ok(Array.isArray(group.items) && group.items.length >= 3, `${group.title} needs at least 3 links`);
  for (const item of group.items) {
    assert.ok(item.target, `${group.title} toc item needs target`);
    assert.ok(item.title, `${group.title} toc item needs title`);
    assert.ok(item.note, `${group.title} toc item needs note`);
  }
}

for (const stage of data.learningStages) {
  assert.ok(stage.title, "learning stage needs title");
  assert.ok(stage.goal, `${stage.title} needs goal`);
  assert.ok(Array.isArray(stage.read) && stage.read.length >= 3, `${stage.title} needs readings`);
  assert.ok(stage.output, `${stage.title} needs output`);
}

for (const family of data.families) {
  assert.ok(family.id, "family needs id");
  assert.ok(family.title, `${family.id} needs title`);
  assert.ok(family.question, `${family.id} needs question`);
  assert.ok(family.takeaway, `${family.id} needs takeaway`);
  assert.ok(Array.isArray(family.patterns) && family.patterns.length >= 3, `${family.id} needs patterns`);
  assert.ok(Array.isArray(family.mustRead) && family.mustRead.length >= 3, `${family.id} needs must-read items`);
}

for (const diagram of data.paradigmDiagrams) {
  assert.ok(diagram.title, "paradigm diagram needs title");
  assert.ok(diagram.kicker, `${diagram.title} needs kicker`);
  assert.ok(diagram.summary, `${diagram.title} needs summary`);
  assert.ok(Array.isArray(diagram.nodes) && diagram.nodes.length >= 4, `${diagram.title} needs at least 4 visual nodes`);
  assert.ok(Array.isArray(diagram.edges) && diagram.edges.length >= 3, `${diagram.title} needs at least 3 edges`);
  assert.ok(Array.isArray(diagram.watch) && diagram.watch.length >= 3, `${diagram.title} needs reading cues`);
  assert.ok(diagram.reference, `${diagram.title} needs reference label`);
  for (const node of diagram.nodes) {
    assert.ok(node.id, `${diagram.title} node needs id`);
    assert.ok(node.label, `${diagram.title} node needs label`);
    assert.ok(node.detail, `${diagram.title} node needs detail`);
    assert.ok(node.kind, `${diagram.title} node needs kind`);
  }
  for (const edge of diagram.edges) {
    assert.ok(edge.from, `${diagram.title} edge needs from`);
    assert.ok(edge.to, `${diagram.title} edge needs to`);
    assert.ok(edge.label, `${diagram.title} edge needs label`);
  }
}

for (const model of data.keyModels) {
  assert.ok(model.name, "key model needs name");
  assert.ok(model.year, `${model.name} needs year`);
  assert.ok(model.family, `${model.name} needs family`);
  assert.ok(model.position, `${model.name} needs position`);
  assert.ok(model.idea, `${model.name} needs core idea`);
  assert.ok(model.value, `${model.name} needs learning value`);
  assert.ok(model.url?.startsWith("http"), `${model.name} needs URL`);
}

assert.equal(data.bagelResources.name, "BAGEL", "BAGEL resources should focus on BAGEL");
assert.ok(data.bagelResources.url?.startsWith("http"), "BAGEL should link to paper");
assert.ok(data.bagelResources.projectUrl?.startsWith("http"), "BAGEL should link to project");
assert.ok(data.bagelResources.codeUrl?.startsWith("https://github.com/"), "BAGEL should expose GitHub");
assert.ok(data.bagelResources.modelUrl?.startsWith("http"), "BAGEL should link to model card");

const bagelUnified = data.unifiedModels.find((model) => model.name === "BAGEL");
assert.ok(bagelUnified, "BAGEL should live in the unified model grid");
assert.ok(Array.isArray(bagelUnified.links) && bagelUnified.links.length >= 4, "BAGEL unified card should expose multiple resources");
assert.ok(bagelUnified.links.some((link) => link.label === "GitHub" && link.url.startsWith("https://github.com/")), "BAGEL unified card should include GitHub");

for (const model of data.unifiedModels) {
  assert.ok(model.name, "unified model needs name");
  assert.ok(model.year, `${model.name} needs year`);
  assert.ok(model.position, `${model.name} needs position`);
  assert.ok(model.contribution, `${model.name} needs contribution`);
  assert.ok(model.url?.startsWith("http"), `${model.name} needs URL`);
}

for (const benchmark of data.benchmarks) {
  assert.ok(benchmark.name, "benchmark needs name");
  assert.ok(benchmark.year, `${benchmark.name} needs year`);
  assert.ok(benchmark.group, `${benchmark.name} needs group`);
  assert.ok(benchmark.skill, `${benchmark.name} needs tested skill`);
  assert.ok(benchmark.note, `${benchmark.name} needs note`);
  assert.ok(benchmark.url?.startsWith("http"), `${benchmark.name} needs URL`);
}

for (const ref of data.references) {
  assert.ok(ref.title, "reference needs title");
  assert.ok(ref.year, `${ref.title} needs year`);
  assert.ok(ref.type, `${ref.title} needs type`);
  assert.ok(ref.group, `${ref.title} needs group`);
  assert.ok(ref.url?.startsWith("http"), `${ref.title} needs URL`);
  assert.ok(ref.value, `${ref.title} needs learning value`);
}

function hasAnchor(markup, href, text) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<a\\b[^>]*href=["']${escapedHref}["'][^>]*>[\\s\\S]*?${escapedText}[\\s\\S]*?</a>`, "s").test(markup);
}

const html = await readFile(indexPath, "utf8");
assert.ok(hasAnchor(html, "#paradigm-diagrams", "范式图"), "top navigation should expose paradigm diagrams directly");
assert.ok(hasAnchor(html, "#paradigm-diagram-gallery", "看范式图"), "hero action should jump directly to the rendered diagram gallery");
assert.ok(html.includes("./data.js?v=20260630-diagrams"), "data script should use the diagram cache buster");
assert.ok(html.includes("./app.js?v=20260630-diagrams"), "app script should use the diagram cache buster");
const siteHtml = await readFile(siteIndexPath, "utf8");
assert.ok(hasAnchor(siteHtml, "./VLM/#paradigm-diagram-gallery", "VLM 多模态大模型学习地图"), "site homepage should deep-link the VLM card to the diagram gallery");
assert.ok(siteHtml.includes("9 张范式图"), "site homepage should advertise VLM paradigm diagrams");
for (const group of data.tocGroups) {
  for (const item of group.items) {
    assert.ok(html.includes(`id="${item.target}"`), `toc target #${item.target} should exist in index`);
  }
}

for (const id of [
  "contents",
  "page-toc",
  "principles",
  "learning-path",
  "families",
  "paradigm-diagrams",
  "paradigm-diagram-gallery",
  "family-tabs",
  "family-detail",
  "model-atlas",
  "model-search",
  "unified-models",
  "benchmark-map",
  "reference-grid",
  "glossary-list"
]) {
  assert.ok(html.includes(id), `index should expose #${id}`);
}

const app = await readFile(appPath, "utf8");
for (const fn of [
  "renderToc",
  "renderPrinciples",
  "renderLearningPath",
  "renderParadigmDiagrams",
  "renderFamilyTabs",
  "renderFamilyDetail",
  "renderModelAtlas",
  "renderUnifiedModels",
  "renderBenchmarkMap",
  "renderReferences",
  "renderGlossary",
  "applyModelSearch"
]) {
  assert.ok(app.includes(fn), `app should include ${fn}`);
}

const styles = await readFile(stylePath, "utf8");
for (const className of [
  "hero",
  "toc-card",
  "principle-grid",
  "learning-path",
  "paradigm-diagram-gallery",
  "paradigm-diagram-card",
  "diagram-node",
  "diagram-edge",
  "family-tabs",
  "model-grid",
  "unified-grid",
  "benchmark-groups",
  "reference-card",
  "glossary-grid"
]) {
  assert.ok(styles.includes(className), `styles should include ${className}`);
}

assert.ok(!html.includes('id="bagel"'), "BAGEL should not have a dedicated page section");
assert.ok(!app.includes("renderBagelCase"), "app should not render a dedicated BAGEL section");

console.log(`OK: ${data.families.length} families, ${data.keyModels.length} models, ${data.benchmarks.length} benchmarks, ${data.references.length} references`);
