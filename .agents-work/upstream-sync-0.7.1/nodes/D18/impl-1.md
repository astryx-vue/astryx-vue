# D18 core 组件对齐原版 · 实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D18`，分支 `sync/d18-core-d12-fixes`，槽位 3。
- PR：#233（→ swarm-tree），已推送。**未合入，等总控决定 #17 默认值后处理。**
- 提交 10 个：plan + 6 个修复/特性提交 + lint + catalog + 模板修复。

## 1. 19 条逐条结论

| # | 结论 | 依据（都经过核实） |
| --- | --- | --- |
| 1 | 已修 | 原版 OverflowList.tsx 测量 `overflowRenderer(allItems)`（真实 overflow 内容最大宽度）；我们原来测量内置文案。改：测量容器渲染 `#overflow` 插槽（传全部 items）。测试：d12Measurement 第 1 条 |
| 2 | 已修 | 原版 Link base 是 `fontSize/fontWeight: inherit`（stylex 同级，修饰类后定义生效）；我们 `.astryx-link.astryx-link{font:inherit}`(0,2,0) 压过修饰类(0,1,0)。改：修饰类改双类。CSS 断言测试 |
| 3 | 已修 | 原版 Text 先应用 defaultWeightByType 再应用显式 weight（Text.tsx stylex.props 顺序）；我们 weight 规则写在 type 之前。改：weight 规则移到 type 之后 |
| 4 | 不是问题 | 原版演练场 table-filter 实测 selector/multi/complex 的 sm 高都是 28（data-size 探测）；我们基线与改后演练场 selector-sm 也是 28。D12 的 30/32/38 不复现 |
| 5 | 已修 | 原版 `<table>` 不设字号，数据格由 TableCell 自带 `--text-body-size`（14px），分组头 td 继承环境字号（16px、行盒 24px、行高 41px）；我们 `.astryx-table` 设 14px 压了分组头。实测对齐：改后演练场分组头 41px / 16px / 24px，与原版逐项一致。另把 table-filter 模板的自定义 `renderGroupHeader` 删掉（原版注释明确要默认实现以保首列固定） |
| 6 | 已修（数字更正） | 原版选择列宽 36px（useTableSelection.tsx `SELECTION_COLUMN_WIDTH = pixel(36)`），不是 D12 说的 48；且原版经 transformColumns 进 resolveColumnWidths，tableMinWidth 含选择列。我们两处都改了：minWidth 纳入选择列、48→36。测试断言 min-width = 120+36 |
| 7 | 已修 | 原版 rowExpansion 面板 td：paddingBlock spacing-4 / paddingInlineEnd spacing-5。我们 `.astryx-table__panel`(0,1,0) 被密度规则 (0,2,1) 盖掉。改：`td.astryx-table__panel`，与密度规则同级且在后 |
| 8 | 已修 | 原版 Token sizeStyles sm/md/lg 全部 `paddingInline: spacing-2`(8px)。我们 sm 覆盖 4px。改：删覆盖 |
| 9 | 已修 | 原版 `header: ReactNode`。改：`header?: string \| (() => VNodeChild)`，函数按函数式组件渲染；aria/排序/resize 标签非字符串时回退 key。测试：headerContent.test.ts |
| 10 | 不是问题 | 原版 Toolbar.tsx `defaultBlockPaddingForSize` 三尺寸全是 spacing-2，无开关；我们 toolbar.css 同样 padding-block spacing-2。D12 说法与原版源码矛盾 |
| 11 | 不是问题 | 原版 rowStatus/useTableRowStatus.tsx `STATUS_COLUMN_WIDTH = {type:'pixel', value: 28}`，与我们一致 |
| 12 | 已修 | 原版 StatusDot variants 有 `accent`（background --color-accent）。补类型 + CSS（含 on-accent 图标色） |
| 13 | 已修 | 原版 Tokenizer 输入框 `flex: 1 1 40px`、无固定 height；tokens 不 grow。改：`.astryx-power-search-tokens{flex:0 1 auto}`、输入框 `height:auto`。实测：空字段 38→32、输入框 28→20 |
| 14 | 已修 | Button 原来根本没有 icon prop（types 里只有插槽）。接 prop：字符串走 Icon（语义名/CSS 类）、组件/渲染函数直接渲染，`#icon` 插槽优先；向后兼容旧渲染函数用法。DropdownMenu `button.icon` 随之可用 |
| 15 | 已修 | 原版 ProgressBar neutral 填充 `--color-text-disabled`。我们缺规则落到 text-primary。补规则。实测深色下 241(近白)→82(灰) |
| 16 | 已修 | 原版 Tab font-size 恒 `--text-label-size`(14px)。我们 sm 13 / lg 15 写死。三尺寸统一 token。实测 lg 15→14 |
| 17 | 半修，留决定 | 机制（contentAlign=center 时每块 margin auto + contentWidth 限宽）原有且与原版一致；但原版 `contentWidth` **默认 680**，我们默认 undefined。改默认值属破坏性变化，按规矩没动，PR 里请总控定 |
| 18 | 不是问题 | 我们 ListItem `label?: ItemText` 本就可选，用 `#label` 插槽不需传字符串（无 dev warning）；原版 Item.tsx label 反而是必填 |
| 19 | 不修 | 归 D15（D12 已登记）。另注意：仓库已有 `Icon/solid-status-icons.test.ts` 把内置 glyph 对齐原版实心路径；文档站显示空心是因为 Lucide 语义映射覆盖了 glyph，这属于 D15 的图标决策 |

## 2. 改动文件

core：`styles/{link,text,table,token,progress-bar,tab-list,status-dot,power-search}.css`、`OverflowList/{OverflowList.vue,types.ts}`、`Table/{TableData.vue,types.ts,plugins/sortable.ts,plugins/stickyColumns.ts}`、`Button/{Button.vue,types.ts}`、`StatusDot/types.ts`。
docs：`components/playground/pages/table-filter.vue`（删 renderGroupHeader）。
cli：`src/generated/catalog.json`（generate 重生成，版本字段）。
测试（新）：`packages/core/src/modifierSpecificity.test.ts`（8 条）、`d12Abilities.test.ts`（6 条）、`d12Measurement.test.ts`（3 条）、`Table/headerContent.test.ts`（2 条）。

## 3. 证据

- 原版源码引用：OverflowList.tsx（测量）、Link.tsx / text.stylex.ts（字体应用顺序）、useTableSelection.tsx（36px）、useTableRowExpansion.tsx（面板内边距）、Token.tsx（paddingInline）、Toolbar.tsx（paddingBlock）、StatusDot.tsx（accent）、Tokenizer.tsx（输入框 flex）、ProgressBar.tsx（neutral 填充）、Tab.tsx（label 字号）、TableCell.tsx / TableHeaderCell.tsx（字号归属）、useTableGroupedRows.tsx（分组头）、BaseTable.tsx（tableMinWidth 链路）、Markdown.tsx（contentWidth 默认 680）、table-filter/page.tsx（无 renderGroupHeader 的注释）。
- 原版在线实测（Playwright + Clash 代理，astryx.atmeta.com/playground?template=table-filter，预览 iframe）：分组头 41px / td 16px / 行盒 24px / 数据行 14px·21px / selector-sm·multi-sm·complex-sm 均 28px。
- 我们改前（swarm-tree 基线，/tmp/d18-base 工作区 build）：分组头 37px / 14px·20px；Tab lg 15px；ProgressBar neutral 近白；PowerSearch 空字段 38 / 输入框 28。
- 我们改后（本分支 build，127.0.0.1:5173）：分组头 41px / 16px / 24px；Tab lg 14px；neutral 灰 82；PowerSearch 32 / 20；selector-sm 28；数据格 21px。
- 探测脚本：`/tmp/d18-probes/{before,after-final,before-playground}.json`（脚本已删，结果 JSON 在）。

## 4. 自测

| 项 | 结果 |
| --- | --- |
| core vitest（289 文件 / 3816 用例） | 过，`NODE_ENV` 未设与 `production` 两种环境各一遍 |
| `pnpm exec eslint . --max-warnings 0` | 过（两种环境） |
| `pnpm check:packages` | 过（行数、无 !important、catalog、i18n） |
| `pnpm --filter @astryx-vue/cli generate` | 工作区干净（catalog 已提交） |
| `pnpm docs:build` | 过 |

## 5. 没修的 / 需要注意

- **#17**：Markdown `contentWidth` 默认 680 未改（破坏性默认值），PR 里留总控。
- **#19**：实心状态图标归 D15。
- 选择列 48→36、`.astryx-table` 不设字号，都会改变现有渲染（PR 正文已点名）。
- table-filter.vue 与 D12 工作区同名文件，合 D12 分支时可能冲突（它那边是大改版，这边只删一行 renderGroupHeader + 可能动过 import，好解）。
