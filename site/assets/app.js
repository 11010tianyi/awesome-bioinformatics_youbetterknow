const state = { query: "", type: "all", rangeDays: 30, latest: null, history: null };

const colors = ["#1f7a5c", "#227f9b", "#b84d63", "#9f7617", "#456cad", "#6f58a8", "#c66a33", "#557d3d"];
const fmt = new Intl.NumberFormat("en-US");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? fmt.format(value) : "N/A";
}

function shortDate(value) {
  return value ? String(value).slice(0, 10) : "N/A";
}

function byRank(a, b) {
  return (a.rank ?? 9999) - (b.rank ?? 9999);
}

function snapshotValue(snapshot, id) {
  return snapshot?.projects?.find((project) => project.id === id)?.stars ?? null;
}

function deltaFor(project, days) {
  const snapshots = state.history?.snapshots ?? [];
  if (!snapshots.length || typeof project.stars !== "number") return 0;
  const latestTime = Date.parse(state.latest.generatedAt);
  const target = latestTime - days * 24 * 60 * 60 * 1000;
  const ordered = snapshots.slice().sort((a, b) => Date.parse(a.generatedAt) - Date.parse(b.generatedAt));
  const baseline = ordered.findLast((item) => Date.parse(item.generatedAt) <= target) ?? ordered[0];
  const previous = snapshotValue(baseline, project.id);
  return typeof previous === "number" ? project.stars - previous : 0;
}

function queryMatch(project) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  return [project.name, project.repo, project.typeLabel, project.description, ...(project.tags ?? [])]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(q));
}

function typeMatch(project) {
  return state.type === "all" || project.type === state.type;
}

function renderStats() {
  const projects = state.latest.projects;
  const leader = projects.find((project) => project.repo);
  const thirtyDay = projects.reduce((sum, project) => sum + Math.max(0, deltaFor(project, 30)), 0);
  const stats = [
    ["项目数", number(state.latest.totals.projects), `${state.latest.totals.categories} 个类型`],
    ["总 Stars", number(state.latest.totals.stars), `${state.latest.totals.repos} 个 GitHub repo`],
    ["30D 增长", `+${number(thirtyDay)}`, "基于历史快照"],
    ["当前 Leader", leader?.name ?? "N/A", leader ? `${number(leader.stars)} stars` : "N/A"],
  ];
  document.getElementById("stats").innerHTML = stats.map(([label, value, foot]) => `
    <article class="stat">
      <div class="stat-label">${escapeHtml(label)}</div>
      <div class="stat-value">${escapeHtml(value)}</div>
      <div class="stat-foot">${escapeHtml(foot)}</div>
    </article>
  `).join("");
}

function renderCategoryShare() {
  const totals = new Map();
  for (const project of state.latest.projects) {
    totals.set(project.typeLabel, (totals.get(project.typeLabel) ?? 0) + (project.stars ?? 0));
  }
  const rows = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = Math.max(1, ...rows.map(([, stars]) => stars));
  document.getElementById("category-share").innerHTML = rows.map(([name, stars], index) => `
    <div class="category-row">
      <div class="category-name">${escapeHtml(name)}</div>
      <div class="bar"><span style="width:${Math.max(2, (stars / max) * 100)}%;background:${colors[index % colors.length]}"></span></div>
      <div class="category-value">${number(stars)}</div>
    </div>
  `).join("");
}

function renderDiscoveryList() {
  const rows = state.latest.projects
    .filter((project) => project.discovered)
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
    .slice(0, 8);
  const fallback = state.latest.projects.filter((project) => project.tags?.includes("auto-discovered")).slice(0, 8);
  const shown = rows.length ? rows : fallback;
  document.getElementById("discovery-list").innerHTML = shown.length ? shown.map((project, index) => `
    <div class="growth-row">
      <a class="growth-name" href="${escapeHtml(project.url)}">${escapeHtml(project.name)}</a>
      <div class="bar"><span style="width:${Math.max(8, 100 - index * 9)}%;background:${colors[index % colors.length]}"></span></div>
      <div class="growth-delta">${number(project.stars)}</div>
    </div>
  `).join("") : `<p class="muted">还没有自动发现条目；首次日更后会在这里显示。</p>`;
}

function renderTrendChart() {
  const snapshots = (state.history?.snapshots ?? []).slice().sort((a, b) => Date.parse(a.generatedAt) - Date.parse(b.generatedAt));
  const topProjects = state.latest.projects.filter((p) => p.repo).slice().sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0)).slice(0, 6);
  const latestTime = Date.parse(state.latest.generatedAt);
  const minTime = latestTime - state.rangeDays * 24 * 60 * 60 * 1000;
  let visible = snapshots.filter((item) => Date.parse(item.generatedAt) >= minTime);
  if (visible.length < 2 && snapshots.length) visible = snapshots.slice(-Math.min(2, snapshots.length));
  if (!visible.some((item) => item.generatedAt === state.latest.generatedAt)) visible.push({ generatedAt: state.latest.generatedAt, date: state.latest.generatedDate, projects: state.latest.projects });

  const values = [];
  for (const project of topProjects) {
    for (const snap of visible) values.push(snapshotValue(snap, project.id) ?? project.stars ?? 0);
  }
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const pad = 38;
  const width = 980;
  const height = 330;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const x = (i) => pad + (visible.length <= 1 ? plotW : (i / (visible.length - 1)) * plotW);
  const y = (v) => pad + (1 - ((v - min) / Math.max(1, max - min))) * plotH;

  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const yy = pad + t * plotH;
    const value = Math.round(max - t * (max - min));
    return `<line class="grid" x1="${pad}" y1="${yy}" x2="${width - pad}" y2="${yy}" /><text class="chart-label" x="8" y="${yy + 4}">${number(value)}</text>`;
  }).join("");
  const lines = topProjects.map((project, pIndex) => {
    const points = visible.map((snap, i) => `${x(i)},${y(snapshotValue(snap, project.id) ?? project.stars ?? 0)}`).join(" ");
    return `<polyline fill="none" stroke="${colors[pIndex % colors.length]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" />`;
  }).join("");
  const labels = visible.map((snap, i) => `<text class="chart-label" x="${x(i) - 18}" y="${height - 10}">${escapeHtml(String(snap.date).slice(5))}</text>`).join("");
  document.getElementById("trend-chart").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img">
      ${grid}
      <line class="axis" x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" />
      ${lines}
      ${labels}
    </svg>
    <div class="legend">${topProjects.map((project, index) => `<span><i style="background:${colors[index % colors.length]}"></i>${escapeHtml(project.name)}</span>`).join("")}</div>
  `;
}

function renderTable() {
  const rows = state.latest.projects.filter(typeMatch).filter(queryMatch).sort(byRank);
  document.getElementById("leaderboard").innerHTML = rows.map((project, index) => `
    <tr>
      <td>${index + 1}</td>
      <td class="project-cell">
        <a href="${escapeHtml(project.url)}"><strong>${escapeHtml(project.name)}</strong></a>
        <span>${escapeHtml(project.repo ?? project.homepage ?? "")}</span>
      </td>
      <td><span class="badge">${escapeHtml(project.typeLabel)}</span></td>
      <td>${number(project.stars)}</td>
      <td>+${number(deltaFor(project, 30))}</td>
      <td>${number(project.forks)}</td>
      <td>${escapeHtml(project.language ?? "N/A")}</td>
      <td>${shortDate(project.pushedAt ?? project.updatedAt)}</td>
      <td class="reason">${escapeHtml(project.description)}</td>
    </tr>
  `).join("");
}

function renderTypeFilter() {
  const select = document.getElementById("type-filter");
  const options = [...new Map(state.latest.projects.map((project) => [project.type, project.typeLabel])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]));
  select.innerHTML = `<option value="all">全部类型</option>` + options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
}

function renderAll() {
  renderTypeFilter();
  renderStats();
  renderCategoryShare();
  renderDiscoveryList();
  renderTrendChart();
  renderTable();
  document.getElementById("updated-at").textContent = `更新于 ${state.latest.generatedDateTime} ${state.latest.timezone}`;
}

async function boot() {
  const [latest, history] = await Promise.all([
    fetch("data/latest.json").then((r) => r.json()),
    fetch("data/history.json").then((r) => r.json()).catch(() => ({ snapshots: [] })),
  ]);
  state.latest = latest;
  state.history = history;

  document.getElementById("trend-range").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.rangeDays = Number(button.dataset.days);
    document.querySelectorAll("#trend-range button").forEach((item) => item.classList.toggle("active", item === button));
    renderTrendChart();
  });
  document.getElementById("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderTable();
  });
  document.getElementById("type-filter").addEventListener("change", (event) => {
    state.type = event.target.value;
    renderTable();
  });

  renderAll();
}

boot().catch((error) => {
  document.body.innerHTML = `<main><section class="panel"><h1>数据加载失败</h1><p>${escapeHtml(error.message)}</p></section></main>`;
});
