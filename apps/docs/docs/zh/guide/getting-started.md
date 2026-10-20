---
title: 快速开始
---

# 快速开始

安装组件和主题。Peer 依赖是 Vue `^3.5.0`。

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

在应用入口引入一次主题。Neutral 会带上 Figtree 和 JetBrains Mono。

```ts
import '@astryx-vue/themes/neutral.css'
```

组件从自己的子路径引入。那个入口会带上对应的结构样式。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始" />
</template>
```

也可以一次引入全部结构样式：

```ts
import '@astryx-vue/core/styles.css'
```

下一步看 [安装](/guide/installation) 里的包入口，看 [主题与样式](/guide/styling) 里层和变量怎么接，或者直接打开 [组件](/components/)。了解设计初衷与实现思路，请参阅 [介绍](/guide/why)。

## 给 AI agent 用

每一页都另有一份纯文本，agent 不用装东西就能读：

- [/llms.txt](https://astryx-vue.pages.dev/llms.txt) 是英文目录，每页一行说明；中文版是 [/llms-zh.txt](https://astryx-vue.pages.dev/llms-zh.txt)。
- [/llms-full.txt](https://astryx-vue.pages.dev/llms-full.txt) 把全部英文文档合成一个文件；中文版是 [/llms-full-zh.txt](https://astryx-vue.pages.dev/llms-full-zh.txt)。
- 任意页面网址后面加 `.md` 就能拿到这一页的 Markdown，例如 [/components/button.md](https://astryx-vue.pages.dev/components/button.md)。中文页面没有 `/zh` 前缀，英文页面在 `/en/` 下。

组件的 Markdown 把总览、属性表、带演示源码的示例和无障碍检查合在一篇里。每个 HTML 页面都在 `<head>` 里指向自己的 Markdown 版；命令行里的组件文本见 [命令行](/guide/cli)。
