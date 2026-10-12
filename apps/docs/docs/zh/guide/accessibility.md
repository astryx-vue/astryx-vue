---
title: 无障碍
---

# 无障碍

组件按可访问名称、键盘和读屏来做。文档和示例不靠拿掉焦点环或降低对比度来换外观。

键盘焦点使用 `--astryx-focus-outline-*`。宽度 2px，样式 `solid`，颜色是 `--astryx-color-accent`，偏移 3px。不要在应用样式里把 `outline` 全局清掉。文档站只在组件自己画出焦点的控件上取消额外的轮廓，例如已经有圆角焦点样式的输入框。

只有图标的按钮必须有名字。`IconButton` 的 `label` 会成为可访问名称。`NavItem` 的 `label` 同样必填。装饰性图形用 `aria-hidden`，不要把图标 class 当成文字。

需要把内容留在可访问树里、但视觉上藏起来时，用 `@astryx-vue/core/VisuallyHidden` 的 `VisuallyHidden`。

读屏播报用 `useAnnounce`。复制成功如果只改按钮文字，读屏经常不念，所以 `useClipboard` 可以传 `announce`，在写入成功时播报一句。浮层关闭走 `useDismiss` 的 Escape 栈。对话框一类浮层用 `useFocusTrap` 把 Tab 留在里面，并用 `useRestoreFocus` 在关闭后把焦点还回触发器。`useScrollLock` 在浮层打开时锁住背景滚动。

列表和菜单的方向键在 `useListFocus`、`useGridRovingFocus` 和 `useTypeahead`。`ChatMessageList` 是 `role="log"`。助手回复还在增长时，把 `isStreaming` 保持为 true，读屏会等这段结束再读，而不是每个 token 都念一遍。

动画尊重 `prefers-reduced-motion`。共享运动类会把位移和缩放收成 0。见 [动画](/themes/motion)。

这里没有一份独立的第三方审计报告。某个组件的键盘和读屏行为，以该组件文档里的说明和仓库里的测试为准。
