---
title: 安装
---

# 安装

astryx-vue 拆分为核心包与主题包两个部分，通常建议一起安装：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

```sh
npm install @astryx-vue/core @astryx-vue/themes
```

```sh
yarn add @astryx-vue/core @astryx-vue/themes
```

`@astryx-vue/core` 的 peer 依赖是 `vue: ^3.5.0`。主题包附带了 `@fontsource/figtree` 与 `@fontsource/jetbrains-mono`，用来提供正文与等宽代码字体。两个包均采用纯 ESM 格式发布。

组件、组合式函数（Composables）与样式有各自清晰的引入路径：

| 需要的内容 | 引入路径 |
| --- | --- |
| 具体的某个组件（推荐） | `@astryx-vue/core/Button` 等独立子路径 |
| 通用组合式函数与包根快捷导出 | `@astryx-vue/core` |
| `provideAstryxLocale`、`useAstryxMessages` | `@astryx-vue/core/locale`（包根也能拿到） |
| 主题样式 | `@astryx-vue/themes/neutral.css`（Butter、Chocolate、Gothic、Matcha、Stone、Y2K 等主题也是同样路径，替换为对应文件名即可） |
| 所有组件的全部结构样式 | `@astryx-vue/core/styles.css` |
| 全局 reset | `@astryx-vue/core/reset.css` |

`reset.css` 是一份全局 reset，和 Tailwind Preflight 是同一类东西。引入以后，整个页面上普通 HTML 标签的默认样式会变：

- 所有元素都是 `box-sizing: border-box`，边框默认是 0 宽的实线。
- 标题、段落、列表等标签没有默认的外边距和内边距，列表没有圆点，标题继承父元素的字号和字重。
- 图片、视频、`svg` 变成块级元素，`img` 和 `video` 会自适应容器宽度。
- 表单控件继承字体和颜色，按钮去掉浏览器自带的外观。
- 禁用的元素显示默认指针，不显示 `not-allowed`。
- `::before`、`::after`、占位文字和搜索框的清除按钮也一并重置。

所有规则都放在优先级最低的 `astryx.reset` 层里，选择器优先级为 0，所以别的层和你自己没放进层的样式都能直接覆盖它。这个文件还会自己声明层级顺序，引入的先后顺序不影响结果。

这份 reset 是全局的。如果不想动你自己的页面，就不要引入 `reset.css`。组件不依赖它，因为每份结构样式都会给自己的元素写好样式。结构样式和主题样式也会自己声明好层级的先后顺序。

虽然子路径和包根导出的是同一批组件，但在文档和日常开发中，我们强烈推荐使用子路径（例如 `@astryx-vue/core/Button`）。这样引用意图十分清晰，而且打包器只会按需打包该组件独有的结构样式。如果你从包根引入 `useClipboard` 这类通用函数，在部分未能精细摇树（Tree-shaking）的打包配置下，可能会把其余组件也一同打包进来。所以仅仅使用组件时，请优先写子路径。

核心包与主题包保持相同的版本号节奏。当前已发布的版本为 `0.1.0`，版本演进记录可参阅 [更新日志](/guide/changelog)。

如果你希望在本地终端或借助 AI Agent 快速检索组件文档，可以了解我们的 [命令行工具](/guide/cli)。
