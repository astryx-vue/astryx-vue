---
title: 贡献指南
---

# 贡献指南

感谢关注 astryx-vue。本项目为开源项目，代码仓库位于 <https://github.com/astryx-vue/astryx-vue>。若发现 Bug 或有改进建议，欢迎提交 GitHub Issue。项目采用 MIT 开源许可证。

## 本地开发环境准备

请确保本地运行环境满足要求（以根目录 `package.json` 中的 `engines` 字段为准）：
- Node.js：`^22.18.0`、`^24.11.0` 或 `>=26`
- pnpm：`>=11.21.0`

克隆仓库后，安装依赖并执行全套质量核验：

```sh
pnpm install
pnpm check
```

`pnpm check` 会依次执行：包依赖边界检查、导出一致性校验、ESLint 代码检查、TypeScript 类型检查、单元测试、打包构建以及发布包 publint 检查。修改组件或主题后，**以 `pnpm check` 全部通过作为基础验证标准**。

## 自动化代码生成与同步

项目中部分聚合导出文件（如 `packages/core/src/index.ts`、`composables/index.ts`、`styles.css` 以及 `neutral.css`）由构建脚本 `pnpm sync` 扫描生成，文件顶部标注了「请勿手动编辑」。

在核心包中新增组件导出或样式入口后，需执行 `pnpm sync`，并将生成的代码变动一同提交。

> **多语言资源说明**：`packages/core/locales/*.json` 为从上游 Astryx 同步的多语言数据，请勿手动编辑。更新多语言或引入其它语种请通过 `loadAstryxCatalog` 接入，详见 [国际化指南](/guide/i18n)。

## 本地运行文档站

```sh
pnpm dev
```

验证文档站静态构建可执行 `pnpm docs:build`。组件文档在侧边栏中的分组信息维护在各组件目录下的 `meta.ts` 中，修改文档时请避免改动无关的分组配置。

## 版本发布流程（Changesets）

项目使用 Changesets 管理版本发布。若 Pull Request 仅包含文档改动，无需生成 changeset；若包含功能特性或缺陷修复，需通过 Changesets 生成变更条目。核心包与主题包版本号保持统一。详细流程参阅仓库中的 `RELEASING.md`。

## 设计系统对齐规范

上游 Astryx 基于 React 19 和 StyleX 实现，其代码与视觉作为实现基准。提交至 astryx-vue 的所有公共 API 必须遵循 Vue 3 标准规范（Props、事件、插槽与组合式函数），**禁止引入 React 或 StyleX 作为运行时依赖**。

设计目标为**视觉与交互行为一致**：在保持标准 Vue 生态开发体验的同时，组件间距、排版规范、色彩过渡与内置文案力求与上游对齐。

若需同步上游最新多语言文件，执行 `node scripts/vendor-astryx-locales.mjs`，该脚本默认抓取上游 `main` 分支最新提交，并将提交哈希记录在同目录的 `SOURCE.json` 中。

## Pull Request 规范：对照截图要求

对组件视觉外观、结构样式或交互动画进行修改时，提交 Pull Request **必须附带上游原版与 Vue 版的视觉对比截图**：
- 左侧为原版 Astryx，右侧为 astryx-vue；
- 需覆盖 4 种组合场景：桌面宽屏、390px 移动窄屏、浅色模式、深色模式。

由于设计系统对视觉还原度要求严格，审查 PR 时会优先比对实际渲染截图。视觉对照图为 UI 变更 PR 的必要材料（文档修订、CI 脚本与底层重构除外）。
