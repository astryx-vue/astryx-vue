---
'@astryx-vue/core': minor
'@astryx-vue/cli': minor
---

布局类组件一批对齐：AppShell 新增 `mobileNav.defaultIsMobile`（服务端直接渲染手机布局），读到窗口前侧栏和抬起背板的圆角在手机宽度先收起，宽度断点跟主题的宽度点走，第二个 AppShell 拿自己的主区域 id，AppShell 作为布局根不再吃外层 Layout、Card、Section 传下来的内边距、容器和分隔线默认值，页头和内容末尾避开设备安全区；Collapsible 收起时内容里的焦点移回触发按钮；LayoutPanel 和 ResizeHandle 的 `resizable` 可直接传 `useResizable()` 的返回值，区域收起时面板内焦点移到分隔条且面板 inert，宽度为 0 的面板不占位也不露出子元素；ResizeHandle 的抓取区始终居中在分隔条上，握把自己接管拖动，悬停才显示的握把能从抓取区够到，分隔条只处理方向键、Home、End、Enter，带 Alt、Ctrl、Meta 的组合放行；拖动中卸载时补写已拖到的尺寸；Layout 没设 `contentWidth` 时不再限制页头页脚宽度，页头页脚无分隔线时只收拢自己 Layout 的内容内边距，内容和侧面板发布的容器内边距与实际边距一致；Grid 的 `align`、`justify` 不设置时交给浏览器默认值；带中间区的 Toolbar 在大字号下换行而不重叠；ScrollableArea 触屏保留平台滚动指示条；AspectRatio 的 `fit` 子元素尺寸挪到 base 层，Tailwind 等后面的层能覆盖；SelectableCard 文档改为只推荐多选；CLI 搜索不再把「splitview」当作 useResizable 的别名。
