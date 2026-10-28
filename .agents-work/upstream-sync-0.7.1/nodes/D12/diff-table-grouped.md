# table-grouped 走查

对照图：`/tmp/D12-shots/table-grouped-light.png`、`/tmp/D12-shots/table-grouped-dark.png`（整页），`/tmp/D12-shots/crops/table-grouped-light-{up,ours}.png`（只截预览区）。
原版 1218 行，我们改前 425 行。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 数据 | 30 条（进行中 6、Todo 12 …） | 11 条 | 已修：30 条照抄原版字段 |
| 标题行 | All Issues + Create issue（lg 主按钮） | 相同 | 一致 |
| 搜索框 | PowerSearch（可建 Status/Priority/Title/Assignee/Project 五类条件），右侧「30 issues」 | 普通 TextInput | 已修：改成 PowerSearch，字段和原版一致；删了自制的 query |
| 搜索框尺寸 | 高 32，占位符靠左 | PowerSearch 默认 38 高，占位符被空 token 容器挤到中间 | 已修：模板里用 `:deep` 把控件压到 32、空 token 容器不占位。core 问题待写进回报：`.astryx-power-search-tokens` 在无条件时仍 `flex: 1 1 auto` 占宽，且 `.astryx-power-search-input` 固定 28 高，使控件在 sm 以外的尺寸实高 38 |
| View Options 按钮 | 文案 View Options，次按钮 md | 文案 View options | 已修（大小写）。宽 109 对 110：字体宽度差，不修 |
| 分组方式弹层 | Popover 内 RadioList（None/Status/Priority/Project/Assignee） | 相同 | 一致 |
| 表格结构 | 一张表，分组头是 colSpan 的一行，下面接数据行 | 每组一张独立的表（每张表都带表头，视觉上表头重复三次） | 已修：改成单张 children 模式表 + colgroup，和原版一样没有表头行 |
| 分组头 | 灰底，chevron + 粗体名 + 灰色数量 Badge，padding 12/16 | 手写 button，样式近似 | 已修：改成 TableRow + TableCell colSpan，键盘（回车/空格）可展开 |
| 状态圆点 | in_progress 是 accent（深色），todo 黄，backlog 灰 | in_progress 蓝 | 已修：模板里补 accent 变体。core 问题待写进回报：StatusDot 不支持 `accent` 变体，原版有 |
| 状态圆点居中 | Center 水平居中 | 靠左 | 已修 |
| Issue 列 | 优先级条形图标（实心）+ 编号 + 标题 + 「› 副标题」，单行截断 | 相同 | 一致 |
| Project 列 | 有值正文，无值灰色「—」 | 相同 | 一致 |
| Created / Updated | supporting 灰字 | 相同 | 一致 |
| Assignee | 头像 sm | 相同（被 tooltip trigger 包了一层） | 一致 |
| 行末「…」菜单 | 七项：Edit issue、Assign to…、Add label、Duplicate、Move to project、分隔线、Delete issue，各带图标 | 只有三项，且按钮图标没画出来（core 的 `button.icon` 是插槽不是字符串），行因此高 51 | 已修：用 `#trigger` 插槽放 IconButton，七项带图标；行高 45，与原版相同 |
| 行点击 | 点整行右侧开详情面板 | 只有标题那格能点 | 已修：整行可点 |
| 详情面板 | LayoutPanel，右侧，可拖宽 | 相同 | 一致 |
| Create issue 对话框 | Title、Status、Priority、Project 四个字段，Cancel/Create | 只有 Title | 已修：补三个字段；标题改成 Create Issue |
| 深色模式 | 同浅色 | 同 | 已对照，无新增差异 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-grouped-dark.png` 整页左右对照，未发现新增差异 | 一致 |
