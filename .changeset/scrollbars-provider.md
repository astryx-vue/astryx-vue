---
"@astryx-vue/core": minor
---

新增 `@astryx-vue/core/Scrollbars`：`ScrollbarsProvider` 和 `useScrollbars`。在应用外层套上 `ScrollbarsProvider`，组件里的滚动区域会换成 OverlayScrollbars 画的覆盖式滚动条。外观用 `--astryx-scrollbar-*` 变量调整。不套 Provider 时组件行为不变，OverlayScrollbars 的 JS 和 CSS 也不会打进包。`ScrollableArea` 新增 `scrollbars` 属性，设为 `false` 时这块区域保留原生滚动条。原版 Astryx 没有这个能力。
