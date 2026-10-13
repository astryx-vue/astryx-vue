---
"@astryx-vue/core": patch
---

导航菜单的链接被路由提前拦住时，选中后仍然关闭。只有该项自己的点击处理调用了 preventDefault，菜单才会留下。
