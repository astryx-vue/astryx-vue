# login-sso 走查

对照图：`/tmp/D20-shots/login-sso-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 背景图 + 外壳高度 | 撑满 | 背景只铺到内容高度 | 已修（`min-height="100%"`） |
| 卡片标题块、SSO 按钮、分隔线、帮助链接对齐 | 居中 | 靠左（`justify`） | 已修（`hAlign`） |
| 按钮字重 | 500 | 400 | 已修 |
| "Having trouble signing in?" 行高 | 20 | 18 | 已修（Link 补行高） |
| 深色 | 同 | 按钮字色 17 对 23 | 不修（core token，清单第 1 条） |

测量结果（浅色）：15 个元素逐个对上，无差异。
