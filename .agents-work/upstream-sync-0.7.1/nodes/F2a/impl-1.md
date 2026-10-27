# F2a charts 纯逻辑 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F2a`，分支 `sync/f2a-charts`。只在本地提交，没有推送。
- 提交（基于 `0dc6992`）：
  - `acf17fd` charts 包骨架：package.json、tsdown、tsconfig、README、catalog
  - `5ad5058` charts: 移植颜色工具 color.ts 及测试
  - `65d8fe9` charts: 移植 formatters 及测试
  - `e68372e` charts: 类型、比例尺工具、标记取色、图例与提示框取值
  - `57d7e92` charts: 配色计算 getChartColorsFromResolver 及测试
  - `6d8e81d` charts: 布局、8 种 SVG 标记的 resolve、标记与布局测试
  - `0001493` charts: 包入口 index.ts
  - `9885a65` scripts: 包边界检查的公开包名单改从 list-public-packages 取
  - `35a825a` 台账 F2a：11 条上游改动填结论

## 1. 做了什么

按计划的「开发步骤」逐条：

1. **包骨架**。新建 `packages/charts/`：`package.json` 写 `"private": true` + `"astryxVue": { "canaryOnly": true }`、版本 `0.0.0`、`exports` 的 `.` 指向 `dist/index.js` / `dist/index.d.ts`、`sideEffects: ["**/*.css"]`；`tsdown.config.ts` 照 cli 写，`platform: 'neutral'`、`dts: true`、vue 和 `d3-*` 不打进包；`tsconfig.json` 照 cli 写；README 三句话。`pnpm-workspace.yaml` 新增 `charts` catalog 组（`d3-scale 4.0.2`、`d3-shape 3.2.0`、两个 `@types/d3-*`，版本和上游 `packages/charts/package.json` 一致），包里用 `catalog:charts` 引用。
2. **`src/color.ts` + `color.test.ts`**。颜色解析/序列化：`parseHex`、`parseRgb`、`parseColor`、`formatHex`、`formatColor`、`toGLFloats`。测试整个搬上游 `core/src/utils/color.test.ts`（含 GL 对照表和 alpha 组合用例）。
3. **`src/formatters.ts` + 测试**。`formatList`、`compactNumber`、`currency`、`percent`、`shortDate`、`monthYear`。测试搬上游 `formatters.test.ts`。
4. **`types.ts`、`utils.ts`、`markColor.ts`、`legend.ts`、`tooltip.ts`**。类型去掉 React，`render()` 改成可选、返回 `VNodeChild`（来自 `vue`，只有类型依赖）；比例尺守卫 `isBandScale`、`xPixel`；标记取色 `seriesFill` / `pointFill`；图例 `deriveLegendItems`；提示框 `deriveTooltipSeriesValues` / `shouldRenderHoverDot`。
5. **`src/getChartColors.ts` + 测试**。只做 `getChartColorsFromResolver(resolve)`（类别、顺序、发散、语义、结构色、`alpha`）。测试搬上游 `getChartColors.test.ts`。
6. **`src/layout.ts`、`src/marks/*`、`marks.test.ts`**。布局：x 比例尺（band / 线性 / 显式 `xDomain`）、y 轴范围（`auto` / `zero` / `data` / 显式 `yDomain`、退化范围撑开、堆叠累计边界）、分类 y 轴、d3 `stack` 堆叠、柱状分组、逐系列调 `resolve()`；8 种标记的工厂和 `resolve()`：`bar`、`line`、`dot`、`area`、`band`、`candlestick`、`errorBar`、`referenceLine`。
7. **`src/index.ts`**。只导出本节点做完的：8 个标记工厂和选项类型、核心类型、`computeLayout`、图例/提示框/取色函数、`getChartColorsFromResolver`、格式化函数、`isBandScale` / `xPixel`、`color.ts` 的 6 个函数。
8. **`scripts/check-package-boundaries.mjs`**。公开包名单从写死三个名字改成从 `scripts/list-public-packages.mjs` 拿（ADR 7.3 的建议），charts 是 private 所以自动被跳过；`node scripts/check-package-boundaries.mjs` 通过。
9. **台账 11 条**都写了结论（1 条已采纳、2 条部分采纳、8 条不适用并给出归属）。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/charts/package.json` | 64 | 包清单：private + canaryOnly、exports、catalog 引用 |
| `packages/charts/tsdown.config.ts` | 14 | 打包成 esm + d.ts，vue 和 d3 不外打 |
| `packages/charts/tsconfig.json` | 10 | 继承根配置，收 `src/**/*.ts` |
| `packages/charts/README.md` | 7 | 是什么、只发 canary、现在只有纯逻辑 |
| `packages/charts/src/color.ts` | 149 | hex / rgb / 颜色名解析，hex / rgba 序列化，GL 通道换算 |
| `packages/charts/src/formatters.ts` | 173 | 数字、货币、百分比、日期、并列短语格式化 |
| `packages/charts/src/getChartColors.ts` | 204 | 从取变量值的函数算出整套图表配色 |
| `packages/charts/src/types.ts` | 182 | 图表核心类型、`DEFAULT_SERIES_COLOR`、标注类标记判定 |
| `packages/charts/src/utils.ts` | 27 | `isBandScale`、`xPixel` |
| `packages/charts/src/markColor.ts` | 55 | 一个标记的颜色怎么定 |
| `packages/charts/src/legend.ts` | 32 | 从系列推出图例项 |
| `packages/charts/src/tooltip.ts` | 59 | 提示框行、悬停点判定 |
| `packages/charts/src/layout.ts` | 327 | 比例尺、y 轴范围、堆叠、分组，再调各系列 `resolve()` |
| `packages/charts/src/marks/bar.ts` | 85 | 柱状（含堆叠、分组、负值）的 `resolve()` |
| `packages/charts/src/marks/line.ts` | 46 | 折线的 `resolve()` |
| `packages/charts/src/marks/dot.ts` | 78 | 散点（含 dodge 错开）的 `resolve()` |
| `packages/charts/src/marks/area.ts` | 54 | 面积（含堆叠）的 `resolve()` |
| `packages/charts/src/marks/band.ts` | 46 | 置信区间的 `resolve()` |
| `packages/charts/src/marks/candlestick.ts` | 47 | K 线的 `resolve()` |
| `packages/charts/src/marks/errorBar.ts` | 57 | 误差条的 `resolve()` |
| `packages/charts/src/marks/referenceLine.ts` | 46 | 参考线工厂（没有点位可算） |
| `packages/charts/src/marks/index.ts` | 8 | 标记子入口 |
| `packages/charts/src/index.ts` | 60 | 包入口，只导出已完成的东西 |
| `packages/charts/src/color.test.ts` | 219 | 上游 `core/src/utils/color.test.ts` |
| `packages/charts/src/formatters.test.ts` | 87 | 上游 `formatters.test.ts` |
| `packages/charts/src/getChartColors.test.ts` | 87 | 上游 `getChartColors.test.ts` |
| `packages/charts/src/marks/marks.test.ts` | 315 | 上游 `marks.test.tsx` 的纯计算部分（改写成直接调 `resolve()`） |
| `packages/charts/src/layout.test.ts` | 217 | 布局（上游没有测试，按代码行为补） |
| `packages/charts/src/legend.test.ts` | 125 | 图例、提示框、取色、悬停点（上游没有测试，按代码行为补） |
| `packages/charts/src/utils.test.ts` | 43 | `isBandScale`、`xPixel`（同上） |
| `pnpm-workspace.yaml` | +5 | 新增 `charts` catalog 组 |
| `scripts/check-package-boundaries.mjs` | +10/−6 | 公开包名单改从 `list-public-packages.mjs` 拿 |
| `.agents-work/upstream-sync-0.7.1/ledger/F2a.md` | +33 | 11 条结论 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `formatters.ts` | 按 `Locale`（就是 `string`）缓存 `Intl` 格式化器，非有限值原样返回，日期固定 `calendar: 'gregory'` | 照上游，语言类型叫 `ChartLocale = string` | 同一套 `Intl` 选项、同一套兜底分支 |
| `getChartColors.ts` | `getChartColorsFromResolver(resolve)` + `getChartColors(theme, mode)` | 只做 `getChartColorsFromResolver` | 计算部分逐行一致；主题入口按 ADR 3.4 不做 |
| `getChartColors` 的颜色工具 | 来自 `@astryxdesign/core/utils` | charts 包内 `src/color.ts`，照上游 `core/src/utils/color.ts` 搬 | 同样的输入同样的输出，测试整份搬过来 |
| `layout.ts` | d3 算比例尺和堆叠，再调各系列 `resolve()` | 照上游 | 算法、常量（`CONTINUOUS_HEADROOM = 0.08`）、分组槽位规则都相同 |
| `legend.ts` / `tooltip.ts` / `markColor.ts` / `utils.ts` | 纯函数 | 照上游 | 同一套优先级和 NaN 处理 |
| `types.ts` | `render()` 必填，返回 `ReactNode`；`svgRef: React.RefObject` | `render?`，返回 `Vue` 的 `VNodeChild`；`svgRef: Ref<SVGSVGElement \| null>` | 类型层面，运行时没有差别：本节点不调用 `render` |
| `marks/*.tsx` | 工厂里同时有 `resolve()` 和 `render()` | 拆成 `marks/*.ts`，只留工厂和 `resolve()`；渲染相关的取值（圆角、透明度、颜色默认值、路径字符串、标签位置）留给 F2b | `resolve()` 的输出逐字段一致（`px` / `py` / `py0` / `dataIndex`） |
| 上游包依赖 | `d3-array` + `d3-scale` + `d3-shape` | 只装 `d3-scale` + `d3-shape` | 上游 v0.7.1 源码只 `import` 了这两个包 |

## 3. 和计划不一样的地方

1. **没有给 charts 加 `@astryx-vue/core` 的 peer 依赖。** 计划第 4 步写「charts 对 core 用 `peerDependencies: workspace:^`」。实际做完发现本节点一个 core 的 API 都没用：上游 `formatters` 的 `Locale` 就是 `string`，颜色工具按计划在包内自实现，`getChartColors(theme, mode)` 不做。加一条用不上的 peer 依赖会让清单说的和实际不符，也违反 DRY，所以留到 F2b 真正用到 core 时再加（那时 `check-package-boundaries` 也接受 `workspace:^`）。
2. **`formatters` 的语言类型叫 `ChartLocale = string`**，没有从 core 引。理由同上：core 没有 `Locale` 这一类别名，它的 `AstryxLocale` 是 `'en' | 'zh-CN'` 联合，而 formaters 要接受任意 BCP 47 标签（上游测试就用了 `de-DE`、`fa-IR`、`th-TH`）。
3. **`layout.ts` 没有拆成多文件。** 计划说超过 500 行再拆，搬过来 327 行（含注释，比上游 372 行少是因为去掉了重复的注释块），在红线内。
4. **marks 的测试改写成了直接调 `resolve()`。** 见第 1 节的测试说明和下面的「栏目外补充」。断言的期望值没有为了通过而放宽——凡是和点位有关的数值（带中心、dodge 间距 9、堆叠层边界、分组左右顺序、`py`/`py0`）都保留了原意。
5. **补了三份上游没有的测试**（`layout.test.ts`、`legend.test.ts`、`utils.test.ts`）。上游这些函数没有任何测试，但它们承载了本节点一半的逻辑（y 轴范围、堆叠、分组、图例取色），没有测试等于没验证。
6. **`check-package-boundaries.mjs` 改成从 `list-public-packages.mjs` 拿名单**（计划第 8 步的「如果需要」）。这是 ADR 7.3 的建议做法，比往写死的名单里补名字更省事，也让 charts 这类 private 包不用逐个维护。

### 上游测试搬了哪些、没搬哪些

搬了（整份搬，断言一条没改）：

| 上游测试 | 我们 | 用例数 |
| --- | --- | --- |
| `packages/core/src/utils/color.test.ts` | `src/color.test.ts` | 42 |
| `packages/charts/src/formatters.test.ts` | `src/formatters.test.ts` | 6 |
| `packages/charts/src/getChartColors.test.ts` | `src/getChartColors.test.ts` | 8 |

`packages/charts/src/marks/marks.test.tsx` 一共 14 条用例，**全部要挂载 React 的 `<Chart>` 并检查 SVG 元素**（`path` 的 `d`、`circle` 的 `r`、`line` 的坐标……），本节点没有渲染，所以没有一条能原样搬。处理办法：把「这个标记算出几个可画的点、点在哪」这层意思改写成直接调 `resolve()` 的用例，逐条对应：

| 上游用例 | 我们 | 说明 |
| --- | --- | --- |
| bar「每个数据点一条路径，颜色是配置的颜色」 | bar「computes one point per datum, centered in its band」 | 改成断言 3 个点、柱心在带中心（上游看 `path` 数量和 `fill`） |
| bar「缺值时跳过，不画在基线上」 | bar「skips bars whose value is missing…」 | 断言只有 2 个点的坐标是有限的；缺值那点 `py` 不是有限值（d3 对 NaN 输入返回 `unknown`，所以不是 NaN） |
| bar「堆叠只给最上层圆角」 | bar「stacked bars share the same band and accumulate from zero」 | 圆角是画的事；这里断言上层柱底边等于下层柱顶边、柱心重合、`_isTopOfStack` 只有最上层为 true |
| bar「分组柱并排」 | bar「grouped bars render side by side within the band」 | 断言同一分类下第二组的 `px` 更大 |
| line「一条描边路径」 | line「computes one point per datum…」 | 描边宽度/颜色是画的事；断言 3 个点、`py` 等于 `yScale(值)` |
| line「只在有限值处画点」 | line「marks missing values as non-finite so the line gaps」 | 断言可画的点正好 2 个 |
| dot「每个数据点一个圆，半径/透明度按配置」 | dot「computes one point per datum」 | 半径/透明度是画的事；断言 3 个点位置有限 |
| dot「缺值跳过」 | dot「skips points whose value is missing」 | 同上游语义 |
| dot「dodge 横向错开，以共用的 x 为中心」 | dot「dodge spreads coincident points horizontally…」 | **数值完全保留**：间距 `radius * 2 + 1 = 9`，第一点在中点左侧 4.5 |
| area「默认填充 + 描边两条路径」 | area「fills from the zero baseline to the value」 | 两条路径是画的事；断言 `py0` 等于 `yScale(0)` |
| area「关掉描边只剩一条路径」/「渐变模式生成渐变」 | 没搬 | 纯渲染（`<linearGradient>` 的 id、`fill-opacity`），归 F2b |
| band「上下界之间填充」 | band「fills the region between the upper and lower bounds」 | 断言 `py = yScale(hi)`、`py0 = yScale(lo)` |
| band「没有任何点同时有上下界时什么都不画」 | band「renders nothing when no point has both bounds」 | 断言可画的点是 0 个 |
| candlestick「每根蜡烛一条须线加一个实体，按涨跌上色」 | candlestick「places each candle at its close price」 | 上色是画的事；断言 `py = yScale(close)` |
| candlestick「缺 OHLC 字段的蜡烛跳过」 | candlestick「still places a candle whose other OHLC fields are missing…」 | 缺字段的判定在画的那一步，`resolve()` 只看收盘价，所以这里断言 3 个位置都算得出来，并在用例名里写明这一点 |
| errorBar「每个点一根竖线加两个小横杠」 | errorBar「places a stem plus whisker ends per point」 | 断言 `py = yScale(high)`、`py0 = yScale(low)` |
| errorBar「缺一侧就不画」 | errorBar「skips whiskers missing either bound」 | 断言可画的点 2 个 |
| referenceLine 三条（横线 + 标签、涂带、竖线） | referenceLine 两条 | `resolve()` 永远返回 `[]`，点位全在 `render()` 里算，所以只搬「没有点位可算」和「`key` 稳定」 |
| GL 标记四条（`dotGL`、`heatmapGL`、`streamGL`、`dotGLInteractive`） | 没搬 | 4 个 WebGL 标记不在本节点范围（ADR 3.3） |

上游没有测试、我们补的：`layout.test.ts`（16 条：band/线性/显式 `xDomain`、分类 y 轴时去掉 x 的 padding、`auto` 含零与留余量、`zero` 对称、`data` 紧贴、显式 `yDomain` 不 `nice()`、单点撑开、全非有限时退到 0-1、堆叠累计边界、堆叠偏移、`_uid` / `_isTopStack`、分组槽位）、`legend.test.ts`（14 条：图例取色三级优先、跳过标注标记、提示框行、共用代表色、悬停点判定、`seriesFill` / `pointFill` 的兜底与抛错）、`utils.test.ts`（6 条）。

## 4. 台账处理

一共 11 条：**已采纳 1 条、部分采纳 2 条、不适用 8 条**。逐条结论已写进 `ledger/F2a.md`，摘要：

- 已采纳：`f5841d14c`（formatters 按语言取格式化器）。
- 部分采纳：`2458b03b3`（日期历法加固已采纳；同一个提交里 B7 的部分不归我们）、`2247368d3`（formatters 加固已采纳；`Chart.spec.md` 归 F2c）、`1581b0900`（vitest 的 `packages/**/*.test.ts` 已经覆盖 charts，不用改配置；`useChartColors` 归 F2b）。
- 不适用：`ea5705c0f`（上游 docs 平台的集成清单）、`377296d72` / `a4b265566` / `a90727569` / `b09d120ab` / `2b2113d7f` / `cb7a565c3`（都是规范文档或规划记录，组件归 F2b，文档归 F2c）。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/charts` | 过 | 7 个文件、113 条用例全过 |
| 2 | `NODE_ENV=production pnpm exec vitest run --maxWorkers=2 packages/charts` | 过 | 同样是 7 个文件、113 条用例 |
| 3 | `env -u NODE_ENV pnpm --filter @astryx-vue/charts build` | 过 | `dist/index.js` 32.52 kB、`dist/index.d.ts` 20.82 kB，两个文件都在 |
| 4 | `env -u NODE_ENV pnpm typecheck`（根上的） | 过 | 根 tsc、charts、cli、core、docs 五个 typecheck 全 Done |
| 5 | `eslint --max-warnings 0`（整个仓库）、`check-line-limit.mjs`、`check-no-important.mjs`、`check-package-boundaries.mjs`、`sync-exports.mjs --check`、`cli generate:check` | 过 | 逐个跑，全部无输出/退出码 0；line-limit 打印「源码单文件行数检查通过（上限 500 行）」；sync-exports 打印「生成结果和已提交文件一致」；generate:check 打印「catalog is up to date (245 components, 31 topics, 53 templates)」 |
| 6 | `env -u NODE_ENV pnpm lint:pkg` | 过 | 退出码 0。它只打包 `list-public-packages` 里的 cli / core / themes，charts 因为是 private 被自动跳过（正是想要的）。注意：这个命令要先有 dist，第一次在干净工作区直接跑会因为 cli 没 build 报 ENOENT，跑过 `pnpm build:packages` 之后就正常，和本节点改动无关 |
| 7 | 全仓库测试 `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` | 过 | 316 个文件、4371 条用例全过（确认没有旧测试被新包影响） |
| 8 | `--astryx-color-data-*` 名字核对 | 过 | 见下表，上游读的 59 个变量在我们主题里全部存在，一个不缺 |

`getChartColors` 读的变量 vs `packages/themes/data.css` / `neutral/base.css`（我们的名字统一加了 `--astryx-` 前缀，表里按上游名列出）：

| 上游变量 | 我们的变量 | 状态 |
| --- | --- | --- |
| `--color-data-categorical-{blue,orange,purple,green,pink,cyan,red,teal,brown,indigo}`（10 个） | `--astryx-color-data-categorical-*` | 10 个都在 `data.css` |
| `--color-data-{blue,shamrock,orange,pink,purple,red,teal,yellow,gray}-{5,4,3,2,1}`（45 个） | `--astryx-color-data-<hue>-<step>` | 45 个都在 `data.css` |
| `--color-data-neutral` | `--astryx-color-data-neutral` | 在 `data.css` |
| `--color-border-emphasized` | `--astryx-color-border-emphasized` | 在 `themes/neutral/base.css`（每套主题各一份） |
| `--color-border` | `--astryx-color-border` | 同上 |
| `--color-text-secondary` | `--astryx-color-text-secondary` | 同上 |

也就是说 F2b 的 `useChartColors` 只需要在调用 `getChartColorsFromResolver` 时做一次名字映射：`name => getComputedStyle(el).getPropertyValue('--astryx' + name)`。

`packages/themes/data.css` 没有改（ADR 说只核对不改）。

## 6. 给 F2b 的交接

1. **`render()` 怎么接**：`SeriesDef.render?: (resolved, ctx) => VNodeChild`，已经是可选的、返回 Vue 的 `VNodeChild`。每个 `marks/*.ts` 里工厂返回的对象直接加一个 `render(resolved, ctx) { ... }` 就行，位置就是上游 `render()` 的位置。`vue` 已经是 peer 依赖（`catalog:peer`），只在 `types.ts` 里 `import type`。
2. **`bar` 的柱宽要从闭包里取**：上游 `bar` 把柱宽 `barWidth` / 偏移 `barOffset` 记在工厂闭包里，`resolve()` 写、`render()` 读。我们保留了这个结构，变量合成一个 `slot = { width, offset }` 对象（写在 `marks/bar.ts` 的工厂里）。F2b 的 `render()` 必须写在同一个工厂里才能读到它，不要把它搬出去。
3. **渲染参数目前没有解析**：`radius`、`opacity`、`curve`、`strokeWidth`、`dots`、`gradient`、`stroke`、`upColor` / `downColor`、误差条的颜色/线宽/横杠宽、参考线的颜色/虚线/标签位置/涂带透明度——这些只影响画，F2a 没有从 `options` 里取出来（取了也没有读者）。F2b 加 `render()` 时照上游的默认值补上（`radius` 4、`opacity` 柱 1 / 散点 0.8 / 面积 0.3 / 带 0.15、`strokeWidth` 折线 2 / 误差条 1.5、`capWidth` 8、`upColor` `var(--color-success)`、`downColor` `var(--color-error)`、误差条 `var(--color-text-primary)`、参考线 `var(--color-border-emphasized)` + 虚线 `6 3` + 涂带 0.1）。
4. **`referenceLine` 的点位全在 `render()` 里算**：`resolve()` 返回 `[]`。它的 `key` 已经按上游规则生成（`ref-${y ?? x ?? 'none'}`）。
5. **`ChartContext.svgRef` 换成了 Vue 的 `Ref<SVGSVGElement | null>`**（上游是 `React.RefObject`）。`ChartPointerEvent`、`ChartMargin`、`ResolvedPositions` 照上游。
6. **还没做、留给 F2b 的公开项**：`useChartColors`、`getChartColors(theme, mode)`、`Chart` / `ChartAxis` / `ChartGrid` / `ChartLegend` / `ChartSwatch` / `ChartTooltip`、`swatchVariantForType`、`useChart`（`ChartContext.ts`）、4 个 WebGL 标记和 `webgl.ts`。`src/index.ts` 里没有给它们留空壳。
7. **和 core 的关系**：本节点一个 core 的 API 都没用，所以 `packages/charts/package.json` 里还没有 `@astryx-vue/core` 的 peer 依赖。F2b 用到 `Text`、`HStack`、`VStack`、`VisuallyHidden`、`useTranslator`、`useLocale`、`useLayer`、`useMergedRefs`、`useTheme` 时按 `"@astryx-vue/core": "workspace:^"` 加进 `peerDependencies`（还得同时进 `devDependencies` 才能本地 typecheck，参考 `packages/core` 自己怎么放 `vue`）。
8. **`d3-array` 没有装**：上游 `package.json` 声明了但 v0.7.1 源码没 `import`（ADR 3.2 的小注）。F2b 如果要用（比如 `extent`、`ticks`），在 `pnpm-workspace.yaml` 的 `charts` catalog 组里加一行再用 `catalog:charts` 引用。
9. **样式表**：`charts/charts.css` 和 `styles/*.css` 没有做（本节点没有组件）。按 ADR 7.1，F2b 建 `styles/<组件>.css`，组件文件自己 `import`，由 `pnpm sync` 汇总出 `packages/charts/charts.css`，并在 `package.json` 的 `exports` / `files` 里补上。现在 `exports` 只有 `.` 和 `./package.json`。

## 7. 拿不准的地方

1. **`getChartColors(theme, mode)` 没做**（计划里就写了不做）。ADR 说「要不要做、默认值从哪里来，由 F2a 和 B1 商量」。我这边没有和 B1 对过，结论是：我们 core 的 `ThemeDefinition.tokens` 只含主题覆盖的变量，默认值在 `packages/themes/*/base.css` 里，纯 JS 拿不到，所以不做一个从主题对象算配色的入口是合适的。如果以后要做，得先有一个「从主题名 + 模式读全部 token」的能力（B1 的活）。
2. **上游 `swatchVariantForType`（在 `ChartSwatch.tsx` 里，是个纯函数）没有做**。ADR 3.4 的范围没有列它，它和色块组件的形状绑在一起，我判断归 F2b。如果验收者认为它属于纯逻辑，挪过来只是一次小的补充。
3. **`marks.test.tsx` 的改写尺度**。我把「画了几个元素、元素属性是什么」翻译成「算了几个点、点在哪」，凡是渲染细节（路径字符串 `d`、`Q` 圆角、`fill-opacity`、渐变 id、`rect[rx=3]` 的标签底、虚线样式）都没有断言，因为那部分代码本节点不存在。如果验收要求「断言的期望值不要改」严格到这种程度，那么这些用例只能等 F2b 挂载 Vue 组件后再搬一遍。
4. **`lints` 里 `pnpm lint:pkg` 需要先 build**：本节点没有改它的行为，但第一次在干净工作区直接跑会报 cli 的 `dist/index.js` 不存在。建议 CI 顺序保持 `build` 在 `lint:pkg` 之前（现在 `pnpm check` 就是）。
5. **`ColorAccessor` 类型在 `bar.ts`、`dot.ts` 里 `export type { ColorAccessor }` 转了一次手**，这是照上游 `marks/bar.tsx`、`marks/dot.tsx` 的写法（它们的 `BarOptions.color` 用这个别名）。如果觉得多余可以删，但从入口导出的类型名要和上游一致。
