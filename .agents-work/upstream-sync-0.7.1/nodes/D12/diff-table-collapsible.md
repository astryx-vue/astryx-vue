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
| 曲线逐项核对（浏览器里量过原版 recharts 的 svg） | 撑满容器：svg 宽 = 面板内容宽（808）；y 轴：不画（`YAxis hide`）；x 轴：5 个标签 Jan 1 / Mar 10 / May 17 / Jul 24 / Sep 30；线型：`type=linear` 折线，不是平滑曲线；线宽 1.5；实线；一条 `3 3` 虚线基准；渐变填充 0.2→0；无图例、无副标题 | svg 撑满面板内容宽（860，比原版宽 52，因面板内边距丢失，见下面「展开面板内边距」）；y 轴不画；x 轴同 5 个标签、位置 40/229/436/645/830（原版 64/247/448/651/834，随宽度比例变）；polyline 折线；线宽 1.5；实线；一条 `3 3` 虚线；渐变 0.2→0；无图例、无副标题 | 一致（宽度差来自 core 的面板内边距） |
| 展开后的曲线 | 面积图：渐变 0.2→0、虚线基准（窗口起点）、无 Y 轴、无网格；X 轴 5 个日期标签；涨绿跌红（信用卡反过来） | 无 | 已修：复用 `PlaygroundAreaChart`，新增 `hasYAxis`/`hasGrid`/`referenceValue`/`fillOpacity`/`padInline` 几个可选项（默认值不变，不影响 dashboard-composition） |
| 排序 | 所有列可排序，Change 列按当前时间范围的涨跌幅排 | 只有部分列；Change 不能排；Processor、Investment 表完全不能排 | 已修 |
| Credit cards 列 | Card / Utilization / Balance / **Limit** / Change | 缺 Limit | 已修 |
| 进度条颜色 | neutral 变体，填充灰 | 实测深色下两边都是 rgb(82,82,82) | 一致（D18 #15 已修） |
| 涨跌徽标 | Token sm：宽 54.7、内边距 8px | 实测宽 54.7、内边距 8px，13 个徽标逐个比对一致 | 一致（D18 #8 已修） |
| 数据行高 | 51（td 内边距 1px，里面一层 div 内边距 4px 8px） | 49（td 内边距 4px 8px） | 不修：**core**，已写进 core 问题清单第 5 条。原版 `TableCell` 在 `td` 上叠了 1px 的单元格内边距，行里每格多出 2px；这个 1px 在原版源码里找不到对应的 StyleX 规则（逐个类名摘掉后 td 内边距仍是 1px），只在运行时存在，我们无法在模板里不破坏其它表而复刻 |
| 展开面板内边距 | 16px 20px 16px 48px，面板高 164.5 | 16px 8px 16px 48px，面板高 164.5（实测） | 部分修（D18 #7）：高度、左、上、下已一致；右内边距 8 对 20 仍差，原因同上一行（密度规则 `[data-density='compact'] :is(th, td):last-child` 特异性 0,3,1 压过 `td.astryx-table__panel`），写进 core 问题清单第 6 条 |
| 窄屏紧凑列 | 内容宽度小于 720 时只留名称+金额两列 | 没有 | 未做（功能块）：1440 宽下不触发，需要 ResizeObserver 量内容宽并重组两张列配置。不是「差异小」：是在首屏之外、用户不会遇到的响应式分支，已在第 4 轮记入后续批次 |
| 深色模式 | 同浅色 | 同 | 对照图已出，结构一致，色值差异同上 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-collapsible-dark.png` 整页左右对照，未发现新增差异 | 一致 |
