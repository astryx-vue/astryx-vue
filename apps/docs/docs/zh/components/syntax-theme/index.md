---
layout: component-docs
title: 语法主题
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { syntaxThemeDark, syntaxThemeLight } from '../../../../components/demos/syntax-theme'
</script>

## 使用方法

`SyntaxTheme` 是代码颜色的提供者。它给里面的每个 `CodeBlock` 写上 `--astryx-code-syntax-*` 和 `--astryx-code-block-background`。`useSyntaxTheme()` 读取最近的语法主题，也包括 `defineTheme({ syntax })` 带上的那份。

单个代码块可以直接传 `syntaxTheme`。一整块区域共用一套预设时，用 `SyntaxTheme` 包起来。

预设从 `@astryx-vue/core/Code` 导出：`oneDarkPro`、`dracula`、`monokai`、`nord`、`tokyoNight`、`catppuccinMocha`、`githubDark`、`githubLight`、`solarizedLight`、`oneLight`、`catppuccinLatte`、`tokyoNightLight`。`defineSyntaxTheme()` 用来做自定义主题。14 个 token 都要给。`[浅色, 深色]` 会存成 `light-dark()`。

```vue
<script setup lang="ts">
import { CodeBlock, dracula, SyntaxTheme } from '@astryx-vue/core/Code'

const code = `const status = response.ok ? 'success' : 'error'`
</script>

<template>
  <SyntaxTheme :theme="dracula">
    <CodeBlock :code="code" language="ts" />
  </SyntaxTheme>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 整个应用共用一套代码配色时，写在 <code>defineTheme()</code> 的 <code>syntax</code> 上。 |
| <Badge variant="success">推荐</Badge> | 只有某一段要换预设时，用 <code>SyntaxTheme</code>。 |
| <Badge variant="success">推荐</Badge> | 只有一个 <code>CodeBlock</code> 时，直接传 <code>syntaxTheme</code>，不必再包一层。 |
| <Badge variant="error">避免</Badge> | 用一次性 CSS 给代码块上色。预设会把 token 颜色和背景放在一起。 |

## 示例


<DemoExample
  :demo="syntaxThemeDark"
  description="用 SyntaxTheme 包住代码块，套上 Dracula 这类深色预设。"
  locale="zh"
  title="SyntaxTheme — Dark Preset"
/>

<DemoExample
  :demo="syntaxThemeLight"
  description="浅色文档上的代码示例，用 GitHub Light 这类浅色预设。"
  locale="zh"
  title="SyntaxTheme — Light Preset"
/>
