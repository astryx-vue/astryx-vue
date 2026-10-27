# theme-showcase 走查

对照图（按滚动分段，原版左、我们右）：`/tmp/D12-shots/scroll/theme-showcase-light.png`。深色没有重截。
第 1 批已修：Inventory 工具栏、Activity 图标与金额。本批新增：聊天后两轮、Filters。页面总高：原版 2640，我们 2668。

| 区块 | 原版 | 我们 | 结论 |
| --- | --- | --- | --- |
| 顶栏、Hero、三张商品卡 | Shop / New In / Stories / Help，三张卡，价格、加购 | 同 | 一致（图上逐段对过） |
| Checkout 卡 | Email、配送方式、支付方式（Card / Apple Pay / Google Pay）、卡号、有效期、国家、保存勾选、Pay now | 同 | 一致；「Payment method」三个选项卡高度略有差（原版 57，我们 52）未量，标未查 |
| Studio AI 聊天区 | 4 轮：用户→助手→用户→助手；第二个助手消息带订单详情卡（Items / Shipping / Estimated arrival / Tracking） | 改前只有前 2 轮 | 已修：补后两轮（含 Card + 4 个 Item、「On time」Badge、「Track →」Link），文字照原版全文 |
| 聊天建议按钮 | Reschedule delivery / Update shipping address / Start a return | 同 | 一致 |
| 聊天输入框 | 「Ask Studio AI…」+ 附件 + 麦克风 + 发送 | 只有一个输入框，没有附件 / 麦克风 / 发送按钮 | 未修 |
| Inventory 筛选行 | 搜索框 + 三个 Selector（Categories / Locations / Tags，带图标）放进 OverflowList，放不下折成「Filters」按钮；右侧列表 / 网格切换 | 已按 OverflowList + 三个 Selector 写；但我们这一栏的宽度让三个 Selector 都放下了，没有折成「Filters」按钮 | 部分：结构已对。原版在这个宽度下三个 Selector 被折进「Filters」，我们没折，原因是 core 的 OverflowList 测量指示器宽度（同 table-filter 里记的 core 问题）。 |
| Inventory 提示条 | 「2 items are running low」黄色提示条 | 同 | 一致 |
| Inventory 表 | 行：勾选 + 缩略图 + 名称 + 库存 + 位置 + 标签 + 菜单 | 同；名称列更窄，名称折成 3 行（「Minimalist / Watch」折成「Minimalis / t Watch」） | 未修：Name 列宽度差，同 table-filter 里记的 core 选择列宽没算进表格最小宽 |
| Revenue / Activity 卡 | 18K / +12% + Activity 列表（图标 + 订单 + 金额） | 同 | 一致（第 1 批已修） |
| 页面总高 | 2640 | 2668 | 差 28px，主要来自上面表行折行；未逐块核对 |
| 深色模式 | — | — | 未做 |
