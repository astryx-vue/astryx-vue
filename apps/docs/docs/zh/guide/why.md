---
title: 介绍
---

# 介绍

astryx-vue 是用 Vue 3 重新实现 [Astryx](https://github.com/facebook/astryx) 设计语言的开源组件库。原版文档位于 <https://astryx.atmeta.com>，基于 React 19 与 StyleX 构建。本项目由社区独立维护，旨在为 Vue 开发者提供高质感、现代化的企业级设计系统实现。

## 核心定位

我们复刻的是设计语言的质感与工程标准，而不是对 React 进行适配包装。组件库严格对齐四大核心基础：

1. **Design Token**：语义化的设计令牌规范。
2. **CSS 变量系统**：支持 `light-dark()` 统一双模配色与层级覆盖。
3. **动效系统（Motion）**：标准缓动与层级时间刻度，开箱支持系统减少动效偏好。
4. **组件颗粒度**：从基础控件到复杂应用界面均与原版对应。

所有组件完全采用 Vue 3 习惯的原生接口设计：Props、事件、插槽、`v-model` 与组合式函数（Composables），无需任何外部运行时桥接，打包干净无冗余。

## 架构与包划分

项目采用清晰的分层架构：

- `@astryx-vue/core`：提供核心组件、组合式函数与基础结构样式。
- `@astryx-vue/themes`：提供 Neutral 等主题变量与排版支持。

样式基于现代 CSS 原生规范编写，使用方无需在项目中引入 StyleX 或配置特定的 CSS 编译器。

## 图标与复杂模式

组件库不捆绑预置的图标组件集合。需要图标的组件（如 `IconButton`、`NavItem`）接受标准的 CSS 类名，开发者可根据项目偏好自由选用 UnoCSS `presetIcons`、Tailwind、Iconify 或自定义 SVG 图标。

对于高频出现的协同交互界面，组件库成套提供组合模式，例如 `Chat`（对话流）、`Citation`（引用）和 `Markdown`。

---

当前公开接口均以仓库实际导出为准。核心样式与组件均遵循原生 Web 标准与现代 Vue 3 模式构建。
