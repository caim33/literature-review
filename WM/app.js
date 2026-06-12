(function () {
  const data = window.vlaMapData || globalThis.vlaMapData;
  let selectedRouteId = data.routes[0].id;
  let activeFilter = "all";
  let query = "";

  const byId = (id) => document.getElementById(id);
  const normalize = (text) => String(text || "").toLowerCase();
  const normalizeQuery = (text) => normalize(text)
    .replaceAll("pi", "π")
    .replaceAll("Π", "π");
  const allReferences = () => data.routes.flatMap((route) =>
    route.references.map((reference) => ({ ...reference, route: route.title, routeId: route.id }))
  );
  const scoreRoute = (route, term) => {
    if (!term) return 0;
    const titleText = normalize(`${route.title} ${route.references.map((reference) => reference.title).join(" ")}`);
    const summaryText = normalize(`${route.question} ${route.takeaway}`);
    const bodyText = normalize(`${route.branches.join(" ")} ${route.patterns.join(" ")}`);
    let score = 0;
    if (titleText.includes(term)) score += 6;
    if (summaryText.includes(term)) score += 3;
    if (bodyText.includes(term)) score += 1;
    return score;
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderCounts() {
    byId("route-count").textContent = data.routes.length;
    byId("reference-count").textContent = allReferences().length;
  }

  function renderFoundations() {
    const container = byId("foundation-grid");
    container.replaceChildren();
    data.foundations.forEach((item) => {
      const card = el("article", "foundation-card");
      card.append(el("p", "foundation-term", item.term));
      card.append(el("h3", "", item.analogy));
      card.append(el("p", "", item.meaning));
      card.append(labelText("机器人例子", item.robotExample));
      container.append(card);
    });
  }

  function renderModelComparison() {
    const container = byId("model-comparison");
    container.replaceChildren();
    const table = el("table", "comparison");
    const thead = el("thead");
    const headerRow = el("tr");
    ["比较轴", "Model-free", "Model-based / WM", "机器人启发"].forEach((heading) => headerRow.append(el("th", "", heading)));
    thead.append(headerRow);
    const tbody = el("tbody");
    data.modelFreeVsModelBased.forEach((row) => {
      const tr = el("tr");
      tr.append(el("td", "axis", row.axis));
      tr.append(el("td", "", row.modelFree));
      tr.append(el("td", "", row.modelBased));
      tr.append(el("td", "", row.robotTakeaway));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    container.append(table);
  }

  function renderPredictionTargets() {
    const container = byId("prediction-targets");
    container.replaceChildren();
    data.predictionTargets.forEach((target) => {
      const card = el("article", "target-card");
      card.append(el("h3", "", target.name));
      card.append(labelText("预测", target.predicts));
      card.append(labelText("用途", target.usefulFor));
      card.append(labelText("注意", target.caution));
      container.append(card);
    });
  }

  function renderRobotWorkflow() {
    const container = byId("robot-workflow");
    container.replaceChildren();
    data.robotWorkflow.forEach((item) => {
      const card = el("article", "workflow-step");
      card.append(el("span", "step", item.step));
      const body = el("div");
      body.append(el("h3", "", item.title));
      body.append(el("p", "", item.detail));
      card.append(body);
      container.append(card);
    });
  }

  function renderArchitecture() {
    const container = byId("architecture-diagram");
    container.replaceChildren();
    const section = el("article", "figure-card wide");
    section.append(el("h3", "", data.systemArchitecture.title));
    section.append(renderFigure(data.systemArchitecture, "wide"));
    section.append(el("p", "figure-caption", data.systemArchitecture.caption));
    container.append(section);
  }

  function renderPaperFigures() {
    const container = byId("figure-grid");
    container.replaceChildren();
    data.paperFigures.forEach((figure) => {
      const card = el("article", `figure-card ${figure.cardClass || ""}`.trim());
      card.append(el("p", "figure-source", figure.source));
      card.append(el("h3", "", figure.title));
      card.append(renderOriginalMedia(figure.originalMedia));
      (figure.supportingMedia || []).forEach((media) => card.append(renderOriginalMedia(media, "supporting")));
      card.append(el("p", "simplified-label", "简化读法"));
      card.append(renderFigure(figure, figure.diagramClass || ""));
      card.append(el("p", "figure-thesis", figure.thesis));
      if (figure.detail) {
        card.append(el("p", "figure-detail", figure.detail));
      }
      if (figure.deepDive) {
        card.append(renderDeepDive(figure.deepDive));
      }
      const list = el("ul", "reading-focus");
      figure.readingFocus.forEach((item) => list.append(el("li", "", item)));
      card.append(list);
      container.append(card);
    });
  }

  function renderDeepDive(deepDive) {
    const details = el("details", "paper-deep-dive");
    const summary = el("summary");
    summary.append(el("span", "deep-dive-title", "详细解读"));
    summary.append(el("span", "deep-dive-summary", deepDive.summary));
    details.append(summary);

    const body = el("div", "deep-dive-body");
    deepDive.sections.forEach((section) => {
      const item = el("section", "deep-dive-section");
      item.append(el("h4", "", section.title));
      item.append(el("p", "", section.body));
      body.append(item);
    });
    details.append(body);
    return details;
  }

  function renderOriginalMedia(media, variant) {
    const wrap = el("figure", variant ? `paper-original ${variant}` : "paper-original");
    let node;
    if (media.type === "video") {
      node = document.createElement("video");
      node.className = "paper-original-media";
      node.controls = true;
      node.muted = true;
      node.loop = true;
      node.playsInline = true;
      node.preload = "metadata";
      const source = document.createElement("source");
      source.src = media.src;
      source.type = "video/mp4";
      node.append(source);
    } else {
      node = document.createElement("img");
      node.className = "paper-original-media";
      node.src = media.src;
      node.alt = media.alt;
      node.loading = "lazy";
      node.decoding = "async";
    }
    if (media.type === "video") {
      node.setAttribute("aria-label", media.alt);
    }

    const caption = el("figcaption", "original-caption");
    caption.append(document.createTextNode(media.caption));
    const sourceLink = el("a", "", media.sourceLabel);
    sourceLink.href = media.sourceUrl;
    sourceLink.target = "_blank";
    sourceLink.rel = "noreferrer";
    caption.append(document.createTextNode(" "));
    caption.append(sourceLink);
    wrap.append(node, caption);
    return wrap;
  }

  function renderFigure(figure, variant) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `paper-figure ${variant || ""}`.trim());
    svg.setAttribute("viewBox", figure.viewBox || "0 0 1160 340");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", figure.title || "World model diagram");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", `arrow-${Math.random().toString(36).slice(2)}`);
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", "M0,0 L0,6 L8,3 z");
    arrow.setAttribute("fill", "#62756f");
    marker.append(arrow);
    defs.append(marker);
    svg.append(defs);
    const markerUrl = `url(#${marker.id})`;

    const nodeById = new Map(figure.nodes.map((node) => [node.id, node]));
    (figure.stages || []).forEach((stage) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "figure-stage");
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", stage.x);
      rect.setAttribute("y", stage.y);
      rect.setAttribute("width", stage.w);
      rect.setAttribute("height", stage.h);
      rect.setAttribute("rx", "12");
      group.append(rect);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", stage.x + 14);
      label.setAttribute("y", stage.y + 24);
      label.setAttribute("class", "figure-stage-label");
      label.textContent = stage.label;
      group.append(label);
      svg.append(group);
    });

    figure.edges.forEach((edge) => {
      const [fromId, toId] = Array.isArray(edge) ? edge : [edge.from, edge.to];
      const from = nodeById.get(fromId);
      const to = nodeById.get(toId);
      if (!from || !to) return;
      const fromCenterX = from.x + from.w / 2;
      const fromCenterY = from.y + from.h / 2;
      const toCenterX = to.x + to.w / 2;
      const toCenterY = to.y + to.h / 2;
      let x1;
      let y1;
      let x2;
      let y2;
      if (Math.abs(toCenterX - fromCenterX) >= Math.abs(toCenterY - fromCenterY)) {
        if (toCenterX >= fromCenterX) {
          x1 = from.x + from.w;
          x2 = to.x;
        } else {
          x1 = from.x;
          x2 = to.x + to.w;
        }
        y1 = fromCenterY;
        y2 = toCenterY;
      } else {
        if (toCenterY >= fromCenterY) {
          y1 = from.y + from.h;
          y2 = to.y;
        } else {
          y1 = from.y;
          y2 = to.y + to.h;
        }
        x1 = fromCenterX;
        x2 = toCenterX;
      }
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const horizontal = Math.abs(x2 - x1) >= Math.abs(y2 - y1);
      const mid = Math.max(24, (horizontal ? Math.abs(x2 - x1) : Math.abs(y2 - y1)) / 2);
      const d = horizontal
        ? `M${x1},${y1} C${x1 + Math.sign(x2 - x1 || 1) * mid},${y1} ${x2 - Math.sign(x2 - x1 || 1) * mid},${y2} ${x2},${y2}`
        : `M${x1},${y1} C${x1},${y1 + Math.sign(y2 - y1 || 1) * mid} ${x2},${y2 - Math.sign(y2 - y1 || 1) * mid} ${x2},${y2}`;
      path.setAttribute("d", d);
      path.setAttribute("class", "figure-edge");
      path.setAttribute("marker-end", markerUrl);
      svg.append(path);
      if (!Array.isArray(edge) && edge.label) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", (x1 + x2) / 2);
        label.setAttribute("y", (y1 + y2) / 2 - 8);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "figure-edge-label");
        label.textContent = edge.label;
        svg.append(label);
      }
    });

    figure.nodes.forEach((node) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `figure-node ${node.kind || "model"}`);
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", node.x);
      rect.setAttribute("y", node.y);
      rect.setAttribute("width", node.w);
      rect.setAttribute("height", node.h);
      rect.setAttribute("rx", "8");
      group.append(rect);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", node.x + node.w / 2);
      label.setAttribute("y", node.y + node.h / 2 - (node.note ? 5 : -4));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "figure-label");
      label.textContent = node.label;
      group.append(label);

      if (node.note) {
        const note = document.createElementNS("http://www.w3.org/2000/svg", "text");
        note.setAttribute("x", node.x + node.w / 2);
        note.setAttribute("y", node.y + node.h / 2 + 16);
        note.setAttribute("text-anchor", "middle");
        note.setAttribute("class", "figure-note");
        note.textContent = node.note;
        group.append(note);
      }
      svg.append(group);
    });

    return svg;
  }

  function renderMisconceptions() {
    const container = byId("misconception-list");
    container.replaceChildren();
    data.misconceptions.forEach((item) => {
      const card = el("article", "misconception");
      card.append(labelText("误区", item.myth));
      card.append(labelText("更准确的说法", item.reality));
      container.append(card);
    });
  }

  function renderRouteTabs() {
    const container = byId("route-tabs");
    container.replaceChildren();
    const term = normalizeQuery(query);
    const visibleRoutes = term
      ? data.routes.filter((route) => scoreRoute(route, term) > 0)
      : data.routes;
    byId("route-match-count").textContent = term ? `匹配 ${visibleRoutes.length} 条路线` : "显示全部路线";

    if (visibleRoutes.length && !visibleRoutes.some((route) => route.id === selectedRouteId)) {
      selectedRouteId = visibleRoutes[0].id;
    }

    visibleRoutes.forEach((route) => {
      const button = el("button", route.id === selectedRouteId ? "tab active" : "tab");
      button.type = "button";
      button.role = "tab";
      button.ariaSelected = route.id === selectedRouteId ? "true" : "false";
      button.textContent = route.title;
      button.addEventListener("click", () => {
        selectedRouteId = route.id;
        renderRouteTabs();
        renderRouteDetail();
      });
      container.append(button);
    });

    if (!visibleRoutes.length) {
      const empty = el("p", "empty route-empty", "没有匹配路线，但文献库仍会按关键词筛选。");
      container.append(empty);
    }
  }

  function renderRouteDetail() {
    const route = data.routes.find((item) => item.id === selectedRouteId) || data.routes[0];
    const container = byId("route-detail");
    container.replaceChildren();

    const header = el("div", "detail-header");
    const titleWrap = el("div");
    titleWrap.append(el("p", "eyebrow", route.priority));
    titleWrap.append(el("h3", "", route.title));
    titleWrap.append(el("p", "question", route.question));
    const takeaway = el("p", "takeaway", route.takeaway);
    header.append(titleWrap, takeaway);

    const columns = el("div", "detail-columns");
    const branches = renderListBlock("路线分支", route.branches);
    const patterns = renderListBlock("学习抓手", route.patterns);
    const refs = renderMiniRefs(route.references);
    columns.append(branches, patterns, refs);
    container.append(header, columns);
  }

  function renderListBlock(title, items) {
    const block = el("article", "detail-block");
    block.append(el("h4", "", title));
    const list = el("ul");
    items.forEach((item) => list.append(el("li", "", item)));
    block.append(list);
    return block;
  }

  function renderMiniRefs(references) {
    const block = el("article", "detail-block refs");
    block.append(el("h4", "", "优先阅读"));
    references.slice(0, 5).forEach((reference) => {
      const link = el("a", "mini-ref");
      link.href = reference.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      const strong = el("strong", "", reference.title);
      const meta = el("span", "", `${reference.year} · ${reference.evidence}`);
      link.append(strong, meta);
      block.append(link);
    });
    return block;
  }

  function renderTimeline() {
    const container = byId("timeline");
    container.replaceChildren();
    data.milestones.forEach((item) => {
      const node = el("article", `timeline-item ${item.lane}`);
      node.append(el("span", "year", item.year));
      node.append(el("h3", "", item.label));
      node.append(el("p", "", item.note));
      container.append(node);
    });
  }

  function renderEquations() {
    const container = byId("formula-grid");
    container.replaceChildren();
    data.equations.forEach((equation) => {
      const card = el("article", "formula-card");
      card.append(el("h3", "", equation.title));
      const math = el("div", "math");
      math.innerHTML = equation.mathml;
      card.append(math, el("p", "", equation.explain));
      container.append(card);
    });
  }

  function renderParadigms() {
    const container = byId("paradigm-grid");
    container.replaceChildren();
    container.append(renderParadigmOverview());
    data.paradigms.forEach((paradigm) => {
      const card = el("article", "paradigm-card");
      card.append(el("p", "layer-chip", paradigm.layer));
      card.append(el("h3", "", paradigm.name));
      card.append(el("p", "examples", paradigm.examples));
      card.append(labelText("读法", paradigm.readingHint));
      card.append(labelText("区分轴", paradigm.axis));
      card.append(labelText("核心问题", paradigm.question));
      card.append(labelText("强项", paradigm.strength));
      card.append(labelText("注意", paradigm.caution));
      card.append(labelText("不要混同", paradigm.notSameAs));
      container.append(card);
    });
  }

  function renderParadigmOverview() {
    const overview = data.paradigmOverview;
    const wrap = el("article", "paradigm-overview");
    wrap.append(el("h3", "", "先按层级读，不要当成互斥分类"));
    wrap.append(el("p", "overview-intro", overview.intro));

    const tableWrap = el("div", "taxonomy-scroll");
    const table = el("table", "taxonomy-table");
    const thead = el("thead");
    const headerRow = el("tr");
    ["看法", "它真正问什么", "代表路线", "机器人/VLA 用法"].forEach((heading) => headerRow.append(el("th", "", heading)));
    thead.append(headerRow);
    const tbody = el("tbody");
    overview.axes.forEach((axis) => {
      const row = el("tr");
      row.append(el("td", "taxonomy-axis", axis.label));
      row.append(el("td", "", axis.question));
      row.append(el("td", "", axis.examples));
      row.append(el("td", "", axis.robotUse));
      tbody.append(row);
    });
    table.append(thead, tbody);
    tableWrap.append(table);
    wrap.append(tableWrap);
    wrap.append(el("p", "taxonomy-rule", overview.rule));
    return wrap;
  }

  function labelText(label, text) {
    const row = el("p", "label-text");
    const strong = el("strong", "", `${label}: `);
    row.append(strong, document.createTextNode(text));
    return row;
  }

  function renderReadingPath() {
    const container = byId("reading-path");
    container.replaceChildren();
    data.readingPath.forEach((phase) => {
      const card = el("article", "phase-card");
      card.append(el("span", "phase", phase.phase));
      card.append(el("h3", "", phase.title));
      card.append(el("p", "", phase.goal));
      const chips = el("div", "chips");
      phase.read.forEach((name) => chips.append(el("span", "chip", name)));
      card.append(chips);
      card.append(el("p", "output", phase.output));
      container.append(card);
    });
  }

  function renderGlossary() {
    const container = byId("glossary-list");
    container.replaceChildren();
    data.glossary.forEach((item) => {
      const row = el("article", "term");
      row.append(el("h3", "", item.term));
      row.append(el("p", "", item.meaning));
      container.append(row);
    });
  }

  function renderFilters() {
    const types = Array.from(new Set(allReferences().map((reference) => reference.type))).sort();
    const container = byId("filter-buttons");
    container.replaceChildren();
    ["all", ...types].forEach((type) => {
      const button = el("button", type === activeFilter ? "filter active" : "filter", type === "all" ? "全部" : type);
      button.type = "button";
      button.addEventListener("click", () => {
        activeFilter = type;
        renderFilters();
        renderReferences();
      });
      container.append(button);
    });
  }

  function renderEvidenceLegend() {
    const container = byId("evidence-legend");
    container.replaceChildren();
    const legend = [
      ["论文/技术报告", "通常是 arXiv、会议论文或技术报告"],
      ["官方 blog", "公司/实验室官方叙述，适合作为工程信号"],
      ["模型卡", "权重、限制和部署信息，注意版本状态"],
      ["项目/代码", "可复现入口，仍需看论文和 issue 状态"],
      ["官方资料", "高层官方入口，不一定有 VLA 架构细节"]
    ];
    legend.forEach(([label, description]) => {
      const item = el("article", "evidence-item");
      item.append(el("strong", "", label), el("span", "", description));
      container.append(item);
    });
  }

  function applyFilters(reference) {
    const haystack = normalizeQuery(`${reference.title} ${reference.value} ${reference.route} ${reference.type} ${reference.year} ${reference.evidence}`);
    const matchesQuery = !query || haystack.includes(normalizeQuery(query));
    const matchesFilter = activeFilter === "all" || reference.type === activeFilter;
    return matchesQuery && matchesFilter;
  }

  function renderReferences() {
    const container = byId("reference-grid");
    container.replaceChildren();
    let visibleCount = 0;

    data.routes.forEach((route) => {
      const references = route.references
        .map((reference) => ({ ...reference, route: route.title, routeId: route.id }))
        .filter(applyFilters);
      if (!references.length) return;

      visibleCount += references.length;
      const section = el("section", "reference-route");
      const header = el("div", "reference-route-head");
      const titleWrap = el("div");
      titleWrap.append(el("p", "route-kicker", route.priority));
      titleWrap.append(el("h3", "", route.title));
      header.append(titleWrap, el("span", "route-ref-count", `${references.length} 篇`));

      const grid = el("div", "reference-route-grid");
      references.forEach((reference) => grid.append(renderReferenceCard(reference)));
      section.append(header, grid);
      container.append(section);
    });

    if (!visibleCount) {
      container.append(el("p", "empty", "没有匹配结果，换个关键词试试。"));
    }
  }

  function renderReferenceCard(reference) {
    const card = el("article", "reference-card");
    const meta = el("p", "ref-meta", `${reference.year} · ${reference.type} · ${reference.evidence}`);
    const link = el("a", "ref-title");
    link.href = reference.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = reference.title;
    card.append(meta, link, el("p", "", reference.value));
    return card;
  }

  function bindSearch() {
    byId("search-input").addEventListener("input", (event) => {
      query = event.target.value;
      const term = normalizeQuery(query);
      const routeMatches = data.routes
        .map((route) => ({ route, score: scoreRoute(route, term) }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score);
      if (routeMatches[0] && query.length > 1) {
        selectedRouteId = routeMatches[0].route.id;
        renderRouteTabs();
        renderRouteDetail();
      }
      renderReferences();
    });
  }

  function initSideToc() {
    const drawer = byId("side-toc");
    const openers = [...document.querySelectorAll("[data-toc-open]")];
    const closers = [...document.querySelectorAll("[data-toc-close]")];
    if (!drawer || !openers.length) return;

    const setOpen = (open) => {
      document.body.classList.toggle("toc-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      openers.forEach((opener) => opener.setAttribute("aria-expanded", String(open)));
    };

    openers.forEach((opener) => {
      opener.addEventListener("click", () => {
        setOpen(!document.body.classList.contains("toc-open"));
      });
    });
    closers.forEach((closer) => closer.addEventListener("click", () => setOpen(false)));
    drawer.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function init() {
    renderCounts();
    renderFoundations();
    renderModelComparison();
    renderPredictionTargets();
    renderArchitecture();
    renderRobotWorkflow();
    renderPaperFigures();
    renderRouteTabs();
    renderRouteDetail();
    renderTimeline();
    renderEquations();
    renderParadigms();
    renderMisconceptions();
    renderReadingPath();
    renderGlossary();
    renderFilters();
    renderEvidenceLegend();
    renderReferences();
    bindSearch();
    initSideToc();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
