---
'@astryx-vue/core': minor
'@astryx-vue/lab': patch
'@astryx-vue/richtext': patch
'@astryx-vue/cli': patch
---

读屏播报：同一帧里播报的多条消息按顺序连在一起念，一模一样的重复只念一次，空消息连同还没念的一起清掉；`useAnnounce` 新增 `hasReplace` 选项，让每次按键都重说一遍的状态（MultiSelector、CommandPalette 的搜索状态）只念最新一条；Selector、MultiSelector 的结果播报会收回还没念出去的「加载中」，TextInput、TextArea 的加载圈改为装饰、忙碌由输入框自己念一次；原生模态对话框打开时，播报写进那个对话框自己的区域；EmptyState 的根不再是 live 区域，页面加载后才出现或文字之后变了才播报一次。复制：`useClipboard` 新增 `isFailed`、`announceFailure`、`onError`，CodeBlock 新增 `copyFailedLabel` 和 `copyError` 事件，复制失败时按钮变叉并用 assertive 播报，Timestamp、评论链接和富文本代码块同样；`useOverflow` 新增 `gapToken`、`renderedGap`、`inlineBounds`。其余：可滚动的 LayoutContent、LayoutPanel、StackItem 溢出时是有名字的 group，AppShell 的 `fill` 主区域溢出时成为键盘停靠点；锁滚动在触屏上取消没人接的单指拖动并关掉页面回弹；TreeList 收起时焦点回到行；Selector、MultiSelector 键盘移到的高亮选项画焦点环；强制配色下聚焦的菜单行可见；`useImageMode` 在区域数值变化时重新采样；Calendar 今天在接管服务端 HTML 之后才读，服务端和浏览器不同日期也不再对不上；`useMediaQuery` 每条查询只挂一个监听。
