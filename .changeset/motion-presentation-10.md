---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

MoreMenu 的锚定菜单改用和 DropdownMenu 一样的 CSS 进场：从触发器那一侧滑进来，以菜单和触发器相接的那一点为原点放大，减少动态效果时手指下只淡入。在手机和平板上，顶层菜单还在进场时落下的点按和拖动会被忽略，和 iOS 一样：菜单照常打开、保持打开、焦点不动，下面的东西也不会有反应；飞出的子菜单不挡。键盘、辅助技术和鼠标不受影响。上游 MoreMenu 包着 DropdownMenu，本来就是这样，这里对齐。
