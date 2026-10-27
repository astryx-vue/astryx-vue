---
title: 快速开始
---

# 快速开始

本文介绍如何在 Vue 3 项目中安装并使用 astryx-vue。

首先安装核心组件包和主题包。组件库要求使用 Vue 3.5.0 或更高版本：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

在应用入口文件（例如 `main.ts`）中引入主题样式。默认的 Neutral 主题包含基础配色方案，并内置了正文字体（Figtree）与等宽字体（JetBrains Mono）：

```ts
import '@astryx-vue/themes/neutral.css'
```

随后即可在页面中使用组件。推荐从具体的子路径按需引入组件，打包工具会自动按需加载对应的组件样式，优化打包产物体积：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始" />
</template>
```

如果你希望全局引入全部基础样式，也可以在入口处统一引入全量样式文件：

```ts
import '@astryx-vue/core/styles.css'
```

关于更多导入配置请参考 [安装](/guide/installation)；样式与 CSS 变量用法见 [主题与样式](/guide/styling)；或者直接浏览 [组件](/components/) 列表。项目背景与设计考量请见 [介绍](/guide/why)。

## 面向 AI Agent 的纯文本访问

文档站为每个页面提供了纯文本访问方式，方便各类 AI 辅助工具直接读取：

- [/llms.txt](https://astryx-vue.pages.dev/llms.txt) 为英文文档目录索引，每页一行简介；对应中文索引为 [/llms-zh.txt](https://astryx-vue.pages.dev/llms-zh.txt)。
- [/llms-full.txt](https://astryx-vue.pages.dev/llms-full.txt) 合并了全量英文文档；对应中文合并文档为 [/llms-full-zh.txt](https://astryx-vue.pages.dev/llms-full-zh.txt)。
- 在任意页面 URL 后追加 `.md` 后缀，即可直接获取该页的 Markdown 原文，例如 [/components/button.md](https://astryx-vue.pages.dev/components/button.md)。中文页面路径默认不含 `/zh` 前缀，英文页面使用 `/en/` 前缀。

组件的 Markdown 文档整合了总览说明、属性列表、代码示例及无障碍注意事项。各 HTML 页面均在 `<head>` 中通过链接指向对应的 Markdown 地址；命令行工具的使用方式见 [命令行](/guide/cli)。
