# astryx-vue

Astryx 设计系统的非官方 Vue 3 社区实现。

[![GitHub](https://img.shields.io/badge/GitHub-astryx--vue%2Fastryx--vue-181717?logo=github)](https://github.com/astryx-vue/astryx-vue)
[![npm @astryx-vue/core](https://img.shields.io/npm/v/@astryx-vue/core?label=%40astryx-vue%2Fcore)](https://www.npmjs.com/package/@astryx-vue/core)
[![npm @astryx-vue/themes](https://img.shields.io/npm/v/@astryx-vue/themes?label=%40astryx-vue%2Fthemes)](https://www.npmjs.com/package/@astryx-vue/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 本项目不是 Meta 官方项目。原版 Astryx 见 <https://github.com/facebook/astryx>。

## 特性

- Vue 3 原生 API：props、事件、插槽、`v-model` 与组合式函数。
- 组件包与主题包分离：`@astryx-vue/core` 提供组件，`@astryx-vue/themes` 提供主题。
- 基于 CSS 变量与 CSS 分层，不要求使用者安装 UnoCSS 或 StyleX。
- 交互式文档，包含组件示例与中英文说明。
- TypeScript 类型完整，配套 Vitest 测试。

## 安装

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

文档站：<https://astryx-vue.pages.dev>

首次 npm 版本是 `0.1.0`。发布步骤见 [RELEASING.md](./RELEASING.md)。

## 快速开始

在应用入口引入一次主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

等宽字体栈是 JetBrains Mono。引入 Neutral 主题时会一并加载 400、500、600、700 和 400 斜体。

然后在组件中使用：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Get started" />
</template>
```

## 文档

在线文档：<https://astryx-vue.pages.dev>

本地启动文档站点：

```sh
pnpm install
pnpm dev
```

## 开发

需要 Node.js 22.18+ 与 pnpm 11.21+。

```sh
pnpm install
pnpm check   # lint + typecheck + test + build
```

## 许可证

[MIT](./LICENSE)
