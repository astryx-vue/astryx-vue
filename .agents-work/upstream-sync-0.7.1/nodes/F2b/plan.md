# F2b charts 组件 · 执行计划

## 目标

`@astryx-vue/charts` 能画出图表了。用户写

```vue
<Chart :data="rows" x-key="month" :series="[bar('revenue'), line('trend')]">
  <ChartAxis position="bottom" />
  <ChartAxis position="left" />
  <ChartGrid />
  <ChartTooltip />
  <ChartLegend />
</Chart>
```

看到的柱子、折线、坐标轴、网格、图例、悬停提示框和十字线，要和原版 Astryx 的 Chart 一样。服务端渲染直接输出 SVG。读屏软件能读到图的名字，数据少时还能读到一张隐藏的数据表。

（上面组件的具体 props 名以上游为准，这里只是示意。）

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F2b`，分支 `sync/f2b-charts-ui`，槽位 2，端口 5172。只在这里改。
- 动手前先读：
  - `docs/adr/0001-new-packages.md` 第 3 节（3.3 决策、3.4 末尾的 F2b 段）、第 7.1 节（样式文件结构）。
  - F2a 的成果：`packages/charts/`。纯逻辑都已经在里面，`types.ts` 里 `render` 的返回类型已经是 Vue 的 `VNodeChild`。另外读 `.agents-work/upstream-sync-0.7.1/nodes/F2a/impl-1.md` 里给 F2b 的交接说明。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/F2b.md`（8 条）。
  - 上游：`packages/charts/src/{Chart,ChartAxis,ChartGrid,ChartLegend,ChartSwatch,ChartTooltip}.tsx`（共约 1570 行）、`ChartContext.ts`、`useChartColors.ts`、`marks/*.tsx` 的 `render` 部分，以及各自的 `.spec.md`、`.doc.mjs`、`.test.tsx`。读法：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:<路径>`。
  - 我们 core 里要用到的：`Text`、`HStack`/`VStack`（看 `packages/core/src/` 里实际叫什么）、`VisuallyHidden`、浮层（`packages/core/src/layer/`，看 C7 的 Tooltip 是怎么用的）、locale（`useAstryxMessages`/`useAstryxLocale`）、`characterCount`/`truncateCharacters`（B7 做的 utils）。charts 对 core 用 `peerDependencies: "workspace:^"`，开发依赖里也加上。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。装依赖前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。
- 浏览器：只能用 `node scripts/swarm/browser-lock.mjs run --purpose F2b --max-run 120 -- <命令>`，同一时刻只开 1 个。Playwright 脚本放在工作区内的 `.tmp-f2b/`（用完删掉，不提交；放 /tmp 会找不到 playwright 包）。

## 上游写法 → 我们的写法

| 上游 | 我们 | 为什么效果一样 |
| --- | --- | --- |
| 标记的 `render()` 返回 ReactNode | 用 Vue 的 `h()` 返回 VNode。直接在 `marks/<名>.ts` 里补上 `render`，不另建组件 | 画出来的 SVG 元素和属性相同 |
| `ChartContext`（React context） | `provide/inject`，key 和类型放在 `src/context.ts`；对外导出 `useChart()` | 子组件拿到同样的比例尺和尺寸 |
| StyleX 样式 | 写成 `packages/charts/styles/<组件>.css`，每份开头照 core 的写法声明层顺序，规则写在 `@layer astryx.components` 里，由组件自己 `import`。包根再放一个汇总的 `charts.css`，`package.json` 的 `exports` 加上 `./charts.css` 和 `./styles/*.css` | 用户按需引入时也有样式 |
| `useChartColors` 读当前主题 | 写成 composable：客户端从根元素的计算样式读 `--astryx-color-data-*`，再调 F2a 的 `getChartColorsFromResolver`；服务端直接输出 `var(--astryx-color-data-…)` 字符串（SVG 的 `fill` 可以直接写 CSS 变量） | 颜色跟着主题走 |
| `ChartTooltip` 的浮层走 core 的 `useLayer` | 同样用我们 core 的浮层 | 提示框浮在弹窗之上（台账 `cb7a565c3`） |
| render prop / children 函数 | 作用域插槽 | 用户能自定义提示框内容 |

## 任务范围

- 要做：`Chart`、`ChartAxis`、`ChartGrid`、`ChartLegend`、`ChartSwatch`、`ChartTooltip` 6 个组件；8 种 SVG 标记的 `render`（bar、line、area、dot、band、candlestick、errorBar、referenceLine）；`useChartColors`、`useChart`；样式；测试；`src/index.ts` 导出。
- 无障碍：SVG 带 `role="img"` 和名字；数据点不超过 100 个时，输出一张视觉隐藏的数据表（照上游）。
- 不做：4 个 WebGL 标记、文档站页面（归 F2c）、发布流程。
- 不碰：`packages/core`（缺什么写进回报）、`ROADMAP.md`、`SWARM.md`。

## 开发步骤（每步测完就提交）

1. `context.ts` + `Chart.vue`：算尺寸（客户端用 ResizeObserver，服务端用 props 里的宽高或默认值）、调 F2a 的布局函数、`provide` 上下文、画 SVG 外框和各系列。
2. 8 种标记的 `render`。
3. `ChartAxis`、`ChartGrid`。长标签用 core 的 `truncateCharacters` 截断，完整文字留给读屏（台账 `2b2113d7f`）。
4. `ChartSwatch`、`ChartLegend`。
5. `ChartTooltip`：悬停时找最近的点，画十字线，弹出浮层，键盘也能操作（照上游 spec）。
6. `useChartColors`、样式文件、`charts.css` 汇总、`package.json` 的 exports、`index.ts`。
7. 测试：把上游 `Chart.test.tsx`、`ChartAxis.test.tsx`、`ChartGrid.test.tsx`、`ChartLegend.test.tsx`、`ChartSwatch.test.tsx`、`ChartTooltip.test.tsx`、`marks.test.tsx` 里的渲染用例改写成 `@vue/test-utils`，断言的期望值不能改。再加一条服务端渲染测试：用 `renderToString` 渲染一个柱状加折线图，断言输出里有 `<svg`、`role="img"`、`<rect`、`<path`。
8. 台账 8 条写结论。

单个源文件不超过 500 行。`Chart.vue`、`ChartTooltip.vue` 超了，就把逻辑抽成 composable。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/charts`，两种 `NODE_ENV` 下都通过，用例数相同。
2. `pnpm --filter @astryx-vue/charts typecheck`、`build` 通过；根上的 `eslint --max-warnings 0 packages/charts`、行数检查、`!important` 检查、`check-package-boundaries`、`sync-exports --check` 都通过。
3. 浏览器：在工作区里搭一个临时 Vite 页面（放在 `.tmp-f2b/`，不提交）。画两张图：一张是「柱状 + 折线 + 两条轴 + 网格 + 图例 + 提示框」，一张是堆叠面积图。浅色、深色各截一张，放到 `/tmp/F2b-shots/`。再把鼠标悬停到第 3 个点上，截一张带提示框的图。然后和原版对照：如果 https://astryx.atmeta.com/components/Chart 上能找到用同样数据的 Demo，就和它比（访问要设代理），把差异写进回报。

## 回报

- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/F2b/impl-1.md`，格式见 `templates/impl-report.md`。另外写三件事：上游测试搬了哪些、没搬哪些、为什么；和原版截图对照的差异；core 缺的东西。
- 分步提交，提交信息用中文，不要推送。最终回复用中文，300 字以内。
