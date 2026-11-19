---
'@astryx-vue/core': patch
---

对齐上游渲染：CodeBlock 标题改用独立的 `--astryx-code-block-title-foreground`（默认 #525252）；Avatar 的首字母改由 `::before` 生成内容绘制（文字放在 `data-initials` 上，不再是文本节点）；`isLabelHidden` 的隐藏标签组改为 `display: contents`，标签与描述各自按 sr-only（inset 0、clip rect）定位；行内 Dialog 不再是定位祖先，Selector 根节点去掉多余的 `position: relative`，SideNav 顶部区域改为 sticky，Switch 隐藏标签不再撑最小高度。
