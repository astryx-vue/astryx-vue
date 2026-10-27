# F3a lab 输入类 · 执行计划

## 目标

往 `@astryx-vue/lab` 里加 3 个输入类组件：ListInput、TransferList（连同 TransferListSelector）、MobileTokenizer。样子、交互、键盘操作、读屏效果都要和原版 v0.7.1 一致。

lab 包的骨架 F3b 已经搭好（#205）。往里加组件的方法看 `nodes/F3b/impl-1.md` 末尾「给后续 lab 节点的骨架说明」，照着加。

## 依据

- 原版：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/lab/src/<组件>/<文件>`。每个组件都要读这几类文件：`.tsx`、`.test.tsx`、`.doc.mjs`；有 `.composition.test.tsx` 的也要读。
- 原版每个文件的行数如下。我们这边每个源码文件不能超过 500 行，所以大文件一定要拆：
  - `ListInput.tsx` 1848 行，测试 1353 行。
  - `TransferList.tsx` 1381 行，`TransferListSelector.tsx` 345 行，测试合计约 1800 行。
  - `MobileTokenizer.tsx` 562 行，测试 340 行。
- 台账：`.agents-work/upstream-sync-0.7.1/ledger/F3a.md`（26 条）。
- ADR 0001 第 4.1 节（依赖的 core 组件）、第 7.1 节（样式结构）。
- core 里要用到的组件：`Field`、`FieldStatus`、`Button`、`IconButton`、`Icon`、`EmptyState`、`Table`（取 `ColumnWidth` 类型）、`ComplexSelector`、`List`、`Item`、`TextInput`、`BottomSheet`、`Typeahead`、`Token`、`AlertDialog`、`Indicator`，以及 Layer 浮层。

## 拆分建议

- **ListInput**：主组件只管把各部分拼起来。把行编辑、拖拽排序、键盘操作分别抽成 composable，每一行做成单独的组件，列宽计算写成纯函数。
- **TransferList**：两边的面板做成一个组件，左右各用一次；选中、移动、暂存这些状态放进 composable；`TransferListSelector` 单独一个组件。
- **MobileTokenizer**：底部面板的内容单独做成一个组件。

## 文案

这几个组件的文案用的是 `@astryx.listInput.*`（16 条）、`@astryx.transferList.*`（26 条）、`@astryx.transferListSelector.*`（3 条）。这些键已经在 `packages/core/locales/*.json` 里了，但还没有接进 `upstreamMap`，见 `scripts/i18n-catalog/coverage.mjs` 里「暂不接入」那一项。

做法：把这三组键接进 core 的 `upstreamMap`，再从 `coverage.mjs` 的「暂不接入」里删掉这三组，组件里通过 core 的 `useTranslator` 来取文案。改 core 只限这一处，其他地方不要动 core。

## 测试

- 原版 `.test.tsx` 里的用例改写成 `@vue/test-utils`，**期望值一个字都不能改**。
- 每个组件加一条服务端渲染冒烟测试。
- 一条用例搬不过来时，标成 `it.todo`，写清楚原因，原版的断言留在注释里。不要靠改期望值让测试通过。

## 浏览器验证

先在工作区里搭一个临时 Vite 页面，放在 `.tmp-f3a/`，不要提交。把 3 个组件的主要状态都画出来：空列表、有数据、拖拽中、禁用、出错。每种状态浅色、深色各截一张图，存到 `/tmp/F3a-shots/`。

原版官网没有 lab 组件的页面，所以没法对照官网截图，只能按原版源码里的 StyleX 取值逐条搬，然后自己看截图找明显的问题。键盘操作要实测一遍：Tab、方向键、Enter、Escape、Delete。

## 自测

- `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/lab`：NODE_ENV 不设、设为 production，两种都要通过。
- 以下检查都要通过：
  - `pnpm --filter @astryx-vue/lab typecheck`
  - `pnpm --filter @astryx-vue/lab build`
  - `pnpm exec eslint . --max-warnings 0`
  - `env -u NODE_ENV pnpm check:packages`

## 纪律

- 每做完一个组件就提交一次，至少每 15 分钟提交一次。提交信息用中文。不要推送。
- 一个问题卡住超过 20 分钟：先提交，把现状写进回报，然后做下一个组件。
- 回报写到 `nodes/F3a/impl-1.md`，内容包括：
  - 哪些测试搬了、哪些没搬，以及原因。
  - 拆分后每个文件的行数。
  - 文案接入情况。
