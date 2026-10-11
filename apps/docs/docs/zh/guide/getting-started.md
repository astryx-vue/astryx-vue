---
title: 快速开始
outline: false
footer: false
---

# 快速开始

安装组件和主题：

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

在应用入口引入一次主题。Neutral 会带上 JetBrains Mono。

```ts
import '@astryx-vue/themes/neutral.css'
```

组件自己的入口会带上对应的结构样式。也可以一次引入全部结构样式：

```ts
import '@astryx-vue/core/styles.css'
```

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="开始" />
</template>
```

组件说明见 [组件](/components/)。
