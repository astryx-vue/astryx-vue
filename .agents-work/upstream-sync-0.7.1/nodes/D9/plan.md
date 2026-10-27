# D9 指南补齐 · 执行计划

## 目标

原版 Astryx 的命令行里内置了一批指南。其中有 11 篇对我们的用户也有用，但我们文档站还没写。D9 把它们改写成 Vue 的说法补进文档站，中英文都写。写完后 `astryx-vue docs` 也能读到，因为 catalog 是从文档站生成的。

清单和理由在 `.agents-work/upstream-sync-0.7.1/nodes/D4a/guides-gap.md` 的 B、C 两类，先读它。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D9`，分支 `sync/d9-guides`。只在这里改。
- 原版指南：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/cli/assets/docs/<名>.doc.mjs`（有些在 `tree/` 子目录下）。它们是 JS 对象，正文在 `sections` 或 `content` 里。
- 我们的文档：`apps/docs/docs/{zh,en}/guide/`、`apps/docs/docs/{zh,en}/themes/`、组件页 `apps/docs/docs/{zh,en}/components/<slug>/`，侧栏 `apps/docs/.vitepress/sidebar.ts`。
- 环境纪律：命令前加 `env -u NODE_ENV`。浏览器只能用 `node scripts/swarm/browser-lock.mjs run --purpose D9 --max-run 120 -- <命令>`。

## 要写的内容

| # | 原版 | 我们写到哪 | 形式 |
| --- | --- | --- | --- |
| 1 | principles | `guide/principles.md` | 新页 |
| 2 | working-with-ai | `guide/working-with-ai.md` | 新页。写怎么让 Claude Code、Cursor、Codex、Copilot 用好 astryx-vue：装 `@astryx-vue/cli`，用 `astryx-vue init --features agents` 生成 AGENTS.md，再用 `component`、`search`、`docs`、`template` 查文档。以 `packages/cli/src/agents.ts` 现在实际输出的内容为准，不要写还不存在的命令 |
| 3 | browser-support | `guide/browser-support.md` | 新页。列出我们实际依赖的新特性（`light-dark()`、`@layer`、`:has()`、`color-mix()`、`@property`、popover 等），先在 `packages/core/styles` 里 grep 确认真的用到了，再写最低浏览器版本 |
| 4 | tree/layout、tree/layout-spacing | `guide/layout.md` | 新页。用我们的 `Layout`、`AppShell`、`Stack`、`Grid` 举例 |
| 5 | tree/headers-and-footers | `guide/patterns.md` 加一节 | 小节 |
| 6 | tree/side-panels | `guide/patterns.md` 加一节 | 小节 |
| 7 | tree/typography-best-practices | `themes/typography.md` 加「该做与不该做」 | 小节 |
| 8 | tree/i18n-rtl-and-testing | `guide/i18n.md` 加「从右往左与伪语言测试」 | 小节。只写我们实际支持的：先查 core 里 `dir`/RTL 的处理 |
| 9 | illustrations | `components/empty-state/index.md` 加插画规范 | 小节 |
| 10 | tree/tailwind | `guide/styling.md` 加「和 Tailwind / UnoCSS 一起用」 | 小节。讲层顺序（`@layer` 怎么排才能让工具类盖过组件）、怎么在工具类里用 `--astryx-*` 变量 |
| 11 | tree/other-libraries | 并进第 10 条 | 只写 CSS Modules、普通 CSS；React 专属的库不写 |

新页加进侧栏（`sidebar.ts`），中英文都要。

## 写作要求

- 中文为主版本，英文内容对应。大白话、短句，一句只说一件事。
- 代码示例用 Vue 单文件组件（`<script setup lang="ts">`，模板里属性写 kebab-case）。
- 每一条说法都要能在代码里找到依据：写组件属性前先去 `packages/core/src/<组件>/types.ts` 确认它存在。原版有、我们没有的能力不要写。
- 不照抄原版。原版讲 StyleX、React、ShadCN 的部分换成我们的做法，或者删掉。

## 不碰

组件源码、主题 CSS、`ROADMAP.md`、`SWARM.md`。

## 自测

1. `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate` 重生 catalog，然后 `generate:check` 通过。
2. `env -u NODE_ENV pnpm build:packages && env -u NODE_ENV pnpm docs:build` 通过。
3. 起文档站，打开 4 个新页的中英文版本，确认侧栏能进、代码块正常、没有坏链接。
4. `node packages/cli/bin/astryx-vue.mjs docs guide/working-with-ai` 能读到新页。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D9/impl-1.md`，列出每篇写到哪、关键说法的代码依据。分步提交，不要推送。最终回复用中文，300 字以内。
