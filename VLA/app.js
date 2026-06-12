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
  const recipeColors = ["#256f73", "#a54735", "#596b2f", "#b07a2f", "#516a93", "#7a5f95", "#8b6f4d", "#4f6f5d"];
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

  function tocTargetIds() {
    return (data.tocGroups || []).flatMap((group) => group.items.map((item) => item.target));
  }

  function renderPageToc() {
    const container = byId("page-toc");
    container.replaceChildren();
    data.tocGroups.forEach((group) => {
      const card = el("article", "toc-card");
      card.append(el("h3", "", group.title));
      const list = el("div", "toc-link-list");
      group.items.forEach((item) => {
        const link = el("a", "toc-link");
        link.href = `#${item.target}`;
        link.dataset.target = item.target;
        link.append(el("strong", "", item.title));
        link.append(el("span", "", item.note));
        list.append(link);
      });
      card.append(list);
      container.append(card);
    });
  }

  function updateActivePageToc() {
    const links = [...document.querySelectorAll(".toc-link")];
    if (!links.length) return;
    let current = tocTargetIds()[0];
    tocTargetIds().forEach((target) => {
      const section = byId(target);
      if (section && section.getBoundingClientRect().top <= 140) current = target;
    });
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.target === current);
    });
  }

  function scrollToTocTarget(target, updateHash = true) {
    const section = byId(target);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    if (updateHash) window.history.pushState(null, "", `#${target}`);
    window.setTimeout(updateActivePageToc, 320);
  }

  function bindPageTocTracking() {
    document.querySelectorAll(".toc-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        scrollToTocTarget(link.dataset.target);
      });
    });
    window.addEventListener("scroll", updateActivePageToc, { passive: true });
    window.addEventListener("hashchange", () => {
      const target = window.location.hash.replace("#", "");
      if (target) scrollToTocTarget(target, false);
      updateActivePageToc();
    });
    const initialTarget = window.location.hash.replace("#", "");
    if (initialTarget) window.setTimeout(() => scrollToTocTarget(initialTarget, false), 0);
    updateActivePageToc();
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

  function renderDesignAxes() {
    const container = byId("design-axis-grid");
    container.replaceChildren();
    data.designAxes.forEach((axis, index) => {
      const card = el("article", "axis-card");

      const head = el("div", "axis-head");
      head.append(el("span", "axis-number", String(index + 1).padStart(2, "0")));
      const titleWrap = el("div");
      titleWrap.append(el("h3", "", axis.title));
      titleWrap.append(el("p", "axis-question", axis.question));
      head.append(titleWrap);

      const options = el("ul", "axis-options");
      axis.options.forEach((option) => options.append(el("li", "", option)));

      card.append(head);
      card.append(el("p", "axis-summary", axis.summary));
      card.append(labelText("为什么重要", axis.why));
      card.append(options);
      card.append(labelText("读论文时看", axis.probe));
      card.append(labelText("容易误判", axis.trap));
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

  function renderApplicationDomains() {
    const container = byId("application-domain-map");
    container.replaceChildren();
    const map = data.applicationDomains;

    const principle = el("article", "domain-principle");
    principle.append(el("h3", "", "先按身体和动作接口分叉"));
    principle.append(el("p", "", map.principle));

    const domainGrid = el("div", "domain-card-grid");
    map.domains.forEach((domain) => {
      const card = el("article", `domain-card ${domain.id}`);
      const head = el("div", "domain-card-head");
      head.append(el("span", "domain-kicker", domain.subtitle));
      head.append(el("h3", "", domain.title));
      card.append(head);
      card.append(el("p", "domain-summary", domain.summary));
      card.append(labelText("Action space", domain.actionSpace));
      card.append(labelText("数据来源", domain.data));
      card.append(labelText("评测重点", domain.metrics));

      const chips = el("div", "domain-example-chips");
      domain.examples.forEach((example) => chips.append(el("span", "domain-example-chip", example)));
      card.append(chips);
      domainGrid.append(card);
    });

    const matrix = el("div", "domain-boundary-matrix");
    const matrixHead = el("div", "domain-matrix-row head");
    matrixHead.append(el("span", "", "判断轴"), el("span", "", "Manipulation VLA"), el("span", "", "Whole-body VLA"));
    matrix.append(matrixHead);
    map.boundaries.forEach((boundary) => {
      const row = el("article", "domain-matrix-row");
      const manipulation = el("p", "", boundary.manipulation);
      manipulation.dataset.domainLabel = "Manipulation VLA";
      const wholeBody = el("p", "", boundary.wholeBody);
      wholeBody.dataset.domainLabel = "Whole-body VLA";
      row.append(el("strong", "", boundary.label));
      row.append(manipulation);
      row.append(wholeBody);
      matrix.append(row);
    });

    const bridgeGrid = el("div", "domain-bridge-grid");
    map.bridges.forEach((bridge) => {
      const card = el("article", "domain-bridge-card");
      card.append(el("h3", "", bridge.title));
      card.append(el("p", "", bridge.text));
      bridgeGrid.append(card);
    });

    container.append(principle, domainGrid, matrix, bridgeGrid);
  }

  function renderTrainingRecipes() {
    const container = byId("training-recipe-list");
    container.replaceChildren();
    data.trainingRecipes.forEach((recipe, index) => {
      const card = el("details", "recipe-card");
      if (index === 0) card.open = true;

      const summary = el("summary", "recipe-summary");
      const toggle = el("span", "recipe-toggle", card.open ? "-" : "+");
      const titleWrap = el("div", "recipe-title-wrap");
      titleWrap.append(el("p", "eyebrow", `${recipe.year} · ${recipe.family}`));
      titleWrap.append(el("h3", "", recipe.title));
      titleWrap.append(el("p", "recipe-read-as", recipe.readAs));

      const meta = el("div", "recipe-meta");
      if (recipe.domain) meta.append(el("span", "recipe-badge domain", recipe.domain));
      meta.append(el("span", "recipe-badge", recipe.evidence));
      meta.append(el("span", "recipe-badge muted", recipe.sources.length > 1 ? `${recipe.sources.length} 个来源` : "1 个来源"));
      summary.append(toggle, titleWrap, meta);
      card.addEventListener("toggle", () => {
        toggle.textContent = card.open ? "-" : "+";
      });

      const body = el("div", "recipe-body");
      const quick = el("div", "recipe-quick-grid");
      quick.append(labelText("范式", recipe.paradigm));
      quick.append(labelText("Action / trajectory", recipe.action));
      quick.append(renderRecipeSources(recipe.sources));

      const dataBlock = renderRecipeDataMix(recipe);
      const trainBlock = renderRecipeBlock("训练阶段 / recipe", recipe.training.map((item) => ({
        title: `${item.stage}. ${item.title}`,
        text: item.detail
      })));
      const unknownBlock = renderRecipeUnknowns(recipe.unknowns);

      body.append(quick, dataBlock, trainBlock, unknownBlock);
      card.append(summary, body);
      container.append(card);
    });
  }

  function renderRecipeSources(sources) {
    const block = el("div", "recipe-sources");
    block.append(el("strong", "", "来源"));
    sources.forEach((source) => {
      const link = el("a", "", source.title);
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      block.append(link);
    });
    return block;
  }

  function renderRecipeDataMix(recipe) {
    const hasShares = recipe.dataMix.every((item) => Number.isFinite(item.share));
    return hasShares ? renderRecipeDonut(recipe.dataMix) : renderRecipePyramid(recipe.dataMix);
  }

  function renderRecipeDonut(items) {
    const section = el("section", "recipe-block recipe-mix-visual");
    section.append(el("h4", "", "数据组成与贡献"));
    const total = items.reduce((sum, item) => sum + item.share, 0) || 1;
    let cursor = 0;
    const segments = items.map((item, index) => {
      const start = cursor;
      const end = cursor + (item.share / total) * 100;
      cursor = end;
      return `${recipeColors[index % recipeColors.length]} ${start.toFixed(3)}% ${end.toFixed(3)}%`;
    });

    const visual = el("div", "recipe-donut-layout");
    const donutWrap = el("div", "recipe-donut-wrap");
    const donut = el("div", "recipe-donut");
    donut.style.background = `conic-gradient(${segments.join(", ")})`;
    const center = el("div", "recipe-donut-center");
    center.append(el("strong", "", `${Math.round(total)}%`));
    center.append(el("span", "", "公开配比"));
    donut.append(center);
    donutWrap.append(donut);

    const legend = el("div", "recipe-mix-legend");
    items.forEach((item, index) => {
      const row = el("article", "recipe-mix-row");
      const head = el("div", "recipe-mix-head");
      const swatch = el("span", "recipe-swatch");
      swatch.style.backgroundColor = recipeColors[index % recipeColors.length];
      head.append(swatch, el("strong", "", item.label), el("span", "recipe-percent", `${item.share}%`));
      row.append(head, el("p", "", item.role));
      legend.append(row);
    });

    visual.append(donutWrap, legend);
    section.append(visual);
    return section;
  }

  function renderRecipePyramid(items) {
    const section = el("section", "recipe-block recipe-pyramid-block");
    section.append(el("h4", "", "数据组成与贡献"));
    const pyramid = el("div", "recipe-pyramid");
    items.forEach((item, index) => {
      const level = el("article", "recipe-pyramid-level");
      const width = Math.max(58, 100 - index * 8);
      level.style.width = `${width}%`;
      level.append(el("strong", "", item.label));
      level.append(el("p", "", item.role));
      pyramid.append(level);
    });
    section.append(pyramid);
    return section;
  }

  function renderRecipeBlock(title, items) {
    const section = el("section", "recipe-block");
    section.append(el("h4", "", title));
    const grid = el("div", "recipe-item-grid");
    items.forEach((item) => {
      const row = el("article", "recipe-item");
      row.append(el("strong", "", item.title));
      row.append(el("p", "", item.text));
      grid.append(row);
    });
    section.append(grid);
    return section;
  }

  function renderRecipeUnknowns(items) {
    const section = el("section", "recipe-block recipe-unknowns");
    section.append(el("h4", "", "未知项 / 阅读注意"));
    const list = el("ul");
    items.forEach((item) => list.append(el("li", "", item)));
    section.append(list);
    return section;
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

  function renderFigureSystem() {
    const system = data.figureSystem;
    byId("figure-eyebrow").textContent = system.eyebrow;
    byId("figure-title").textContent = system.title;

    const container = byId("figure-system-case");
    container.replaceChildren();

    const intro = el("article", "figure-intro");
    intro.append(el("p", "figure-summary", system.summary));
    intro.append(labelText("证据等级", system.evidence));

    const arch = el("div", "figure-architecture");
    system.architecture.forEach((node, index) => {
      const nodeEl = el("section", "figure-arch-node");
      nodeEl.append(el("span", "figure-arch-label", node.label));
      nodeEl.append(el("h3", "", node.title));
      nodeEl.append(el("p", "", node.detail));
      if (index < system.architecture.length - 1) {
        nodeEl.append(el("span", "figure-arch-arrow", "→"));
      }
      arch.append(nodeEl);
    });

    const demoGrid = el("div", "figure-demo-grid");
    system.demos.forEach((demo) => {
      const card = el("article", "figure-demo-card");
      const media = el("div", "figure-video-wrap");
      const video = document.createElement("video");
      video.src = demo.videoUrl;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.controls = true;
      video.setAttribute("disableRemotePlayback", "");
      media.append(video);

      const tags = el("div", "figure-tags");
      demo.tags.forEach((tag) => tags.append(el("span", "figure-tag", tag)));

      const body = el("div", "figure-demo-body");
      body.append(el("span", "figure-version", demo.version));
      body.append(el("h3", "", demo.title));
      body.append(labelText("任务场景", demo.scene));
      body.append(labelText("体现能力", demo.capability));
      body.append(labelText("系统机制", demo.mechanism));
      body.append(labelText("公开视频", demo.evidence));
      body.append(tags);

      const source = el("a", "figure-source-link", demo.sourceTitle);
      source.href = demo.sourceUrl;
      source.target = "_blank";
      source.rel = "noreferrer";
      body.append(source);

      card.append(media, body);
      demoGrid.append(card);
    });

    const footer = el("div", "figure-study-footer");
    const questions = el("article", "figure-questions");
    questions.append(el("h3", "", "读 Figure demo 时追问"));
    const list = el("ul");
    system.readQuestions.forEach((question) => list.append(el("li", "", question)));
    questions.append(list);

    const notes = el("article", "figure-notes");
    notes.append(el("h3", "", "和其他路线对比"));
    system.notes.forEach((note) => notes.append(labelText(note.label, note.text)));
    footer.append(questions, notes);

    container.append(intro, arch, demoGrid, footer);
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
    container.className = "reference-groups";
    const routeGroups = data.routes
      .map((route) => ({
        route,
        references: route.references
          .map((reference) => ({ ...reference, route: route.title, routeId: route.id }))
          .filter(applyFilters)
      }))
      .filter((group) => group.references.length);

    if (!routeGroups.length) {
      container.append(el("p", "empty", "没有匹配结果，换个关键词试试。"));
      return;
    }

    routeGroups.forEach((group) => container.append(renderRouteReferenceGroup(group.route, group.references)));
  }

  function renderRouteReferenceGroup(route, references) {
    const group = el("section", "reference-route-group");
    const head = el("div", "route-group-head");
    const titleWrap = el("div");
    titleWrap.append(el("p", "eyebrow", route.priority));
    titleWrap.append(el("h3", "", route.title));
    titleWrap.append(el("p", "", route.question));
    head.append(titleWrap, el("span", "route-ref-count", `${references.length} 项资料`));

    const grid = el("div", "route-reference-grid");
    references.forEach((reference) => {
      grid.append(renderReferenceCard(reference));
    });

    group.append(head, grid);
    return group;
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

  function init() {
    renderCounts();
    renderPageToc();
    renderRouteTabs();
    renderRouteDetail();
    renderTimeline();
    renderEquations();
    renderParadigms();
    renderDesignAxes();
    renderArchitectureDiagrams();
    renderApplicationDomains();
    renderTrainingRecipes();
    renderFigureSystem();
    renderPaperFigureGuides();
    renderReadingPath();
    renderGlossary();
    renderFilters();
    renderEvidenceLegend();
    renderReferences();
    bindSearch();
    bindPageTocTracking();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
