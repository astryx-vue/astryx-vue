---
title: 贡献指南
---

# 贡献指南

仓库在 <https://github.com/astryx-vue/astryx-vue>。问题用 GitHub Issues。许可是 MIT。

本地需要 Node.js `^22.18.0`、`^24.11.0` 或 `>=26`，以及 pnpm `>=11.21.0`。版本以根目录 `package.json` 的 `engines` 为准。

```sh
pnpm install
pnpm check
```

`pnpm check` 会跑包边界检查、导出同步检查、lint、类型检查、测试、构建，以及发布包的 publint 检查。改组件或主题时，以这条命令通过为完成标准。

`packages/core/src/index.ts`、`composables/index.ts`、`styles.css` 和 `neutral.css` 由 `pnpm sync` 生成，文件头写着不要手改。新增导出或样式入口后运行 `pnpm sync`，再把生成结果一起提交。

`packages/core/locales/*.json` 是从原版 Astryx 拉下来的语言目录，不要手抄进 `messages.ts`。额外语言用 `loadAstryxCatalog`，说明在国际化那一页。

文档站：

```sh
pnpm dev
```

只构建文档是 `pnpm docs:build`。组件文档的侧边栏分组来自每个示例的 `meta.ts`，不要在改指南或主题页时重排那一组。

发版用 Changesets，说明在仓库的 `RELEASING.md`。只改文档时不需要 changeset。两个包的版本号由 Changesets 收成同一组。

原版 Astryx 的 React 实现只作对照。提交到这个仓库的接口应保持 Vue 的 props、事件、插槽和组合式函数，不要把 React 或 StyleX 加进公开包的依赖。
