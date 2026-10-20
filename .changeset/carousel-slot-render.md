---
"@astryx-vue/core": patch
---

轮播在渲染时读取默认插槽，不再触发 Vue 的 `Slot "default" invoked outside of the render function` 警告。用渲染函数或 JSX 写轮播时，父组件重新渲染后传下的新卡片会立刻显示，之前会停在旧的一批。卡片的数量或内容变化后，滚动范围会重新测量。页面上的 DOM 结构和卡片自身的状态都没有变化。
