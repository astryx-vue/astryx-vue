# F1a richtext 纯逻辑 · 执行计划

## 目标

新建 `@astryx-vue/richtext` 包，先放进不碰界面的部分：Lexical 节点集合，以及 Markdown 的导入、导出和原样往返。同一段 Markdown 交给我们的函数和交给上游 v0.7.1 的函数，得到的 Lexical 文档和导出文本要完全一样。上游的纯逻辑测试照搬，期望值不改。

用户这一步还看不到编辑器，编辑器在 F1b 做。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F1a`，分支 `sync/f1a-richtext-logic`，槽位 1，端口 5171。这个节点不需要浏览器。只在这个工作区里改。
- 动手前先读：
  - `docs/adr/0001-new-packages.md`：第 2 节全部，**尤其 2.5、2.6 的 F1a 清单、2.7 风险**；第 7.1、7.2、7.3 节。范围以 ADR 2.6 为准。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/F1a.md`（70 条）。
  - 上游：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/richtext/<路径>`。文件清单用 `git -C ... ls-tree -r --name-only v0.7.1 packages/richtext`。
  - 参考已有的新包：`packages/charts/`（`package.json`、`tsdown.config.ts`、`tsconfig.json`），照它搭包骨架。
  - core 已经有的 Markdown 接口（C9 做的）：`packages/core/src/Markdown/parser/`、`plugin-protocol/`、`publicParser.ts`、`characterReferences.ts`，以及 `packages/core/package.json` 里的 `./Markdown/parser`、`./Markdown/plugins` 两个子路径。**先确认** `parseMarkdownAst`、`parseInlineAst`、`decodeMarkdownCharacterReferences`、`getMarkdownPluginCapabilities` 的行为和上游一致；缺什么或不一致，不要改 core，写进回报。

## 包骨架

- `packages/richtext/package.json`：
  - 名字 `@astryx-vue/richtext`，正式包，**不设 `private`**。
  - `peerDependencies` 写 `@astryx-vue/core: workspace:^`、`vue: catalog:peer`；`lexical` 和 `@lexical/*` 也放进 peer，版本照上游锁 `^0.52.0`，并在 `peerDependenciesMeta` 里标成可选，和上游一致。
  - 这些包同时进 `devDependencies`。版本写进 `pnpm-workspace.yaml` 新的 `richtext` catalog 分组，包里用 `catalog:richtext` 引用。
  - `exports` 至少有 `.` 和 `./markdown` 两个入口；`./richtext.css` 留给 F1b。`sideEffects: ["**/*.css"]`。
- `tsdown.config.ts`：两个入口 `src/index.ts`、`src/markdown.ts`，不要打包 `vue`、`@astryx-vue/core`、`lexical`、`@lexical/*`。
- `README.md`：英文，照 `packages/charts/README.md` 的格式写，说明这一版只有 Markdown 逻辑，编辑器在后续版本提供。按 ADR 2.7 写明：`@lexical/headless` 会带上 `happy-dom`。
- `.changeset/config.json` 的 `fixed` 组加上 `@astryx-vue/richtext`（ADR 7.2）。**不要写 changeset 文件**，G3 再写。
- `scripts/check-package-boundaries.mjs`：公开包名单改成从 `scripts/list-public-packages.mjs` 拿，不要再写死（ADR 7.3）。
- 跑 `pnpm install` 前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。

## 要移植的文件（ADR 2.6）

`editorNodes.ts`、`markdownSource.ts`、`markdownSerializers.ts`、`markdownTable.ts`、`markdownCharacterReferences.ts`、`markdownCodeFence.ts`、`markdownHardLineBreak.ts`、`markdownHeading.ts`、`markdownLink.ts`、`markdownListExport.ts`、`markdownListIndentation.ts`、`markdownOrderedList.ts`、`markdownQuote.ts`、`markdownSpaceRuns.ts`、`markdownTaskList.ts`、`markdownThematicBreak.ts`、`markdownExtensions.ts`、`markdownExtensionNode.ts`、`linkUtils.ts`、`markdown.ts`（子路径入口）。

- 这些文件只依赖 Lexical 里和框架无关的包，以及 core 的 Markdown 解析器，**不能 import `@lexical/react`，也不能 import Vue 组件**。`@astryx-vue/richtext/markdown` 必须能在服务端用。
- `markdownExtensionNode.ts` 的 `decorate()`：上游返回 React 元素。这里先返回 `null`，类型留成 Vue 能接的形状，注释写清楚由编辑器渲染。
- 超过 500 行的要按职责拆开，比如 `markdownCharacterReferences.ts` 990 行（实体表单独放一个文件）、`markdownSource.ts` 995 行。拆完对外导出的名字不变。
- 上游从 `@astryxdesign/core/...` 导入的地方，改成我们 core 对应的子路径。

## 测试

- 22 个不挂载组件的 `markdown*.test.ts` 整个搬过来。
- 5 个 `markdown*.test.tsx` 里，只搬不挂载组件的用例。挂载组件的用例留给 F1b，在回报里列出名字。
- **期望值一个字都不能改。** 有的过不了，先查是我们的 core 解析器不一致还是移植错了；查不出来就标 `it.todo` 并写进回报，不要改期望值。
- 再加一条：在 node 环境里 import `@astryx-vue/richtext/markdown`，确认不会加载 Vue 组件。

## 开发步骤（每步测完就提交）

1. 包骨架、依赖、构建、边界检查、changeset 配置。
2. 节点集合与基础转换器：`editorNodes`、`markdownHeading`、`markdownQuote`、`markdownLink`、`linkUtils`、`markdownHardLineBreak`、`markdownThematicBreak`，以及它们的测试。
3. 列表：`markdownOrderedList`、`markdownListIndentation`、`markdownListExport`、`markdownTaskList`，以及测试。
4. 代码与表格：`markdownCodeFence`、`markdownTable`，以及测试。
5. 字符：`markdownCharacterReferences`、`markdownSpaceRuns`，以及测试。
6. 扩展：`markdownExtensions`、`markdownExtensionNode`，以及测试。
7. 往返：`markdownSource`、`markdownSerializers`、`markdown.ts`，以及剩下的测试。
8. 台账 70 条逐条写结论：「已采纳」或「不适用：理由」，归 F1b/F1c 的写「交给 F1b」。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/richtext`：NODE_ENV 不设和设成 `production` 两种模式都要跑，用例数要一样。
2. `pnpm --filter @astryx-vue/richtext typecheck` 和 `build` 通过。
3. 在仓库根目录跑这几项检查，都要通过：`eslint --max-warnings 0 packages/richtext`、行数检查、`!important` 检查、`check-package-boundaries`、`pnpm check:packages`。

## 纪律

- 每做完一步提交一次。至少每 15 分钟提交一次，提交信息用中文，不要推送。
- 一个问题卡住超过 20 分钟：先提交，把现状写进回报，然后做下一步。
- 不碰 `packages/core`，也不改 `ROADMAP.md`、`SWARM.md`。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/F1a/impl-1.md`，格式见 `templates/impl-report.md`。另外写清三件事：
- 测试搬了哪些、没搬哪些、为什么。
- core 解析器和上游不一致的地方。
- 留给 F1b 的东西。
