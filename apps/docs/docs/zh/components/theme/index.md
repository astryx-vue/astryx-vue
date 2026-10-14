---
layout: component-docs
title: 主题
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { themeApply, themeNested, themeSwitcher } from '../../../../components/demos/theme'
</script>

## 使用方法

`Theme` 本身就是主题提供者。它把 `defineTheme()` 返回的主题写到子树的 CSS 变量上，子组件用 `useTheme()` 读取。没有另外一个 Provider 组件。

token 名可以用原版的 `--color-accent`，也可以用这个包的 `--astryx-color-accent`。`[浅色, 深色]` 会写成 `light-dark()`。`mode` 默认是 `system`，也可以是 `light` 或 `dark`。最外层的 `Theme` 会把 `data-astryx-theme` 和 `data-astryx-color-mode` 同步到 `document.documentElement`，嵌套的不会。

主题对象上的 `syntax` 给这棵子树里的代码上色。更近的 `SyntaxTheme` 优先。从 `@astryx-vue/core/Theme` 引入。

```vue
<script setup lang="ts">
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const ocean = defineTheme({
  name: 'ocean',
  tokens: {
    '--color-accent': ['#0077B6', '#48CAE4'],
    '--color-background-surface': ['#F0F8FF', '#0A1628'],
    '--color-text-primary': ['#0A1317', '#FFFFFF'],
    '--radius-container': '16px',
  },
})
</script>

<template>
  <Theme :theme="ocean">
    <p>Ocean</p>
  </Theme>
</template>
```

`neutralTheme` 是不覆盖 token 的主题。颜色仍然来自 `@astryx-vue/themes/neutral.css`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | token 名带上 `--`，例如 `--color-accent` 或 `--astryx-color-accent`。 |
| <Badge variant="success">推荐</Badge> | 明暗两套颜色不同时，写成 `[浅色, 深色]`。 |
| <Badge variant="success">推荐</Badge> | 某一块区域要换一套主题时，再嵌一层 `Theme`。 |
| <Badge variant="error">避免</Badge> | 用 `Theme` 去翻转一张图片上的文字。那是 `MediaTheme` 的事。 |

## 示例


<DemoExample
  :demo="themeApply"
  description="用 Theme 包住一块子树，这块区域里的组件都改用这套主题。"
  locale="zh"
  title="Theme — Apply Theme"
/>

<DemoExample
  :demo="themeNested"
  description="嵌套的 Theme 只改里面那一块，外面的主题保持不变。"
  locale="zh"
  title="Theme — Nested Theme"
/>

<DemoExample
  :demo="themeSwitcher"
  description="用状态切换传给 Theme 的主题对象，下面的外观跟着换。"
  locale="zh"
  title="Theme — Switch Themes"
/>
