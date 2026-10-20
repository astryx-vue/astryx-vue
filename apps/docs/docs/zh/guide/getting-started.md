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

下一步看 [安装](/guide/installation) 里的包入口，看 [主题与样式](/guide/styling) 里层和变量怎么接，或者直接打开 [组件](/components/)。想了解设计初衷与实现思路，请参阅 [介绍](/guide/why)。

## 给 AI Agent 使用

每一页文档都贴心地提供了一份纯文本，AI Agent 不需要额外安装工具就能直接读取：

- [/llms.txt](https://astryx-vue.pages.dev/llms.txt) 是英文目录，每页一行说明；中文版是 [/llms-zh.txt](https://astryx-vue.pages.dev/llms-zh.txt)。
- [/llms-full.txt](https://astryx-vue.pages.dev/llms-full.txt) 把全部英文文档合成一个完整文件；中文版是 [/llms-full-zh.txt](https://astryx-vue.pages.dev/llms-full-zh.txt)。
- 任意页面网址后面加上 `.md` 就能直接获取这一页的原生 Markdown，例如 [/components/button.md](https://astryx-vue.pages.dev/components/button.md)。中文页面没有 `/zh` 前缀，英文页面在 `/en/` 路径下。

组件的 Markdown 把总览介绍、属性表、带演示源码的示例和无障碍检查整合在同一篇里。每个 HTML 页面都在 `<head>` 里指向自己的 Markdown 版；命令行里的组件文本提取见 [命令行](/guide/cli)。
