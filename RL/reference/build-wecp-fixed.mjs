import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(here, "wecp-rl-interview.extract.md");
const outputPath = path.join(here, "wecp-rl-interview-fixed.html");
const sourceUrl = "https://www.wecreateproblems.com/interview-questions/reinforcement-learning-interview-questions";

const sectionMeta = {
  Beginner: { zh: "基础", className: "beginner" },
  Intermediate: { zh: "进阶", className: "intermediate" },
  Experienced: { zh: "经验", className: "experienced" },
};

let fixedFormulaCount = 0;
let fixedTableCount = 0;

const raw = await readFile(inputPath, "utf8");
const sections = parseQuestions(raw);
const cards = sections.flatMap((section) =>
  section.questions.map((question) => ({ section: section.name, ...question })),
);

const html = renderPage(sections, cards);
await writeFile(outputPath, html, "utf8");

console.log(`Generated ${outputPath}`);
console.log(`Questions: ${cards.length}`);
console.log(`Formula fixes: ${fixedFormulaCount}`);
console.log(`Table fixes: ${fixedTableCount}`);

function parseQuestions(markdown) {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  const start = lines.findIndex((line) => line === "### Beginner (Q&A)");
  if (start < 0) {
    throw new Error("Could not find Q&A start marker.");
  }
  const end = lines.findIndex((line, index) => index > start && line === "WeCP Team");
  const qaLines = lines.slice(start, end > start ? end : undefined);

  const parsed = [];
  let currentSection = null;
  let currentQuestion = null;

  for (const line of qaLines) {
    if (!line) continue;

    const sectionMatch = line.match(/^###\s+(Beginner|Intermediate|Experienced)\s+\(Q&A\)$/);
    if (sectionMatch) {
      currentSection = { name: sectionMatch[1], questions: [] };
      parsed.push(currentSection);
      currentQuestion = null;
      continue;
    }

    const questionMatch = line.match(/^###\s+(\d+)\.\s+(.+)$/);
    if (questionMatch && currentSection) {
      currentQuestion = {
        number: Number(questionMatch[1]),
        title: cleanupText(questionMatch[2]),
        body: [],
      };
      currentSection.questions.push(currentQuestion);
      continue;
    }

    if (currentQuestion) {
      currentQuestion.body.push(cleanupText(line));
    }
  }

  return parsed;
}

function renderPage(sections, allCards) {
  const stats = sections
    .map((section) => `${sectionMeta[section.name].zh} ${section.questions.length}`)
    .join(" / ");
  const renderedSections = sections.map(renderSection).join("\n");
  const renderedToc = renderToc(sections);
  const formulaFixes = fixedFormulaCount;
  const tableFixes = fixedTableCount;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RL Interview Q&A - WeCP Local Fixed</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --panel: #ffffff;
      --panel-soft: #eef3f8;
      --ink: #17202c;
      --muted: #637082;
      --line: #d9e2ec;
      --blue: #2457a6;
      --green: #23745b;
      --amber: #936018;
      --red: #a54444;
      --shadow: 0 14px 35px rgba(23, 32, 44, 0.08);
      color-scheme: light;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background:
        linear-gradient(180deg, #eaf0f8 0, rgba(234, 240, 248, 0) 310px),
        var(--bg);
      color: var(--ink);
      line-height: 1.65;
    }

    a { color: inherit; }
    .shell {
      display: grid;
      grid-template-columns: minmax(230px, 300px) minmax(0, 1fr);
      min-height: 100vh;
    }

    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: auto;
      border-right: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.86);
      backdrop-filter: blur(12px);
      padding: 24px 18px;
    }

    .brand {
      display: grid;
      gap: 4px;
      margin-bottom: 20px;
    }
    .brand strong { font-size: 18px; letter-spacing: 0; }
    .brand span { color: var(--muted); font-size: 13px; }

    .source {
      display: block;
      color: var(--blue);
      font-size: 13px;
      overflow-wrap: anywhere;
      margin: 10px 0 18px;
    }

    .toc-section {
      margin: 14px 0;
    }
    .toc-section h2 {
      color: var(--muted);
      font-size: 12px;
      letter-spacing: 0;
      margin: 0 0 8px;
      text-transform: uppercase;
    }
    .toc-section a {
      display: block;
      padding: 7px 9px;
      border-radius: 6px;
      color: #304052;
      font-size: 13px;
      line-height: 1.35;
      text-decoration: none;
    }
    .toc-section a:hover { background: var(--panel-soft); color: var(--blue); }

    main {
      max-width: 1180px;
      width: 100%;
      padding: 36px clamp(18px, 4vw, 48px) 70px;
    }

    .hero {
      display: grid;
      gap: 18px;
      margin-bottom: 22px;
    }
    .kicker {
      color: var(--blue);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    h1 {
      max-width: 780px;
      font-size: clamp(30px, 5vw, 54px);
      line-height: 1.05;
      letter-spacing: 0;
      margin: 0;
    }
    .intro {
      max-width: 820px;
      color: #405064;
      font-size: 16px;
      margin: 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin: 8px 0 18px;
    }
    .stat {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.82);
      padding: 12px;
      box-shadow: 0 8px 22px rgba(23, 32, 44, 0.05);
    }
    .stat b { display: block; font-size: 20px; line-height: 1.1; }
    .stat span { color: var(--muted); font-size: 12px; }

    .controls {
      position: sticky;
      top: 0;
      z-index: 2;
      display: grid;
      grid-template-columns: minmax(210px, 1fr) auto auto;
      gap: 10px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      padding: 10px;
      box-shadow: var(--shadow);
      margin: 22px 0 24px;
    }

    .search {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px 12px;
      color: var(--ink);
      background: #fff;
      font: inherit;
      min-width: 0;
    }

    .chips, .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      justify-content: flex-end;
    }
    button {
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fff;
      color: #243243;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 8px 10px;
      white-space: nowrap;
    }
    button:hover { border-color: #b4c3d4; background: #f8fbfe; }
    button.active { background: #183a67; color: #fff; border-color: #183a67; }

    .section-title {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin: 34px 0 12px;
    }
    .section-title h2 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0;
    }
    .section-title span { color: var(--muted); font-size: 13px; }

    .qa-list {
      display: grid;
      gap: 12px;
    }

    details.qa-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      box-shadow: 0 8px 22px rgba(23, 32, 44, 0.05);
      overflow: hidden;
    }

    details.qa-card[hidden] { display: none; }

    summary {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 15px 17px;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker { display: none; }
    .num {
      display: inline-grid;
      place-items: center;
      min-width: 34px;
      height: 26px;
      border-radius: 5px;
      background: var(--panel-soft);
      color: var(--blue);
      font-weight: 700;
      font-size: 13px;
    }
    .question-title {
      font-weight: 720;
      line-height: 1.35;
    }
    .tag {
      border-radius: 999px;
      color: #fff;
      font-size: 12px;
      padding: 4px 8px;
    }
    .tag.beginner { background: var(--green); }
    .tag.intermediate { background: var(--amber); }
    .tag.experienced { background: var(--red); }

    .answer {
      border-top: 1px solid var(--line);
      padding: 10px 18px 18px;
      color: #27384b;
    }
    .answer p { margin: 10px 0; }
    .answer ul {
      margin: 8px 0 12px;
      padding-left: 22px;
    }
    .answer li { margin: 5px 0; }
    .answer .label {
      display: inline-block;
      color: #1f4d82;
      font-weight: 760;
    }

    .formula {
      margin: 11px 0;
      border-left: 4px solid #4c86c6;
      border-radius: 6px;
      background: #eef5fc;
      padding: 10px 12px;
      overflow-x: auto;
      color: #0d2f51;
      font-family: "Times New Roman", Cambria, Georgia, "Noto Serif", serif;
      font-size: 18px;
      line-height: 1.55;
      white-space: nowrap;
    }
    .math-line + .math-line {
      margin-top: 4px;
    }
    .math-inline {
      font-family: "Times New Roman", Cambria, Georgia, "Noto Serif", serif;
      font-size: 1.03em;
      white-space: nowrap;
    }
    .formula sub,
    .formula sup,
    .math-inline sub,
    .math-inline sup {
      font-size: 0.68em;
      line-height: 0;
    }
    .formula small {
      display: block;
      color: #58718d;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      margin-bottom: 4px;
      white-space: normal;
    }
    code.inline {
      border-radius: 4px;
      background: #eef3f8;
      padding: 1px 4px;
      color: #183a67;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 0.92em;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      font-size: 14px;
    }
    th, td {
      border-bottom: 1px solid var(--line);
      padding: 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f0f5fa; color: #23354a; }
    tr:last-child td { border-bottom: 0; }

    .empty {
      display: none;
      border: 1px dashed #b4c3d4;
      border-radius: 8px;
      color: var(--muted);
      padding: 24px;
      text-align: center;
    }

    @media (max-width: 900px) {
      .shell { display: block; }
      .sidebar {
        position: relative;
        height: auto;
        max-height: 330px;
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }
      .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .controls { grid-template-columns: 1fr; }
      .chips, .actions { justify-content: flex-start; }
      summary { grid-template-columns: auto 1fr; }
      .tag { grid-column: 2; width: fit-content; }
    }

    @media print {
      .sidebar, .controls { display: none; }
      .shell { display: block; }
      main { max-width: none; padding: 0; }
      details.qa-card { break-inside: avoid; box-shadow: none; }
      details.qa-card:not([open]) .answer { display: block; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <strong>RL 面试问答本地修正版</strong>
        <span>公式修复 / 问答折叠 / 本地离线阅读</span>
      </div>
      <a class="source" href="${sourceUrl}">原始来源：WeCP Reinforcement Learning Interview Questions</a>
      ${renderedToc}
    </aside>

    <main>
      <section class="hero">
        <div class="kicker">Local fixed reference</div>
        <h1>Reinforcement Learning Interview Questions and Answers</h1>
        <p class="intro">这份页面从本地抽取的 WeCP 问答生成，只用于你本机参考。修复重点是把混在一起的 Unicode、LaTeX 和渲染残片整理成可读公式，并把若干挤成一行的对比内容改成表格。</p>
        <div class="summary-grid">
          <div class="stat"><b>${allCards.length}</b><span>道可见 Q&A</span></div>
          <div class="stat"><b>${formulaFixes}</b><span>处公式修复</span></div>
          <div class="stat"><b>${tableFixes}</b><span>个对比表</span></div>
          <div class="stat"><b>${stats}</b><span>按难度分组</span></div>
        </div>
      </section>

      <section class="controls" aria-label="Filters">
        <input id="search" class="search" type="search" placeholder="搜索问题、算法或关键词，比如 PPO / Bellman / offline RL">
        <div class="chips" aria-label="Difficulty">
          <button class="active" data-filter="all" type="button">全部</button>
          <button data-filter="Beginner" type="button">基础</button>
          <button data-filter="Intermediate" type="button">进阶</button>
          <button data-filter="Experienced" type="button">经验</button>
        </div>
        <div class="actions">
          <button id="expandAll" type="button">展开</button>
          <button id="collapseAll" type="button">折叠</button>
        </div>
      </section>

      ${renderedSections}
      <div id="empty" class="empty">没有匹配的题目，换个关键词试试。</div>
    </main>
  </div>

  <script>
    const cards = Array.from(document.querySelectorAll(".qa-card"));
    const search = document.querySelector("#search");
    const empty = document.querySelector("#empty");
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    let activeFilter = "all";

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      for (const card of cards) {
        const section = card.dataset.section;
        const text = card.dataset.search;
        const matchesFilter = activeFilter === "all" || activeFilter === section;
        const matchesQuery = !query || text.includes(query);
        const show = matchesFilter && matchesQuery;
        card.hidden = !show;
        if (show) visible += 1;
        if (query && show) card.open = true;
      }
      empty.style.display = visible ? "none" : "block";
    }

    search.addEventListener("input", applyFilters);
    for (const button of filterButtons) {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        for (const other of filterButtons) other.classList.toggle("active", other === button);
        applyFilters();
      });
    }
    document.querySelector("#expandAll").addEventListener("click", () => {
      for (const card of cards) if (!card.hidden) card.open = true;
    });
    document.querySelector("#collapseAll").addEventListener("click", () => {
      for (const card of cards) card.open = false;
    });
  </script>
</body>
</html>`;
}

function renderToc(sections) {
  return sections
    .map((section) => {
      const meta = sectionMeta[section.name];
      const links = section.questions
        .map(
          (question) =>
            `<a href="#${idFor(section.name, question.number)}">${question.number}. ${escapeHtml(question.title)}</a>`,
        )
        .join("");
      return `<nav class="toc-section"><h2>${meta.zh} ${section.questions.length}</h2>${links}</nav>`;
    })
    .join("\n");
}

function renderSection(section) {
  const meta = sectionMeta[section.name];
  return `<section data-section-block="${section.name}">
    <div class="section-title">
      <h2>${meta.zh} Q&A</h2>
      <span>${section.name} · ${section.questions.length} questions</span>
    </div>
    <div class="qa-list">
      ${section.questions.map((question, index) => renderQuestion(section.name, question, index)).join("\n")}
    </div>
  </section>`;
}

function renderQuestion(sectionName, question, index) {
  const meta = sectionMeta[sectionName];
  const id = idFor(sectionName, question.number);
  const searchable = searchTextFor(sectionName, question);
  return `<details id="${id}" class="qa-card" data-section="${sectionName}" data-search="${escapeAttr(searchable)}" ${index < 2 ? "open" : ""}>
    <summary>
      <span class="num">${question.number}</span>
      <span class="question-title">${escapeHtml(question.title)}</span>
      <span class="tag ${meta.className}">${meta.zh}</span>
    </summary>
    <div class="answer">
      ${renderBody(question.body, question.title)}
    </div>
  </details>`;
}

function renderBody(lines, title) {
  const blocks = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      blocks.push(`<ul>${list.join("")}</ul>`);
      list = [];
    }
  };

  for (const rawLine of lines) {
    const table = renderTable(rawLine, title);
    if (table) {
      flushList();
      blocks.push(table);
      continue;
    }

    const formula = renderFormula(rawLine, title);
    if (formula) {
      flushList();
      blocks.push(formula);
      continue;
    }

    if (rawLine.startsWith("- ")) {
      list.push(`<li>${renderInline(rawLine.slice(2))}</li>`);
      continue;
    }

    flushList();
    blocks.push(`<p>${renderInline(rawLine)}</p>`);
  }

  flushList();
  return blocks.join("\n");
}

function renderFormula(line, title) {
  const text = decodeEntities(cleanupText(line));
  const lowerTitle = title.toLowerCase();
  const block = (math, label = "") => {
    fixedFormulaCount += 1;
    return `<div class="formula">${label ? `<small>${escapeHtml(label)}</small>` : ""}${renderMath(math)}</div>`;
  };
  const paraAndBlock = (prefix, math, label = "") => {
    fixedFormulaCount += 1;
    return `<p>${renderInline(prefix)}</p><div class="formula">${label ? `<small>${escapeHtml(label)}</small>` : ""}${renderMath(math)}</div>`;
  };

  if (text.includes("π(a∣s)=P(At=a∣St=s)")) return block("π(a | s) = P(A_t = a | S_t = s)", "Stochastic policy");
  if (text.includes("τ=(s0,a0,r1,s1,a1,r2")) return block("τ = (s_0, a_0, r_1, s_1, a_1, r_2, ..., s_T)", "Trajectory / rollout");
  if (text === "(S,A,P,R,γ)(S, A, P, R, \\gamma)(S,A,P,R,γ)") return block("M = (S, A, P, R, γ)", "MDP tuple");
  if (text.includes("P(st+1∣st,at,st−1")) {
    return block("P(s_{t+1} | s_t, a_t, s_{t-1}, a_{t-1}, ..., s_0, a_0) = P(s_{t+1} | s_t, a_t)", "Markov property");
  }
  if (text.includes("Vπ(s)=Eπ[Gt∣St=s]")) {
    return block("V^π(s) = E_π[G_t | S_t = s] = E_π[Σ_{k=0}^∞ γ^k R_{t+k+1} | S_t = s]", "State value function");
  }
  if (text.includes("Qπ(s,a)=Eπ[Gt∣St=s,At=a]")) {
    return block("Q^π(s, a) = E_π[G_t | S_t = s, A_t = a]", "Action value function");
  }
  if (text.includes("Qπ(s,a)=Eπ[∑k=0∞γk")) {
    return block("Q^π(s, a) = E_π[Σ_{k=0}^∞ γ^k R_{t+k+1} | S_t = s, A_t = a]", "Q-value");
  }
  if (text.includes("Q∗(s,a)=E[Rt+1+γmax")) {
    return block("Q*(s, a) = E[R_{t+1} + γ max_{a'} Q*(S_{t+1}, a') | S_t = s, A_t = a]", "Bellman optimality for Q");
  }
  if (text.includes("π∗(s)=arg")) return block("π*(s) = arg max_a Q*(s, a)", "Greedy optimal policy");
  if (text.includes("at={randomactionwithprobability")) {
    return block("a_t = random action, with probability ε\n    = arg max_a Q(s_t, a), with probability 1 - ε", "ε-greedy policy");
  }
  if (text.includes("Q(st,at)←Q(st,at)+α")) {
    return block("Q(s_t, a_t) ← Q(s_t, a_t) + α [r_{t+1} + γ max_a Q(s_{t+1}, a) - Q(s_t, a_t)]", "Q-learning update");
  }
  if (text.includes("δt=rt+1+γV(st+1)−V(st)")) {
    return block("δ_t = r_{t+1} + γ V(s_{t+1}) - V(s_t)", "TD error");
  }
  if (text.includes("V(st)←V(st)+αδt")) return block("V(s_t) ← V(s_t) + α δ_t", "TD value update");
  if (text.includes("V(s)=1N(s)")) {
    return block("V(s) = (1 / N(s)) Σ_{i=1}^{N(s)} G_i", "Monte Carlo estimate");
  }
  if (text.includes("Q(s,a)←Q(s,a)+α[r+γmax")) {
    return block("Q(s, a) ← Q(s, a) + α [r + γ max_{a'} Q(s', a') - Q(s, a)]", "Q-learning update");
  }
  if (text.includes("Q(s,a)←Q(s,a)+α[r+γQ")) {
    return block("Q(s, a) ← Q(s, a) + α [r + γ Q(s', a') - Q(s, a)]", "SARSA update");
  }
  if (text.includes("Vπ(s)=Ea∼π")) {
    return block("V^π(s) = E_{a~π, s'~P}[r(s, a) + γ V^π(s')]", "Bellman expectation equation");
  }
  if (text.includes("V∗(s)=max") && text.includes("Es′")) {
    return block("V*(s) = max_a E_{s'}[r(s, a) + γ V*(s')]", "Optimal value function");
  }
  if (text.includes("V∗(s)=max") && text.includes("∑s′P")) {
    return block("V*(s) = max_a [R(s, a) + γ Σ_{s'} P(s' | s, a) V*(s')]", "Bellman optimality equation");
  }
  if (text.includes("Gt=rt+1+γrt+2")) {
    return block("G_t = r_{t+1} + γ r_{t+2} + γ² r_{t+3} + ...", "Discounted return");
  }
  if (text.includes("Qπ(s,π′(s))")) {
    return block("Q^π(s, π'(s)) ≥ V^π(s)", "Policy improvement theorem");
  }
  if (text.includes("π′(s)=arg")) return block("π'(s) = arg max_a Q^π(s, a)", "Policy improvement step");
  if (text.includes("V(s)←max")) {
    return block("V(s) ← max_a [R(s, a) + γ Σ_{s'} P(s' | s, a) V(s')]", "Value iteration update");
  }
  if (text.includes("π∗(s)=arg") && text.includes("R(s,a)+γ")) {
    return block("π*(s) = arg max_a [R(s, a) + γ Σ_{s'} P(s' | s, a) V*(s')]", "Policy from value iteration");
  }
  if (text.includes("Q(s,a)≈fθ")) return block("Q(s, a) ≈ f_θ(s, a)", "Function approximation");
  if (text.includes("y=r+γmax") && text.includes("θ−")) {
    return block("y = r + γ max_{a'} Q(s', a'; θ^-)", "DQN target");
  }
  if (text.includes("y=r+γmax") && text.includes("θ)")) {
    return block("y = r + γ max_{a'} Q(s', a'; θ)", "DQN target with online network");
  }
  if (text.includes("a∗=arg")) return block("a* = arg max_a Q(s', a; θ)", "Double DQN action selection");
  if (text.includes("y=r+γQ(s′,a∗")) return block("y = r + γ Q(s', a*; θ^-)", "Double DQN target evaluation");
  if (text.includes("Q(s,a)=V(s)+(A(s,a)")) {
    return block("Q(s, a) = V(s) + [A(s, a) - (1 / |A|) Σ_{a'} A(s, a')]", "Dueling DQN aggregation");
  }
  if (text.includes("δ=∣r+γmax")) return block("δ = |r + γ max_a Q(s', a) - Q(s, a)|", "TD-error priority");
  if (text.includes("A(s,a)=Q(s,a)−V(s)")) return block("A(s, a) = Q(s, a) - V(s)", "Advantage function");
  if (text.includes("LCLIP(θ)=")) {
    return block("L^CLIP(θ) = E_t[min(r_t(θ) A_t, clip(r_t(θ), 1 - ε, 1 + ε) A_t)]", "PPO clipped objective");
  }
  if (text.includes("rt(θ)=πθ(at∣st)")) {
    return block("r_t(θ) = π_θ(a_t | s_t) / π_{θ_old}(a_t | s_t)", "PPO probability ratio");
  }
  if (text.includes("max⁡θEt[πθ")) {
    return block("max_θ E_t[(π_θ(a_t | s_t) / π_{θ_old}(a_t | s_t)) A_t]\nsubject to D_KL(π_{θ_old}, π_θ) ≤ δ", "TRPO constrained objective");
  }
  if (text.includes("J(π)=∑tE")) {
    return block("J(π) = Σ_t E_{(s_t, a_t)~π}[r(s_t, a_t) + α H(π(· | s_t))]", "SAC maximum-entropy objective");
  }
  if (text.includes("H(π)=−∑aπ")) {
    return block("H(π) = -Σ_a π(a | s) log π(a | s)", "Policy entropy");
  }
  if (text.includes("∇θJ(θ)=Eπ[∇θlog")) {
    return block("∇_θ J(θ) = E_π[∇_θ log π_θ(a | s) Q^π(s, a)]", "Policy gradient");
  }
  if (text.includes("θ←θ+α∇θlog")) {
    return block("θ ← θ + α ∇_θ log π_θ(a_t | s_t) G_t", "REINFORCE update");
  }
  if (text.includes("∇θJ(θ)=E[∇θlog")) {
    return block("∇_θ J(θ) = E[∇_θ log π_θ(a | s) (G_t - b(s))]", "Policy gradient with baseline");
  }
  if (text.includes("A^tGAE")) {
    return block("Â_t^{GAE(γ, λ)} = Σ_{l=0}^∞ (γλ)^l δ_{t+l}", "Generalized Advantage Estimation");
  }
  if (text.includes("where δt=rt+γV")) {
    return paraAndBlock("where", "δ_t = r_t + γ V(s_{t+1}) - V(s_t)", "GAE temporal-difference residual");
  }
  if (lowerTitle.includes("inverse reinforcement learning") && text.includes("τ=(s0,a0")) {
    return block("τ = (s_0, a_0, s_1, a_1, ...),  learn R(s, a)", "IRL from expert trajectories");
  }

  return null;
}

function renderTable(line, title) {
  const text = decodeEntities(cleanupText(line));
  const table = (headers, rows) => {
    fixedTableCount += 1;
    return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
  };

  if (text.startsWith("AspectQ-LearningSARSA")) {
    return table(["Aspect", "Q-Learning", "SARSA"], [
      ["Type", "Off-policy", "On-policy"],
      ["Update rule", "Q(s, a) ← Q(s, a) + α [r + γ max_{a'} Q(s', a') - Q(s, a)]", "Q(s, a) ← Q(s, a) + α [r + γ Q(s', a') - Q(s, a)]"],
      ["Policy used for update", "Greedy best action", "Actual policy action, often ε-greedy"],
      ["Exploration handling", "Ignores exploratory action in target", "Accounts for exploratory action"],
      ["Best fit", "Deterministic or low-risk settings", "Stochastic or high-risk settings"],
    ]);
  }
  if (text.startsWith("AspectModel-Free RLModel-Based RL")) {
    return table(["Aspect", "Model-Free RL", "Model-Based RL"], [
      ["Environment knowledge", "No transition/reward model", "Learns or uses transition and reward model"],
      ["Examples", "Q-learning, SARSA, DQN", "Dyna-Q, MCTS, AlphaZero"],
      ["Approach", "Learns values or policies from experience", "Builds a model to simulate and plan"],
      ["Sample efficiency", "Usually lower", "Usually higher if the model is accurate"],
      ["Risk", "More interaction needed", "Model bias can hurt performance"],
    ]);
  }
  if (text.startsWith("ComponentActorCritic")) {
    return table(["Component", "Actor", "Critic"], [
      ["Purpose", "Selects actions", "Evaluates actions"],
      ["Function", "Policy network π_θ(a | s)", "Value network V(s) or Q(s, a)"],
      ["Output", "Action distribution or action", "Expected return / value"],
      ["Learning signal", "Policy gradients from critic", "TD error or value loss"],
      ["Role", "Improves behavior", "Reduces variance and guides updates"],
    ]);
  }
  if (text.startsWith("AspectPPOA3C")) {
    return table(["Aspect", "PPO", "A3C"], [
      ["Policy update", "Clipped surrogate objective", "Gradient ascent with advantage"],
      ["Sample efficiency", "Higher; can reuse trajectories for multiple epochs", "Lower; on-policy samples are typically single-use"],
      ["Stability", "Very stable, less sensitive", "Can be noisy and hyperparameter-sensitive"],
      ["Parallelism", "Synchronous or asynchronous implementations", "Asynchronous multi-agent execution"],
      ["Implementation", "Simpler than TRPO", "Requires careful async handling"],
    ]);
  }
  if (text.startsWith("AspectDDPGTD3")) {
    return table(["Aspect", "DDPG", "TD3"], [
      ["Critics", "Single critic", "Twin critics"],
      ["Policy update", "Actor updated every step", "Actor updated less frequently"],
      ["Target smoothing", "No", "Adds target action noise"],
      ["Overestimation bias", "Often present", "Reduced"],
      ["Best fit", "Continuous control with careful tuning", "More robust continuous control"],
    ]);
  }
  if (text.startsWith("AspectDiscrete Action SpaceContinuous Action Space")) {
    return table(["Aspect", "Discrete action space", "Continuous action space"], [
      ["Definition", "Finite set of actions", "Real-valued action range"],
      ["Examples", "Move left/right, jump, choose attack", "Steering angle, throttle, robot joints"],
      ["Algorithms", "Q-learning, DQN, A3C", "DDPG, TD3, SAC, continuous PPO"],
      ["Policy representation", "Probability over actions", "Distribution parameters, often Gaussian"],
      ["Complexity", "Easier to enumerate", "Requires function approximation and careful exploration"],
    ]);
  }
  if (text.startsWith("AspectModel-Based RLModel-Free RL")) {
    return table(["Aspect", "Model-Based RL", "Model-Free RL"], [
      ["Environment knowledge", "Learns or uses transition/reward model", "No model; learns from interaction"],
      ["Planning", "Uses model to simulate future actions", "No explicit planning"],
      ["Sample efficiency", "Higher", "Lower"],
      ["Compute", "More planning/model cost", "Less computation per step"],
      ["Examples", "Dyna-Q, MuZero", "DQN, PPO, SAC"],
    ]);
  }
  if (text.startsWith("TypeDescriptionExamples Cooperative")) {
    return table(["Type", "Description", "Examples"], [
      ["Cooperative", "Agents maximize shared reward", "Robot teams, multi-agent path planning"],
      ["Competitive", "Agents compete; rewards are often zero-sum", "Chess, poker, StarCraft"],
      ["Mixed", "Some cooperation within teams and competition between teams", "Soccer simulation, MOBA games"],
    ]);
  }

  return null;
}

function cleanupText(value) {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\u200b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderInline(value) {
  const normalized = normalizeInlineMath(cleanupText(value));
  const labelMatch = normalized.match(/^([A-Z][A-Za-z /-]{2,32}:)\s*(.*)$/);
  if (labelMatch) {
    return `<span class="label">${escapeHtml(labelMatch[1])}</span> ${renderMathInline(labelMatch[2])}`;
  }
  return renderMathInline(normalized).replace(/`([^`]+)`/g, "<code class=\"inline\">$1</code>");
}

function renderMath(math) {
  return String(math)
    .split("\n")
    .map((line) => `<div class="math-line">${renderMathLine(line)}</div>`)
    .join("");
}

function renderMathInline(text) {
  return renderMathLine(text);
}

function renderMathLine(value) {
  const input = String(value);
  let html = "";
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if ((char === "_" || char === "^") && index + 1 < input.length) {
      const parsed = readScriptToken(input, index + 1);
      if (parsed.value) {
        html += char === "_"
          ? `<sub>${renderMathLine(parsed.value)}</sub>`
          : `<sup>${renderMathLine(parsed.value)}</sup>`;
        index = parsed.end;
        continue;
      }
    }
    html += escapeHtml(char);
  }
  return html;
}

function readScriptToken(input, start) {
  if (input[start] === "{") {
    let depth = 1;
    let end = start + 1;
    for (; end < input.length; end += 1) {
      if (input[end] === "{") depth += 1;
      if (input[end] === "}") depth -= 1;
      if (depth === 0) break;
    }
    return {
      value: input.slice(start + 1, end),
      end: Math.min(end, input.length - 1),
    };
  }

  let end = start;
  const first = input[start];
  if (/[A-Za-z0-9+\-=∞πθλδγαεμ'*-]/u.test(first)) {
    end += 1;
    if (/[A-Za-z]/u.test(first)) {
      while (end < input.length && /[A-Za-z0-9]/u.test(input[end])) end += 1;
    }
  }

  return { value: input.slice(start, end), end: Math.max(start, end - 1) };
}

function normalizeInlineMath(value) {
  return value
    .replaceAll("a=π(s)a = \\pi(s)a=π(s)", "a = π(s)")
    .replaceAll("P(a∣s)P(a|s)P(a∣s)", "P(a | s)")
    .replaceAll("π(a∣s)\\pi(a|s)π(a∣s)", "π(a | s)")
    .replaceAll("π\\piπ", "π")
    .replaceAll("πθ(a∣s)\\pi_\\theta(a|s)πθ(a∣s)", "π_θ(a | s)")
    .replaceAll("πθ(a∣s)\\pi_\\theta(a|s)πθ​(a∣s)", "π_θ(a | s)")
    .replaceAll("πi(ai∣s)\\pi_i(a_i|s)πi(ai∣s)", "π_i(a_i | s)")
    .replaceAll("πi(ai∣s)\\pi_i(a_i|s)πi​(ai​∣s)", "π_i(a_i | s)")
    .replaceAll("Q(s,a)Q(s, a)Q(s,a)", "Q(s, a)")
    .replaceAll("Q(s,a)Q(s,a)Q(s,a)", "Q(s, a)")
    .replaceAll("q(s,a)q(s, a)q(s,a)", "Q(s, a)")
    .replaceAll("q(s,a)q(s,a)q(s,a)", "Q(s, a)")
    .replaceAll("V(s)V(s)V(s)", "V(s)")
    .replaceAll("v(s)v(s)v(s)", "V(s)")
    .replaceAll("A(s,a)A(s,a)A(s,a)", "A(s, a)")
    .replaceAll("a(s,a)a(s,a)a(s,a)", "A(s, a)")
    .replaceAll("b(s)b(s)b(s)", "b(s)")
    .replaceAll("Q(s,a;θ)Q(s,a;\\theta)Q(s,a;θ)", "Q(s, a; θ)")
    .replaceAll("Q(s,a∣θQ)Q(s,a|\\theta^Q)Q(s,a∣θQ)", "Q(s, a | θ^Q)")
    .replaceAll("a=μ(s∣θμ)a = \\mu(s|\\theta^\\mu)a=μ(s∣θμ)", "a = μ(s | θ^μ)")
    .replaceAll("θ\\thetaθ", "θ")
    .replaceAll("θ−\\theta^-θ−", "θ^-")
    .replaceAll("γ\\gammaγ", "γ")
    .replaceAll("α\\alphaα", "α")
    .replaceAll("GtG_tGt", "G_t")
    .replaceAll("GtG_tGt​", "G_t")
    .replaceAll("GiG_iGi", "G_i")
    .replaceAll("G_iG_iGi", "G_i")
    .replaceAll("sss", "s")
    .replaceAll("aaa", "a")
    .replaceAll("rrr", "r")
    .replaceAll("s′s's′", "s'")
    .replaceAll("a′a'a′", "a'")
    .replaceAll("(s,a,r,s′)(s, a, r, s')", "(s, a, r, s')")
    .replaceAll("(s,a,r,s′)(s,a,r,s')", "(s, a, r, s')")
    .replaceAll("(s,a)(s, a)(s,a)", "(s, a)")
    .replaceAll("Qπ(s,a)Q^{\\pi}(s, a)Qπ(s,a)", "Q^π(s, a)")
    .replaceAll("Qπ(s,a)Q^{π}(s, a)Qπ(s,a)", "Q^π(s, a)")
    .replaceAll("qπ(s,a)q^{\\pi}(s, a)qπ(s,a)", "Q^π(s, a)")
    .replaceAll("Vπ(s)V^{\\pi}(s)Vπ(s)", "V^π(s)")
    .replaceAll("Vπ(s)V^{π}(s)Vπ(s)", "V^π(s)")
    .replaceAll("vπ(s)v^{\\pi}(s)vπ(s)", "V^π(s)")
    .replaceAll("R(s,a)R(s,a)R(s,a)", "R(s, a)")
    .replaceAll("r(s,a)r(s,a)r(s,a)", "R(s, a)")
    .replaceAll("π′\\pi'π′", "π'")
    .replaceAll("π∗\\pi^*π∗", "π*")
    .replaceAll("V∗V^*V∗", "V*")
    .replace(/\s+([,.;:])/g, "$1");
}

function searchTextFor(sectionName, question) {
  return normalizeInlineMath(`${sectionName} ${question.number} ${question.title} ${question.body.join(" ")}`)
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[\\{}_^]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function idFor(section, number) {
  return `${section.toLowerCase()}-${number}`;
}
