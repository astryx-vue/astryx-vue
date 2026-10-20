[English](./README.md) | 简体中文

# astryx-vue

astryx-vue 是 Meta [Astryx](https://github.com/facebook/astryx) 设计系统的非官方 Vue 3 社区移植版本：包含开箱即用的 Vue 组件、多套风格主题，以及方便 AI Agent 快速检索文档与上下文的命令行工具。

[![GitHub](https://img.shields.io/badge/GitHub-astryx--vue%2Fastryx--vue-181717?logo=github)](https://github.com/astryx-vue/astryx-vue)
[![npm @astryx-vue/core](https://img.shields.io/npm/v/@astryx-vue/core?label=%40astryx-vue%2Fcore)](https://www.npmjs.com/package/@astryx-vue/core)
[![npm @astryx-vue/themes](https://img.shields.io/npm/v/@astryx-vue/themes?label=%40astryx-vue%2Fthemes)](https://www.npmjs.com/package/@astryx-vue/themes)
[![npm @astryx-vue/cli](https://img.shields.io/npm/v/@astryx-vue/cli?label=%40astryx-vue%2Fcli)](https://www.npmjs.com/package/@astryx-vue/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 说明：本项目由开源社区独立维护与开发，与 Meta Platforms, Inc. 没有任何隶属、背书或商业支持关系。原版 React 实现请访问 <https://github.com/facebook/astryx>。

## 安装

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

库本身唯一的对等依赖（peer dependency）是 `vue` `^3.5.0`。使用 npm、yarn 或 bun 时命令和包名完全一致。

## 快速上手

### 1. 引入主题样式

在应用的主入口（如 `main.ts`）引入一套主题。默认推荐引入 `neutral.css`，它不仅会自动加载 Figtree 与 JetBrains Mono 字体，还会把基础变量写入 `:root` 全局生效：

```ts
import '@astryx-vue/themes/neutral.css'
```

### 2. 使用组件

所有组件都支持从各自的独立子路径按需引入。这样引入时，组件所需的骨架样式会自动带入，无需额外配置 StyleX 编译器，也不强制依赖 UnoCSS 或 Tailwind CSS：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始使用" />
</template>
```

## 包含的包

| 软件包 | 主要用途 |
| --- | --- |
| [`@astryx-vue/core`](./packages/core) | 核心组件库：提供所有 Vue 3 组件、常用工具函数（Composables）与组件基础骨架样式 |
| [`@astryx-vue/themes`](./packages/themes) | 主题样式包：内置 Neutral、Butter、Chocolate、Gothic、Matcha、Stone、Y2K 共 7 套预设主题 |
| [`@astryx-vue/cli`](./packages/cli) | 专属命令行工具：在终端查询组件文档、快速搜索，或为 AI 辅助编程生成上下文规则 |

`@astryx-vue/core` 和 `@astryx-vue/themes` 版本保持同步发布。`@astryx-vue/cli` 独立维护版本号。

## 命令行工具 (CLI)

建议将 CLI 安装到项目的开发依赖中。包里声明了 `bin`，装完命令就在 `node_modules/.bin` 里：

```sh
pnpm add -D @astryx-vue/cli
pnpm exec astryx-vue component Button
npx astryx-vue search dialog
```

不安装、只想临时用时，运行 `npx @astryx-vue/cli …`（注意：scope 不能省，因为 npm 上裸名 `astryx-vue` 不是这个包）。

```sh
pnpm exec astryx-vue build "带单点登录的登录页"
pnpm exec astryx-vue template login-card ./src/pages
pnpm exec astryx-vue manifest --json
pnpm exec astryx-vue init --features agents
```

其中 `init --features agents` 命令仅会刷新 `AGENTS.md` 文件中由本工具托管的代码块，你在托管标记之外手写的说明文字都会完整保留。具体用法详见 [CLI 使用指南](https://astryx-vue.pages.dev/guide/cli)。

## 常用链接与资源

- 官方文档：<https://astryx-vue.pages.dev>（英文版：<https://astryx-vue.pages.dev/en/>）
- 在线演练场：<https://astryx-vue.pages.dev/playground/>（英文版：<https://astryx-vue.pages.dev/en/playground/>）
- 组件索引列表：<https://astryx-vue.pages.dev/components/>
- 主题说明总览：<https://astryx-vue.pages.dev/themes/>

## 本地开发

运行本项目需要准备 Node.js 22.18+ 以及 pnpm 11.21+ 环境。

```sh
# 安装所有依赖
pnpm install

# 启动本地文档站预览
pnpm dev

# 运行代码规范检查、类型校验、单元测试与项目构建
pnpm check
```

版本发布流程请参考 [RELEASING.md](./RELEASING.md)。

## 开源许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。原版 Astryx 设计与代码版权归 Meta Platforms, Inc. 所有。本项目为社区非官方移植，与 Meta 无关联。
