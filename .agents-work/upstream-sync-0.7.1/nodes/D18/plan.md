# D18 core 组件对齐原版 · D12 走查 19 条问题修复

工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D18`，分支 `sync/d18-core-d12-fixes`，槽位 3，端口 5173。

## 最终目标

D12 演练场走查交给 core 的 19 条问题，逐条在上游 v0.7.1 源码核实后修复（或确认不是问题），每组根因一个提交，让演练场模板不再依赖绕过代码。

## 19 条逐条核实结论

核实方式：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:<路径>` 读原版源码；存疑的再用浏览器量原版在线页面（Playwright 走代理）。

| # | 结论 | 依据 |
| --- | --- | --- |
| 1 | **确认** | 原版 OverflowList 测量容器渲染 `overflowRenderer(allItems)`（用户真实的 overflow 内容，最大宽度）。我们渲染内置文案「还有 N 项」。修：测量容器改渲染 `#overflow` 插槽（传全部 items） |
| 2 | **确认** | 原版 Link base `fontSize/fontWeight: inherit`，size/weight 显式传 Text 生效。我们 `.astryx-link.astryx-link{font:inherit}`（0,2,0）压过 `--size-*/--weight-*`（0,1,0）。修：size/weight 规则改双类特异性 |
| 3 | **确认** | 原版 Text 应用顺序 defaultWeightByType 在前、weight 显式在后，显式 weight 赢。我们 text.css 里 weight 规则排在 type 规则前面，display-3 的 300 盖过 bold。修：weight 规则移到 type 规则之后 |
| 4 | **待浏览器实测** | 源码上我们 `size-sm` 高度 = `--astryx-input-height-sm`(28) border-box，与原版 `--size-element-sm`(28) 一致。D12 量到 30/32/38 需复测（可能是别的元素或已修） |
| 5 | **待浏览器实测** | 原版 td 行高 = 14px×1.4286=20px（tokens.stylex.ts 注释 14px→20px），与我们一致。分组头行高待实测 |
| 6 | **确认（数字不准）** | 原版选择列宽 36px（useTableSelection.tsx `SELECTION_COLUMN_WIDTH = pixel(36)`），且经 transformColumns 进入 resolveColumnWidths，tableMinWidth **包含**选择列。我们选择列 48px 且不参与 tableMinWidth。修：两处的归一是 tableMinWidth 纳入选择列；48→36 属对齐改动，和选择列视觉一起实测后定 |
| 7 | **确认** | 原版展开面板 td：paddingBlock spacing-4(16)、paddingInlineEnd spacing-5(20)、paddingInlineStart 40px+密度。我们 `.astryx-table__panel`(0,1,0) 被 `.astryx-table[data-density] :is(th,td)`(0,2,1) 盖掉 paddingBlock/InlineEnd。修：panel 选择器提高特异性 |
| 8 | **确认** | 原版 Token sizeStyles sm/md/lg 都是 `paddingInline: spacing-2`(8px)。我们 sm 覆盖成 spacing-1(4px)。修：删掉 sm 的 padding-inline 覆盖 |
| 9 | **确认** | 原版 `column.header: ReactNode`。我们 `header?: string`。修：类型放宽 `string \| (() => VNodeChild)`，模板用函数式组件渲染；非字符串时 aria/resize 标签回退 column.key |
| 10 | **倾向不是问题** | 原版 Toolbar 无条件 `paddingBlock: spacing-2`（Toolbar.tsx `defaultBlockPaddingForSize` 全尺寸=2）。D12 说法与原版源码矛盾，浏览器量原版演练场 reader 标题栏后定 |
| 11 | **不是问题** | 原版 rowStatus 状态列 `STATUS_COLUMN_WIDTH = {type:'pixel', value: 28}`，与我们 28 一致 |
| 12 | **确认** | 原版 StatusDot 有 `accent` 变体（background `--color-accent`）。我们没有。修：types 加 `'accent'`，CSS 加规则 |
| 13 | **确认** | 原版 Tokenizer 输入框 flex `1 1 40px`、无固定 height（内容撑高）；空 tokens 不 flex-grow。我们 `.astryx-power-search-tokens{flex:1 1 auto}` 空时也占位，输入框固定 28 高。修：tokens 改 `flex:0 1 auto`，输入框 height 改 auto |
| 14 | **确认** | 原版 Button icon 是 ReactNode 直接渲染。我们 Button 的 `icon` prop 根本没接（只渲染 `#icon` 插槽），types 写 `() => unknown`。修：Button 渲染 `icon` prop（字符串=CSS 类名、组件=渲染、函数=调用，兼容旧用法） |
| 15 | **确认** | 原版 neutral 变体填充色 `--color-text-disabled`（中性灰）。我们 neutral 无规则，落到默认 `--astryx-color-text-primary`（近黑）。修：补 neutral fill 规则 |
| 16 | **确认** | 原版 Tab font-size 恒 `--text-label-size`(14px)，不随尺寸变。我们 sm=13px、lg=15px 写死。修：三个 size 统一用 label token |
| 17 | **半确认，默认值需总控决定** | 原版 `contentWidth` 默认 680、`contentAlign='center'` 时每块 margin-inline auto + maxWidth 680（表格/代码块不限宽）。我们每块居中机制已有（`__prose` margin auto + measure），但默认 contentWidth 是 undefined。改默认值属破坏性变化，列入回报由总控定 |
| 18 | **不是问题** | 我们 ListItem `label` 本就可选（`label?: ItemText`），用 `#label` 插槽无需传字符串；原版 label 反而是必填（ReactNode） |
| 19 | **不修（归 D15）** | 原版状态图标实心。图标方案归 D15，D12 已记。本节点不动 |

## 共用根因归并

- **根因 A：CSS 特异性/顺序**（#2 #3 #7 #15 #16）：修饰类规则被基础规则或早期规则压住。逐条修 CSS，配样式断言测试。
- **根因 B：缺变体/缺 prop 接线**（#12 #14）：组件能力比原版少。补类型 + 渲染 + 测试。
- **根因 C：测量逻辑**（#1 #6 #13）：宽度/占位计算与原版口径不同。改测量实现 + 测试。
- **根因 D：数据 API 表达力**（#9）：header 只收字符串。放宽类型 + 渲染 + 测试。
- **待实测**（#4 #5 #10 #17 部分 #6 的 48→36）：文档站 demo 量值 + 原版在线页面对比后定。

## 修复顺序

1. 文档站 build + preview，写探测脚本量基线（#4 #5 #10 #17，以及所有改动组件改前尺寸）。
2. 根因 A（CSS 五条）一个提交 + 测试。
3. 根因 B（StatusDot accent、Button icon）一个提交 + 测试。
4. 根因 C（OverflowList 测量、Table 选择列入 minWidth、PowerSearch flex）一个提交 + 测试。
5. 根因 D（Table header 放宽）一个提交 + 测试。
6. 全量检查（eslint、check:packages、cli generate、docs:build、vitest 两种 NODE_ENV）。
7. 每个改动组件在文档站 demo 复量，附改前改后对照。

## 不碰

- D12 工作区（`/Users/shenqingchuan/workspace/astryx-vue-wt/D12`）。
- packages/cli 的 catalog 以外内容。
- 不改已有 prop 默认值/行为（#17 的 contentWidth 默认 680 列入回报，#6 的 48→36 若做会明确写出）。
