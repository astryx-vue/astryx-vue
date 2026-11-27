---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

List 新增 `animatedLayout`，ListItem 新增 `itemKey`：把 `useAnimatedLayout` 的句柄传给列表、给每行一个数据里的键，行的插入、移除和移动就有动效。新行入场，移除的行在原位收起，和反向移动的行交叉的那一行从上方滑过，后面的行和内容滑到新位置；包里的 List 和项目里自己拷的 ListItem 混用时也能一起工作。触屏上按压列表行和 TreeList 行，松手时按压底色改在独立的一层上只淡出透明度，交给合成器去画，主线程忙时也不卡。
