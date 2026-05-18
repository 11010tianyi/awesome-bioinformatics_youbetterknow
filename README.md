# awesome-bioinformatics_youbetterknow

面向生物信息程序员的整合性资源项目：把生信领域的 awesome 清单、工作流生态、主流工具链、数据库网站、单细胞/多组学、AI+Bio 项目和可复现工程基础设施放到同一张可检索地图里。

> 快照日期：2026-05-17  
> 适用读者：需要搭建、维护或评估生物信息分析栈的程序员、科研工程师和组学分析人员。  
> 整理原则：优先收录可直接使用、有活跃社区或在真实项目中高频出现的项目、工具、网站和平台。

## 项目导航

| 路径 | 内容 |
|:---|:---|
| [相关性资源集/Bioinformatics_YouBetterKnow_全网高相关性项目清单.md](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/相关性资源集/Bioinformatics_YouBetterKnow_全网高相关性项目清单.md) | 主清单：按相关性打分排序，含链接、类型、定位和使用建议 |
| [learning/生信程序员最小知识地图.md](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/learning/生信程序员最小知识地图.md) | 从程序员视角拆解生信必备知识层：数据格式、工作流、组学任务、数据库、AI+Bio |
| [data/catalog.json](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/data/catalog.json) | 机器可读种子目录，便于后续生成网页、同步 star 或扩展标签 |
| [bioinformatics-youbetterknow.ts](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/bioinformatics-youbetterknow.ts) | 自动日更生成器：抓取 GitHub 元数据、生成 Pages 数据、严格发现新种子 |
| [site/index.html](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/site/index.html) | GitHub Pages 静态仪表盘入口 |

## 当前覆盖范围

- Awesome 与资源索引：Awesome-Bioinformatics、awesome-ai-bioinformatics、bio.tools、WorkflowHub。
- 可复现工作流：Nextflow、nf-core、Snakemake、CWL、WDL/Cromwell、Galaxy、Dockstore、Terra/AnVIL。
- 包管理与容器：Bioconductor、Bioconda、BioContainers、MultiQC。
- 核心分析栈：SAMtools/HTSlib/BCFtools、GATK、DeepVariant、fastp、STAR、minimap2、Salmon、Biopython、scverse、Seurat。
- 数据库与网站：NCBI、Ensembl/VEP、UCSC Genome Browser、UniProt、RCSB PDB、gnomAD、cBioPortal、Open Targets、Reactome、STRING、CELLxGENE。
- 细分方向：单细胞、宏基因组、蛋白质组、变异注释、基因组浏览器、病原组学、群体遗传。
- AI+Bio：AlphaFold、OpenFold、ESM、MMseqs2、RFdiffusion、ProteinMPNN、DeepVariant。

## 使用方式

1. 先看主清单的前 20 项，确定你要构建的是「工作流平台」「分析工具箱」「数据库索引」还是「AI+Bio 工具链」。
2. 如果要做新项目，优先从 `nf-core + Nextflow + Bioconda/BioContainers + MultiQC` 组合开始，避免过早自造轮子。
3. 如果要做工具评估，把主清单中的「类型」「一句话定位」「适合场景」当作第一轮筛选字段。
4. 后续可用 `data/catalog.json` 扩展为静态网页、搜索索引或定期 GitHub 元数据同步脚本。

## 自动日更 GitHub Pages

本项目已加入参考 `11010tianyi/bioagent-leaderboard-updater` 的自动更新结构，但生成器命名、数据模型和页面视觉已改成本项目专属实现：

- `.github/workflows/update-github-pages.yml`：每天 09:20 Asia/Shanghai、手动触发或推送到 `main` 时运行。
- `bioinformatics-youbetterknow.ts`：读取 `data/catalog.json`，刷新 GitHub stars/forks/update timestamps，生成 `site/data/latest.json`、`site/data/history.json`、每日 snapshot 和 `site/awesome-bioinformatics.md`。
- `site/`：可直接部署为 GitHub Pages 的静态站点。

自动发现新种子由 `discoverNewProjects()` 完成，默认守门条件：

- GitHub topic 必须包含白名单之一：`bioinformatics`、`biomedical`、`computational-biology`、`genomics`、`single-cell`、`proteomics` 等。
- stars 默认 `>= 10`，可通过 `DISCOVERY_MIN_STARS` 调整。
- 仓库描述 + README 必须同时命中至少一个 bio 类词和一个工具/项目相关词。
- 排除 fork、archived repo，以及已在 `data/catalog.json` 中出现过的 `github` repo。
- 每次最多加入 5 个，可通过 `DISCOVERY_LIMIT` 调整。

本地生成：

```bash
node --experimental-strip-types ./bioinformatics-youbetterknow.ts \
  --catalog data/catalog.json \
  --output site/awesome-bioinformatics.md \
  --json-output site/data/latest.json \
  --history-output site/data/history.json \
  --snapshot-dir site/data/snapshots
```

GitHub Actions 中使用 Bun，仓库启用 Pages 后选择 GitHub Actions 作为部署源即可。

## 维护说明

- GitHub stars 和更新时间来自 2026-05-17 的 GitHub REST API 快照；实时数值请以项目页面为准。
- 部分数据库、SaaS 和官方门户不是 GitHub 仓库，因此以官网入口和用途为主。
- 本项目是高相关性导航，不替代具体工具的版本锁定、许可审查和生产环境验证。
