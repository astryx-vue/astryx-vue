---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

菜单对齐上游：方向键、Home/End 和字母跳转能走到禁用的行（行仍不可操作，打开菜单也不会落在它上面）；子菜单里按 Tab 关掉整个菜单；DropdownMenuSubMenu 新增 `delay`、`hideDelay`，忙碌转圈只播报一次加载；数据模式的行带 `items` 就是子菜单，放在分组里也一样；自定义触发器打开的底部弹层以触发器的名称命名；悬停点亮的行不再出现键盘焦点环；指针打开菜单时保留按住期间已点亮的行；手指打开菜单后要走过一小段距离才开始挑行（`presentation` 不写时），MoreMenu 也支持按住滑动再松手选行；ContextMenu 的面板在第一次打开时才挂上、触屏底部弹层按需加载；shadow root 里的浮层按在自己身上不再被当成点外面。
