---
'@astryx-vue/core': patch
---

DropdownMenu 的 BottomSheet 改为按需加载，普通 popover 不再静态携带这部分实现。SSR 和水合首帧跳过尚未加载的面板；键盘打开早于下载完成时，面板到达后仍会聚焦第一行。
