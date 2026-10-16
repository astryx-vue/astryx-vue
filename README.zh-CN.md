[English](./README.md) | 简体中文

# astryx-vue

Astryx 的非官方 Vue 3 移植：组件、主题，以及给 agent 用的命令行。

[![GitHub](https://img.shields.io/badge/GitHub-astryx--vue%2Fastryx--vue-181717?logo=github)](https://github.com/astryx-vue/astryx-vue)
[![npm @astryx-vue/core](https://img.shields.io/npm/v/@astryx-vue/core?label=%40astryx-vue%2Fcore)](https://www.npmjs.com/package/@astryx-vue/core)
[![npm @astryx-vue/themes](https://img.shields.io/npm/v/@astryx-vue/themes?label=%40astryx-vue%2Fthemes)](https://www.npmjs.com/package/@astryx-vue/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 与 Meta 没有隶属、背书或支持关系。原版 Astryx 在 <https://github.com/facebook/astryx>。

## 安装

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

唯一的 peer 依赖是 `vue` `^3.5.0`。npm 和 yarn 用同样的包名。

## 快速开始

在应用入口引入一套主题。Neutral 也会写到 `:root`，并带上 Figtree 和 JetBrains Mono。

```ts
import '@astryx-vue/themes/neutral.css'
```

每个组件从自己的子路径引入。那个入口会带上对应的结构样式。不需要 StyleX，也不需要 UnoCSS。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始" />
</template>
```

## 包

| 包 | 是什么 |
| --- | --- |
| [`@astryx-vue/core`](./packages/core) | Vue 组件、组合式函数和结构样式 |
| [`@astryx-vue/themes`](./packages/themes) | 一个主题包：Neutral、Butter、Chocolate、Gothic、Matcha、Stone、Y2K |
| [`@astryx-vue/cli`](./packages/cli) | `astryx-vue`：查组件文档、搜索、写 agent 上下文。不是 Meta 的 `astryx` |

`core` 和 `themes` 一起发布。命令行已经在这个仓库里，随之后的版本发到 npm。

## 命令行

把 CLI 装成开发依赖，再用项目脚本调用：

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
npm run astryx-vue -- search dialog
npm run astryx-vue -- manifest --json
npm run astryx-vue -- init --features agents
```

`init --features agents` 只刷新 `AGENTS.md` 里的托管块。标记外面的文字保持不动。说明见 [命令行](https://astryx-vue.pages.dev/guide/cli)。

## 资源

- 文档：<https://astryx-vue.pages.dev>（英文：<https://astryx-vue.pages.dev/en/>）
- 演练场：<https://astryx-vue.pages.dev/playground/>（英文：<https://astryx-vue.pages.dev/en/playground/>）
- 组件：<https://astryx-vue.pages.dev/components/>
- 主题：<https://astryx-vue.pages.dev/themes/>

## 开发

需要 Node.js 22.18+ 和 pnpm 11.21+。

```sh
pnpm install
pnpm dev      # 文档站
pnpm check    # lint、类型检查、测试和构建
```

发布步骤见 [RELEASING.md](./RELEASING.md)。

## 许可证

[MIT](./LICENSE)。Astryx 的版权属于 Meta Platforms, Inc.。这个仓库是该设计的非官方移植，与 Meta 没有隶属或背书关系。
