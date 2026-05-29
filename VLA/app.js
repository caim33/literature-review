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
  const findNodeLabel = (diagram, id) => diagram.nodes.find((node) => node.id === id)?.label || id;
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
    data.paradigms.forEach((paradigm) => {
      const card = el("article", "paradigm-card");
      card.append(el("h3", "", paradigm.name));
      card.append(el("p", "examples", paradigm.examples));
      card.append(labelText("强项", paradigm.strength));
      card.append(labelText("注意", paradigm.caution));
      container.append(card);
    });
  }

  function renderArchitectureDiagrams() {
    const container = byId("architecture-gallery");
    container.replaceChildren();
    data.architectureDiagrams.forEach((diagram) => {
      const card = el("article", "architecture-card");
      const head = el("div", "diagram-head");
      head.append(el("span", "diagram-kicker", diagram.kicker));
      head.append(el("h3", "", diagram.title));
      head.append(el("p", "", diagram.takeaway));

      const flow = el("div", "diagram-flow");
      diagram.nodes.forEach((node, index) => {
        const nodeEl = el("section", "diagram-node");
        nodeEl.append(el("span", "node-index", String(index + 1).padStart(2, "0")));
        nodeEl.append(el("strong", "", node.label));
        nodeEl.append(el("p", "", node.detail));
        flow.append(nodeEl);
      });

      const edges = el("div", "diagram-edges");
      diagram.edges.forEach((edge) => {
        const edgeEl = el("p", "diagram-edge");
        edgeEl.append(el("strong", "", `${findNodeLabel(diagram, edge.from)} → ${findNodeLabel(diagram, edge.to)}`));
        edgeEl.append(el("span", "", edge.label));
        edges.append(edgeEl);
      });

      card.append(head, flow, edges);
      container.append(card);
    });
  }

  function renderPaperFigureGuides() {
    const container = byId("paper-figure-guides");
    container.replaceChildren();
    data.paperFigureGuides.forEach((figure) => {
      const card = el("article", "figure-guide");

      const media = el("a", figure.imageUrl ? "figure-media has-image" : "figure-media");
      media.href = figure.sourceUrl;
      media.target = "_blank";
      media.rel = "noreferrer";
      if (figure.imageUrl) {
        const img = document.createElement("img");
        img.src = figure.imageUrl;
        img.alt = `${figure.title} original figure`;
        img.loading = "lazy";
        media.append(img);
        media.append(el("span", "figure-open-label", "点击查看原图来源"));
      } else {
        media.append(el("span", "figure-placeholder", "原图见论文 / 官方页"));
      }

      const body = el("div", "figure-body");
      const source = el("a", "figure-source", figure.sourceTitle);
      source.href = figure.sourceUrl;
      source.target = "_blank";
      source.rel = "noreferrer";
      body.append(el("h3", "", figure.title), source);
      body.append(labelText("原图入口", figure.originalFigure));

      const steps = el("ol", "figure-steps");
      figure.simplified.forEach((step) => steps.append(el("li", "", step)));
      body.append(steps);
      body.append(labelText("读图重点", figure.watchFor));

      const simplified = el("div", "simplified-flow");
      figure.simplified.forEach((step, index) => {
        const shortStep = step.split("，")[0].replaceAll("。", "");
        const stepNode = el("span", "simple-step", `${index + 1}. ${shortStep}`);
        simplified.append(stepNode);
      });
      body.append(simplified);

      card.append(media, body);
      container.append(card);
    });
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
    const references = allReferences().filter(applyFilters);

    if (!references.length) {
      container.append(el("p", "empty", "没有匹配结果，换个关键词试试。"));
      return;
    }

    references.forEach((reference) => {
      const card = el("article", "reference-card");
      const meta = el("p", "ref-meta", `${reference.year} · ${reference.type} · ${reference.evidence} · ${reference.route}`);
      const link = el("a", "ref-title");
      link.href = reference.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = reference.title;
      card.append(meta, link, el("p", "", reference.value));
      container.append(card);
    });
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

  function init() {
    renderCounts();
    renderRouteTabs();
    renderRouteDetail();
    renderTimeline();
    renderEquations();
    renderParadigms();
    renderArchitectureDiagrams();
    renderPaperFigureGuides();
    renderReadingPath();
    renderGlossary();
    renderFilters();
    renderEvidenceLegend();
    renderReferences();
    bindSearch();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
