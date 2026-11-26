---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

主指针是手指时，Dialog、Drawer、MobileNav 进场动画播完之前不接手指和笔的点按（静止的鼠标照样能点，进场前按下的手指抬起时照常落到下面）；关闭中的 BottomSheet 不再一关就藏起仍有焦点的内容，改为只放行 Tab、焦点离开后才变成不可操作。
