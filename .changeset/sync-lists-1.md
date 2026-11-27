---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

列表与树：有序列表的编号共用一列，位数变了别的行的文字不动，编号右对齐、等宽；可点的行在手指下把触控范围朝相邻行的空隙长到 44px，链接行点内边距或热区也会跟着链接走；选中行悬停、按下时在底色上叠色；`bleed` 列表在圆角 Card、Dialog 的首尾取容器圆角；禁用的按钮行、链接行和横滑操作仍能用键盘聚焦但不会触发；横滑行把双指缩放留给浏览器；TreeList 引导线对齐箭头、手指操作下自己带展开收起的滑动、主题可用 `tree-disclosure` 指示图形换掉展开箭头；Outline 的链接都在正常 Tab 顺序里（不再是方向键漫游）、跟随链接后焦点移到目标标题、传入的 `aria-label` 优先、减弱动效时立即到达；MetadataList 的值只在单词比一行还长时才折断；新增 `useOutlineFromDOM` 文档页，补充 OverflowList、MetadataList、Outline 的使用建议。
