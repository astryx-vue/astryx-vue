# Astryx Vue 调研与讨论记录

> 状态：组件已经在写。总导出、样式汇总和文案汇总由 `pnpm sync` 生成，不要手改。  
> 更新日期：2026-10-11

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

## 新增一个组件

只新建自己的目录，然后跑 `pnpm sync`。不要手改下面这些生成文件：

- `packages/core/src/index.ts`
- `packages/core/package.json` 里的 `exports`
- `packages/core/styles.css`
- `packages/themes/neutral.css`
- `packages/core/src/composables/index.ts`
- `packages/core/src/locale/messages.ts`
- `apps/docs/components/demo-infra/componentCatalog.ts`
- `apps/docs/components/demos/registry.ts`

要新建的目录和文件：

1. `packages/core/src/<Component>/`，里面要有 `index.ts`，用具名导出组件、类型和组合式函数。不要只写默认导出。注入键（名字以 `Key` 或 `_KEY` 结尾）留在子路径里，不会进总入口。`Icon` 没有 `index.ts`，所以不对外公开。
2. `packages/core/styles/<kebab>.css`，以及需要主题时的 `packages/themes/neutral/<kebab>.css`。
3. 文案放在 `packages/core/src/locale/messages/<kebab>.ts`。同一个文件里写 `en` 和 `zh-CN`，并导出 `export const <camel>Messages` 和 `export interface <Pascal>Messages`。没有文案就不要建这个文件。
4. 可复用的组合式函数放在 `packages/core/src/composables/useX.ts`。不要手改该目录的 `index.ts`。
5. 文档示例放在 `apps/docs/components/demos/<slug>/`，并新增 `meta.ts`（`slug`、分组、组内 `order`、中英文名、目录卡片示例）。文档页放在 `docs/zh/components/<slug>/` 和 `docs/en/components/<slug>/`。

然后在仓库根目录运行 `pnpm sync`。`pnpm check` 里的 `sync --check` 会核对生成结果；不一致就先重新生成，不要手动合并这些文件。

`styles.css` 里原先没有汇总、由组件单文件自己引入的样式，以及 `composables/index.ts` 原先没有公开的 `useCalendar`、`usePagination`，生成脚本会继续留在外面，避免公开范围被悄悄改掉。新文件不在这份例外里，会自动收进汇总。

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
