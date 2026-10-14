---
title: 安装
---

# 安装

两个公开包一起装：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

```sh
npm install @astryx-vue/core @astryx-vue/themes
```

```sh
yarn add @astryx-vue/core @astryx-vue/themes
```

`@astryx-vue/core` 的 peer 依赖是 `vue: ^3.5.0`。主题包依赖 `@fontsource/figtree` 和 `@fontsource/jetbrains-mono`，用来提供正文和等宽字体。两个包都只发布 ESM。

组件、组合式函数和语言环境的入口不同：

| 需要的东西 | 从哪里引入 |
| --- | --- |
| 某一个组件 | `@astryx-vue/core/Button` 这种子路径 |
| 组合式函数，以及根入口重新导出的组件 | `@astryx-vue/core` |
| `provideAstryxLocale`、`useAstryxMessages` | `@astryx-vue/core/locale`，根入口也能拿到 |
| 一套主题 | `@astryx-vue/themes/neutral.css`。Butter、Chocolate、Gothic、Matcha、Stone、Y2K 也是这个路径，换成各自的文件名。 |
| 全部结构样式 | `@astryx-vue/core/styles.css` |
| 层声明 | `@astryx-vue/core/reset.css` |

`reset.css` 目前只有 `@layer astryx.reset;`，不是一份浏览器重置。结构样式和主题样式自己也会声明层的顺序。

子路径和包根导出的是同一批组件。文档和示例使用子路径，这样意图更清楚，也只加载该组件那份结构样式。从包根引入 `useClipboard` 这类函数时，打包器若不能摇掉未使用的重导出，可能会把其他组件模块一起算进去。只使用组件时，优先写子路径。

版本号两个包一起走。已经发布的是 `0.1.0`。记录见 [更新日志](/guide/changelog)。
