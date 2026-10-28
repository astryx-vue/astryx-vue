# settings-dialog 走查

对照图：`/tmp/D20-shots/settings-dialog-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 对话框外框 | 876×774，距窗口四周 16px | 908×774 顶满宽（`max-width: 100%`） | 已修：框上加最大宽度 `min(100%, 100dvw - 2rem)`。待 core 修复后去掉（Dialog 标准尺寸的最大宽度，已列入 core 清单） |
| 侧栏标题 "Settings" | x=32 | x=16（头部行没撑满宽度） | 已修（`width="100%"`，随外框修好） |
| 侧栏分组标题到条目 | 间距 0 | 多 2px（SideNavSection 自带 gap 2px） | 已修（模板压成 0）。待 core 修复后去掉 |
| 侧栏分组之间 | 无间距，底部内边距 8 | 多 4px 间距、底部内边距 4 | 已修（压 `.astryx-side-nav__body`）。待 core 修复后去掉 |
| 小号选择器（Pronouns / Presence） | 内边距 3px 12px | 4px 8px | 已修（补内边距）。待 core 修复后去掉 |
| 开关行 | 24 高 | 开关行 inline-flex 撑成 28 高，开关下沉 2px | 已修（`display: flex`）。待 core 修复后去掉 |
| 其余（标题、副标题、分组卡片、输入框、右侧关闭钮） | 一致 | 一致 | 一致 |
| 深色 | 同 | 同上 | 与浅色同一批修复 |
