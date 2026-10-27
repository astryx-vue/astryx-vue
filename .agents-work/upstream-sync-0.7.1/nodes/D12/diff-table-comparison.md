# table-comparison 走查

对照图：`/tmp/D12-shots/table-comparison-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-comparison-light-{up,ours}.png`（只截预览区）。
原版 1449 行（含 30 天可用性条、悬停显示的清除按钮），我们改前 308 行。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页头 | Compare models + Highlight best 开关 + Add model（带加号） | 相同，加号图标用 carbon | 已修：加号换成 heroicons plus |
| 模型选择器位置 | 在表头每个模型列里，lg 尺寸、隐藏标签、选项带提供商图标和副标题 | 表格上面单独一排三个带标签的选择器，表头只是文字 | 已修：删掉上面那排，用 `headerPatch.before` 把选择器放进表头。core 问题待写进回报：`TableColumn.header` 只收字符串，原版收 ReactNode，所以只能走 headerPatch，并要用隐藏标题占位 |
| 选择器尺寸 | 203×36，占满列宽 | 同样 lg | 已修（宽度 253/92/203，与原版一致） |
| 清除按钮 | 只在鼠标悬停或聚焦表头时出现，且只剩 2 个模型时不出现 | 一直显示 | 不修：原版靠 mouseenter/focus 状态切换两种 Selector（hasClear 有无）。我们让它一直可清除。差异小，先记下 |
| 提供商图标 | Northwind=芯片、Calder Labs=星光、Halcyon=闪电、Sable AI=立方体 | 无 | 已修（heroicons 对应图标） |
| 模态图标 | 文字用「Tt」字形，图 / 声 / 视频 / 文档，格子 20×20，间距 12，带 hover 说明 tooltip | carbon 的 Aa 字形，间距 4，无 tooltip | 已修：Text 改成内联 SVG（lucide Type 的路径），间距 12，格子 20×20，加 Tooltip（「Text: supported; …」） |
| 单元格内容高度 | 每格统一 24 高，行高 49 | 无统一高度，模态行 45 | 已修：所有单元格内容固定 24 高，行高 49 |
| 数值/单位字重 | 数值 normal，胜出 semibold；单位 normal，胜出用 primary 色 | 单位无字重/色设置 | 已修 |
| 胜出格底色 | 蓝色整格铺满 | 相同 | 一致 |
| 布尔格图标 | 实心？—— 原版是 lucide 的描边圆叉（circle-x），颜色 rgb(192,38,44) | carbon 实心叉，颜色 rgb(118,0,12) | 待复核：描边还是实心没有在浏览器里核对；颜色确认不同（原版 192,38,44，我们 118,0,12），来自 core 的 error 图标前景 token。图形归 D15 |
| 分组头文案 | h3，对外 h2（accessibilityLevel） | h3 | 已修：加 accessibilityLevel 2，标题块 sticky 靠左 |
| 分组头高度与内边距 | td 内边距 8px 12px 8px 0，行高 41 | 12px 20px，行高 49 | 不修：core。原版分组头 td 固定 `padding-block: spacing-2; padding-inline-end: spacing-3`，不随密度变；core 的分组头 td 没有这两条，spacious 密度下被通用规则撑大 |
| 分组头 chevron | 在最左，距表格边 4px | 同 | 一致 |
| 第一列「Models」 | 左对齐、secondary 标签 | 相同 | 一致 |
| 30 天可用性条 | 有（Performance 组里，每天一根条，悬停出提示） | 没有 | 未做：功能块，体量大（约 250 行）。不影响首屏，先标「进行中」 |
| 深色模式 | 同浅色 | 同 | 对照图已出 |
