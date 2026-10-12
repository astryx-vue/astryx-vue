---
title: 为什么
---

# 为什么

astryx-vue 用 Vue 3 重新实现 [Astryx](https://github.com/facebook/astryx) 的设计语言。原版文档在 <https://astryx.atmeta.com>，技术栈是 React 19 和 StyleX。这个仓库是非官方社区项目，不是 Meta 的项目，也不把 React 版本的能力说成自己的能力。

原版值得对齐的是设计语言，不是框架。这里重点复刻四件事：design token、CSS 变量、动画系统，以及组件的粒度。用法按 Vue 来写：props、事件、插槽、`v-model` 和组合式函数。不包一层 React 适配器，也不依赖会把 React 带进依赖树的官方包。

组件和主题分成两个包。`@astryx-vue/core` 提供组件和结构样式，`@astryx-vue/themes` 提供主题。样式是普通 CSS，使用方不用安装 UnoCSS 或 StyleX。

图标不做成一套内置图标组件。需要图标的组件接收一个 CSS class，绘制交给调用方。文档站用的是 Anthony Fu 的 CSS icon 方案（UnoCSS 的 `presetIcons`）。组件自己只保留少量装饰字形，例如勾、chevron 和复制。说明见 [图标](/guide/icons)。

对话、引用和 Markdown 这类会一起出现的界面，按组件粒度成套提供，而不是只给一个打平的按钮列表。目前这套界面是 `Chat`、`Citation` 和 `Markdown`。见 [应用模式](/guide/patterns)。

公开接口以仓库里的导出为准。主题目前只有 Neutral。还没有原版 CLI、StyleX 的 `xstyle`，也没有 butter 等其他主题包。
