---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

焦点陷阱（Dialog、Popover、BottomSheet、MobileNav 和 `useFocusTrap`）按 Tab 更像浏览器：同名单选组只算一站，关着的 `<dialog>` 里的控件不算，嵌套时最里层接 Tab，Ctrl/Meta+Tab 留给浏览器，自己处理 Tab 的控件不被抢焦点，传送进 iframe 也能用；Popover 打开时焦点按文档顺序落在第一个可用控件上，跳过 `aria-disabled` 的；菜单里被指针点亮的行不再画键盘焦点环，shadow root 里的菜单也能按松手位置选行，手指松开选中一行后只取消它自己的 touchend，不会在慢页面上让迟到的 click 点中新出现的行；NavMenu、NavHeadingMenu 和 TabMenu 的选项支持按住滑过再松开选中；子菜单关掉后不会被过期的悬停计时重新打开；`useEntryAnimation` 接管服务端 HTML 时不再对不上；复制在不允许异步剪贴板的框架里改用浏览器的复制命令。Calendar 按住 Shift 用 PageUp/PageDown 按年翻；SegmentedControl 禁用时仍保留选中分段的 Tab 停靠点，禁用原因同时描述每个分段；滚动区只靠盒子几何更新两头位置，祖先拖动 transform 时不再每帧重新测量；OverflowList 按主题实际排出的间距折叠，Toolbar 首部直接放 OverflowList 时会折叠给尾部让位。
