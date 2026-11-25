---
'@astryx-vue/core': minor
'@astryx-vue/richtext': patch
'@astryx-vue/lab': patch
'@astryx-vue/cli': patch
---

公开 `useComponentMessages` 和各组件的内置文案（如 `tableMessages`、`codeBlockMessages`），自己的组件可以只取用到的几组文案。富文本编辑器改用它，打包时不再带上全部组件的文案。
