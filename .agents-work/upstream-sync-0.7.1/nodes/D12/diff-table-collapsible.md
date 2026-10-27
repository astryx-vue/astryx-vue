# table-collapsible 走查

对照图：`/tmp/D12-shots/table-collapsible-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-collapsible-light-{up,ours}.png`（折叠态，只截预览区），`/tmp/D12-shots/crops/table-collapsible-expand-{up,ours}.png`（点了 Expand all 之后）。
原版 1474 行（recharts 图表 + 响应式紧凑列），我们改前 434 行。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页头按钮 | 状态文案：全展开时「Collapse all」，否则「Expand all」；会同时展开所有行 | 固定「Expand / collapse all」，只管四个分组 | 已修：文案随状态切换，同时展开所有行 |
| 页头 / 时间范围 | 标题 + 净头寸 + 1W/1M/3M/YTD/1Y | 相同 | 一致 |
| 分组头图标 | 24×24 灰底圆角方块里放 16px 图标 | 裸图标 | 已修：加 `.category-tile` |
| 分组头文字与摘要 | 标题 + 数量徽标，右侧「Available $…」 | 相同 | 一致 |
| 每行展开箭头 | 每行左侧有箭头，点开显示该行历史曲线 | 没有；曲线放在页面底部一张卡片里，只显示 bank-1 | 已修：接 `useTableRowExpansion`，删掉底部卡片 |
| 展开后的曲线 | 面积图：渐变 0.2→0、虚线基准（窗口起点）、无 Y 轴、无网格；X 轴 5 个日期标签；涨绿跌红（信用卡反过来） | 无 | 已修：复用 `PlaygroundAreaChart`，新增 `hasYAxis`/`hasGrid`/`referenceValue`/`fillOpacity`/`padInline` 几个可选项（默认值不变，不影响 dashboard-composition） |
| 排序 | 所有列可排序，Change 列按当前时间范围的涨跌幅排 | 只有部分列；Change 不能排；Processor、Investment 表完全不能排 | 已修 |
| Credit cards 列 | Card / Utilization / Balance / **Limit** / Change | 缺 Limit | 已修 |
| 进度条颜色 | neutral 变体，填充灰（rgb 145,145,145） | 填充近黑（27,27,27） | 不修：core。ProgressBar 的 `neutral` 变体颜色和原版不同 |
| 涨跌徽标 | Token sm：宽 55、内边距 8px | 宽 47、内边距 4px | 不修：core。`.astryx-token.size-sm` 的横向内边距是 4px，原版是 8px |
| 数据行高 | 51（compact 单元格内有 1px 边框包裹层） | 49 | 不修：core。原版 compact 单元格外层多一层 DIV，内边距 4/8 加 1px 边 |
| 展开面板内边距 | 16px 20px 16px 48px，面板高 165 | 4px 8px，面板高 141 | 不修：core。`.astryx-table__panel` 的 16/20/48 被更具体的 `.astryx-table[data-density] :is(th, td)` 压掉了（特异性问题，选择器写错） |
| 窄屏紧凑列 | 内容宽度小于 720 时只留名称+金额两列 | 没有 | 不修：1440 宽下不触发，且需要 ResizeObserver 量内容宽；先不做 |
| 深色模式 | 同浅色 | 同 | 对照图已出，结构一致，色值差异同上 |
