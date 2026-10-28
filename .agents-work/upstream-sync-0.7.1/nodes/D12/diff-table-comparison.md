# table-comparison 走查

对照图：`/tmp/D12-shots/table-comparison-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-comparison-light-{up,ours}.png`（只截预览区）。
原版 1449 行（含 30 天可用性条、悬停显示的清除按钮），我们改前 308 行。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页头 | Compare models + Highlight best 开关 + Add model（带加号） | 相同，加号图标用 carbon | 已修：加号换成 heroicons plus |
| 模型选择器位置 | 在表头每个模型列里，lg 尺寸、隐藏标签、选项带提供商图标和副标题 | 表格上面单独一排三个带标签的选择器，表头只是文字 | 已修：删掉上面那排，用 `headerPatch.before` 把选择器放进表头。core 问题待写进回报：`TableColumn.header` 只收字符串，原版收 ReactNode，所以只能走 headerPatch，并要用隐藏标题占位 |
| 选择器尺寸 | 203×36，占满列宽 | 同样 lg | 已修（宽度 253/92/203，与原版一致） |
| 清除按钮 | 只在鼠标悬停或聚焦表头时出现，且只剩 2 个模型时不出现 | 悬停或聚焦才出现，只剩 2 个模型时不出现（实测：静止时按钮只有 Model N，悬停出现 Clear Model 1，移开消失，聚焦第二列出现 Clear Model 2） | 已修：靠 `activeHeader` 状态切换 `hasClear` |
| 提供商图标 | Northwind=芯片、Calder Labs=星光、Halcyon=闪电、Sable AI=立方体 | 无 | 已修（heroicons 对应图标） |
| 模态图标 | 文字用「Tt」字形，图 / 声 / 视频 / 文档，格子 20×20，间距 12，带 hover 说明 tooltip | carbon 的 Aa 字形，间距 4，无 tooltip | 已修：Text 改成内联 SVG（lucide Type 的路径），间距 12，格子 20×20，加 Tooltip（「Text: supported; …」） |
| 单元格内容高度 | 每格统一 24 高，行高 49 | 无统一高度，模态行 45 | 已修：所有单元格内容固定 24 高，行高 49 |
| 数值/单位字重 | 数值 normal，胜出 semibold；单位 normal，胜出用 primary 色 | 单位无字重/色设置 | 已修 |
| 胜出格底色 | 蓝色整格铺满 | 相同 | 一致 |
| 布尔格图标 | lucide 描边圆形：circle-x / circle-check，stroke 2，error 色 rgb(192,38,44) | carbon 实心叉，色 rgb(118,0,12) | 已修图形：浏览器里核对过原版是 `<circle r=10>` + 两条线的描边图标，模板里用同样的 SVG 复刻，带 aria-label。颜色差（192,38,44 对 118,0,12）仍在，来自 core 的 error 图标前景 token，不在模板层 |
| 分组头文案 | h3，对外 h2（accessibilityLevel） | h3 | 已修：加 accessibilityLevel 2，标题块 sticky 靠左 |
| 分组头高度与内边距 | td 内边距 8px 12px 8px 0，行高 41 | 实测原版 41 / 内边距 8,12,8,0；我们去掉覆盖后 49 / 12,20（`.astryx-table[data-density='spacious'] :is(th, td)` 特异性 0,3,1 盖过 D18 的 `td.astryx-table__group`）。模板里 `.table-frame :deep(.astryx-table td.astryx-table__group:first-child)` 压回 | 已修：模板层覆盖。**core 问题**：分组头应不随密度变，已写入回报的 core 清单 |
| 分组头 chevron | 在最左，距表格边 4px | 同 | 一致 |
| 第一列「Models」 | 左对齐、secondary 标签 | 相同 | 一致 |
| 30 天可用性条 | 有（Performance 组里，每天一根条，悬停出提示） | 没有 | 未做：功能块，体量大（约 250 行）。不影响首屏，先标「进行中」 |
| 深色模式 | 同浅色 | 同 | 对照图已出 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-comparison-dark.png` 整页左右对照，未发现新增差异 | 一致 |

## 第 4 轮返工（总控深色验收）

深色模式下原版与我们逐项实测（`tr` 行高、`top`、内边距、图标颜色、悬停按钮）：

| 项 | 原版 | 我们（改后） | 结论 |
| --- | --- | --- | --- |
| Provider 行 top | 182 | 182 | 已修（分组头 41px，Overview 141、Pricing 525 都一致） |
| 分组头 | h41，内边距 8,12,8,0 | h41，内边距 8,12,8,0 | 已修（见上） |
| Time to first token | `0.3 sec` / `0.2 sec` / `0.3 sec` | 相同 | 已修。原版数据 `latency: 0.28`，格式 `decimal = Intl.NumberFormat(maximumFractionDigits: 1)`，所以显示 0.3；我们数据与格式本来就一样，之前的 `0.28` 是旧版本残留 |
| 价格 / tok/s / K tokens | `$0.10 /1M` `186 tok/s` `65.54K tokens` … | 逐行一致 | 一致（整张表文本逐行比对） |
| 模态图标亮暗 | 支持的 rgb(255,255,255)，不支持的 rgb(82,82,82) | 相同（五个槽位逐个比对颜色一致） | 已修。我们的图标以前被 Icon 的 `fill: currentColor` 填成实心，改用 lucide 描边路径 + `fill: none` |
| 模型选择器清除按钮 | 悬停 / 聚焦才出现，只剩 2 个模型不出现 | 同 | 已修 |
| 30 天可用性条 | 有 | 有 | 一致 |
