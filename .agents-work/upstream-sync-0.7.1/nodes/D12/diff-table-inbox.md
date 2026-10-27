# table-inbox 走查

对照图：`/tmp/D12-shots/table-inbox-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-inbox-light-{up,ours}.png`（只截预览区）。
原版 2693 行（含写信 / 回复 Tokenizer、悬停显示的四个行操作、窄屏单栏、批量选择），我们改前 721 行。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| **整体布局（用户可见的大问题）** | 列表 302 宽 + 分隔线 + 阅读栏 605 宽 | 左边会话列表整块看不见，只漏出一排圆点；阅读栏宽 963，超出整个预览区 908 | 已修：阅读栏宽度写死成 963px（按 1440 屏算的）。改成 `containerRef` + `'66.67%'`，相对内容区算：列表 302 / 阅读栏 605，与原版同。原版另外用「整宽 − 300」做上限，我们没做（见下） |
| 页头 | Inbox + 「3 unread of 9 conversations」+ Refresh / Compose | 相同 | 一致 |
| Tab 条 | Inbox 3 / Escalations 1 / Waiting / Resolved 1，下方分割线 | 相同 | 一致 |
| 列表表头 | Conversation / Received，高 38 | 高 37 | 不修：core 的行高差，同 table-filter |
| 列表行 | 行高 58–59；未读加粗 + 左侧圆点；有附件带回形针 | 相同 | 一致 |
| 状态圆点列宽 | 36 | 28 | 不修：core。原版 `useTableRowStatus` 的状态列 36 宽，我们的 28 宽；整列相差 8px，使 Conversation 列和 Received 列各差几像素。属 core 的 rowStatus 插件 |
| 选中行高亮 | 打开的那行整行底色 `--color-accent-muted`，带 `aria-current` | 没有 | 已修：行插件加 `aria-current` 和单元格背景。浅色 rgb(241,241,241)、深色 rgb(38,38,38)，与原版实测一致 |
| 整行可点 | 点行任意处打开，Enter / Space 可开，点到按钮 / 勾选框 / 链接不开 | 只有「发件人 + 主题」那一格能点 | 已修：改成行级 `onClick`，带 `tabindex=0`。键盘 Enter / Space 没做（`rowPatch` 的 `listeners` 不收 keydown，是 core 限制），不修 |
| 阅读栏标题栏 | 标题 h2 20px + 右侧四个图标按钮，工具栏高 32，上内边距 16 | 工具栏高 48（多出上下各 8 的 padding） | 不修：core。原版 `Toolbar` 不加块内边距，我们的 `.astryx-toolbar` 固定 `padding-block: spacing-2` |
| 标签（Urgent / Billing / Escalated） | 三个 token，左边距 8，token 间隔 12 | token 间隔 8，横向内边距 4 | 不修：core。`.astryx-token.size-sm` 横向内边距 4px，原版 8px；同 table-collapsible 里涨跌徽标的问题 |
| 消息组间距 | 每条消息头 66 高，相邻消息距 74（8px 间隙）；外面包一层 `VStack gap=2` | 间隙 16px（继承外层 `gap=4`） | 已修：补上 `VStack :gap="2"`。回复栏位置、正文、附件图都已对到同一像素（Lucas 309 / 正文 441 / Reply 743） |
| 附件缩略图 | 64×64 | 相同 | 一致 |
| Reply / Reply all | 主按钮 + 次按钮，带图标 | 相同 | 一致 |
| 悬停显示的行操作（4 个） | 悬停某行时在时间位置出现四个操作按钮（归档、标已读等） | 没有 | 未做：功能块，约 300 行。先标「进行中」 |
| 窄屏单栏 | 内容宽 < 560 时阅读栏占满，列表收起 | 没有 | 不修：1440 下不触发 |
| 阅读栏宽度上限 | `surfaceWidth − 300`，随屏幕 | 没做，只用 `maxSize: '100%'` | 不修：core 的 `parseSize` 不支持「百分比 − 像素」，原版靠量宽后传像素；不影响首屏 |
| 写信 / 回复窗口 | Compose 与 Reply 打开带 Tokenizer 的写信面板 | 按钮点了没反应 | 未做：功能块，体量大 |
| 深色模式 | 同浅色 | 同；选中行 rgb(38,38,38) 与原版一致 | 对照图已出，无新增差异 |
