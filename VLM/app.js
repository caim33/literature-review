(function () {
  const data = window.vlmMapData || globalThis.vlmMapData;
  let selectedFamilyId = data.families[0].id;
  let modelQuery = "";
  let visualFiguresExpanded = false;
  const featuredVisualFigureIndexes = [0, 4, 7];

  const byId = (id) => document.getElementById(id);
  const normalize = (text) => String(text || "").toLowerCase();

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function linkEl(className, href, text) {
    const link = el("a", className, text);
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    return link;
  }

  function labelText(label, text) {
    const block = el("p", "label-text");
    block.append(el("strong", "", label));
    block.append(document.createTextNode(text));
    return block;
  }

  function renderCounts() {
    byId("family-count").textContent = data.families.length;
    byId("model-count").textContent = data.keyModels.length;
    byId("benchmark-count").textContent = data.benchmarks.length;
  }

  function renderToc() {
    const container = byId("page-toc");
    container.replaceChildren();
    data.tocGroups.forEach((group) => {
      const card = el("article", "toc-card");
      card.append(el("h3", "", group.title));
      const links = el("div", "toc-link-list");
      group.items.forEach((item) => {
        const link = el("a", "toc-link");
        link.href = `#${item.target}`;
        link.append(el("strong", "", item.title));
        link.append(el("span", "", item.note));
        links.append(link);
      });
      card.append(links);
      container.append(card);
    });
  }

  function renderPrinciples() {
    const container = byId("principle-grid");
    container.replaceChildren();
    data.principles.forEach((principle) => {
      const card = el("article", "principle-card");
      card.append(el("span", "principle-number", principle.number));
      card.append(el("h3", "", principle.title));
      card.append(el("p", "", principle.text));
      container.append(card);
    });
  }

  function renderLearningPath() {
    const container = byId("learning-path-list");
    container.replaceChildren();
    data.learningStages.forEach((stage, index) => {
      const card = el("article", "path-card");
      card.append(el("span", "path-step", String(index + 1).padStart(2, "0")));
      card.append(el("h3", "", stage.title));
      card.append(labelText("目标", stage.goal));
      const reads = el("div", "read-chips");
      stage.read.forEach((item) => reads.append(el("span", "read-chip", item)));
      card.append(reads);
      card.append(labelText("阶段输出", stage.output));
      container.append(card);
    });
  }

  function svgEl(tag, attrs = {}) {
    const svgNS = "http://www.w3.org/2000/svg";
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function renderSvgText(parent, lines, x, y, className, fill) {
    lines.forEach((line, index) => {
      const text = svgEl("text", { x, y: y + index * 17, class: className, fill });
      text.textContent = line;
      parent.append(text);
    });
  }

  function splitSvgText(text, maxUnits) {
    const tokens = String(text).trim().match(/[\u2e80-\u9fff\uac00-\ud7af\uff01-\uff60]|[^\s\u2e80-\u9fff\uac00-\ud7af\uff01-\uff60]+|\s+/g) || [];
    const lines = [];
    let current = "";
    let currentUnits = 0;
    const tokenUnits = (token) => Array.from(token).reduce((total, character) => {
      if (/\s/.test(character)) return total + 0.45;
      if (/[\u2e80-\u9fff\uac00-\ud7af\uff01-\uff60]/.test(character)) return total + 2;
      return total + 1;
    }, 0);

    tokens.forEach((token) => {
      const units = tokenUnits(token);
      if (current && currentUnits + units > maxUnits) {
        lines.push(current.trim());
        current = token.trimStart();
        currentUnits = tokenUnits(current);
      } else {
        current += token;
        currentUnits += units;
      }
    });
    if (current.trim()) lines.push(current.trim());
    return lines;
  }

  function segmentIntersectsNode(fromPoint, toPoint, node, padding = 6) {
    const left = node.x - padding;
    const right = node.x + node.w + padding;
    const top = node.y - padding;
    const bottom = node.y + node.h + padding;
    if (fromPoint.y === toPoint.y) {
      const minX = Math.min(fromPoint.x, toPoint.x);
      const maxX = Math.max(fromPoint.x, toPoint.x);
      return fromPoint.y > top && fromPoint.y < bottom && minX < right && maxX > left;
    }
    const minY = Math.min(fromPoint.y, toPoint.y);
    const maxY = Math.max(fromPoint.y, toPoint.y);
    return fromPoint.x > left && fromPoint.x < right && minY < bottom && maxY > top;
  }

  function pointsToFigurePath(points) {
    return points.map((point, index) => {
      if (!index) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      return point.x === previous.x ? `V ${point.y}` : `H ${point.x}`;
    }).join(" ");
  }

  function buildFigureEdgePath(from, to, nodes) {
    const fromCenterX = from.x + from.w / 2;
    const fromCenterY = from.y + from.h / 2;
    const toCenterX = to.x + to.w / 2;
    const toCenterY = to.y + to.h / 2;
    const arrowGap = 10;
    const rightGap = to.x - (from.x + from.w);
    const leftGap = from.x - (to.x + to.w);

    if (rightGap >= 18) {
      const startX = from.x + from.w;
      const endX = to.x - arrowGap;
      if (Math.abs(fromCenterY - toCenterY) < 2) {
        return `M ${startX} ${fromCenterY} H ${endX}`;
      }
      const laneX = startX + (endX - startX) / 2;
      const points = [
        { x: startX, y: fromCenterY },
        { x: laneX, y: fromCenterY },
        { x: laneX, y: toCenterY },
        { x: endX, y: toCenterY }
      ];
      const blockers = nodes.filter((node) => node !== from && node !== to && points.slice(1).some((point, index) => segmentIntersectsNode(points[index], point, node)));
      if (!blockers.length) return pointsToFigurePath(points);

      const corridorNodes = nodes.filter((node) => node !== from && node !== to && node.x < endX && node.x + node.w > startX);
      const upperLane = Math.max(18, Math.min(from.y, to.y, ...corridorNodes.map((node) => node.y)) - 18);
      const approachX = endX - 18;
      return pointsToFigurePath([
        { x: startX, y: fromCenterY },
        { x: startX, y: upperLane },
        { x: approachX, y: upperLane },
        { x: approachX, y: toCenterY },
        { x: endX, y: toCenterY }
      ]);
    }

    if (leftGap >= 18) {
      const startX = from.x;
      const endX = to.x + to.w + arrowGap;
      if (Math.abs(fromCenterY - toCenterY) < 2) {
        return `M ${startX} ${fromCenterY} H ${endX}`;
      }
      const laneX = startX + (endX - startX) / 2;
      const points = [
        { x: startX, y: fromCenterY },
        { x: laneX, y: fromCenterY },
        { x: laneX, y: toCenterY },
        { x: endX, y: toCenterY }
      ];
      const blockers = nodes.filter((node) => node !== from && node !== to && points.slice(1).some((point, index) => segmentIntersectsNode(points[index], point, node)));
      if (!blockers.length) return pointsToFigurePath(points);

      const corridorNodes = nodes.filter((node) => node !== from && node !== to && node.x < startX && node.x + node.w > endX);
      const upperLane = Math.max(18, Math.min(from.y, to.y, ...corridorNodes.map((node) => node.y)) - 18);
      const approachX = endX + 18;
      return pointsToFigurePath([
        { x: startX, y: fromCenterY },
        { x: startX, y: upperLane },
        { x: approachX, y: upperLane },
        { x: approachX, y: toCenterY },
        { x: endX, y: toCenterY }
      ]);
    }

    const movesDown = toCenterY >= fromCenterY;
    const startY = movesDown ? from.y + from.h : from.y;
    const endY = movesDown ? to.y - arrowGap : to.y + to.h + arrowGap;
    if (Math.abs(fromCenterX - toCenterX) < 2) {
      return `M ${fromCenterX} ${startY} V ${endY}`;
    }
    const laneY = startY + (endY - startY) / 2;
    return `M ${fromCenterX} ${startY} V ${laneY} H ${toCenterX} V ${endY}`;
  }

  function renderVisualFigures() {
    const container = byId("visual-figure-grid");
    container.replaceChildren();
    const figurePalette = {
      vision: ["#f5fffb", "#9fc9ba"],
      language: ["#f7faff", "#aebfdb"],
      connector: ["#fbf8ff", "#c7aed7"],
      fusion: ["#fbf8ff", "#c7aed7"],
      loss: ["#fff6f0", "#d7ad98"],
      generator: ["#fff6f0", "#d7ad98"],
      data: ["#fffff1", "#cacc90"],
      benchmark: ["#fffff1", "#cacc90"],
      output: ["#f6fbf2", "#afc6a4"]
    };
    const figures = visualFiguresExpanded
      ? data.visualFigureGuides
      : featuredVisualFigureIndexes.map((index) => data.visualFigureGuides[index]).filter(Boolean);
    figures.forEach((figure) => {
      const card = el("article", "visual-figure-card");
      const head = el("div", "visual-figure-head");
      head.append(el("span", "diagram-kicker", figure.kicker));
      head.append(el("h3", "", figure.title));
      head.append(el("p", "", figure.summary));

      const svg = svgEl("svg", {
        class: "visual-figure-svg",
        viewBox: "0 0 920 320",
        preserveAspectRatio: "xMidYMid meet",
        role: "img",
        "aria-label": figure.title
      });
      const defs = svgEl("defs");
      const marker = svgEl("marker", { id: `arrow-${figure.title.replace(/\W+/g, "-")}`, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" });
      const markerPath = svgEl("path", { d: "M 0 0 L 10 5 L 0 10 z", class: "figure-arrow-head", fill: "#8a9b95" });
      marker.append(markerPath);
      defs.append(marker);
      svg.append(defs);

      const layoutNodes = figure.nodes.map((node) => {
        const titleLines = splitSvgText(node.label, Math.max(12, Math.floor((node.w - 24) / 8)));
        const detailLines = splitSvgText(node.detail, Math.max(15, Math.floor((node.w - 24) / 6.8)));
        const detailY = 64 + Math.max(0, titleLines.length - 1) * 17;
        const height = Math.max(node.h, detailY + Math.max(0, detailLines.length - 1) * 17 + 12);
        return { ...node, titleLines, detailLines, detailY, h: height };
      });
      const figureHeight = Math.max(320, ...layoutNodes.map((node) => node.y + node.h + 24));
      svg.setAttribute("viewBox", `0 0 920 ${figureHeight}`);

      figure.edges.forEach((edge) => {
        const from = layoutNodes[edge.from];
        const to = layoutNodes[edge.to];
        const path = svgEl("path", {
          d: buildFigureEdgePath(from, to, layoutNodes),
          class: "figure-edge-path",
          fill: "none",
          stroke: "#8a9b95",
          "stroke-width": "2.2",
          "marker-end": `url(#arrow-${figure.title.replace(/\W+/g, "-")})`
        });
        svg.append(path);
      });

      layoutNodes.forEach((node, index) => {
        const group = svgEl("g", { class: `figure-node ${node.kind}` });
        const [fill, stroke] = figurePalette[node.kind] || ["#ffffff", "#ccd4ce"];
        group.append(svgEl("rect", { x: node.x, y: node.y, width: node.w, height: node.h, rx: "9", fill, stroke, "stroke-width": "2" }));
        const indexText = svgEl("text", { x: node.x + 12, y: node.y + 22, class: "figure-node-index", fill: "#1f6f69" });
        indexText.textContent = String(index + 1).padStart(2, "0");
        group.append(indexText);
        renderSvgText(group, node.titleLines, node.x + 12, node.y + 43, "figure-node-title", "#1c2430");
        renderSvgText(group, node.detailLines, node.x + 12, node.y + node.detailY, "figure-node-detail", "#5d6b73");
        svg.append(group);
      });

      const stage = el("div", "visual-figure-stage");
      stage.append(svg);

      const mobileFigure = el("div", "visual-figure-mobile");
      const mobileNodes = el("div", "visual-mobile-nodes");
      figure.nodes.forEach((node, index) => {
        const item = el("article", `visual-mobile-node ${node.kind}`);
        item.append(el("span", "visual-mobile-index", String(index + 1).padStart(2, "0")));
        item.append(el("h4", "", node.label));
        item.append(el("p", "", node.detail));
        mobileNodes.append(item);
      });

      const relationLegend = el("div", "visual-edge-legend");
      relationLegend.append(el("span", "visual-edge-legend-title", "关系与训练目标"));
      figure.edges.forEach((edge) => {
        const relation = el("div", "visual-edge-item");
        relation.append(el("span", "", `${figure.nodes[edge.from].label} → ${figure.nodes[edge.to].label}`));
        relation.append(el("strong", "", edge.label));
        relationLegend.append(relation);
      });
      mobileFigure.append(mobileNodes);

      const body = el("div", "visual-figure-body");
      const list = el("ul", "visual-read-list");
      figure.readAs.forEach((item) => list.append(el("li", "", item)));
      const link = linkEl("figure-source", figure.sourceUrl, "打开论文 / 项目入口");
      body.append(list, link);
      card.append(head, stage, mobileFigure, relationLegend, body);
      container.append(card);
    });

    const toggle = byId("visual-figure-toggle");
    const status = byId("visual-figure-status");
    toggle.setAttribute("aria-expanded", String(visualFiguresExpanded));
    toggle.textContent = visualFiguresExpanded ? "收起至精选 3 张" : `展开全部 ${data.visualFigureGuides.length} 张`;
    status.textContent = visualFiguresExpanded
      ? `全部 ${data.visualFigureGuides.length} / ${data.visualFigureGuides.length} 张`
      : `精选 ${figures.length} / ${data.visualFigureGuides.length} 张`;
  }

  function toggleVisualFigures() {
    visualFiguresExpanded = !visualFiguresExpanded;
    renderVisualFigures();
    byId("visual-figure-toggle").focus();
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
        simplified.append(el("span", "simple-step", `${index + 1}. ${shortStep}`));
      });
      body.append(simplified);

      card.append(media, body);
      container.append(card);
    });
  }

  function findDiagramNode(diagram, id) {
    return diagram.nodes.find((node) => node.id === id);
  }

  function renderParadigmDiagrams() {
    const container = byId("paradigm-diagram-gallery");
    container.replaceChildren();
    data.paradigmDiagrams.forEach((diagram) => {
      const card = el("article", "paradigm-diagram-card");

      const head = el("div", "diagram-head");
      head.append(el("span", "diagram-kicker", diagram.kicker));
      head.append(el("h3", "", diagram.title));
      head.append(el("p", "", diagram.summary));
      head.append(el("span", "diagram-reference", diagram.reference));

      const flow = el("div", "diagram-flow");
      diagram.nodes.forEach((node, index) => {
        const nodeEl = el("section", `diagram-node ${node.kind}`);
        nodeEl.append(el("span", "node-index", String(index + 1).padStart(2, "0")));
        nodeEl.append(el("strong", "", node.label));
        nodeEl.append(el("p", "", node.detail));
        flow.append(nodeEl);
      });

      const edges = el("div", "diagram-edges");
      diagram.edges.forEach((edge) => {
        const from = findDiagramNode(diagram, edge.from)?.label || edge.from;
        const to = findDiagramNode(diagram, edge.to)?.label || edge.to;
        const edgeEl = el("p", "diagram-edge");
        edgeEl.append(el("strong", "", `${from} → ${to}`));
        edgeEl.append(el("span", "", edge.label));
        edges.append(edgeEl);
      });

      const watch = el("div", "diagram-watch");
      watch.append(el("h4", "", "读图时看"));
      const list = el("ul");
      diagram.watch.forEach((item) => list.append(el("li", "", item)));
      watch.append(list);

      card.append(head, flow, edges, watch);
      container.append(card);
    });
  }

  function renderFamilyTabs() {
    const container = byId("family-tabs");
    container.replaceChildren();
    data.families.forEach((family) => {
      const button = el("button", family.id === selectedFamilyId ? "family-tab active" : "family-tab", family.title);
      button.type = "button";
      button.role = "tab";
      button.ariaSelected = family.id === selectedFamilyId ? "true" : "false";
      button.addEventListener("click", () => {
        selectedFamilyId = family.id;
        renderFamilyTabs();
        renderFamilyDetail();
      });
      container.append(button);
    });
  }

  function renderFamilyDetail() {
    const family = data.families.find((item) => item.id === selectedFamilyId) || data.families[0];
    const container = byId("family-detail");
    container.replaceChildren();

    const head = el("div", "family-head");
    head.append(el("p", "eyebrow", "Route Question"));
    head.append(el("h3", "", family.title));
    head.append(el("p", "family-question", family.question));

    const takeaway = el("aside", "family-takeaway");
    takeaway.append(el("strong", "", "学习抓手"));
    takeaway.append(el("p", "", family.takeaway));

    const patterns = el("div", "family-patterns");
    family.patterns.forEach((pattern) => {
      const item = el("article", "pattern-card");
      item.append(el("p", "", pattern));
      patterns.append(item);
    });

    const reads = el("div", "family-reads");
    reads.append(el("h4", "", "优先阅读"));
    family.mustRead.forEach((item) => reads.append(el("span", "read-chip", item)));

    container.append(head, takeaway, patterns, reads);
  }

  function modelMatches(model, query) {
    if (!query) return true;
    return normalize(`${model.name} ${model.year} ${model.family} ${model.position} ${model.idea} ${model.value}`).includes(query);
  }

  function renderModelAtlas() {
    const container = byId("model-grid");
    container.replaceChildren();
    const query = normalize(modelQuery);
    const models = data.keyModels.filter((model) => modelMatches(model, query));
    byId("model-match-count").textContent = query ? `匹配 ${models.length} 个模型` : "显示全部模型";

    models.forEach((model) => {
      const card = el("article", model.highlight ? "model-card highlight" : "model-card");
      const meta = el("div", "model-meta");
      meta.append(el("span", "", model.year));
      meta.append(el("span", "", model.family));
      if (model.highlight) meta.append(el("span", "must", "重点"));
      card.append(meta);
      card.append(el("h3", "", model.name));
      card.append(el("p", "model-position", model.position));
      card.append(labelText("核心思路", model.idea));
      card.append(labelText("学习价值", model.value));
      card.append(linkEl("model-link", model.url, "打开资料"));
      container.append(card);
    });

    if (!models.length) {
      container.append(el("p", "empty", "没有匹配模型，换个关键词试试。"));
    }
  }

  function applyModelSearch() {
    modelQuery = byId("model-search").value;
    renderModelAtlas();
  }

  function renderUnifiedModels() {
    const container = byId("unified-grid");
    container.replaceChildren();
    data.unifiedModels.forEach((model) => {
      const card = el("article", "unified-card");
      card.append(el("span", "unified-year", model.year));
      card.append(el("h3", "", model.name));
      card.append(el("p", "unified-position", model.position));
      card.append(el("p", "", model.contribution));
      const links = el("div", "resource-links");
      const resources = model.links || [{ label: "资料", url: model.url }];
      resources.forEach((resource) => links.append(linkEl("resource-link", resource.url, resource.label)));
      card.append(links);
      container.append(card);
    });
  }

  function groupBy(items, key) {
    return items.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  }

  function renderBenchmarkMap() {
    const container = byId("benchmark-groups");
    container.replaceChildren();
    const groups = groupBy(data.benchmarks, "group");
    Object.entries(groups).forEach(([group, benchmarks]) => {
      const section = el("section", "benchmark-group");
      section.append(el("h3", "", group));
      const grid = el("div", "benchmark-grid");
      benchmarks.forEach((benchmark) => {
        const card = el("article", "benchmark-card");
        card.append(el("span", "benchmark-year", benchmark.year));
        card.append(el("h4", "", benchmark.name));
        card.append(labelText("测试能力", benchmark.skill));
        card.append(el("p", "", benchmark.note));
        card.append(linkEl("model-link", benchmark.url, "论文/入口"));
        grid.append(card);
      });
      section.append(grid);
      container.append(section);
    });
  }

  function renderReferences() {
    const container = byId("reference-grid");
    container.replaceChildren();
    data.references.forEach((reference) => {
      const card = el("article", "reference-card");
      const top = el("div", "reference-top");
      top.append(el("span", "", reference.year));
      top.append(el("span", "", reference.evidence));
      card.append(top);
      card.append(el("h3", "", reference.title));
      card.append(el("p", "reference-group", reference.group));
      card.append(el("p", "", reference.value));
      card.append(linkEl("model-link", reference.url, "打开"));
      container.append(card);
    });
  }

  function renderGlossary() {
    const container = byId("glossary-list");
    container.replaceChildren();
    data.glossary.forEach((item) => {
      const card = el("article", "glossary-card");
      card.append(el("h3", "", item.term));
      card.append(el("p", "", item.meaning));
      container.append(card);
    });
  }

  function bind() {
    byId("model-search").addEventListener("input", applyModelSearch);
    byId("visual-figure-toggle").addEventListener("click", toggleVisualFigures);
  }

  function restoreHashScroll() {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const alignTarget = () => {
      const target = byId(id);
      if (!target) return;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY),
        left: 0,
        behavior: "auto"
      });
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
    requestAnimationFrame(alignTarget);
    setTimeout(alignTarget, 120);
    setTimeout(alignTarget, 450);
    window.addEventListener("load", alignTarget, { once: true });
  }

  window.addEventListener("hashchange", restoreHashScroll);

  function init() {
    renderCounts();
    renderVisualFigures();
    renderPaperFigureGuides();
    renderToc();
    renderPrinciples();
    renderLearningPath();
    renderParadigmDiagrams();
    renderFamilyTabs();
    renderFamilyDetail();
    renderModelAtlas();
    renderUnifiedModels();
    renderBenchmarkMap();
    renderReferences();
    renderGlossary();
    bind();
    restoreHashScroll();
  }

  init();
})();
