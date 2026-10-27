---
title: 安装
---

# 安装

astryx-vue 拆分为核心包与主题包两个部分，通常建议搭配安装：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

```sh
npm install @astryx-vue/core @astryx-vue/themes
```

```sh
yarn add @astryx-vue/core @astryx-vue/themes
```

`@astryx-vue/core` 的 peer 依赖为 `vue: ^3.5.0`。主题包附带了 `@fontsource/figtree` 与 `@fontsource/jetbrains-mono` 字体依赖，分别用于正文与等宽代码排版。两个包均采用纯 ESM 格式发布。

组件、组合式函数（Composables）与样式的引入路径如下：

| 资源类别 | 引入路径 |
| --- | --- |
| 单个组件（推荐） | `@astryx-vue/core/Button` 等独立子路径 |
| 通用组合式函数与包根导出 | `@astryx-vue/core` |
| `provideAstryxLocale`、`useAstryxMessages` | `@astryx-vue/core/locale`（亦可从包根导入） |
| 主题样式 | `@astryx-vue/themes/neutral.css`（Butter、Chocolate、Gothic、Matcha、Stone、Y2K 等主题路径规则相同，替换文件名即可） |
| 组件全部结构样式 | `@astryx-vue/core/styles.css` |
| 全局样式重置 | `@astryx-vue/core/reset.css` |

`reset.css` 提供全局样式重置，类似于 Tailwind Preflight。引入后将对页面的原生 HTML 元素样式进行规范化处理：

- 所有元素统一使用 `box-sizing: border-box`，默认边框宽度为 0。
- 标题、段落、列表等标签移除默认外边距和内边距，列表默认无标记符号，标题继承父元素的字号与字重。
- 图片、视频与 `svg` 统一为块级元素，`img` 和 `video` 默认适配容器宽度。
- 表单控件继承字体与前景色，按钮清除浏览器自带的外观样式。
- 禁用状态元素展示默认光标，而非 `not-allowed`。
- `::before`、`::after`、占位文字及搜索框清除按钮均同步重置。

所有重置规则均置于优先级最低的 `astryx.reset` 级联层（Cascade Layer）中，选择器特异度为 0，因此业务样式或其它级联层均可直接覆盖。该文件内置了级联层顺序声明，引入的前后顺序不影响样式优先级。

该样式重置会影响全局。如果已有项目已有现成的全局样式重置机制，无需重复引入 `reset.css`。组件本身自带完整的结构样式，不强依赖该文件。

虽然子路径和包根导出的是同一批组件，但在业务开发中推荐使用子路径（如 `@astryx-vue/core/Button`）。子路径能够明确导入目标，并确保打包工具仅打包对应组件的独立样式。如果直接从包根导入 `useClipboard` 这类通用工具函数，在部分 Tree-shaking 支持不完整的打包环境下可能引入额外代码。因此仅需使用组件时，建议优先通过子路径导入。

核心包与主题包保持相同的发布版本节奏。当前最新版本为 `0.3.0`，版本变更记录见 [更新日志](/guide/changelog)，版本迁移说明见 [升级指南](/guide/migration)。

如需在终端或配合 AI 工具检索组件文档，可参考 [命令行工具](/guide/cli)。
