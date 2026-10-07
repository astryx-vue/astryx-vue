# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户是正在评估 astryx-vue 的 Vue 开发者。他们需要先看懂项目现在能做什么、还不能做什么，再决定是否继续阅读、试用或关注项目进展。

## Product Purpose

astryx-vue 是 Astryx 设计系统的非官方 Vue 社区版本。项目用 Vue 3 原生方式重新实现组件和主题，并提供可以阅读、预览和验证这些内容的文档。

当前成功标准不是尽快发布 npm，而是先完成第一轮组件和 Neutral 明暗主题，在全新的 Vue 项目中验证安装、构建和类型，并确保公开包不带入 React。

## Positioning

项目不套一层 React 适配器，也不直接依赖会带入 React 的 Astryx 官方包；公开接口使用 Vue 的 props、事件、插槽、`v-model` 和组合式函数。所有主题集中在 `@astryx-vue/themes`，通过子路径按需引入。

## Operating Context

读者会从 VitePress 文档了解安装方式、主题、组件和 API。真实组件示例使用 Vue 运行。开发进度、试做范围和内部安排不属于正式文档内容，只记录在仓库内部的 `.agents-work`。

## Capabilities and Constraints

- 公开包是 `@astryx-vue/core` 和 `@astryx-vue/themes`。
- 项目使用 最新版 Vue、TypeScript、Vite、tsdown、Vitest 和 VitePress。
- 样式使用 CSS 变量和 CSS 分层，不要求使用者安装 UnoCSS 或 StyleX。
- 当前只有工程骨架，还没有可用组件，也没有发布 npm。
- 第一轮计划包含 Stack 系列、Badge、Blockquote、Skeleton、VisuallyHidden 和 Neutral 明暗主题。

## Brand Commitments

- 所有正式文档、页面标题和无障碍名称统一使用小写连字符形式“astryx-vue”，不写成“Astryx Vue”或“Astryx-Vue”；同时明确说明它是非官方社区项目。
- Logo 使用 `public/icon-logo.svg` 和 `public/full-text-logo.svg`。
- 文档以中文为主，保留包名和必要的英文名称。
- 文档使用 Figtree Light。
- 视觉参考 Astryx 官网的深色、宽松留白、超大标志和蓝色重点色，但不照搬官网内容或把 React 版本的能力说成自己的能力。

## Evidence on Hand

- 用户提供了 Astryx 官网首页截图作为样式参考。
- 已有两份可缩放 Logo：`public/icon-logo.svg` 和 `public/full-text-logo.svg`。
- 仓库内已有调研、架构方案和第一轮范围记录。
- 目前没有真实组件截图、用户案例、性能数据或已发布版本；文档不得编造这些内容。

## Product Principles

1. 正式文档按产品终态写安装、API 和用法，不把文档写成实现计划书。
2. 让 Vue 使用者先看懂，再决定是否继续阅读或试用。
3. 公开包保持纯 Vue，不让文档工具的 React 依赖越界。
4. 保留 Astryx 的辨识度，同时让用法和文档真正符合 Vue。

## Accessibility & Inclusion

文档和组件示例不能为了视觉效果牺牲键盘操作、可见焦点、文字对比度、减少动态效果设置或窄屏阅读。
