---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

触屏上 Tooltip、HoverCard 要等手指真的轻点才打开，滑动页面不再误开或误关 Popover 和选择列表，轻点禁用控件能看到禁用原因；Dialog 只有按下和松手都在遮罩上才关闭，按遮罩先关掉里面的弹出框时对话框留着；浮层在 iframe 里也能用 Escape 和 Tab。
