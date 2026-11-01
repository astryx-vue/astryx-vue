---
layout: lab-docs
title: Stat
---

# Stat

用于展示关键指标、趋势变化和补充说明。

<script setup lang="ts">
import { labStat } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labStat" description="指标包含名称、主数值、上升趋势和比较周期。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { Stat } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | 必填 | 指标名称。 |
| `value` | `string` | `undefined` | 预先格式化好的主数值；默认插槽优先。 |
| `delta` | `StatDelta` | `undefined` | 趋势变化，包含 `value`、`direction` 和可选的 `sentiment`。 |
| `description` | `string` | `undefined` | 主数值下方的补充说明。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 主数值的字号。 |

`direction` 可取 `'up' | 'down' | 'flat'`。默认颜色依次为成功、错误、次要文字；可用 `sentiment: 'positive' | 'negative' | 'neutral'` 覆盖，适合“下降是好事”的指标。

## 插槽

| 名称 | 说明 |
| --- | --- |
| 默认插槽 | 自定义主数值内容。 |
| `media` | 在指标内容下方放置图表或其他媒体。 |
