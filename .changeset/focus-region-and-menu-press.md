---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

焦点陷阱（Dialog、Popover、BottomSheet、MobileNav 和 `useFocusTrap`）按 Tab 更像浏览器：同名单选组只算一站，关着的 `<dialog>` 里的控件不算，嵌套时最里层接 Tab，Ctrl/Meta+Tab 留给浏览器，自己处理 Tab 的控件不被抢焦点，传送进 iframe 也能用；Popover 打开时焦点按文档顺序落在第一个可用控件上，跳过 `aria-disabled` 的；菜单里被指针点亮的行不再画键盘焦点环，shadow root 里的菜单也能按松手位置选行；子菜单关掉后不会被过期的悬停计时重新打开；`useEntryAnimation` 接管服务端 HTML 时不再对不上；复制在不允许异步剪贴板的框架里改用浏览器的复制命令。
