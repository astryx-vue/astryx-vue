---
'@astryx-vue/core': patch
---

`useTheme` 和 `useSyntaxTheme` 挂载前不再读读者的页面：主题没有指定 light 或 dark 时 `mode` 先按 light 解析，`useTheme().token()` 也先不读文档上的计算样式，挂载后再跟随页面（`data-astryx-color-mode`、`dark` 类、系统偏好、页面定义的 CSS 变量）。服务端看不到这些，之前深色页面或定义了 token 的页面在 hydration 时文字和颜色都会对不上。
