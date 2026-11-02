---
'@astryx-vue/core': patch
---

`Button` 在忙碌只因 `isLoading` 或不可中断的 `clickAction` 未完成时改用 `aria-disabled`，不再设置原生 `disabled`：按钮保持键盘焦点，但点击、Enter/Space 以及冒泡到祖先的点击都会被拦住；`href` 版本忙碌时也保持 `<a>`，不会换成禁用按钮。真正的 `isDisabled`（包括同时忙碌）仍用原生 `disabled`。

首次渲染就处于 loading 的 `Button` 先以空内容挂载 live region，下一帧再写入 loading 文案，避免读屏器跳过与文字同时出现的 live region。
