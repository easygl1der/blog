import AdmZip from "adm-zip";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, join, relative } from "node:path";

const zipPath = "export.zip";
const outputDir = "dist";
const searchIndexPath = join(outputDir, "search-index.json");
const searchScriptPath = join(outputDir, "local-search.js");

rmSync(zipPath, { force: true });
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

execFileSync("npx", ["mintlify", "export", "--output", zipPath], {
  stdio: "inherit",
});

const zip = new AdmZip(zipPath);
zip.extractAllTo(outputDir, true);

const docsRoot = "docs";
const docsConfig = JSON.parse(readFileSync("docs.json", "utf8"));

function walkFiles(dir) {
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      const stat = statSync(path);
      return stat.isDirectory() ? walkFiles(path) : [path];
    });
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = {};
  if (!match) return { frontmatter, body: raw };

  for (const line of match[1].split("\n")) {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) continue;
    const key = rawKey.trim();
    let value = rest.join(":").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }
    frontmatter[key] = value;
  }
  return { frontmatter, body: raw.slice(match[0].length) };
}

function titleFromPath(path) {
  return basename(path, ".mdx")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripMdx(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/[#>*_[\]()`{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectNavRefs(node, refs = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) collectNavRefs(item, refs);
  } else if (node && typeof node === "object") {
    for (const key of ["pages", "groups", "tabs"]) collectNavRefs(node[key], refs);
  } else if (typeof node === "string" && node.startsWith("docs/")) {
    refs.add(node.replace(/\/$/, ""));
  }
  return refs;
}

const navRefs = collectNavRefs(docsConfig.navigation);
const mdxFiles = walkFiles(docsRoot).filter((file) => file.endsWith(".mdx"));
const index = mdxFiles
  .map((file) => {
    const raw = readFileSync(file, "utf8");
    const { frontmatter, body } = parseFrontmatter(raw);
    const pageRef = relative(".", file).replace(/\.mdx$/, "");
    const href = `/${pageRef}`;
    const text = stripMdx(body);
    return {
      title: frontmatter.title || titleFromPath(file),
      description: frontmatter.description || "",
      date: frontmatter.date || "",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      href,
      text: text.slice(0, 8000),
      navRank: navRefs.has(pageRef) ? 0 : 1,
    };
  })
  .sort((a, b) => a.navRank - b.navRank || b.date.localeCompare(a.date));

writeFileSync(searchIndexPath, JSON.stringify(index, null, 2));

function localSearchClient() {
  const state = { index: null, open: false };
  const maxResults = 12;
  const searchSelector = "#search-bar-entry,#search-bar-entry-mobile";

  const styles = document.createElement("style");
  styles.textContent = `
    .ys-search-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.38);backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding:9vh 16px 24px}
    .ys-search-panel{width:min(920px,100%);border:1px solid rgba(148,163,184,.38);border-radius:22px;background:rgba(255,255,255,.98);box-shadow:0 28px 90px rgba(15,23,42,.32);overflow:hidden}
    .dark .ys-search-panel{background:rgba(15,23,42,.98);border-color:rgba(71,85,105,.8)}
    .ys-search-input{width:100%;border:0;border-bottom:1px solid rgba(148,163,184,.24);outline:0;padding:22px 24px;font:500 20px/1.3 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a;background:transparent}
    .dark .ys-search-input{color:#e2e8f0;border-bottom-color:rgba(71,85,105,.8)}
    .ys-search-input::placeholder{color:#94a3b8}
    .ys-search-results{max-height:min(62vh,620px);overflow:auto;padding:10px}
    .ys-search-result{display:block;padding:14px 14px 13px;border-radius:14px;text-decoration:none;color:#0f172a}
    .ys-search-result:hover,.ys-search-result[data-active=true]{background:#eff6ff}
    .dark .ys-search-result{color:#e2e8f0}.dark .ys-search-result:hover,.dark .ys-search-result[data-active=true]{background:rgba(30,41,59,.92)}
    .ys-search-title{font-weight:700;font-size:15px;line-height:1.35;margin-bottom:4px}
    .ys-search-desc{font-size:13px;line-height:1.45;color:#64748b;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .dark .ys-search-desc{color:#94a3b8}
    .ys-search-meta{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;font-size:11px;color:#64748b}
    .ys-search-tag{border-radius:999px;background:#f1f5f9;padding:2px 7px}.dark .ys-search-tag{background:#1e293b;color:#cbd5e1}
    .ys-search-empty{padding:34px 18px;text-align:center;color:#64748b;font-size:14px}
  `;
  document.head.appendChild(styles);

  async function loadIndex() {
    if (state.index) return state.index;
    const response = await fetch("/search-index.json", { cache: "force-cache" });
    state.index = await response.json();
    return state.index;
  }

  function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  }

  function scorePage(page, terms) {
    const title = page.title.toLowerCase();
    const description = page.description.toLowerCase();
    const tags = (page.tags || []).join(" ").toLowerCase();
    const text = page.text.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 24;
      if (description.includes(term)) score += 10;
      if (tags.includes(term)) score += 8;
      if (text.includes(term)) score += 2;
    }
    return score - (page.navRank || 0);
  }

  function resultHtml(page, active) {
    const tags = (page.tags || []).slice(0, 4).map((tag) => `<span class="ys-search-tag">${escapeHtml(tag)}</span>`).join("");
    return `<a class="ys-search-result" data-active="${active ? "true" : "false"}" href="${page.href}">
      <div class="ys-search-title">${escapeHtml(page.title)}</div>
      <div class="ys-search-desc">${escapeHtml(page.description || page.text.slice(0, 180))}</div>
      <div class="ys-search-meta">${page.date ? `<span>${escapeHtml(page.date)}</span>` : ""}${tags}</div>
    </a>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  async function openSearch() {
    if (state.open) return;
    state.open = true;
    const backdrop = document.createElement("div");
    backdrop.className = "ys-search-backdrop";
    backdrop.innerHTML = `<div class="ys-search-panel" role="dialog" aria-modal="true" aria-label="Search documentation">
      <input class="ys-search-input" placeholder="Search notes..." autocomplete="off" />
      <div class="ys-search-results"><div class="ys-search-empty">Type to search this blog.</div></div>
    </div>`;
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector(".ys-search-input");
    const results = backdrop.querySelector(".ys-search-results");
    const close = () => { state.open = false; backdrop.remove(); };
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
    input.focus();
    const index = await loadIndex();

    function render() {
      const terms = tokenize(input.value);
      if (!terms.length) {
        results.innerHTML = index.slice(0, maxResults).map((page, i) => resultHtml(page, i === 0)).join("");
        return;
      }
      const matches = index
        .map((page) => ({ page, score: scorePage(page, terms) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map((item) => item.page);
      results.innerHTML = matches.length ? matches.map((page, i) => resultHtml(page, i === 0)).join("") : `<div class="ys-search-empty">No results for "${escapeHtml(input.value)}".</div>`;
    }

    input.addEventListener("input", render);
    backdrop.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
      if (event.key === "Enter") {
        const active = results.querySelector(".ys-search-result[data-active=true]") || results.querySelector(".ys-search-result");
        if (active) window.location.href = active.href;
      }
    });
    render();
  }

  function intercept(event) {
    const target = event.target.closest && event.target.closest(searchSelector);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    openSearch();
  }

  function neutralizeNativeSearchHandlers() {
    document.querySelectorAll(searchSelector).forEach((button) => {
      if (button.dataset.ysLocalSearch === "true") return;
      const clone = button.cloneNode(true);
      clone.dataset.ysLocalSearch = "true";
      clone.addEventListener("click", intercept, true);
      clone.addEventListener("pointerdown", intercept, true);
      clone.addEventListener("mousedown", intercept, true);
      button.replaceWith(clone);
    });
  }

  neutralizeNativeSearchHandlers();
  new MutationObserver(neutralizeNativeSearchHandlers).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("pointerdown", intercept, true);
  document.addEventListener("mousedown", intercept, true);
  document.addEventListener("click", intercept, true);
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      event.stopImmediatePropagation();
      openSearch();
    }
  }, true);
}

const localSearchScript = `(${localSearchClient.toString()})();\n`;

writeFileSync(searchScriptPath, localSearchScript);

const scriptTag = '<script src="/local-search.js" defer></script>';
for (const htmlPath of walkFiles(outputDir).filter((file) => file.endsWith(".html"))) {
  let html = readFileSync(htmlPath, "utf8");
  if (!html.includes(scriptTag)) {
    html = html.replace("</body>", `${scriptTag}</body>`);
    writeFileSync(htmlPath, html);
  }
}
