---
'@astryx-vue/core': patch
---

对齐上游的导航与文本域布局：TopNav / SideNav 标题带 `NavIcon` 时去掉起始内边距，标志贴齐左边；SideNav 滚动区不再有子项间距、没有顶部或底部区域时补成 8px，底部区域改为 sticky，隐藏的分区标题随底部区域定位；可折叠 SideNavItem 的无障碍标签改用 `hidden`，不再产生可见文字节点；SideNavSection 隐藏标题时不再继承 flex 居中；TextArea 的 `rows` 默认 3，高度由行数决定，去掉最小高度并把上下内边距收成 4px（`lg` 为 8px）。
