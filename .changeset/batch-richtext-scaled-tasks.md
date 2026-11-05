---
'@astryx-vue/richtext': patch
---

修复 RichText 任务勾选框在缩略预览中错位的问题。使用 transform 缩放时，先把视口坐标换算回本地 CSS 像素，再计算位置和 RTL 左偏，确保勾选框仍对齐自己的任务项。
