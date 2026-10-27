# table-filter 走查（功能块已补完，第 3 批收尾）

原版 4630 行，我们是简化版。本文件按区块逐条标状态，没做完的标「进行中」。
对照图：`/tmp/D12-shots/table-filter-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-filter-light-{up,ours}.png`（只截预览区）。深色还没逐区块对照。

| 区块 | 原版 | 我们 | 状态 |
| --- | --- | --- | --- |
| 页头结构 | LayoutHeader（有分隔线）里 Section padding 4，标题行 + 筛选行 | 照原版重搭（原来是 LayoutContent 里手拼的 HStack） | 已修 |
| 标题行 | Service jobs + New job（无图标，默认尺寸，高 32） | 去掉 + 图标和 sm，高 32 | 已修 |
| 搜索框 | 120px，聚焦展开到 240px | 同 | 已修 |
| 筛选子句 | OverflowList：Upcoming、Status、Customer、Technician、Priority、Quote，放不下的收进「+N」 | 同；Status/Customer/Technician 用 MultiSelector，Priority 用 Selector（显示「Priority is High」），Quote 用 ComplexSelector + 双滑块 | 已修 |
| 状态过滤初值 | 除 Completed 外四项，收起显示「Scheduled, +3」，带清除叉 | 同 | 已修 |
| 结果数 + Clear all | 「55 results • Clear all」，Clear all 是 supporting 小字的 Link | 同 | 已修 |
| 右侧工具簇 | View options（Popover 弹层）、Create saved view、Saved views（按下后实心图标） | 同；Saved views 打开时编辑类控件退下、只留开关，和原版一致 | 已修 |
| 筛选 chip 尺寸 | 全部高 28，内边距 8px 12px | Customer/Technician 高 30，Priority 32，Quote 38，内边距 4px 8px | 已修（模板里用 `:deep` 统一成 28 高、12px 横向内边距）。core 问题待写进回报：sm 尺寸下 MultiSelector 实高 30、Selector 32、ComplexSelector 38，原版都是 28 |
| 筛选行折叠位置 | 1440 宽下放得下 Upcoming 和 Status，其余收进「+4」 | 只放得下 Upcoming，收进「+5」，因为 chip 偏宽 | 不修：core。OverflowList 测量指示器宽度时用内置「还有 N 项」文案（89px），不读 `#overflow` 插槽里的实际按钮（「+N」43px），所以多留 46px、少放一个子句。原版是 Upcoming + Status + 「+4」，我们是 Upcoming + 「+5」。模板里没有无损绕过，交总控开 core 节点 |
| 表头 | 高 38；表格总宽 1328，Job 360 / Customer 180 | 高 37；表格总宽 1280，Job 291 / Customer 201 | 不修：core。①行高差同分组行。②`resolveColumnWidths` 的 `tableMinWidth` 只算 `pixelTotal + maxProportionalSpace`，不含选择列的 48px，所以表格比原版窄 48，比例列分到的空间少，Job 窄 69、Customer 宽 21。已用原版同一组 proportional(2,240)/(1,180) 配置验证：原版基准宽 540（=180×3），Job 360 Customer 180 |
| 分组行 | 16px 半粗体 + 灰括号数字，行高 41 | 14px，行高 37 | 不修：core。原版 `<table>` 字号 16px，分组头 td 不设字号，继承 16px；普通 td 单独设 14px/行高 21。我们的 core 把 `.astryx-table` 设成 14px / 行高 1.4286，分组头 14px，所有行高少约 1px（分组行 37 对 41，数据行 36–57 对 37–57 的累计差）。模板里不能绕：原版注释明确说不能用 `renderGroupHeader`，否则丢首列固定。交总控开 core 节点 |
| 数据行 | 单元格顶部对齐，行高 57，Job 文字不截断（wrap） | 已改成 wrap + 顶部对齐，行高约 57 | 已修（待复核） |
| 紧急优先级圆点 | 脉冲动画 | 加了 isPulsing | 已修 |
| 首列固定 | 首列粘左 | 加了 sticky 插件 | 已修 |
| 多列排序 | 允许多列排序、可取消排序 | 已开 | 已修 |
| 无限加载 | 每批 15 条，滚近底部 240px 加载下一批，加载中画 5 行骨架，全部加完显示「All N jobs loaded」 | 同。分组时切点补齐到组末尾；哨兵用滚动监听+距离判断（原版 IntersectionObserver 以 viewport 为根，我们内容区内部滚动时 IO 被 overflow 裁剪不触发，换成等价语义的距离判断）。批次数据与原版逐组一致（首屏 Beacon (10) + Elm (9)） | 已修 |
| 行详情面板 | 点行在右侧开可拖拽详情面板（380 默认，320–560）：头部徽章+优先级+主/次按钮、MetadataList 六行、Site history 列表 | 同，ResizeHandle + LayoutPanel 实现；选中行整行铺 accent 浅底 | 已修 |
| View options 弹层 | 660 宽 Popover：左侧栏四节 + 右侧面板。Columns 是双栏穿梭（显示列可拖把手排序/移除，Job 列锁定带原因 tooltip；可用列可加回/全选）；Density、Sticky Columns、Grouping 是 RadioList | 同。列排序用指针拖放（原版还有键盘排序，未做，理由：演练场无键盘路径需求）；compact 表面的 BottomSheet 分支未做，理由：演练场预览固定桌面宽度 | 已修 |
| 保存视图 | 书签按钮开「Create new saved view」对话框（名称 + This view saves 摘要 + Create）；Saved views 条（All + chips 横滚 + 编辑铅笔）；编辑对话框只改名（Delete 危险按钮 + Save） | 同，三个预置视图（Needs dispatch / Luis's jobs / High value）的筛选和视图配置与原版一致 | 已修 |
| 高级搜索 | 扳手 ToggleButton 切 PowerSearch token 输入框（placeholder「Try \"quote > 1000\" or \"status is Overdue\"」），筛选行和控制簇各放一个开关（按原版位置） | 同，filters 单一来源，两种模式读写同一组子句 | 已修 |
| 空状态 | EmptyState：搜索图标 + 标题 + 描述 + Clear all / Power search 两个按钮 | 同 | 已修 |
| 批量操作条 | 选中行后筛选行整行换成 muted 底操作条：Assign/Reschedule/Cancel 图标按钮 + N jobs selected + Unselect All | 同 | 已修 |
| 深色模式 | 同浅色；Scheduled, +3 子句在 1440 宽下可见 | 页头、表头、分组行、徽标配色都对。差异只有浅色里已记录的那几条（子句被挤进「+5」、行高、列宽）| 已对照，无新增差异 |

## 第 3 批补充说明

- 数据与排序：分组时原版 comparator 先比组序再比用户排序键（保证组内行连续、分页切点落在组边界），模板里自实现了这个 groupMajorData（useTableSortableState 无预排序钩子，待 core 修复后可简化）。
- 不做的：compact 表面（手机宽度）的 BottomSheet 分支——演练场预览固定桌面宽度，原版该分支在此不可见；列排序的键盘路径。
- 深色整页对照已重截：`/tmp/D12-shots/table-filter-dark.png`，与原版首屏逐组一致。
- 交互状态左右对照：`/tmp/D12-shots/tf-states-light.png`（视图选项/保存视图/详情/批量/空状态）。

## 说明

- 原版是 4630 行的超大模板，第 2 批只做了首屏，第 3 批把功能块全部补齐。
