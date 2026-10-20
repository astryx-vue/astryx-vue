---
layout: component-docs
title: useTheme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useThemeTokenValues } from '../../../../components/demos/use-theme'
</script>

## 使用方法

用代码拿主题 token 的值。给不吃 CSS 的地方用：SVG、canvas、Vega、D3、地图、图表库，它们要的是 JavaScript 里的具体值，而不是一个 CSS 变量名。

```ts
import { useTheme } from '@astryx-vue/core/Theme'
```

```ts
const { mode, token, tokens } = useTheme()

const accent = token('--color-accent')
const categorical = tokens.value['--color-data-categorical-blue']
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在 Vue 组件里往 SVG 属性、canvas 绘制、图表配置这类非 CSS 的对象里填颜色时，用 `tokens` 或 `token(name)`。 |
| <Badge variant="success">推荐</Badge> | 普通组件样式优先用 CSS 变量；只有 JavaScript 真需要具体值时才用这个 hook。 |
| <Badge variant="success">推荐</Badge> | 图表系列色用 `--color-data-categorical-blue` 这类数据可视化 token，不要随手挑一个界面颜色。 |
| <Badge variant="error">避免</Badge> | 在数据可视化里把浅色和深色写死：应该从当前主题解析出来。 |
| <Badge variant="error">避免</Badge> | 以为这个 hook 能反映所有 CSS 层叠覆盖。它只按当前 `Theme` 的模式解析；局部的媒体表面覆盖、以及外来的任意 CSS，不一定能体现出来。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useThemeTokenValues"
  description="用 useTheme 读出解析后的 token 值，给 SVG 图表这类不吃 CSS 的地方用。"
  locale="zh"
  title="useTheme — 读取 token 值"
/>
