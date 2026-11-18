---
'@astryx-vue/core': patch
---

内联展开的 MoreMenu 不再打乱页面上其他弹层的 hydration。内联菜单之前用 `<Teleport disabled>` 包住子菜单的 Teleport。Vue 3.5 水合这种嵌套时会让子菜单占走外层在 body 里留的空位，之后每个传送到 body 的弹层（Tooltip、Popover、聊天输入框的建议列表等）都会对上前一个弹层的服务端 HTML。内联菜单现在直接原地渲染，不再经过 Teleport。
