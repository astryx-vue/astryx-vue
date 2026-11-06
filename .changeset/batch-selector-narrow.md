---
'@astryx-vue/core': patch
---

修复 Selector 选项在窄列表中不能收缩的问题。选项允许 `min-width: 0`，长标签可以按现有省略样式收缩，不再把弹出层撑出窄容器。
