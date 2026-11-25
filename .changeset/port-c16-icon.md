---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Icon 与主题图标跟进上游 AST-087 一组改动。

- `defineTheme({ icons })` 的条目可以写成 `{ size, variant }` 的函数，`Icon` 按实际尺寸调用它；函数返回 `null` 就不画，不再退回默认图标。`theme.icons` 和 `useSemanticIcon` 按 `md` 读取。
- 主题用 `iconVariants` 一次列出支持的变体名，`Icon` 新增 `variant` 属性来要另一种画法；主题没列的变体不会传给条目。
- 新增 `defineTheme({ componentIcons })`，按槽位决定组件自己的图标：CodeBlock 复制（`code-block-copy`）、Timestamp 悬浮卡片复制（`timestamp-copy`）、Table 排序指示（`table-sort-indicator`）和行展开（`table-row-expand`）。写错的字段只在开发环境提示一次，不会打断渲染。
- 主题在 `components.icon['size:sm']` 等尺寸上写的 `width`、`height` 现在连字形的字号一起改。
- `Icon` 的模板 ref 暴露 `element` 和渲染出的 `svg`。
- 同一页面里加载了多份本包时，注册的图标彼此可见。

CLI 内置的 Icon 文档同步更新。
