#!/usr/bin/env bun
/**
 * Daily GitHub Pages generator for awesome-bioinformatics_youbetterknow.
 *
 * The script is intentionally dependency-free so GitHub Actions only needs Bun.
 *
 * Usage:
 *   bun ./bioinformatics-youbetterknow.ts --catalog data/catalog.json --output site/awesome-bioinformatics.md --json-output site/data/latest.json --history-output site/data/history.json --snapshot-dir site/data/snapshots
 *   bun ./bioinformatics-youbetterknow.ts --discover-only --catalog data/catalog.json
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

type CatalogEntry = {
  name: string;
  type: string;
  url: string;
  github?: string;
  tags?: string[];
  description?: string;
  homepage?: string;
  discovered?: boolean;
  discovered_at?: string;
  discovery_source?: string;
  discovery_reason?: string;
  language?: string;
  license?: string;
  updated_at?: string;
  pushed_at?: string;
  forks_snapshot?: number;
  stars_snapshot_2026_05_17?: number;
  [key: string]: unknown;
};

type RepoStats = {
  fullName: string;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  updatedAt: string | null;
  pushedAt: string | null;
  description: string | null;
  htmlUrl: string | null;
  homepage: string | null;
  language: string | null;
  license: string | null;
  topics: string[];
  archived: boolean;
  fork: boolean;
  error?: string;
};

type RankedProject = CatalogEntry & {
  id: string;
  repo: string | null;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  pushedAt: string | null;
  updatedAt: string | null;
  liveDescription: string | null;
  htmlUrl: string;
  score: number;
  typeLabel: string;
};

const DEFAULT_CATALOG = "data/catalog.json";
const DEFAULT_OUTPUT = "site/awesome-bioinformatics.md";
const DEFAULT_JSON_OUTPUT = "site/data/latest.json";
const DEFAULT_HISTORY_OUTPUT = "site/data/history.json";
const DEFAULT_SNAPSHOT_DIR = "site/data/snapshots";

const DISCOVERY_TOPICS = [
  "bioinformatics",
  "biomedical",
  "computational-biology",
  "genomics",
  "transcriptomics",
  "single-cell",
  "proteomics",
  "metagenomics",
  "cheminformatics",
  "drug-discovery",
];

const BIO_TERMS = [
  "bioinformatics",
  "biomedical",
  "biology",
  "biological",
  "genomic",
  "genomics",
  "transcriptomics",
  "proteomics",
  "metabolomics",
  "metagenomics",
  "single-cell",
  "sequencing",
  "variant",
  "microbiome",
  "protein",
  "drug discovery",
  "cheminformatics",
  "clinical",
  "medical",
];

const RELATED_TERMS = [
  "workflow",
  "pipeline",
  "analysis",
  "tool",
  "toolkit",
  "database",
  "visualization",
  "annotation",
  "sequence",
  "sequencing",
  "machine learning",
  "deep learning",
  "ai",
  "model",
  "agent",
  "benchmark",
  "package",
  "library",
  "framework",
];

const TYPE_LABELS: Record<string, string> = {
  "awesome-list": "Awesome 清单",
  "workflow-community": "工作流社区",
  "workflow-engine": "工作流引擎",
  "web-platform": "Web 平台",
  "package-ecosystem": "包生态",
  "package-channel": "包管理",
  "container-registry": "容器生态",
  "reporting-tool": "QC/报告",
  library: "程序库",
  "cli-toolkit": "命令行工具",
  "variant-toolkit": "变异分析",
  "ai-variant-caller": "AI 变异检测",
  "single-cell-library": "单细胞库",
  "single-cell-browser": "单细胞浏览",
  "cancer-genomics-platform": "癌症基因组",
  "variant-annotation": "变异注释",
  "protein-structure-ai": "蛋白结构 AI",
  "protein-language-model": "蛋白语言模型",
  "sequence-search": "序列检索",
  "protein-design-ai": "蛋白设计 AI",
  "discovered-github-repo": "自动发现",
};

const STATIC_TYPE_WEIGHT: Record<string, number> = {
  "awesome-list": 100,
  "workflow-community": 98,
  "workflow-engine": 96,
  "web-platform": 95,
  "package-ecosystem": 94,
  "package-channel": 93,
  "container-registry": 93,
  "reporting-tool": 91,
  library: 88,
  "cli-toolkit": 88,
  "variant-toolkit": 87,
  "ai-variant-caller": 87,
  "single-cell-library": 86,
  "single-cell-browser": 85,
  "cancer-genomics-platform": 84,
  "variant-annotation": 84,
  "protein-structure-ai": 84,
  "protein-language-model": 83,
  "sequence-search": 83,
  "protein-design-ai": 82,
  "discovered-github-repo": 75,
};

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function todayKey(date = new Date()) {
  return `stars_snapshot_${date.toISOString().slice(0, 10).replaceAll("-", "_")}`;
}

function todayDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function dateTimeForDisplay(date = new Date()) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function normalizeRepo(repo?: string | null) {
  if (!repo) return null;
  return repo.replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
}

function optionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function projectId(entry: CatalogEntry) {
  return (normalizeRepo(entry.github) ?? entry.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function includesAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function inferType(repo: RepoStats, text: string): string {
  const lower = text.toLowerCase();
  const topicSet = new Set(repo.topics.map((topic) => topic.toLowerCase()));
  if (topicSet.has("single-cell") || lower.includes("single-cell") || lower.includes("scrna")) return "single-cell-library";
  if (topicSet.has("workflow") || lower.includes("workflow") || lower.includes("pipeline")) return "workflow-engine";
  if (topicSet.has("proteomics") || lower.includes("protein")) return "protein-structure-ai";
  if (lower.includes("variant") || lower.includes("vcf")) return "variant-toolkit";
  if (lower.includes("visualization") || lower.includes("browser")) return "web-platform";
  if (lower.includes("package") || lower.includes("library")) return "library";
  return "discovered-github-repo";
}

async function readJson<T>(path: string, fallback: T): Promise<T> {
  if (!existsSync(path)) return fallback;
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function githubFetch<T>(url: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "awesome-bioinformatics-youbetterknow",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return (await response.json()) as T;
}

async function fetchRepoStats(repo: string, token?: string): Promise<RepoStats> {
  const normalized = normalizeRepo(repo);
  if (!normalized) throw new Error(`Invalid repo: ${repo}`);
  try {
    const data = await githubFetch<any>(`https://api.github.com/repos/${normalized}`, token);
    return {
      fullName: data.full_name,
      stars: data.stargazers_count ?? null,
      forks: data.forks_count ?? null,
      openIssues: data.open_issues_count ?? null,
      updatedAt: data.updated_at ?? null,
      pushedAt: data.pushed_at ?? null,
      description: data.description ?? null,
      htmlUrl: data.html_url ?? `https://github.com/${normalized}`,
      homepage: data.homepage || null,
      language: data.language ?? null,
      license: data.license?.spdx_id ?? null,
      topics: Array.isArray(data.topics) ? data.topics : [],
      archived: Boolean(data.archived),
      fork: Boolean(data.fork),
    };
  } catch (error) {
    return {
      fullName: normalized,
      stars: null,
      forks: null,
      openIssues: null,
      updatedAt: null,
      pushedAt: null,
      description: null,
      htmlUrl: `https://github.com/${normalized}`,
      homepage: null,
      language: null,
      license: null,
      topics: [],
      archived: false,
      fork: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function fetchReadmeText(repo: string, token?: string): Promise<string> {
  const normalized = normalizeRepo(repo);
  if (!normalized) return "";
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.raw",
      "User-Agent": "awesome-bioinformatics-youbetterknow",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`https://api.github.com/repos/${normalized}/readme`, { headers });
    if (!response.ok) return "";
    return (await response.text()).slice(0, 20000);
  } catch {
    return "";
  }
}

function passesDiscoveryFilters(repo: RepoStats, readme: string, existingRepos: Set<string>, minStars: number) {
  const normalized = repo.fullName.toLowerCase();
  const text = `${repo.description ?? ""}\n${readme}`;
  const hasAllowedTopic = repo.topics.some((topic) => DISCOVERY_TOPICS.includes(topic.toLowerCase()));
  const hasBioTerm = includesAny(text, BIO_TERMS);
  const hasRelatedTerm = includesAny(text, RELATED_TERMS);
  return (
    !existingRepos.has(normalized) &&
    !repo.archived &&
    !repo.fork &&
    typeof repo.stars === "number" &&
    repo.stars >= minStars &&
    hasAllowedTopic &&
    hasBioTerm &&
    hasRelatedTerm
  );
}

function discoveryReason(repo: RepoStats, readme: string) {
  const text = `${repo.description ?? ""}\n${readme}`.toLowerCase();
  const topic = repo.topics.find((item) => DISCOVERY_TOPICS.includes(item.toLowerCase())) ?? "bioinformatics";
  const bio = BIO_TERMS.find((term) => text.includes(term.toLowerCase())) ?? "bio term";
  const related = RELATED_TERMS.find((term) => text.includes(term.toLowerCase())) ?? "related term";
  return `topic:${topic}; stars:${repo.stars}; text:${bio}+${related}`;
}

export async function discoverNewProjects(options: {
  catalogPath: string;
  token?: string;
  minStars?: number;
  limit?: number;
}) {
  const minStars = options.minStars ?? Number(process.env.DISCOVERY_MIN_STARS ?? 10);
  const limit = options.limit ?? Number(process.env.DISCOVERY_LIMIT ?? 5);
  const catalog = await readJson<CatalogEntry[]>(options.catalogPath, []);
  const existingRepos = new Set(catalog.map((entry) => normalizeRepo(entry.github)?.toLowerCase()).filter(Boolean) as string[]);
  const seenCandidates = new Set<string>();
  const candidates: Array<{ repo: RepoStats; readme: string; reason: string }> = [];

  for (const topic of DISCOVERY_TOPICS) {
    const query = encodeURIComponent(`topic:${topic} stars:>=${minStars} pushed:>2024-01-01 fork:false archived:false`);
    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=15`;
    let results: any[] = [];
    try {
      const data = await githubFetch<any>(url, options.token);
      results = Array.isArray(data.items) ? data.items : [];
    } catch (error) {
      console.warn(`Discovery query failed for topic:${topic}:`, error instanceof Error ? error.message : error);
      continue;
    }

    for (const item of results) {
      const fullName = item.full_name as string;
      if (!fullName || existingRepos.has(fullName.toLowerCase()) || seenCandidates.has(fullName.toLowerCase())) continue;
      seenCandidates.add(fullName.toLowerCase());
      const repo = await fetchRepoStats(fullName, options.token);
      const readme = await fetchReadmeText(fullName, options.token);
      if (passesDiscoveryFilters(repo, readme, existingRepos, minStars)) {
        candidates.push({ repo, readme, reason: discoveryReason(repo, readme) });
      }
    }
  }

  candidates.sort((a, b) => (b.repo.stars ?? 0) - (a.repo.stars ?? 0));
  const selected = candidates.slice(0, Math.max(0, limit));
  if (!selected.length) {
    console.log("discoverNewProjects: no new projects passed strict filters.");
    return { added: 0, catalog };
  }

  const snapshotKey = todayKey();
  for (const candidate of selected) {
    const combinedText = `${candidate.repo.description ?? ""}\n${candidate.readme}`;
    catalog.push({
      name: candidate.repo.fullName.split("/").at(-1) ?? candidate.repo.fullName,
      type: inferType(candidate.repo, combinedText),
      url: candidate.repo.htmlUrl ?? `https://github.com/${candidate.repo.fullName}`,
      github: candidate.repo.fullName,
      tags: [...new Set(["auto-discovered", ...candidate.repo.topics.slice(0, 8)])],
      description: candidate.repo.description ?? undefined,
      homepage: candidate.repo.homepage ?? undefined,
      discovered: true,
      discovered_at: todayDate(),
      discovery_source: "GitHub Search API",
      discovery_reason: candidate.reason,
      language: candidate.repo.language ?? undefined,
      license: candidate.repo.license ?? undefined,
      updated_at: candidate.repo.updatedAt ?? undefined,
      pushed_at: candidate.repo.pushedAt ?? undefined,
      forks_snapshot: candidate.repo.forks ?? undefined,
      [snapshotKey]: candidate.repo.stars ?? undefined,
    });
    existingRepos.add(candidate.repo.fullName.toLowerCase());
  }

  catalog.sort((a, b) => {
    const weightDelta = (STATIC_TYPE_WEIGHT[b.type] ?? 0) - (STATIC_TYPE_WEIGHT[a.type] ?? 0);
    if (weightDelta) return weightDelta;
    return a.name.localeCompare(b.name);
  });
  await writeJson(options.catalogPath, catalog);
  console.log(`discoverNewProjects: added ${selected.length} project(s): ${selected.map((item) => item.repo.fullName).join(", ")}`);
  return { added: selected.length, catalog };
}

function rankScore(entry: CatalogEntry, stats: RepoStats | null) {
  const typeWeight = STATIC_TYPE_WEIGHT[entry.type] ?? 70;
  const stars = stats?.stars ?? Number(entry[todayKey()] ?? entry.stars_snapshot_2026_05_17 ?? 0);
  const activity = stats?.pushedAt ? Math.max(0, 10 - Math.floor((Date.now() - Date.parse(stats.pushedAt)) / (1000 * 60 * 60 * 24 * 120))) : 0;
  return Math.round((typeWeight + Math.log10(stars + 1) * 6 + activity) * 10) / 10;
}

async function buildProjects(catalog: CatalogEntry[], token?: string): Promise<RankedProject[]> {
  const projects: RankedProject[] = [];
  for (const entry of catalog) {
    const repo = normalizeRepo(entry.github);
    const stats = repo ? await fetchRepoStats(repo, token) : null;
    projects.push({
      ...entry,
      id: projectId(entry),
      repo,
      stars: stats?.stars ?? optionalNumber(entry[todayKey()] ?? entry.stars_snapshot_2026_05_17),
      forks: stats?.forks ?? optionalNumber(entry.forks_snapshot),
      openIssues: stats?.openIssues ?? null,
      pushedAt: stats?.pushedAt ?? String(entry.pushed_at ?? ""),
      updatedAt: stats?.updatedAt ?? String(entry.updated_at ?? ""),
      liveDescription: stats?.description ?? entry.description ?? null,
      htmlUrl: stats?.htmlUrl ?? entry.url,
      homepage: stats?.homepage ?? entry.homepage,
      language: stats?.language ?? entry.language,
      license: stats?.license ?? entry.license,
      tags: [...new Set([...(entry.tags ?? []), ...(stats?.topics ?? [])])],
      typeLabel: TYPE_LABELS[entry.type] ?? entry.type,
      score: rankScore(entry, stats),
    });
  }
  return projects.sort((a, b) => b.score - a.score || (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name));
}

function latestPayload(projects: RankedProject[]) {
  const generatedAt = new Date();
  return {
    generatedAt: generatedAt.toISOString(),
    generatedDate: todayDate(generatedAt),
    generatedDateTime: dateTimeForDisplay(generatedAt),
    timezone: "Asia/Shanghai",
    totals: {
      projects: projects.length,
      repos: projects.filter((project) => project.repo).length,
      stars: projects.reduce((sum, project) => sum + (project.stars ?? 0), 0),
      forks: projects.reduce((sum, project) => sum + (project.forks ?? 0), 0),
      discovered: projects.filter((project) => project.discovered).length,
      categories: [...new Set(projects.map((project) => project.type))].length,
    },
    projects: projects.map((project, index) => ({
      rank: index + 1,
      id: project.id,
      name: project.name,
      type: project.type,
      typeLabel: project.typeLabel,
      url: project.htmlUrl || project.url,
      homepage: project.homepage ?? null,
      repo: project.repo,
      stars: project.stars,
      forks: project.forks,
      openIssues: project.openIssues,
      pushedAt: project.pushedAt,
      updatedAt: project.updatedAt,
      language: project.language ?? null,
      license: project.license ?? null,
      score: project.score,
      tags: project.tags ?? [],
      description: project.liveDescription ?? project.description ?? "",
      discovered: Boolean(project.discovered),
      discoveredAt: project.discovered_at ?? null,
      discoveryReason: project.discovery_reason ?? null,
    })),
  };
}

async function updateHistory(historyPath: string, snapshotDir: string, latest: ReturnType<typeof latestPayload>) {
  const history = await readJson<{ snapshots: any[] }>(historyPath, { snapshots: [] });
  const snapshot = {
    generatedAt: latest.generatedAt,
    date: latest.generatedDate,
    projects: latest.projects.map((project) => ({
      id: project.id,
      name: project.name,
      repo: project.repo,
      stars: project.stars,
      forks: project.forks,
      score: project.score,
    })),
  };
  history.snapshots = [...(history.snapshots ?? []).filter((item) => item.date !== latest.generatedDate), snapshot]
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-400);
  await writeJson(historyPath, history);
  await writeJson(join(snapshotDir, `${latest.generatedDate}.json`), snapshot);
  return history;
}

function markdown(projects: RankedProject[], latest: ReturnType<typeof latestPayload>) {
  const lines: string[] = [];
  lines.push("# Awesome Bioinformatics YouBetterKnow - Daily GitHub Snapshot");
  lines.push("");
  lines.push(`> Generated at ${latest.generatedDateTime} ${latest.timezone}. GitHub stars/forks are live API snapshots; scientific usefulness still requires version, license, and data-contract checks.`);
  lines.push("");
  lines.push(`- Projects: **${latest.totals.projects}**`);
  lines.push(`- GitHub repos: **${latest.totals.repos}**`);
  lines.push(`- Total stars: **${latest.totals.stars.toLocaleString("en-US")}**`);
  lines.push(`- Auto-discovered entries: **${latest.totals.discovered}**`);
  lines.push("");
  lines.push("| Rank | Score | Project | Type | Stars | Forks | Updated | Tags | Description |");
  lines.push("|---:|---:|:---|:---|---:|---:|:---:|:---|:---|");
  projects.forEach((project, index) => {
    const url = project.htmlUrl || project.url;
    lines.push(`| ${index + 1} | ${project.score} | [${project.name}](${url}) | ${project.typeLabel} | ${project.stars ?? "N/A"} | ${project.forks ?? "N/A"} | ${(project.pushedAt ?? project.updatedAt ?? "").slice(0, 10) || "N/A"} | ${(project.tags ?? []).slice(0, 4).join(", ")} | ${(project.liveDescription ?? project.description ?? "").replaceAll("|", "/").slice(0, 120)} |`);
  });
  lines.push("");
  lines.push("## Discovery Guardrails");
  lines.push("");
  lines.push("- GitHub topics must include one allowlisted bio topic, for example `bioinformatics`, `biomedical`, `genomics`, `single-cell`, `proteomics`, `drug-discovery`.");
  lines.push("- Stars must be above the configured threshold, default `DISCOVERY_MIN_STARS=10`.");
  lines.push("- Repository description plus README must contain at least one bio term and one project/tool term.");
  lines.push("- Forks, archived repositories, and repos already present in `data/catalog.json` are excluded.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

async function generate(options: {
  catalogPath: string;
  output: string;
  jsonOutput: string;
  historyOutput: string;
  snapshotDir: string;
  token?: string;
}) {
  const catalog = await readJson<CatalogEntry[]>(options.catalogPath, []);
  const projects = await buildProjects(catalog, options.token);
  const latest = latestPayload(projects);
  await mkdir(dirname(options.output), { recursive: true });
  await writeFile(options.output, markdown(projects, latest));
  await writeJson(options.jsonOutput, latest);
  await updateHistory(options.historyOutput, options.snapshotDir, latest);
  console.log(`Generated ${projects.length} projects into ${options.jsonOutput}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalogPath = String(args.catalog ?? DEFAULT_CATALOG);
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || undefined;
  const minStars = Number(args["min-stars"] ?? process.env.DISCOVERY_MIN_STARS ?? 10);
  const limit = Number(args["discovery-limit"] ?? process.env.DISCOVERY_LIMIT ?? 5);

  if (args["discover-only"]) {
    await discoverNewProjects({ catalogPath, token, minStars, limit });
    return;
  }

  if (args.discover) {
    await discoverNewProjects({ catalogPath, token, minStars, limit });
  }

  await generate({
    catalogPath,
    output: String(args.output ?? DEFAULT_OUTPUT),
    jsonOutput: String(args["json-output"] ?? DEFAULT_JSON_OUTPUT),
    historyOutput: String(args["history-output"] ?? DEFAULT_HISTORY_OUTPUT),
    snapshotDir: String(args["snapshot-dir"] ?? DEFAULT_SNAPSHOT_DIR),
    token,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
