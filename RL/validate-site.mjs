import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = ["index.html", "styles.css", "script.js"];
const requiredSections = [
  "roadmap",
  "rl-foundations",
  "ppo",
  "dpo",
  "grpo",
  "llm-rl",
  "robot-rl",
  "offline-rl",
  "diffusion-vla",
  "real-robot",
  "cheatsheet",
  "glossary",
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

const indexPath = path.join(root, "index.html");
const html = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";

for (const id of requiredSections) {
  if (!html.includes(`id="${id}"`)) {
    failures.push(`Missing section anchor: #${id}`);
  }
}

const checks = [
  ["PPO formula", /L\^\{CLIP\}|clip\(r_t/i],
  ["DPO formula", /L_\{DPO\}|chosen|rejected/i],
  ["GRPO formula", /A_i\s*=|Group Relative|组内/i],
  ["SAC entropy objective", /SAC|entropy|alpha/i],
  ["VLA real robot workflow", /VLA|真机|安全/i],
  ["inline SVG diagrams", /<svg[\s>]/i],
  ["search input", /id="searchInput"/i],
  ["interactive cards", /data-tags=/i],
  ["glossary terms", /class="term"/i],
];

for (const [label, pattern] of checks) {
  if (!pattern.test(html)) {
    failures.push(`Missing content check: ${label}`);
  }
}

const cardCount = (html.match(/class="algo-card/g) || []).length;
if (cardCount < 12) {
  failures.push(`Expected at least 12 algorithm cards, found ${cardCount}`);
}

const diagramCount = (html.match(/class="diagram/g) || []).length;
if (diagramCount < 7) {
  failures.push(`Expected at least 7 diagrams, found ${diagramCount}`);
}

const termCount = (html.match(/class="term"/g) || []).length;
if (termCount < 40) {
  failures.push(`Expected at least 40 glossary terms, found ${termCount}`);
}

const cssPath = path.join(root, "styles.css");
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
const scriptPath = path.join(root, "script.js");
const script = fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, "utf8") : "";
if (!/\.formula\s+pre\s*\{[\s\S]*display:\s*none;/.test(css)) {
  failures.push("Rendered formula blocks must hide raw <pre> source by default.");
}

if (!script.includes("renderFormulaViews()")) {
  failures.push("Formula blocks must generate readable formula views from source.");
}

for (const requiredClass of ["sum-symbol", "script-wrap", "script-sup", "script-sub"]) {
  if (!script.includes(requiredClass) || !css.includes(requiredClass)) {
    failures.push(`Formula renderer must support ${requiredClass}.`);
  }
}

if (!script.includes("sum(?![A-Za-z])") || !script.includes('"Σ"')) {
  failures.push("Formula renderer must convert plain sum tokens to Σ.");
}

for (const rawSvgText of ["action a_t", "reward r_t", "s_{t+1}"]) {
  if (html.includes(rawSvgText)) {
    failures.push(`SVG labels must use real subscript markup, found raw text: ${rawSvgText}`);
  }
}

if (failures.length) {
  console.error("Validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Validation passed: static RL manual has required files, sections, diagrams, formulas, and glossary.");
