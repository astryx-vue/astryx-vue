---
title: 快速开始
---

# 快速开始

只要几分钟，就能在你的 Vue 3 项目里用上 astryx-vue。

首先安装核心组件包和主题包。组件库要求你的项目使用 Vue 3.5.0 或更新版本：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

在应用的入口文件（例如 `main.ts`）里引入一次主题样式。默认的 Neutral 主题为你准备好了基础配色，并自带了好看的正文字体（Figtree）与等宽字体（JetBrains Mono）：

```ts
import '@astryx-vue/themes/neutral.css'
```

接着就可以直接在页面里使用组件了。推荐直接从具体的子路径引入组件，这样打包器只会加载该组件对应的样式，代码体积最轻巧：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始" />
</template>
```

如果你希望省去后顾之忧，也可以在入口处一次性引入所有组件的结构样式：

```ts
import '@astryx-vue/core/styles.css'
```

接下来，你可以阅读 [安装](/guide/installation) 了解更详细的包导出结构，阅读 [主题与样式](/guide/styling) 了解样式的分层与变量配置，或者直接在 [组件列表](/components/) 里挑选组件上手。想了解设计初衷与实现思路，请参阅 [介绍](/guide/why)。
