---
'@astryx-vue/charts': patch
---

修复 ChartBrush 手机斜向拖动被原生滚动打断的问题，并在 pointercancel 时丢弃未完成选区而不是误提交；ChartZoom 使用相同的根 SVG 触摸约束。
