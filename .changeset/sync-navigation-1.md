---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

对齐上游导航组件：侧边导航收起、展开时旧轨道留一份副本、从行内结束边裁剪并淡入淡出，AppShell 里内容区跟着一起滑动，按主题的移动曲线播放，「减少动态效果」时按指针类型淡入淡出或直接切换；收起时焦点还在轨道丢掉的行上，会交给收起按钮或最近的保留行；下级行和顶层行等宽、内容缩进，下级组只在收起动画期间裁剪；禁用的侧栏项保留 Tab 停靠点（`aria-disabled`）且不运行你的处理函数；空插槽不再画包裹元素；整个标题是链接时末端内容放在链接旁边；`SideNav` 的 `resizable` 可直接传 `useResizable()` 的返回值，`NavItem` 新增 `isFocusableWhenDisabled`；MobileNav 抽屉最宽 85vw、头部随内容长高、内容区是导航地标、`side="auto"` 按文字方向和打开者位置选边、文件选择器的取消不再关掉抽屉。
