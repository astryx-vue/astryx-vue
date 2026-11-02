---
'@astryx-vue/core': patch
---

`Link`、`Token` 和 `ClickableCard` 禁用时改用 `aria-disabled`，不再用原生 `disabled` 或 `tabIndex=-1`：控件保留 Tab 停留点，读屏仍能读到它的名称和不可用状态；点击、Enter/Space 以及冒泡到祖先的点击都会被拦住，不会触发回调或导航。禁用链接继续不带 `href`，并显式暴露链接角色。
