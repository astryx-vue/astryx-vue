# contact-form 走查

对照图：`/tmp/D20-shots/contact-form-{light,dark}.png`（`-light-b` 是滚到 "How did you hear about us?" 的一张）

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页面总高 | 1195 | 1205 | 已修：见下一条 |
| "Anything else?" 文本区 | 750×68（rows=3，文本区自带 4px 8px 内边距，外框无内边距） | 734×62（外框 8px 内边距 + 80px 最小高度） | 已修：`rows=3` + `control-class` 压外框内边距和最小高度。待 core 修复后去掉 |
| 目标标签 Token 文字 | 14px 高，y=506 | 20 高，y=503 | 不修，理由：在原版页面量过，两边 Token 按钮位置、宽度一致（x、w 全部相等），只差文字行盒 6px，来自 core 的 Token 行高（清单第 13 条同类，Token 的 `vertical-align`） |
| Token 字色 | 浅色 rgb(0,0,0)；深色 rgb(255,255,255) | 浅色 rgb(27,27,27)；深色 rgb(212,212,212) | 不修，理由：core 的 token 前景色定值不同，已列入 core 清单 |
| 单选列表行 | 24 高，文字 17 高 | 24 高，文字 20 高 | 不修，理由：同上，core 的 Radio 文字行盒，位置与间距一致 |
| 三张介绍卡、两行输入、两个选择器、复选框、Submit、条款 | 一致 | 一致 | 一致 |
