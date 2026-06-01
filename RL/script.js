const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const progress = document.querySelector("#progressFill");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
let searchable = [...document.querySelectorAll("[data-tags]")];
const noResults = document.querySelector("#noResults");
const glossary = document.querySelector("#glossary");
const toggleGlossary = document.querySelector("#toggleGlossary");
const glossaryTerms = [...document.querySelectorAll("#glossary .term")];
let glossaryExpanded = false;

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
  progress.style.width = `${pct}%`;
}

function updateActiveNav() {
  let current = sections[0]?.id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 120) current = section.id;
  }
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

function normalize(text) {
  return text.toLowerCase().trim();
}

function runSearch() {
  const query = normalize(searchInput.value);
  let visible = 0;
  if (query) glossaryExpanded = true;
  syncGlossaryVisibility(query);
  searchable.forEach((item) => {
    const haystack = normalize(`${item.textContent} ${item.dataset.tags || ""}`);
    const match = !query || haystack.includes(query);
    item.classList.toggle("hidden", !match);
    if (match) visible += 1;
  });
  noResults.classList.toggle("show", Boolean(query) && visible === 0);
}

function syncGlossaryVisibility(query = normalize(searchInput.value)) {
  if (!glossary || !toggleGlossary) return;
  const expanded = glossaryExpanded || Boolean(query);
  glossary.classList.toggle("glossary-collapsed", !expanded);
  toggleGlossary.setAttribute("aria-expanded", String(expanded));
  toggleGlossary.textContent = expanded ? "收起术语表" : `展开全部 ${glossaryTerms.length} 个术语`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function stripBraces(value) {
  return value.replaceAll("{", "").replaceAll("}", "");
}

function normalizeMathTokens(text) {
  return text
    .replace(/\\mathcal\{([^}]+)\}/g, "$1")
    .replace(/\\mathbb\{([^}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^}]+)\}/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\sum|(?<![A-Za-z])sum(?![A-Za-z])/g, "Σ")
    .replace(/\\infty/g, "∞")
    .replace(/\\cdot/g, "·")
    .replace(/\\mid/g, "|")
    .replace(/\\Vert/g, "||")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\log/g, "log")
    .replace(/\\min/g, "min")
    .replace(/\\max/g, "max")
    .replace(/\\exp/g, "exp")
    .replace(/\\clip/g, "clip")
    .replace(/\\nabla|nabla/g, "∇")
    .replace(/\\theta|theta/g, "θ")
    .replace(/\\epsilon|epsilon/g, "ε")
    .replace(/\\gamma|gamma/g, "γ")
    .replace(/\\alpha|alpha/g, "α")
    .replace(/\\beta|beta/g, "β")
    .replace(/\\lambda|lambda/g, "λ")
    .replace(/\\phi|phi/g, "φ")
    .replace(/\\sigma|sigma/g, "σ")
    .replace(/\\Delta|Delta/g, "Δ")
    .replace(/\\pi|(?<![A-Za-z])pi(?![A-Za-z])/g, "π");
}

function tokenHtml(token) {
  return normalizeMathTokens(stripBraces(token))
    .replaceAll("\\", "")
    .replace(/([A-Za-zΑ-ωπθγβλασφ])_([A-Za-zΑ-ωπθγβλασφ0-9+\-]+)/g, "$1$2");
}

function scriptWrap(base, sub = "", sup = "") {
  const subHtml = sub ? `<span class="script-sub">${tokenHtml(sub)}</span>` : "";
  const supHtml = sup ? `<span class="script-sup">${tokenHtml(sup)}</span>` : "";
  return `<span class="script-wrap"><span class="script-base">${tokenHtml(base)}</span>${subHtml}${supHtml}</span>`;
}

function renderStructuredMath(rawLine) {
  let line = rawLine.trim();
  const fragments = [];
  const protect = (html) => {
    const index = fragments.push(html) - 1;
    return `\uE000${index}\uE001`;
  };

  line = normalizeMathTokens(line);
  line = escapeHtml(line);

  line = line.replace(
    /Σ(?:_\{([^}]*)\}|_([A-Za-z0-9=+\-∞]+))?(?:\^\{([^}]*)\}|\^([A-Za-z0-9∞]+))?/g,
    (_match, subA, subB, supA, supB) => {
      const sub = subA || subB || "";
      const sup = supA || supB || "";
      return protect(`<span class="sum-wrap"><span class="script-sup">${tokenHtml(sup)}</span><span class="sum-symbol">Σ</span><span class="script-sub">${tokenHtml(sub)}</span></span>`);
    },
  );

  const base = "([A-Za-zΑ-ω∞∇πθγβλασφ]+|\\))";
  line = line
    .replace(new RegExp(`${base}_\\{([^}]*)\\}\\^\\{([^}]*)\\}`, "g"), (_m, baseText, sub, sup) => protect(scriptWrap(baseText, sub, sup)))
    .replace(new RegExp(`${base}\\^\\{([^}]*)\\}_\\{([^}]*)\\}`, "g"), (_m, baseText, sup, sub) => protect(scriptWrap(baseText, sub, sup)))
    .replace(new RegExp(`${base}_\\{([^}]*)\\}`, "g"), (_m, baseText, sub) => protect(scriptWrap(baseText, sub, "")))
    .replace(new RegExp(`${base}\\^\\{([^}]*)\\}`, "g"), (_m, baseText, sup) => protect(scriptWrap(baseText, "", sup)))
    .replace(new RegExp(`${base}_([A-Za-zΑ-ωπθγβλασφ0-9+\\-]+)`, "g"), (_m, baseText, sub) => protect(scriptWrap(baseText, sub, "")))
    .replace(new RegExp(`${base}\\^([A-Za-zΑ-ωπθγβλασφ0-9+\\-]+)`, "g"), (_m, baseText, sup) => protect(scriptWrap(baseText, "", sup)))
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll("\\", "");

  return line.replace(/\uE000(\d+)\uE001/g, (_match, index) => fragments[Number(index)] || "");
}

function prettyFormula(source) {
  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const text = renderStructuredMath(line).replace(/\s*~\s*/g, " ~ ");
      return `<span class="math-line">${text}</span>`;
    });
  return lines.join("");
}

function renderFormulaViews() {
  document.querySelectorAll(".formula").forEach((formula) => {
    if (formula.querySelector(".math-view")) return;
    const source = formula.querySelector("pre")?.innerText || "";
    if (!source.trim()) return;
    const view = document.createElement("div");
    view.className = "math-view";
    view.innerHTML = prettyFormula(source);
    formula.insertBefore(view, formula.querySelector("pre"));
  });
  searchable = [...document.querySelectorAll("[data-tags]")];
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

document.querySelectorAll(".copy-formula").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.parentElement.querySelector("pre")?.innerText || "";
    const old = button.textContent;
    try {
      const ok = await copyText(text);
      button.textContent = ok ? "已复制" : "复制失败";
    } catch {
      button.textContent = "复制失败";
    }
    setTimeout(() => {
      button.textContent = old;
    }, 1200);
  });
});

document.querySelectorAll(".details button").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".details").classList.toggle("open");
  });
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
}, { passive: true });

searchInput.addEventListener("input", runSearch);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  glossaryExpanded = false;
  runSearch();
  searchInput.focus();
});

renderFormulaViews();
toggleGlossary?.addEventListener("click", () => {
  glossaryExpanded = !glossaryExpanded;
  syncGlossaryVisibility();
});
syncGlossaryVisibility();
updateProgress();
updateActiveNav();
