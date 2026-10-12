---
title: 快速开始
---

# 快速开始

安装组件和主题。Peer 依赖是 Vue `^3.5.0`。

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

在应用入口引入一次主题。Neutral 会带上 JetBrains Mono。

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

Figtree 写在正文字体栈的第一位，但主题包不加载它。要使用这个字体，在应用里自己引入。不引入时会落到后面的系统无衬线字体。

下一步看 [安装](/guide/installation) 里的包入口，看 [主题与样式](/guide/styling) 里层和变量怎么接，或者直接打开 [组件](/components/)。项目为什么这样做，写在 [为什么](/guide/why)。
