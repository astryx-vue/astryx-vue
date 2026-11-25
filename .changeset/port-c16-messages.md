---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

每个组件只带自己的内置文案：只用到 Button、Spinner、Token 这类组件的应用，打包时不再把所有组件的英文和中文文案一起打进去。显示的文字、`InternationalizationProvider` 的用法和 `useAstryxMessages`、`useTranslator` 等公开接口都不变。
