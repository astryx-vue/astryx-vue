---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

对齐上游 origin/main 的几处渲染差异：

- `NumberInput` 标签隐藏时也渲染 Field：保留读屏用的隐藏 `<label>`，`width` 也能落到外层。
- `ChatMessageBubble` 按内容收窄，去掉 280px 的最小宽度，例如「Where's my order?」宽 148px，发出的消息靠右。
- `Selector` 新增 `startIcon`，画在触发器最前面，设了它就不再画选中项自己的图标；触发器外壳的间距改为 8px；选项 `icon` 可以直接传 VNode，按它自己的尺寸画，不再套 16px 的盒子。
- `Text` 支持 `type="inherit"`：字号、行高、字重和颜色都跟随父元素。
- `Collapsible` 的文字触发行裁掉行高留白，箭头盒子改为 17px（`--text-large-size`），高度和上游一致；自定义的高内容照常撑高触发行。
- `Table` 只有作为容器的直接首个或末个子元素时，才在上下方向贴到容器边缘，同上游 #12068。
- `TreeList` 的条目支持 `startContent`。
- `TextArea` 计数器改成「164/2,000」的格式。
- `Token` 默认颜色的文字改用 `--color-text-primary`。
- `Text` 的每种 `type` 都写明默认字重（同上游 defaultWeightByTypeStyles），不再继承父元素的字重。之前放在粗体容器里的 supporting 文字会跟着变粗、宽出约 2.8%。
- display 型 `Heading` 的字重跟随自己的层级（h1 是 600），字号和行高仍取 display 档，和上游实际渲染一致。
- `Link` 新增 `type`（默认 `body`），决定字号、行高和字重，用法同 Text；嵌在文字里的链接用 `type="inherit"`。
