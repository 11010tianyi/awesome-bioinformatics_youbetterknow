# Bioinformatics YouBetterKnow（本仓库）全网高相关性项目集合

> **说明**：本文档以「生物信息程序员需要快速建立可复现、可扩展、可检索的综合工具地图」为锚点，汇总全网高相关的开源项目、工具网站、数据库、工作流平台与 AI+Bio 资源。参考了 [danielecook/Awesome-Bioinformatics](https://github.com/danielecook/Awesome-Bioinformatics)、[HongxinXiang/awesome-ai-bioinformatics](https://github.com/HongxinXiang/awesome-ai-bioinformatics)、nf-core、Galaxy、Bioconductor、Bioconda、bio.tools 等公开资源。  
> **排序规则**：按 **与本项目主题的相关性得分（10 分制，高到低）** 排列；同分优先「整合性入口 / 工作流生态 / 高频生产工具 / 官方数据库 / AI+Bio 标杆」。

**相关性打分维度（综合）**

1. 是否能作为生信程序员的 **入口级地图或基础设施**，例如 awesome 清单、工作流社区、包管理、容器、工具注册表；
2. 是否覆盖真实项目中高频出现的 **数据格式、QC、比对、变异、表达、单细胞、多组学、蛋白结构、数据库检索**；
3. 是否有活跃社区、可复现工程实践、文档、示例、模块化流程或标准接口；
4. 是否适合二次开发、脚本集成、云端/HPC 执行、教学复用或生产化维护；
5. 对 AI+Bio 方向，额外考虑模型影响力、开源可运行性、GPU/数据依赖、与传统生信流程的衔接程度。

---

## 相关性排序总表（含链接直达）

| 排序 | 相关性 | 名称 | 类型 | 链接直达 | 一句话定位 |
|:---:|:---:|:---|:---|:---|:---|
| 1 | **10/10** | **Awesome-Bioinformatics** | Awesome 清单 | https://github.com/danielecook/Awesome-Bioinformatics | 经典生信资源总入口，覆盖库、软件、数据库、教程与主题清单 |
| 2 | **10/10** | **nf-core** | 工作流社区 | https://nf-co.re/ · https://github.com/nf-core/tools · https://github.com/nf-core/modules | Nextflow 生信流程事实标准社区，适合直接复用生产级 pipelines |
| 3 | **10/10** | **Galaxy Project** | Web 平台 / 工作流 | https://galaxyproject.org/ · https://github.com/galaxyproject/galaxy | 面向可视化分析、教学、工具包装和无代码工作流的成熟平台 |
| 4 | **10/10** | **Bioconductor** | R/Bio 生态 | https://www.bioconductor.org/ | 统计基因组学、转录组、差异分析和注释的 R 生态核心 |
| 5 | **9.8/10** | **Bioconda** | 包管理 | https://bioconda.github.io/ · https://github.com/bioconda/bioconda-recipes | 生信命令行工具的 Conda 分发主通道，环境复现的基础设施 |
| 6 | **9.8/10** | **BioContainers** | 容器生态 | https://biocontainers.pro/ · https://github.com/BioContainers/containers | 生信工具容器镜像生态，衔接 Docker、Singularity/Apptainer 与工作流 |
| 7 | **9.8/10** | **Nextflow** | 工作流引擎 | https://www.nextflow.io/ · https://github.com/nextflow-io/nextflow | 数据驱动 DSL，适合 HPC、云端、本地混合执行和 nf-core 生态 |
| 8 | **9.6/10** | **Snakemake** | 工作流引擎 | https://snakemake.github.io/ · https://github.com/snakemake/snakemake | Pythonic 工作流系统，适合实验室级 pipelines、规则化依赖和本地/HPC |
| 9 | **9.5/10** | **bio.tools** | 工具注册表 | https://bio.tools/ | ELIXIR 体系下的生信工具注册和发现入口，可按功能、主题、格式检索 |
| 10 | **9.5/10** | **MultiQC** | QC 报告 | https://multiqc.info/ · https://github.com/MultiQC/MultiQC | 把多样本、多工具 QC 输出聚合成统一报告的高频必备工具 |
| 11 | **9.3/10** | **awesome-ai-bioinformatics** | AI+Bio 清单 | https://github.com/HongxinXiang/awesome-ai-bioinformatics | AI 与生信交叉资源入口，适合补齐模型、论文和工具线索 |
| 12 | **9.2/10** | **Dockstore** | 工作流/工具注册 | https://dockstore.org/ · https://github.com/dockstore/dockstore-ui2 | 面向 CWL/WDL/Nextflow 的工具与工作流发布、发现和复用平台 |
| 13 | **9.2/10** | **WorkflowHub** | 工作流注册 | https://workflowhub.eu/ | 面向科研工作流的共享平台，适合查找可复用流程与 RO-Crate 元数据 |
| 14 | **9/10** | **Terra / AnVIL** | 云端组学平台 | https://terra.bio/ · https://anvilproject.org/ | Broad/NIH 生态的云端分析平台，适合大规模基因组数据协作 |
| 15 | **9/10** | **Common Workflow Language / cwltool** | 工作流标准 | https://www.commonwl.org/ · https://github.com/common-workflow-language/cwltool | 可移植命令行工作流标准，强调规范化、跨平台和工具描述 |
| 16 | **9/10** | **WDL / Cromwell** | 工作流语言/引擎 | https://openwdl.org/ · https://github.com/openwdl/wdl · https://github.com/broadinstitute/cromwell | Broad 系常用工作流语言与执行引擎，GATK/Terra 场景高频 |
| 17 | **8.9/10** | **Biopython** | Python 库 | https://biopython.org/ · https://github.com/biopython/biopython | Python 生物序列、文件解析、数据库访问和脚本胶水的经典工具箱 |
| 18 | **8.9/10** | **SAMtools / HTSlib / BCFtools** | HTS 基础工具 | https://www.htslib.org/ · https://github.com/samtools/samtools · https://github.com/samtools/htslib · https://github.com/samtools/bcftools | BAM/CRAM/VCF/BCF 处理的底层事实标准 |
| 19 | **8.8/10** | **GATK** | 变异分析工具箱 | https://gatk.broadinstitute.org/ · https://github.com/broadinstitute/gatk | 胚系/体细胞变异分析、BQSR、HaplotypeCaller 等流程核心 |
| 20 | **8.8/10** | **DeepVariant** | AI 变异检测 | https://github.com/google/deepvariant | 用深度学习从 NGS 数据调用变异，适合与传统 variant pipeline 对照 |
| 21 | **8.8/10** | **Ensembl / Ensembl VEP** | 注释数据库 / 变异注释 | https://www.ensembl.org/ · https://github.com/Ensembl/ensembl-vep | 基因组注释、比较基因组和变异效应预测的核心入口 |
| 22 | **8.7/10** | **NCBI** | 官方数据库群 | https://www.ncbi.nlm.nih.gov/ | SRA、Gene、RefSeq、BLAST、dbSNP、ClinVar、PubMed 等基础资源入口 |
| 23 | **8.7/10** | **UCSC Genome Browser** | 基因组浏览器 | https://genome.ucsc.edu/ | 参考基因组、tracks、坐标系统和可视化浏览的常用入口 |
| 24 | **8.7/10** | **IGV / igv.js** | 基因组可视化 | https://igv.org/ · https://github.com/igvteam/igv · https://github.com/igvteam/igv.js | 桌面和网页端基因组可视化组件，适合 BAM/VCF/track 检查 |
| 25 | **8.7/10** | **JBrowse 2** | Web 基因组浏览器 | https://jbrowse.org/jb2/ · https://github.com/GMOD/jbrowse-components | React 组件化现代 genome browser，适合嵌入式基因组门户 |
| 26 | **8.6/10** | **scverse / Scanpy / AnnData / scvi-tools** | 单细胞 Python 生态 | https://scverse.org/ · https://github.com/scverse/scanpy · https://github.com/scverse/anndata · https://github.com/scverse/scvi-tools | Python 单细胞分析、数据结构和深度生成模型生态 |
| 27 | **8.6/10** | **Seurat** | 单细胞 R 生态 | https://satijalab.org/seurat/ · https://github.com/satijalab/seurat | R 单细胞分析事实标准之一，整合、注释和可视化资料丰富 |
| 28 | **8.6/10** | **CELLxGENE / CELLxGENE Census** | 单细胞浏览/数据 | https://cellxgene.cziscience.com/ · https://github.com/chanzuckerberg/cellxgene | 单细胞 atlas 浏览、共享和公开数据发现入口 |
| 29 | **8.5/10** | **fastp / FastQC** | FASTQ QC | https://github.com/OpenGene/fastp · https://www.bioinformatics.babraham.ac.uk/projects/fastqc/ | reads 质控、adapter trimming 和基础质量报告的常用起点 |
| 30 | **8.5/10** | **STAR / Salmon** | RNA-seq 比对/定量 | https://github.com/alexdobin/STAR · https://github.com/COMBINE-lab/salmon | RNA-seq splice-aware alignment 与 transcript quantification 代表工具 |
| 31 | **8.5/10** | **minimap2 / Bowtie2 / BWA** | 序列比对 | https://github.com/lh3/minimap2 · https://github.com/BenLangmead/bowtie2 · https://github.com/lh3/bwa | 长读长、短读长和通用 read alignment 的基础工具 |
| 32 | **8.5/10** | **DESeq2 / edgeR / limma** | 差异分析 | https://bioconductor.org/packages/DESeq2/ · https://bioconductor.org/packages/edgeR/ · https://bioconductor.org/packages/limma/ | RNA-seq 和组学差异分析中最常见的统计包组合 |
| 33 | **8.5/10** | **AlphaFold / AlphaFold DB** | 蛋白结构 AI | https://github.com/google-deepmind/alphafold · https://alphafold.ebi.ac.uk/ | 蛋白结构预测和结构数据库的标杆资源 |
| 34 | **8.4/10** | **OpenFold** | 蛋白结构 AI | https://github.com/aqlaboratory/openfold | 可训练、GPU 友好的 PyTorch AlphaFold2 复现，适合模型开发 |
| 35 | **8.4/10** | **ESM** | 蛋白语言模型 | https://github.com/facebookresearch/esm | 蛋白语言模型和 embedding 生态的经典入口 |
| 36 | **8.4/10** | **MMseqs2** | 序列检索/聚类 | https://github.com/soedinglab/MMseqs2 | 超高速序列搜索与聚类，蛋白数据库构建和注释高频使用 |
| 37 | **8.3/10** | **RFdiffusion / ProteinMPNN** | 蛋白设计 AI | https://github.com/RosettaCommons/RFdiffusion · https://github.com/dauparas/ProteinMPNN | 结构生成与序列设计的代表项目，适合蛋白设计链路入门 |
| 38 | **8.3/10** | **UniProt** | 蛋白数据库 | https://www.uniprot.org/ | 蛋白序列、功能、注释和交叉引用的核心数据库 |
| 39 | **8.3/10** | **RCSB PDB** | 结构数据库 | https://www.rcsb.org/ | 蛋白与生物大分子实验结构数据入口 |
| 40 | **8.3/10** | **cBioPortal** | 癌症基因组平台 | https://www.cbioportal.org/ · https://github.com/cBioPortal/cbioportal | 癌症多组学、变异、拷贝数、表达与临床关联浏览平台 |
| 41 | **8.2/10** | **gnomAD** | 群体变异数据库 | https://gnomad.broadinstitute.org/ · https://github.com/broadinstitute/gnomad-browser | 人群变异频率和约束指标查询的高频入口 |
| 42 | **8.2/10** | **Open Targets Platform** | 靶点发现 | https://platform.opentargets.org/ | 疾病、靶点、遗传证据和药物发现证据整合平台 |
| 43 | **8.2/10** | **Reactome / STRING / KEGG** | 通路与网络 | https://reactome.org/ · https://string-db.org/ · https://www.kegg.jp/ | 通路富集、蛋白互作、代谢网络和功能解释常用资源 |
| 44 | **8.1/10** | **QIIME 2** | 微生物组平台 | https://qiime2.org/ | 可追踪 provenance 的微生物组分析平台，适合扩增子和生态分析 |
| 45 | **8.1/10** | **MetaPhlAn / HUMAnN** | 宏基因组 profiling | https://github.com/biobakery/MetaPhlAn · https://github.com/biobakery/humann | Shotgun metagenomics 物种组成和功能组成分析常用组合 |
| 46 | **8.1/10** | **Kraken2 / Bracken** | 物种分类/丰度 | https://github.com/DerrickWood/kraken2 · https://github.com/jenniferlu717/Bracken | k-mer 分类与丰度估计，宏基因组和病原检测常用 |
| 47 | **8/10** | **Bakta / Prokka** | 原核基因组注释 | https://github.com/oschwengers/bakta · https://github.com/tseemann/prokka | 细菌、MAG、质粒注释的实用工具，Bakta 更偏标准化和新流程 |
| 48 | **8/10** | **OpenMS / FragPipe / MaxQuant** | 蛋白质组 | https://www.openms.de/ · https://fragpipe.nesvilab.org/ · https://www.maxquant.org/ | 质谱数据处理、鉴定和定量的代表性工具链 |
| 49 | **8/10** | **Hail** | 大规模基因组计算 | https://hail.is/ · https://github.com/hail-is/hail | 面向大规模基因型矩阵和群体遗传统计的分布式计算框架 |
| 50 | **8/10** | **PLINK / SAIGE / REGENIE** | GWAS/群体遗传 | https://www.cog-genomics.org/plink/ · https://github.com/weizhouUMICH/SAIGE · https://rgcgithub.github.io/regenie/ | 大规模关联分析、混合模型和遗传统计高频工具 |
| 51 | **7.9/10** | **Nextstrain / Augur / Auspice** | 病原组学 | https://nextstrain.org/ · https://github.com/nextstrain/augur · https://github.com/nextstrain/auspice | 病原体进化、实时监测和系统发育可视化平台 |
| 52 | **7.9/10** | **Cytoscape** | 网络可视化 | https://cytoscape.org/ | 生物网络、通路互作和多组学网络图的桌面工具 |
| 53 | **7.8/10** | **InterPro / Pfam** | 蛋白域注释 | https://www.ebi.ac.uk/interpro/ · https://www.ebi.ac.uk/interpro/entry/pfam/ | 蛋白家族、结构域和功能位点注释入口 |
| 54 | **7.8/10** | **ChEMBL / PubChem** | 化学生物数据库 | https://www.ebi.ac.uk/chembl/ · https://pubchem.ncbi.nlm.nih.gov/ | 药物、化合物、靶点活性和化学结构数据常用入口 |
| 55 | **7.7/10** | **ClinVar / dbSNP** | 变异知识库 | https://www.ncbi.nlm.nih.gov/clinvar/ · https://www.ncbi.nlm.nih.gov/snp/ | 临床变异解释和常见 SNP 查询基础资源 |
| 56 | **7.7/10** | **GTEx** | 表达调控数据库 | https://gtexportal.org/ | 人类组织表达、eQTL 和调控解释常用入口 |
| 57 | **7.7/10** | **Human Protein Atlas** | 蛋白表达图谱 | https://www.proteinatlas.org/ | 组织、细胞、亚细胞定位和病理表达图谱 |
| 58 | **7.6/10** | **BioMart** | 数据检索接口 | https://www.ensembl.org/biomart/ | Ensembl 等数据库的批量注释和 ID 映射入口 |
| 59 | **7.6/10** | **UCSC Table Browser / LiftOver** | 坐标与表格工具 | https://genome.ucsc.edu/cgi-bin/hgTables · https://genome.ucsc.edu/cgi-bin/hgLiftOver | genome interval、track 表格导出和 genome build 坐标转换高频工具 |
| 60 | **7.5/10** | **Galaxy ToolShed / tools-iuc** | Galaxy 工具生态 | https://toolshed.g2.bx.psu.edu/ · https://github.com/galaxyproject/tools-iuc | Galaxy 工具封装和社区维护 wrappers 的核心来源 |

---

## GitHub 快照备忘（2026-05-17）

| 项目 | GitHub 仓库 | Stars | 最近更新时间 | 主要语言 | 许可 |
|:---|:---|---:|:---:|:---|:---|
| AlphaFold | google-deepmind/alphafold | 14592 | 2026-05-16 | Python | Apache-2.0 |
| Biopython | biopython/biopython | 5024 | 2026-05-17 | Python | 未声明/复杂 |
| ESM | facebookresearch/esm | 4078 | 2026-05-16 | Python | MIT |
| Awesome-Bioinformatics | danielecook/Awesome-Bioinformatics | 4033 | 2026-05-17 | - | 未声明 |
| DeepVariant | google/deepvariant | 3703 | 2026-05-16 | Python | BSD-3-Clause |
| Nextflow | nextflow-io/nextflow | 3385 | 2026-05-17 | Groovy | Apache-2.0 |
| OpenFold | aqlaboratory/openfold | 3356 | 2026-05-14 | Python | Apache-2.0 |
| RFdiffusion | RosettaCommons/RFdiffusion | 2866 | 2026-05-17 | Python | 未声明/复杂 |
| Snakemake | snakemake/snakemake | 2778 | 2026-05-16 | Python | MIT |
| Seurat | satijalab/seurat | 2727 | 2026-05-17 | R | 未声明/复杂 |
| Scanpy | scverse/scanpy | 2457 | 2026-05-17 | Python | BSD-3-Clause |
| fastp | OpenGene/fastp | 2359 | 2026-05-16 | C++ | MIT |
| STAR | alexdobin/STAR | 2196 | 2026-05-16 | C | MIT |
| minimap2 | lh3/minimap2 | 2182 | 2026-05-16 | C | 未声明/复杂 |
| MMseqs2 | soedinglab/MMseqs2 | 2059 | 2026-05-17 | C | MIT |
| GATK | broadinstitute/gatk | 1946 | 2026-05-15 | Java | 未声明/复杂 |
| SAMtools | samtools/samtools | 1897 | 2026-05-15 | C | 未声明/复杂 |
| Bioconda recipes | bioconda/bioconda-recipes | 1819 | 2026-05-17 | Shell | MIT |
| Galaxy | galaxyproject/galaxy | 1773 | 2026-05-16 | Python | 未声明/复杂 |
| ProteinMPNN | dauparas/ProteinMPNN | 1726 | 2026-05-15 | Jupyter Notebook | MIT |
| scvi-tools | scverse/scvi-tools | 1623 | 2026-05-13 | Python | BSD-3-Clause |
| MultiQC | MultiQC/MultiQC | 1450 | 2026-05-13 | JavaScript | GPL-3.0 |
| Cromwell | broadinstitute/cromwell | 1064 | 2026-05-13 | Scala | BSD-3-Clause |
| cBioPortal | cBioPortal/cbioportal | 1006 | 2026-05-16 | Java | AGPL-3.0 |
| Prokka | tseemann/prokka | 978 | 2026-05-16 | Perl | GPL-3.0 |
| HTSlib | samtools/htslib | 922 | 2026-05-15 | C | 未声明/复杂 |
| Kraken2 | DerrickWood/kraken2 | 903 | 2026-05-15 | C++ | MIT |
| pysam | pysam-developers/pysam | 890 | 2026-05-10 | Cython | MIT |
| Salmon | COMBINE-lab/salmon | 885 | 2026-05-14 | C++ | GPL-3.0 |
| BCFtools | samtools/bcftools | 864 | 2026-05-15 | C | 未声明/复杂 |

> 说明：Stars 是当日 GitHub REST API 快照，用于判断社区热度，不等于科学质量、生产成熟度或许可证可用性。

---

## 分项链接与备忘

### A. 整合性入口 / 资源索引

| 项目 | 主要入口 | 备忘 |
|:---|:---|:---|
| Awesome-Bioinformatics | https://github.com/danielecook/Awesome-Bioinformatics | 适合快速发现主题资源，覆盖范围广 |
| awesome-ai-bioinformatics | https://github.com/HongxinXiang/awesome-ai-bioinformatics | AI+Bio 主题入口，适合补线索 |
| bio.tools | https://bio.tools/ | 工具注册表，适合按功能、数据格式、主题检索 |
| WorkflowHub | https://workflowhub.eu/ | 科研工作流注册和共享 |
| ELIXIR | https://elixir-europe.org/ | 欧洲生命科学数据基础设施网络，常能追到标准和服务入口 |

### B. 工作流 / 可复现 / 环境

| 项目 | 主要入口 | 使用场景 |
|:---|:---|:---|
| nf-core | https://nf-co.re/ | 直接复用 RNA-seq、Sarek、scrnaseq、mag 等生产流程 |
| Nextflow | https://www.nextflow.io/ | 本地、HPC、云端混合执行；与容器和对象存储配合成熟 |
| Snakemake | https://snakemake.github.io/ | Python 友好、规则清晰、适合中小型实验室 pipeline |
| Galaxy | https://galaxyproject.org/ | Web 分析、教学、工具包装、非程序员协作 |
| CWL | https://www.commonwl.org/ | 强调标准化与跨执行后端移植 |
| WDL / Cromwell | https://openwdl.org/ · https://github.com/broadinstitute/cromwell | Broad/GATK/Terra 生态常见 |
| Bioconda | https://bioconda.github.io/ | 生信工具安装和环境锁定 |
| BioContainers | https://biocontainers.pro/ | 容器化工具分发，工作流生产化关键依赖 |
| Dockstore | https://dockstore.org/ | 工作流和工具发布、发现、注册 |
| Terra / AnVIL | https://terra.bio/ · https://anvilproject.org/ | 云端大规模基因组分析和协作 |

### C. 核心命令行和库

| 项目 | 主要入口 | 备忘 |
|:---|:---|:---|
| SAMtools / HTSlib / BCFtools | https://www.htslib.org/ | HTS 文件格式处理底座 |
| GATK | https://gatk.broadinstitute.org/ | 变异分析标准工具箱 |
| DeepVariant | https://github.com/google/deepvariant | AI variant calling |
| fastp / FastQC | https://github.com/OpenGene/fastp · https://www.bioinformatics.babraham.ac.uk/projects/fastqc/ | FASTQ QC 和预处理 |
| STAR / Salmon | https://github.com/alexdobin/STAR · https://github.com/COMBINE-lab/salmon | RNA-seq 比对和定量 |
| minimap2 / Bowtie2 / BWA | https://github.com/lh3/minimap2 · https://github.com/BenLangmead/bowtie2 · https://github.com/lh3/bwa | 长短读长比对 |
| Biopython / pysam | https://biopython.org/ · https://github.com/pysam-developers/pysam | Python 脚本、解析和 BAM/VCF 操作 |
| MultiQC | https://multiqc.info/ | 报告聚合与项目级 QC |

### D. 单细胞 / 多组学

| 项目 | 主要入口 | 备忘 |
|:---|:---|:---|
| scverse | https://scverse.org/ | Python 单细胞生态总入口 |
| Scanpy | https://scanpy.readthedocs.io/ | Python 单细胞分析主库 |
| AnnData | https://anndata.readthedocs.io/ | h5ad 数据结构核心 |
| scvi-tools | https://scvi-tools.org/ | 单细胞/空间组学深度生成模型 |
| Seurat | https://satijalab.org/seurat/ | R 单细胞生态事实标准 |
| CELLxGENE | https://cellxgene.cziscience.com/ | 单细胞 atlas 浏览和公开数据 |
| Human Cell Atlas | https://www.humancellatlas.org/ | 人类细胞图谱计划入口 |

### E. 数据库 / 注释 / 知识图谱

| 项目 | 主要入口 | 备忘 |
|:---|:---|:---|
| NCBI | https://www.ncbi.nlm.nih.gov/ | SRA、Gene、RefSeq、BLAST、ClinVar、dbSNP、PubMed |
| Ensembl / VEP | https://www.ensembl.org/ · https://www.ensembl.org/info/docs/tools/vep/index.html | 基因组注释与变异效应 |
| UCSC Genome Browser | https://genome.ucsc.edu/ | tracks、Table Browser、LiftOver |
| UniProt | https://www.uniprot.org/ | 蛋白序列、功能和注释 |
| RCSB PDB | https://www.rcsb.org/ | 实验结构数据库 |
| AlphaFold DB | https://alphafold.ebi.ac.uk/ | 预测结构数据库 |
| gnomAD | https://gnomad.broadinstitute.org/ | 人群变异频率 |
| cBioPortal | https://www.cbioportal.org/ | 癌症基因组数据浏览 |
| Open Targets | https://platform.opentargets.org/ | 靶点与疾病证据 |
| Reactome / STRING / KEGG | https://reactome.org/ · https://string-db.org/ · https://www.kegg.jp/ | 通路、网络和功能解释 |

### F. AI+Bio / 蛋白与模型

| 项目 | 主要入口 | 使用提醒 |
|:---|:---|:---|
| AlphaFold | https://github.com/google-deepmind/alphafold | 数据库下载和 GPU 资源是实际门槛 |
| OpenFold | https://github.com/aqlaboratory/openfold | 适合模型训练、复现和二次开发 |
| ESM | https://github.com/facebookresearch/esm | 常用于 protein embedding、zero-shot 变异效应探索 |
| MMseqs2 | https://github.com/soedinglab/MMseqs2 | AI 结构预测前的序列搜索、聚类、数据库构建常用 |
| RFdiffusion | https://github.com/RosettaCommons/RFdiffusion | 结构生成，结果需要实验和生物物理验证 |
| ProteinMPNN | https://github.com/dauparas/ProteinMPNN | 结构条件下的蛋白序列设计 |
| DeepVariant | https://github.com/google/deepvariant | AI 与传统 variant calling pipeline 的成熟交叉案例 |

---

## 重点条目：生信程序员的三层基础栈

### 1. 可复现执行层：Nextflow / nf-core / Snakemake / Galaxy

- **Nextflow + nf-core**：最适合直接落生产流程。优先学习 `params`、profiles、container、channel、resume、Tower/Seqera Platform 等概念。
- **Snakemake**：更 Pythonic，适合实验室内部流程、规则化文件依赖和本地/HPC。
- **Galaxy**：适合教学、工具包装、Web 分析和非程序员协作，不应只被看作“网页工具”，它也是成熟的工具生态。
- **CWL/WDL**：更偏标准和平台互操作；若目标是 Dockstore、Terra 或 Broad/GATK 生态，要重点关注。

### 2. 环境和分发层：Bioconda / BioContainers / Bioconductor

- **Bioconda**：命令行工具安装入口，适合与 `conda-lock`、`mamba`、Nextflow/Snakemake profile 组合。
- **BioContainers**：生产环境尤其重要，避免同名工具、系统库、编译参数导致的复现漂移。
- **Bioconductor**：R 侧统计和组学分析核心，尤其是差异分析、注释、通路和高维组学对象。

### 3. 解释与知识层：NCBI / Ensembl / UCSC / UniProt / gnomAD / Reactome

- **坐标和参考版本** 是首要风险：hg19/GRCh37、GRCh38、T2T、不同 annotation release 之间不能混用。
- **变异解释** 通常需要 VEP、gnomAD、ClinVar、dbSNP、cBioPortal 等多源证据，不要只看一个注释字段。
- **功能解释** 常会落到 Reactome、STRING、KEGG、GO、UniProt，但许可、版本和 ID 映射都需要记录。

---

## 使用建议

- **做新的生信 pipeline**：先查 nf-core 是否已有同类流程；若有，优先 fork/配置，而不是从零写。
- **做工具选型**：优先看 Bioconda/BioContainers 是否可安装、是否有 GitHub 活跃维护、是否被 nf-core 或 Galaxy wrapper 使用。
- **做数据库整合**：先确定 organism、genome build、annotation release、ID 类型和更新时间，再谈 API/爬虫。
- **做 AI+Bio 原型**：先明确输入输出是否能接上传统生信数据结构，例如 FASTA、MSA、PDB/mmCIF、VCF、h5ad。
- **做网页或平台**：基因组浏览优先评估 IGV.js/JBrowse 2；单细胞浏览优先看 CELLxGENE；癌症门户优先看 cBioPortal。
- **做教学或团队协作**：Galaxy、nf-core 文档、Bioconductor vignettes 和 scverse tutorials 是高质量材料来源。

---

## 与本仓库的关系

- 本文件位于 **`awesome-bioinformatics_youbetterknow/相关性资源集/`**，是本项目的主资源清单。
- [README.md](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/README.md) 提供项目导航；[data/catalog.json](/Users/tianyi/Documents/Codex_project/awesome-bioinformatics_youbetterknow/data/catalog.json) 提供机器可读种子目录。
- 若后续要做成网页，可把本文档总表拆成 JSON，再生成筛选器、标签页和 GitHub 元数据同步任务。

---

## 来源与核验说明

- GitHub 元数据：2026-05-17 通过 GitHub REST API 抓取部分仓库 stars、语言、更新时间和许可证字段。
- 官方入口优先：项目定位以各项目官网或 GitHub README 描述为准，包括 nf-core、Galaxy、Bioconductor、Bioconda、BioContainers、bio.tools、NCBI、Ensembl、UCSC、UniProt、RCSB PDB、gnomAD、cBioPortal、Open Targets、Reactome、STRING、AlphaFold、OpenFold、ESM 等。
- 清单性质：本文是高相关性导航，不是所有生信工具的穷尽列表；生产使用前仍需做版本锁定、许可证确认、输入输出验证和小样本 smoke test。

*整理说明：基于本仓库 Bioinformatics YouBetterKnow 定位、用户给定参考项目、公开网络检索、GitHub API 快照和生物信息工程常识汇编；链接和项目活跃度可能随时间变化，请以官方页面为准。*
