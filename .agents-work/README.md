# Astryx Vue 调研与讨论记录

> 状态：Git、基本目录和配置已经完成；尚未开始写组件  
> 更新日期：2026-08-15

## 写作方式

- 尽量用中文和大白话。
- 工具的正式名称会保留，但第一次出现时说明它是做什么的。
- 不用英文缩写代替解释，不用行业黑话包装简单事情。

## 已经定下来的事

- 这是一个非官方的社区项目，所有公开包放在 `@astryx-vue` 这个 npm 组织下。
- 使用 MIT 许可证，并保留原版 Astryx 和第三方内容的许可证说明。
- Vue、TypeScript 和所有工具依赖使用 npm 当前最新版。
- 使用 pnpm 和带名称的版本分组，例如 `catalog:vue`、`catalog:build`，不用空的 `catalog:`。
- 应用构建使用 Vite；组件构建使用 tsdown 和 unplugin-vue；测试使用 Vitest。
- 代码检查使用 ESLint 和 `@antfu/eslint-config`。
- 文档使用 VitePress，组件示例直接使用 Vue。
- `@astryx-vue/core` 等公开组件包，以及新建空白 Vue 项目安装它们之后，都不能出现 React 依赖。
- 样式先用 CSS 变量和 CSS 分层，不把 UnoCSS 或 StyleX 作为使用组件的前提。
- Vue 版本使用 Vue 自己习惯的 props、事件、插槽、`v-model` 和组合式函数，不照抄 React 写法。

## 第一轮做什么

先从头跑通一遍“整理原版资料 → 写 Vue 组件 → 测试 → 打包 → 放进空白 Vue 项目试装 → 写文档展示”。

第一轮准备：

- `@astryx-vue/core`：公开包，放 Vue 组件、共用代码、类型和组件样式；
- `@astryx-vue/themes`：公开包，集中放所有主题；第一轮提供 `./neutral` 和 `./neutral.css`。

Neutral 的样式这样引入：

```ts
import '@astryx-vue/themes/neutral.css'
```

第一轮组件：

- Stack、StackItem、HStack、VStack；
- Badge；
- Blockquote；
- Skeleton；
- VisuallyHidden。

第一轮完成后暂不发布到 npm，先在仓库和一个全新的 Vue 项目中验证。

## 文件说明

1. [原版 Astryx 调研](./00-upstream-research.md)
2. [工具和工程方案的详细核对](./01-feasibility-and-architecture.md)——技术查证用，包含工具原名
3. [已经确定和还没确定的事情](./02-discussion-log.md)
4. [第一轮组件和文档方案](./03-pilot-slice.md)——建议先看这份

基本工程已经按用户授权搭好，并通过代码检查、类型检查、测试、组件包构建和文档构建。打包后的 `core` 与 `themes` 也已放进一个全新的 Vue 项目试装，确认不会带入 React。下一步才开始整理 Neutral 的真实设计变量和第一个组件。
