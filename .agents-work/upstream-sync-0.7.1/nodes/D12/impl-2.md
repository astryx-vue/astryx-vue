# D12 演练场模板逐个走查 · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D12`，分支 `sync/d12-playground-qa-2`。只在本地提交，没有推送。
- 已 rebase 到 swarm-tree（含 D17 #220），领先 53 个提交。
- 16 个模板每个都有 `diff-<slug>.md`，都在 `nodes/D12/` 下，跟分支一起提交。

## 1. 做了什么

按「table 系列 → dashboard 系列 → theme-showcase」做完 16 个模板。每个模板读原版源码，在浏览器里量原版和我们的 DOM 坐标（位置、尺寸、字号、字重、图表刻度位置、折线首点坐标），再逐区块修。

用户反复指出的图表问题，每张图按「撑满容器、y 轴档数、x 轴位置、图例色块、副标题、线型、虚实线」逐项核对，写进 diff。

公共修改（影响所有模板）：

| 文件 | 内容 |
| --- | --- |
| `apps/docs/styles/playground.css`、`usePaneResize.ts` | 演练场外壳：预览栏默认宽 432（原来 440，比原版窄 8px，导致 MetadataList 少一列）；预览卡片加 1px 描边、去阴影、深色底色 #1f1f22；Export 按钮高 32（原来 36，把工具栏撑高 4px） |
| `apps/docs/components/playground/playgroundCharts.ts` | `PlaygroundSparkline` 加 `isMeasured`；`PlaygroundLineChart` / `PlaygroundAreaChart` 加 `pad`、`centerTicks`、`yTicks`、`hasYAxis` 等可选项。默认行为都不变 |
| `apps/docs/components/playground/playgroundChartsExtra.ts`（新） | 柱图、甘特图、环形图从 `playgroundCharts.ts` 拆出来（原文件超 500 行），原路径 re-export，使用方不变 |
| `scripts/swarm/playground-pair.mjs` | 给本地站点预置主题（站点默认深色，原来的「浅色」图其实是深色） |

## 2. 每个模板修了几处、剩下几处

数字是从各 diff 文件里数「已修 / 一致 / 不修 / 未做」关键字得到的近似值，一条里出现多次会重复计，仅供参考，以 diff 为准。

| 模板 | 已修 | 一致 | 不修（理由在 diff） | 未做 / 进行中 |
| --- | --- | --- | --- | --- |
| table | 0 | 10 | 0 | 0 |
| table-page | 6 | 8 | 1 | 0 |
| table-filter | 10 | 1 | 3 | **功能块没做**：无限加载、行详情面板、View options 弹层、保存视图、高级搜索、空状态、批量操作条 |
| table-grouped | 11 | 8 | 1 | 0 |
| table-collapsible | 6 | 4 | 5 | 窄屏紧凑列 |
| table-comparison | 9 | 4 | 2 | 30 天可用性条、悬停显示清除按钮 |
| table-inbox | 4 | 7 | 7 | 悬停行操作、写信窗口、窄屏单栏 |
| table-tree | 5 | 5 | 5 | 键盘导航、面包屑折叠 |
| dashboard | 6 | 11 | 0 | 0 |
| dashboard-scorecard | 2 | 12 | 1 | 0 |
| dashboard-alert-rail | 11 | 10 | 2 | 数据生成器形状（原版的大尖峰没复刻） |
| dashboard-cohort-funnel | 9 | 12 | 1 | 页面总高差 4px 未查明 |
| dashboard-comparison | 12 | 10 | 0 | 0 |
| dashboard-composition | 10 | 13 | 0 | 0 |
| dashboard-progress | 11 | 7 | 3 | 燃尽图 y 轴「80 / pts」折行、W13 位置、环形图宽差 4px、页面总高未重测 |
| theme-showcase | 3 | 5 | 0 | 聊天输入框的附件 / 麦克风 / 发送按钮；Filters 在当前宽度下三个 Selector 没折进「Filters」（core 问题）；名称列窄；总高差 28px |

## 3. 和计划不一样的地方

- **深色模式没有逐个模板重截。** 前 8 个 table 模板生成了深色整页对照图（table-filter、table-grouped、table-collapsible、table-comparison、table-tree 看过；table、table-page、table-inbox 的深色图生成了但没逐张细看）；dashboard 系列和 theme-showcase 只按滚动分段截了浅色，深色没截。用户中途说不要重头再截，我按这个执行。
- **table-filter 只做了首屏**。原版 4630 行，功能块体量大，没做。
- 站点端口用 5171（计划写的 5174）。
- **滚动分段对照图**：用户中途指出之前的错位藏在要往下滚才能看到的区域，从 dashboard-scorecard 起改用 `scrollpair.mjs`，按滚动分段截。前面的 table 系列只截了第一屏加个别展开态，下半屏靠 DOM 量值核对，没有分段对照图。
- 浏览器截图脚本放在 `.tmp-d12/`，不提交。

## 4. 交给 core 的问题（汇总）

| # | 问题 | 影响的模板 |
| --- | --- | --- |
| 1 | `OverflowList` 测量指示器宽度用内置「还有 N 项」文案（89px），不读 `#overflow` 插槽里实际按钮（「+N」43px），少放一个子句 | table-filter、theme-showcase |
| 2 | `Link` 的 `size`、`weight` 属性不生效：`.astryx-link.astryx-link { font: inherit }` 特异性高于 `--size-*` | table-filter、dashboard-composition |
| 3 | `Text` 的 `type="display-3"` 字重（300）规则盖过 `weight="bold"`，粗体永远不生效 | dashboard-composition |
| 4 | `MultiSelector` / `Selector` / `ComplexSelector` 在 `size="sm"` 下实高 30 / 32 / 38，原版都是 28 | table-filter |
| 5 | `Table` 单元格行高：原版 td 21px、我们 20px（每行少约 1px）；分组头原版继承 16px、我们 14px | table-filter、table-collapsible、table-inbox、dashboard-cohort-funnel、table-tree |
| 6 | `Table` 的 `tableMinWidth` 没把选择列（48px）算进去，比例列分到的宽度偏少 | table-filter、theme-showcase |
| 7 | `Table` 展开面板 `.astryx-table__panel` 的 16 / 20 / 48 内边距被 `.astryx-table[data-density] :is(th,td)`（特异性 0,3,1）盖掉 | table-collapsible |
| 8 | `.astryx-token.size-sm` 横向内边距 4px，原版 8px（涨跌徽标、标签偏窄） | table-collapsible、table-inbox、dashboard-cohort-funnel |
| 9 | `Table` 的 `column.header` 只收字符串，原版收 ReactNode（只能走 `headerPatch`） | table-comparison |
| 10 | `Toolbar` 固定 `padding-block: spacing-2`，原版阅读栏标题栏不加（标题栏高 48 对 32） | table-inbox |
| 11 | `useTableRowStatus` 状态列 28px，原版 36px | table-inbox |
| 12 | `StatusDot` 没有 `accent` 变体（原版有，深色圆点） | table-grouped |
| 13 | `PowerSearch` 无条件时 `.astryx-power-search-tokens` 仍占满剩余宽度把输入框挤到中间；`.astryx-power-search-input` 固定 28 高 | table-grouped |
| 14 | `DropdownMenu` 的 `button.icon` 是插槽函数，传字符串不生效 | table-grouped |
| 15 | `ProgressBar` `neutral` 变体填充色：原版灰 145，我们近黑 27 | table-collapsible |
| 16 | `.astryx-tab--size-sm` 字号写死 13px，原版 14px | table-tree |
| 17 | `Markdown` 的 `contentAlign="center"` 没有把每块居中并限宽 680 | table-tree |
| 18 | `ListItem` 的 `label` 属性必填，用 `label` 插槽放富内容时仍要再传一份字符串 | dashboard-composition |
| 19 | 状态图标原版实心、我们空心；error 图标前景色 192,38,44 对我们 118,0,12 | table-comparison（已记 D15） |

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `pnpm check:templates` | 过 | 49 个模板落地后 vue-tsc 通过 |
| 2 | `node scripts/check-template-tokens.mjs` | 过 | 57 个模板；含「图表跟着容器宽度走」新检查 |
| 3 | `pnpm exec eslint --max-warnings 0 .` | 过 | 无输出 |
| 4 | `pnpm check:packages` | 过 | 含行数检查（拆出 `playgroundChartsExtra.ts`）、无 `!important`、catalog 一致 |
| 5 | `pnpm exec vitest run --maxWorkers=2 packages/cli tests` | 过 | 38 个文件，577 条用例 |
| 6 | 拆分后重建，6 个图表模板运行时无报错 | 过 | dashboard、-progress、-cohort-funnel、-comparison、-composition、theme-showcase |

## 6. 对照图路径

- 整页左右对照（浅色 + 深色）：`/tmp/D12-shots/<slug>-<light|dark>.png`，前 8 个 table 模板和 dashboard-scorecard 之前的共有。
- 只截预览区、放大：`/tmp/D12-shots/crops/<slug>-light-{up,ours}.png`；点开展开态：`/tmp/D12-shots/crops/<slug>-expand-{up,ours}.png`。
- **滚动分段对照（原版左、我们右）**：`/tmp/D12-shots/scroll/<slug>-light.png`，dashboard-scorecard、dashboard、dashboard-alert-rail（含 `-final`、`-v2`）、dashboard-cohort-funnel、dashboard-comparison（含 `-final`）、dashboard-composition（含 `-final`）、dashboard-progress、theme-showcase。
- 这些图在 `/tmp`，机器重启会丢。

## 7. 拿不准的地方

- 「已修」计数来自关键字统计，不精确。
- dashboard-progress 改后没有重截整页，坐标靠 DOM 量值核对。
- theme-showcase 的 Filters 结构对了，但视觉上和原版不同（没折成「Filters」按钮），原因在 core 问题 #1。
- 站点默认外观是深色，对照原版浅色时需预置 `vitepress-theme-appearance`；`playground-pair.mjs` 已改。
- 浏览器截图那一侧：原版站点偶尔首屏空白，需要等 iframe 内容出来再截，脚本里已加等待。
