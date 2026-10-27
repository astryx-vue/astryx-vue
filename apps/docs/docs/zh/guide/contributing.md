---
title: 贡献指南
---

# 贡献指南

感谢你对 astryx-vue 的关注！本项目完全开源，代码仓库托管在 <https://github.com/astryx-vue/astryx-vue>。如果你发现了 Bug 或有好的建议，欢迎在 GitHub Issues 提交讨论。本项目采用宽松友好的 MIT 开源许可证。

## 本地开发环境准备

请确保本地安装了符合要求的 Node.js 与 pnpm 版本（具体版本限制以根目录 `package.json` 中的 `engines` 字段为准）：
- Node.js：`^22.18.0`、`^24.11.0` 或 `>=26`
- pnpm：`>=11.21.0`

克隆仓库后，安装依赖并执行全套质量检查：

```sh
pnpm install
pnpm check
```

`pnpm check` 会依次严格执行：包边界依赖检查、导出同步校验、ESLint 代码检查、TypeScript 类型检查、单元测试、打包构建以及发布包的 publint 检查。在修改任何组件或主题样式后，**以 `pnpm check` 全部通过作为完成的基本标准**。

## 自动生成的代码与同步

项目中部分聚合导出文件（如 `packages/core/src/index.ts`、`composables/index.ts`、`styles.css` 以及 `neutral.css`）是由自动化脚本 `pnpm sync` 统一扫描并生成的，文件顶部明确标注了「请勿手动编辑」。

当你在核心库中新增了组件导出或新的样式入口后，请运行 `pnpm sync`，并将自动生成的变化一同提交进 Git。

> **多语言文件说明**：`packages/core/locales/*.json` 是从 Meta 原版 Astryx 同步的多语言映射表，请勿直接手动修改它们。若要更新多语言或引入额外语言，请通过 `loadAstryxCatalog` 进行转换，详见 [国际化指南](/guide/i18n)。

## 本地启动文档站

```sh
pnpm dev
```

如需验证文档站打包是否正常，可运行 `pnpm docs:build`。请注意：组件文档在侧边栏里的分组归属来自每个组件示例目录下的 `meta.ts`，在修改普通文档指南或主题说明页时，请不要随意改动那些分组配置。

## 版本发布流程（Changesets）

项目使用 Changesets 进行版本发布管控。如果你的 Pull Request 仅修改了文档，则无需生成 changeset；如果包含了功能新增或修复，请通过 Changesets 记录改动。核心包与主题包的版本号会由 Changesets 保持统一同步。更详细的发版指引可参阅仓库内的 `RELEASING.md`。

## 设计对齐原则：追求像素级一致

原版 Astryx 基于 React 19 和 StyleX 实现，它的源码仅作为我们还原时的设计基准。提交到 astryx-vue 的所有公共 API，必须遵循标准的 Vue 3 惯用法（Props、事件、插槽和组合式函数），**不能把 React 或 StyleX 作为运行依赖引入到库中**。

我们的核心目标是**视觉与交互对齐**：除了使用 Vue 生态的标准语法之外，组件的间距、排版、色彩动效与内置文案，都力求与原版保持一致，保持两套库在视觉细节上一致。

若需从原版同步最新的多语言资源，可执行 `node scripts/vendor-astryx-locales.mjs`，该脚本默认会拉取原版 `main` 分支的最新提交，并将本次拉取使用的 Commit 哈希精准记录在同目录的 `SOURCE.json` 中。

## Pull Request 规范：必须附带对照截图

如果你对组件外观、结构样式或交互动效进行了修改，在提交 Pull Request 时**必须附带原版与 Vue 版的效果对照图**：
- 左侧为原版 Astryx，右侧为 astryx-vue；
- 至少覆盖 4 种组合场景：桌面宽屏、390px 移动窄屏、浅色模式、深色模式。

由于组件库对视觉质感要求极高，社区审查 PR 时会优先比对实际渲染截图与体验效果，而不仅仅是审查代码行变动。因此，视觉对照图是 PR 必不可少的一部分（纯文档修复、CI 脚本与底层重构除外）。
