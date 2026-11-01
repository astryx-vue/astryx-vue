---
layout: lab-docs
title: CircularProgress
---

# CircularProgress

用圆环表示确定或不确定的进度。

<script setup lang="ts">
import { labCircularProgress } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCircularProgress" description="分别展示带数值的确定进度、成功态大圆环和不确定进度。" locale="zh" title="确定与不确定进度" /></ClientOnly>

## 导入

```ts
import { CircularProgress } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `undefined` | 当前进度；不确定模式下忽略。 |
| `max` | `number` | `100` | 最大进度。 |
| `label` | `string` | 必填 | 无障碍名称。 |
| `isLabelHidden` | `boolean` | `true` | 是否视觉隐藏标签，读屏仍可读取。 |
| `hasValueLabel` | `boolean` | `false` | 是否在圆环中央显示数值。 |
| `formatValueLabel` | `(value, max) => string` | 百分比 | 自定义中央数值格式。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 圆环尺寸。 |
| `variant` | `'accent' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'accent'` | 语义颜色。 |
| `isIndeterminate` | `boolean` | `false` | 是否显示不确定进度动画。 |
| `isDisabled` | `boolean` | `false` | 是否使用禁用颜色。 |

默认插槽可替换圆环中央内容。启用 `isIndeterminate` 后，`value` 和 `hasValueLabel` 不再生效。
