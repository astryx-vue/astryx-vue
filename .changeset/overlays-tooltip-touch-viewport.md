---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

浮层与提示的一批修正：Tooltip 在焦点到达时才判断它算不算触发焦点（漫游 tabindex 成员、可聚焦的包裹层都能用键盘打开，鼠标按下后脚本挪来的焦点不再打开提示），`isOpen` 为 false 时本该打开的焦点只发出 `openChange(true)`，禁用时收起已打开的提示；Popover 的高度跟随动态视口并避开刘海和主屏指示条，屏幕键盘弹出时锚定浮层落在键盘上方；触摸在浮层外按下后拖动不再关掉浮层；Dialog 与 Drawer 的遮罩不再模糊；InfoTip 在粗指针下的点击区域随邻居间距伸缩，补了「指标释义」和「权限说明」两个示例；LayoutContent 也带上 `data-container`，主题可以把对话框、卡片的正文和页眉页脚分开设计；新增 useLightbox 文档页。
