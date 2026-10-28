# table-page 走查

对照图：`/tmp/D12-shots/table-page-light.png`、`/tmp/D12-shots/table-page-dark.png`（左原版，右我们，1440×900）。
没有截滚动位置图：页面主体是表格，第一屏之后只是更多表格行和合计，结构在 DOM 里已核对。

| 区块 | 原版 | 我们 | 结论 |
| --- | --- | --- | --- |
| 外壳：预览栏宽度 | 预览卡片宽 910，内容区 908 | 默认编辑栏 440px，内容区 902，比原版窄 6px | 已修：编辑栏默认 432px（`playground.css`、`usePaneResize.ts`） |
| 外壳：预览卡片边框和底色 | 1px 描边（浅色 rgba(5,54,89,.098)，深色 rgba(242,244,246,.098)），无阴影；深色卡片底 #1f1f22 | 无描边，有 0 1px 2px 阴影，深色底 #1b1b1b | 已修：新增 `--pg-stage-bg`、`--pg-stage-line` |
| 外壳：Export 按钮高度 | 32px | 36px，把工具栏撑高 4px，卡片下移 4px | 已修：固定 height 32px。卡片位置 (514/76) 尺寸 (910×808) 与原版相同 |
| 标题行 | Invoice INV-2043 加 Download PDF，图标在左 | 相同 | 一致 |
| 文档信息 MetadataList | 3 列，两行 6 项 | 原来掉成 2 列三行（因为宽度少 6px，低于三列的 872px 门槛） | 已修：随外壳宽度修正后为 3 列 |
| 范围切换 + 搜索框 | 左 All lines/Hourly，右 300px 搜索框 | 相同 | 一致 |
| 表头 | Description、Category、Qty、Rate、Amount，带排序和筛选图标 | 相同 | 一致 |
| 首尾列内边距 | 原版 useFlushEdges：首列左、末列右内边距为 0，文字与 MetadataList 同一条线 | 缺，首尾列各缩进 8px | 已修：新增 `flushEdgesPlugin`（用 `cellPatch`） |
| 表格行内容、数据 19 行 | 描述、类别、数量、单价、金额 | 相同 | 一致 |
| 表格行高 | 行 37.5（单元格行高 21px） | 实测 37.5 对 37.5，所有行逐个一致 | 一致（D16/D18 已修） |
| 行悬停卡片 | 5 项：Category、Billing、Calculation、Amount、Share of invoice | 3 项，缺 Calculation、Amount；标题没带 accessibilityLevel | 已修：补两项，标题 `accessibilityLevel: 2` |
| 合计区 | 三条分隔线，Subtotal、Tax (8.75%)、Total due | 相同 | 一致 |
| 筛选后提示条 | warning Banner，右侧 Clear all filters | 相同 | 一致 |
| 空状态 | EmptyState 加 Clear filters | 相同 | 一致 |
| 深色模式 | 同上 | 同上，卡片底色已对 | 一致 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-page-dark.png` 整页左右对照，未发现新增差异 | 一致 |
