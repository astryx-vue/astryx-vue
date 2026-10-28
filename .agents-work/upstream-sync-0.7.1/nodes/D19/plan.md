# D19 core 组件对齐原版 · D12 第二批 13 条问题

工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D19`，分支 `sync/d19-core-d12-fixes-2`，槽位 3，端口 5173。
来源：`nodes/D12/impl-3.md` 第三节（13 条）。基线 = origin/swarm-tree（含 D18）。

## 先说一个前提

D12 的"原版"数字是从**在线站点**量的，在线站点现在是 v0.7.4 以后的代码，我们的对齐目标是 v0.7.1。
所以每条都读了 `v0.7.1` 源码再定结论。第 11 条就是这样才发现不属于 0.7.1。

核实方式：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/core/src/...`，
再用 Playwright（走代理）在原版演练场 table-collapsible / table-inbox / table-tree 上量 DOM，在我们的 docs 站和演练场上量同一处。

## 13 条逐条核实

| # | 清单说法 | 结论 | 依据 |
| --- | --- | --- | --- |
| 1 | Table 分组头随密度变 | **确认** | 原版分组头是插件自己渲染的裸 `<td colSpan>`（useTableGroupedRows.tsx `headerCell`：paddingBlock 8、paddingInlineStart 0、paddingInlineEnd 12），不吃密度。我们 `.astryx-table[data-density] :is(th,td)`（0,2,1）和 `:first-child/:last-child`（0,3,1）压过 `td.astryx-table__group`。docs 站实测 compact 33 / balanced 41 / spacious 49，原版恒 41 |
| 2 | Table 默认 `table-layout: fixed` | **确认** | BaseTable.tsx `styles.table.tableLayout='fixed'`，只有 children 模式（`<Table>` 手写行列）加 `tableAutoLayout`。我们数据模式是 auto。docs 站实测 `table-layout: auto`；演练场 4 个模板在 `:deep` 里自己补了 fixed |
| 3 | tableMinWidth 不跟选择列宽 | **确认，说法要改** | 根因不是 minWidth 算错，而是我们的选择列是在 `transformColumns` 流水线**外面**临时拼上去的（TableData.vue `[selectColumn(), ...resolvedColumns]`），后面的插件改不到它。原版选择列由 selection 插件的 `transformColumns` 加入，后面的插件可以 `map` 改宽度，改了自然进 `resolveColumnWidths` 和 `tableMinWidth`（table-filter 模板原版就是这样把它改成 48）。`widthFor` 拖拽改宽不进 minWidth，原版也一样 |
| 4 | Icon 的 `<span>` 里 fill 继承 currentColor | **确认** | 原版 Icon 对组件型图标直接渲染 `<svg {...props}>`，没有任何 `fill` 样式，描边图标（lucide 的 `fill="none"`）保持描边。我们 `.astryx-icon > svg { fill: currentcolor }` 是 CSS，盖过了 svg 的 `fill` 属性 |
| 5 | compact 数据格比原版少 2px | **已查明：原版的一个意外，需决定** | 原版演练场 table-collapsible 实测：行高 51，`<td>` 内边距是 `1px`（浏览器默认值），里面一层 `<div>` 内边距 `4px 8px`。来源是 TableCell.tsx：只要单元格有右键菜单（`contextMenuActions`），密度内边距就从 `<td>` 挪到右键触发器 div（为了让整格都能触发菜单），`<td>` 只剩 `densityTextStyles`（字号和 box-sizing），没有内边距，于是浏览器默认的 `td { padding: 1px }` 漏出来。哪些格有菜单：rowExpansion 插件给每个可展开行的每个格子都贡献"展开/收起"菜单项（useTableRowExpansion.tsx 第 475–500 行）。不可展开的行没有，所以同一张表里行高不一致。v0.7.2–v0.7.4 的 TableCell 没变。结论：**只有带行展开的表**在可展开行上多 2px。见"修复"一节的处理 |
| 6 | 展开面板右内边距被盖 | **确认** | 同第 1 条根因。实测 `padding-inline-end` 8px（compact）对原版 20px |
| 7 | Toolbar 缺 Section 外壳的横向内边距 | **确认** | 原版 Toolbar 是 `<Section paddingBlock={2}>` 里面放 toolbar（Toolbar.tsx 第 302–310 行）。Section 的横向内边距来自主题的 `--astryx-section-padding`（neutral = 12px），并带"逃出父容器内边距"的负外边距。原版演练场 table-inbox 实测：toolbar 561×32，外面 Section 585×48，内边距 8px 12px。我们 Toolbar 是单个 div，padding 8px 0。两边的"首尾幽灵按钮缩进"（edgeCompSlot）我们也没接 |
| 8 | `parseSize` 不支持"百分比 − 像素" | **不是问题** | 原版 `parseSize`（useResizable.ts 第 388 行）也只收数字、`'Npx'`、`'N%'`、`pixel()`、`percent()`。原版 table-inbox 的 `maxSize` 写的是 `surfaceWidth - LIST_MIN_WIDTH`，是 JS 里算好的数字，不是 CSS 表达式。我们同样支持这几种 |
| 9 | TabList 容器高 33/5 对 32/4 | **不是问题（已对齐）** | 在原版和我们的 table-tree 上量同一个 TabList：都是 874×33，nav 内边距底部都是 4px。原版 strip 的"底内边距 5"是焦点环外扩量，被同样大小的负外边距抵消，不占布局。D12 量的是 D18 之前的版本 |
| 10 | Markdown 标题外边距 | **确认** | 两处：① 原版按**源文档的标题深度**（`node.depth <= 3` 取大间距 24/12，否则 16/8），不是渲染出来的 h 级别；`headingLevelStart=2` 时 `#` 渲染成 h2，`##` 渲染成 h3，原版仍按 depth 1、2 取大间距。我们按渲染级别（h1、h2 大，其余小）。② 我们首个标题的"去上边距"（`.astryx-markdown > :first-child`）被标题规则压住，实测首标题上边距 16px，原版 0 |
| 11 | Markdown 表格没有外框和网格线 | **不是 0.7.1 的问题** | v0.7.1 的 Markdown 表格是 `<Table dividers="rows">`，只有行线。网格线和外框是 v0.7.4 的提交 962800ced "tables draw a line on every cell edge (#7576)"。D12 量的是在线站点的新代码。记入 G4 台账 |
| 13 | Token 的 `vertical-align: middle` | **确认** | 原版 Token 样式里没有 `verticalAlign`（只有 inline-flex + alignItems）。D12 实验过：改 baseline 后表格行高对上 |
| 12 | ProgressBar 在 flex 行宽度 0 / TextInput 默认宽度 | **都确认** | ProgressBar：原版容器 `width:100%; minWidth:48px`，我们没有，在 flex 行里缩成 0。TextInput：原版 `<input>` 只有 `flex:1; minWidth:0`，我们多了 `width:100%`。百分比宽度的输入框在"按内容定宽"的 flex 子项里最小内容宽度算 0，所以根节点缩到 94 而不是输入框默认的 146 |

## 归并出的共用根因

- **根因 A：密度单元格规则太"宽"。** `.astryx-table[data-density] :is(th,td)` 和它的 first/last-child 变体对所有格子生效，插件自己渲染的格子（分组头、展开面板）要靠比它特异性更高的规则去"赢回来"，每加一种就要多一场特异性战争。 → #1 #6
  做法：密度规则对插件格子**不生效**（用 `:where(:not(...))` 排除，不增加特异性），插件格子只由自己的规则管。
- **根因 B：数据表的列布局口径和原版不一致。** 默认布局、选择列不在列流水线里、带菜单的格子的内边距。 → #2 #3 #5
- **根因 C：Toolbar 缺 Section 外壳。** → #7
- **根因 D：Markdown 标题间距用渲染级别而不是源文档深度，且首尾去边距被压。** → #10
- **根因 E：几个组件的 CSS 比原版多了一条或少了一条声明。** → #4 #12 #13

## 修复顺序（每组一个提交，各配测试）

1. 根因 E：Icon `svg:not([fill])`、Token 去 vertical-align、ProgressBar 宽度、TextInput 去 width:100%。
2. 根因 A：分组头、展开面板。docs 站 table 分组/展开 demo 量密度三档。
3. 根因 B：数据表 fixed 布局（`data-layout` 属性）；选择列进 transformColumns 流水线；第 5 条按下面处理。
4. 根因 D：渲染时给标题加 `data-depth`，CSS 按深度取间距，首尾去边距修特异性。
5. 根因 C：Toolbar 套 Section。
6. 全量检查。每个改动组件在 docs 站 demo 上改前后各量一次尺寸（改前基线已存 `/tmp/d19-probes/before.json`，245 页），附对照表。

## 第 5 条的处理

原版的这 2px 是意外（浏览器默认 td 内边距漏出来），而且同一张表可展开行和不可展开行高度不一致。
但"效果和原版一致"是总原则，且 table-collapsible、table-tree 等模板整页高度会差 26px。
所以做成**窄的复刻**：只有行展开插件给"可展开行的格子"打标记，标记格的上下内边距 +1px（原版同样只在可展开行出现）。
横向的 1px 不复刻（对列宽无影响，宽度由 fixed 布局决定）。
这不改任何 prop 行为，只影响 rowExpansion 的可展开行的行高（+2px）。如果总控认为不该复刻一个意外，删掉标记即可，一处改动。

## 不碰

- D20 的工作区。
- 改已有 prop 默认值的事（本批没有发现需要改默认值的）。
- 第 11 条的网格线：不属于 0.7.1。
