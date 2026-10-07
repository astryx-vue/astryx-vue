# astryx-vue

Astryx 设计系统的非官方 Vue 3 社区实现。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 本项目不是 Meta 官方项目。原版 Astryx 见 <https://github.com/facebook/astryx>。

## 特性

- Vue 3 原生 API：props、事件、插槽、`v-model` 与组合式函数。
- 组件包与主题包分离：`@astryx-vue/core` 提供组件，`@astryx-vue/themes` 提供主题。
- 基于 CSS 变量与 CSS 分层，不要求使用者安装 UnoCSS 或 StyleX。
- 交互式文档，包含组件示例与中英文说明。
- TypeScript 类型完整，配套 Vitest 测试。

## 安装

当前暂未发布到 npm。可以通过本地 workspace 或源码构建引用。

发布后将支持：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

## 快速开始

在应用入口引入一次主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

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
