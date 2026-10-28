# login 走查（浅色 + 深色，DOM 量位置/尺寸/字号/颜色）

对照图：`/tmp/D20-shots/login-{light,dark}.png`。测量脚本：`scripts/swarm/playground-measure.mjs login <light|dark> 5171`。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页面外壳 Center | 撑满 806 高 | 外壳无高度，内容贴顶 | 已修：外壳用 `min-height="100%"`（改前把 100% 写进 style，被预览根的 `display: contents` 吃掉） |
| Logo（立方体图标 + Product Inc.） | 水平居中 | 水平居中 | 一致（图标是 CSS 遮罩 span，原版是 svg，测量脚本只认 svg，位置人工核对一致） |
| 标题 / 副标题 / 两个输入框 / 按钮 | 位置、尺寸、字号一致 | 一致 | 一致 |
| 按钮字重 | 500 | 400 | 已修：预览框里把 `button/input/textarea/select` 的字体字重还给组件层（`playground.css`），根因是文档站全局 `font-weight: 400` 压过组件层 |
| 深色按钮字色 | rgb(17,17,17) | rgb(23,23,23) | 不修，理由：core/themes 的主色前景 token，已列入 core 问题清单第 1 条 |
