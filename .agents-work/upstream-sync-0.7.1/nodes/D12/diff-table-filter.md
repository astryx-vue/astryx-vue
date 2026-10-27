# table-filter 走查（进行中）

原版 4630 行，我们是简化版。本文件按区块逐条标状态，没做完的标「进行中」。
对照图：`/tmp/D12-shots/table-filter-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-filter-light-{up,ours}.png`（只截预览区）。深色还没逐区块对照。

| 区块 | 原版 | 我们 | 状态 |
| --- | --- | --- | --- |
| 页头结构 | LayoutHeader（有分隔线）里 Section padding 4，标题行 + 筛选行 | 照原版重搭（原来是 LayoutContent 里手拼的 HStack） | 已修 |
| 标题行 | Service jobs + New job（无图标，默认尺寸，高 32） | 去掉 + 图标和 sm，高 32 | 已修 |
| 搜索框 | 120px，聚焦展开到 240px | 同 | 已修 |
| 筛选子句 | OverflowList：Upcoming、Status、Customer、Technician、Priority、Quote，放不下的收进「+N」 | 同；Status/Customer/Technician 用 MultiSelector，Priority 用 Selector（显示「Priority is High」），Quote 用 ComplexSelector + 双滑块 | 已修 |
| 状态过滤初值 | 除 Completed 外四项，收起显示「Scheduled, +3」，带清除叉 | 同 | 已修 |
| 结果数 + Clear all | 「55 results • Clear all」，Clear all 是 supporting 小字的 Link | 用了 Link，字号偏大，还没对 | 进行中 |
| 右侧工具簇 | View options、Create saved view、Saved views（有实心态） | 三个按钮在，Saved views 没有按下后的实心图标，弹层只是菜单 | 进行中 |
| 筛选 chip 尺寸 | 全部高 28，内边距 8px 12px | Customer/Technician 高 30，Priority 32，Quote 38，内边距 4px 8px | 已修（模板里用 `:deep` 统一成 28 高、12px 横向内边距）。core 问题待写进回报：sm 尺寸下 MultiSelector 实高 30、Selector 32、ComplexSelector 38，原版都是 28 |
| 筛选行折叠位置 | 1440 宽下放得下 Upcoming 和 Status，其余收进「+4」 | 只放得下 Upcoming，收进「+5」，因为 chip 偏宽 | 进行中（随上一条） |
| 表头 | 高 38，Job 列宽 360 | 高 37，Job 列宽 240（列宽配置 proportional(2) 与原版一致，差在可用宽度） | 进行中 |
| 分组行 | 16px 半粗体 + 灰括号数字，行高 41 | 14px，行高 37 | 进行中（core 的分组头样式，待确认） |
| 数据行 | 单元格顶部对齐，行高 57，Job 文字不截断（wrap） | 已改成 wrap + 顶部对齐，行高约 57 | 已修（待复核） |
| 紧急优先级圆点 | 脉冲动画 | 加了 isPulsing | 已修 |
| 首列固定 | 首列粘左 | 加了 sticky 插件 | 已修 |
| 多列排序 | 允许多列排序、可取消排序 | 已开 | 已修 |
| 无限加载 | 每批 15 条，滚到底加载下一批，带骨架行 | 一次全部展示 | 进行中 |
| 行详情面板 | 点行在右侧开详情面板 | 没有 | 进行中 |
| View options 弹层 | 660 宽，Columns / Density / Sticky Columns / Grouping 四节 | 只有菜单项，点了没反应 | 进行中 |
| 保存视图 | 对话框、Saved views 条、编辑 | 没有 | 进行中 |
| 高级搜索 | PowerSearch 查询栏 | 只有按钮 | 进行中 |
| 空状态、批量操作条 | 有 | 没有 | 进行中 |
| 深色模式 | — | — | 进行中 |

## 说明

- 原版是 4630 行的超大模板，上面「进行中」里除了尺寸类，其余是功能块。按用户要求「效果一致」，会按首屏可见程度排序：先收尾尺寸和折叠位置，再做 View options 弹层和行详情面板。
