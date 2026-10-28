# settings-sidebar 走查

对照图：`/tmp/D20-shots/settings-sidebar-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 行右侧 "Edit" 等链接 | 14px，行高 20 | 16px，行高 24（没传 size 落到 body 字号 16） | 已修：这类链接统一 `size="md"`（9 处） |
| 导航行图标、分组、右侧 Card、Toolbar | 一致 | 一致 | 一致（脚本"缺失 svg"是图标用 CSS 遮罩 span 的测量假象，截图人工核对一致） |
| 深色 | 同 | 一致 | 一致 |
| "Professional hosting tools" 带图标的行 | button 161×20 | 链接式按钮在脚本里归类不同 | 不修，理由：在原版页面量过，两边位置一致（52,471），只是元素标签不同导致配对失败 |
