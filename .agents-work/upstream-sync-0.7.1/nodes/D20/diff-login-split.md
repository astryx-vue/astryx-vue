# login-split 走查

对照图：`/tmp/D20-shots/login-split-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 外壳高度 | 撑满 | 贴顶 | 已修 |
| 表单列起点 x | 57 | 81（内层 `Center` 带了 24px 默认内边距） | 已修：`:padding="0"`。原版 Center 的内边距默认 0，core 的 Center 在整页 Center 里被继承，待 core 查（已列入清单） |
| 底部 Sign up 行 | 在列底部 | 同 | 一致 |
| Apple / Google 按钮图标 | 16×16 png | 20×20 | 已修（显式宽高） |
| 条款行、`Sign up` 链接 | 12px | 16px | 已修（`Link size="sm"`） |
| 封面图 | 贴右、圆角、高 508 | 加载前高度 381（量早了） | 一致（等图加载后量：508 对 508） |
| 深色 | 同浅色 | 仅按钮字色 17 对 23 | 同 login，不修（core token） |
