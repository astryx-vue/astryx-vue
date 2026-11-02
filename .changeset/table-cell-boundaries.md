---
'@astryx-vue/core': patch
'@astryx-vue/richtext': patch
---

修正 Markdown 与富文本的表格边框：每个单元格四条边都画线，不再只有行与行之间的分隔线；表格外沿由表格自身的边框闭合，和格线折叠成一条 1px 的线，不会在边缘叠成双线。两个界面用同一套 `--astryx-color-border` 行线和列线，最后一行、最后一列不重复画线，所以同一张表在 Markdown 阅读状态和富文本里的格子边界一致。
