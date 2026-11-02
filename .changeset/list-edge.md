---
'@astryx-vue/core': minor
---

`List` 新增 `edge`，统一决定每行文字、分隔线以及悬停和选中背景相对列表边缘与外围容器的位置。默认 `padded` 保持现有表现；`flush` 去掉行的左右内边距，让静态行的文字、分隔线和背景都落在列表上方标题的竖线上；`outset` 把文字放在这条线上，并让分隔线和背景伸进容器的内边距；`bleed` 让文字落在容器的内边距线上，分隔线和背景铺到容器边缘、四角为直角，像 Card 里的表格行。`outset` 和 `bleed` 读取最近的、共享内边距的容器（Card、Section、BottomSheet、带内边距的 ScrollableArea，或 Layout 区域）；没有这样的容器时和 `padded` 一样。`ListEdge` 类型一并导出。

原来的 `edgeCompensation="inline"` 保留为 `edge="outset"` 的弃用别名，几何位置相同；两个都设置时以 `edge` 为准，并在开发期警告一次。
