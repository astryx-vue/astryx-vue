# F3b lab 展示类 · 执行计划

## 目标

新建 `@astryx-vue/lab` 包，和上游一样只发 canary。第一批放进 5 个展示类组件：Stat、CircularProgress、InfoTip、SVGIcon、LogStream。每个组件的样子、交互、读屏效果都要和上游 v0.7.1 一致。

这是 lab 系列的第一个节点，**包骨架由本节点搭**。后面的 F3a、F3c、F3e、F3g、F3h 都往这个包里加组件，所以骨架要搭得能按组件扩展。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F3b`，分支 `sync/f3b-lab-display`，槽位 2，端口 5172。只在这个工作区里改。
- 动手前先读：
  - `docs/adr/0001-new-packages.md`：第 4 节（4.1 的表、4.3 发布策略）、第 7.1、7.2、7.3 节。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/F3b.md`（31 条）。
  - 上游：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/lab/src/<组件>/<文件>`。每个组件都要读 `.tsx`、`.test.tsx`、`.doc.mjs`；有 `.spec.md` 的也读。
  - 照着搭骨架：`packages/charts/`。它的 `package.json`（`private: true`、`astryxVue.canaryOnly`）、`tsdown.config.ts`、`tsconfig.json`、`styles/` 加汇总 `charts.css` 的写法，lab 都照抄。
  - core 里要用的：`Tooltip`、`Icon`（InfoTip 用），以及 locale 和 token。core 的写法看 `packages/core/src/` 和 `packages/core/styles/`。

## 包骨架

- `packages/lab/package.json`：名字 `@astryx-vue/lab`，`private: true`，`"astryxVue": { "canaryOnly": true }`，版本 `0.0.0`。`exports` 里有 `.`、`./lab.css`、`./styles/*.css`。`peerDependencies` 写 `@astryx-vue/core: workspace:^` 和 `vue: catalog:peer`。
- `styles/<组件>.css` 每个组件一份，开头照 core 的写法声明层顺序，规则写在 `@layer astryx.components` 里，由组件自己 `import`。包根再放一个 `lab.css` 汇总全部样式。
- 主题变量：组件要用的新 `--astryx-*` 变量，先在组件 CSS 里写 `var(--astryx-xxx, <上游默认值>)`。默认值取自上游 Neutral 主题，这样不用改 themes 包也能画对。需要每套主题各自取值的，列进回报，交给后续节点。
- README：英文。顶部写明这是 canary 包，API 可能会变。
- `src/index.ts` 按组件导出。

## 组件

| 组件 | 上游行数 | 要点 |
| --- | --- | --- |
| Stat | 298 | 标题、数值、涨跌幅、趋势插槽。上游的 render prop 改成具名插槽 |
| CircularProgress | 458 | 有确定和不确定两种状态。`role="progressbar"`，`aria-valuenow` 等属性照上游 |
| InfoTip | 128 | 用 core 的 `Tooltip` 和 `Icon`。键盘能聚焦，读屏能读到说明，测试照上游 |
| SVGIcon | 414，另有 icons、pathTransforms 等约 1400 行 | 粗细可变、填充角色、遮罩镂空，自带十几个示例图标。`pathTransforms.ts` 612 行，要拆开 |
| LogStream | 588 | 四列：时间、级别、来源、消息。自动跟随、跳到最新、终端暗色版。拆成组件加 composable，每个文件 500 行以内 |

上游写法和我们的写法：

| 上游 | 我们 | 为什么效果一样 |
| --- | --- | --- |
| StyleX 的 `stylex.create`，加 `tokens.stylex.ts` / `variations.stylex.ts` | 普通 CSS，加 `--astryx-*` 变量和 `data-*` 属性选择器 | 算出来的样式一样 |
| render prop、`children` 函数 | 作用域插槽 | 用户能做同样的自定义 |
| `xstyle` | 不提供，用 `class` 和 `style` | 和 core 的约定一致 |
| `mergeProps` | Vue 的 attrs 透传 | 用户写的属性都落到根元素上 |

## 测试

- 把上游各组件 `.test.tsx` 里的用例改写成 `@vue/test-utils`，**期望值不改**。
- 每个组件加一条服务端渲染冒烟测试，用 `renderToString` 渲染。
- 文案：上游用 core 的 `@astryx.*` 文案键的地方，看 `packages/core/locales/en.json` 里有没有这些键。有的话照 `packages/charts/src/messages.ts` 的办法，在包里放一份兜底文案；没有就写进回报。

## 开发步骤（每步测完就提交）

1. 包骨架：`package.json`、构建、tsconfig、样式汇总、README、`pnpm install`。装依赖前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。
2. Stat。
3. CircularProgress。
4. InfoTip。
5. SVGIcon。
6. LogStream。
7. 台账 31 条逐条写结论：「已采纳」或「不适用：理由」。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/lab`：NODE_ENV 不设和设成 `production` 两种模式都要跑，用例数要一样。
2. `pnpm --filter @astryx-vue/lab typecheck` 和 `build` 都要通过。在仓库根目录跑下面这些检查，也都要通过：
   - `eslint --max-warnings 0 packages/lab`
   - 行数检查
   - `!important` 检查
   - `check-package-boundaries`
   - `pnpm check:packages`
3. 浏览器检查：在工作区里放一个临时 Vite 页面，路径 `.tmp-f3b/`，不要提交。
   - 把 5 个组件的主要状态各画一份，浅色、深色各截一张图，存到 `/tmp/F3b-shots/`。
   - 和原版 https://astryx.atmeta.com/components/<组件名> 的 Demo 对照，访问前先设代理。差异写进回报。
   - 浏览器只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose F3b --max-run 150 -- <命令>`。同一时刻只开 1 个。Playwright 走外网时要设 `proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }`。

## 纪律

- 每做完一个组件就提交一次，而且至少每 15 分钟提交一次。提交信息用中文，不要推送。
- 一个问题卡住超过 20 分钟：先提交，把现状写进回报，然后做下一步。
- 不碰 `packages/core` 和 `packages/themes`，缺什么写进回报。不改 `ROADMAP.md`、`SWARM.md`。
- 文档站页面不在这个节点做，归 F3f。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/F3b/impl-1.md`，格式见 `templates/impl-report.md`。另外写清这几件事：
- 测试搬了哪些、没搬哪些、为什么。
- 和原版截图对照的差异。
- 需要放进 themes 的变量。
- 给后续 lab 节点的骨架说明：怎么加一个新组件。
