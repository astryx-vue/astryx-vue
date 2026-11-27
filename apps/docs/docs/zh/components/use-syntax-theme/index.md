---
layout: component-docs
title: useSyntaxTheme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useSyntaxThemeKeywordColor } from '../../../../components/demos/use-syntax-theme'
</script>

## 使用方法

给 canvas、SVG 这类用不了 `SyntaxTheme` 所设 CSS 变量的绘制读代码高亮的颜色。在 `SyntaxTheme` 里调用，或者在 `defineTheme({ syntax })` 设了语法主题的 `Theme` 里调用。两者都没有时返回 `null`，调用方可以跳过绘制。

```ts
import { useSyntaxTheme } from '@astryx-vue/core/Code'
```

```ts
const syntax = useSyntaxTheme()

const keyword = syntax?.token('keyword')
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把绘制放在给周围代码上色的同一个 `SyntaxTheme` 下面。 |
| <Badge variant="success">推荐</Badge> | 读 `token` 之前先判断是不是 `null`。上面没有语法主题时 hook 返回 `null`。 |
| <Badge variant="error">避免</Badge> | 把语法颜色手抄进 canvas。它们会和当前的语法主题慢慢对不上。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useSyntaxThemeKeywordColor"
  description="用 useSyntaxTheme 读最近一层 SyntaxTheme 的关键字颜色，给用不了 CSS 变量的绘制用。"
  locale="zh"
  title="useSyntaxTheme — 关键字颜色"
/>
