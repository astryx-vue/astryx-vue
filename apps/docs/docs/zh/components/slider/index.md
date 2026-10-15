---
layout: component-docs
title: 滑块
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sliderFormatted, sliderRange, sliderMarks, sliderStatus } from '../../../../components/demos/slider'
</script>

## 使用方法

`Slider` 用于选择单个数值或数值区间。

```vue
<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const volume = shallowRef(50)
const budget = shallowRef<[number, number]>([20, 80])
</script>

<template>
  <Slider v-model="volume" label="Volume" />
  <Slider v-model="budget" label="Budget" value-display="text" />
</template>
```

主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 必须提供标签，即使将其隐藏，让屏幕阅读器用户也能理解滑块。 |
| <Badge variant="success">推荐</Badge> | 使用有意义的单位格式化数值，例如 “$50” 或 “75%”，避免只显示原始数字。 |
| <Badge variant="error">避免</Badge> | 用于精确的数值输入。应搭配文本输入框，或使用 NumberInput。 |
| <Badge variant="error">避免</Badge> | 把步长设得过大，导致只能选择少数几个位置。应改用 SegmentedControl 或单选按钮。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的滑块来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample
  :demo="sliderFormatted"
  description="温度以华氏度显示在滑块旁边。"
  locale="zh"
  title="格式化数值"
/>

<DemoExample
  :demo="sliderRange"
  description="价格区间，上下两个滑块各管一端。"
  locale="zh"
  title="范围"
/>

<DemoExample
  :demo="sliderMarks"
  description="音量在 0、25、50、75 和 100 处有刻度。"
  locale="zh"
  title="刻度"
/>

<DemoExample
  :demo="sliderStatus"
  description="CPU、内存和磁盘上的错误、警告和成功。"
  locale="zh"
  title="校验状态"
/>

## 键盘操作

滑块完全可以用键盘操作，不必依赖拖动。焦点落到滑块上之后，下面的按键会调整它的数值：

- Tab 依次把焦点移到每个滑块上。
- 左右方向键沿水平方向移动一步；在从右到左的布局里方向相反。
- 上下方向键增加或减少一步。
- PageUp / PageDown 增加或减少十步。
- Home / End 移动到允许的最小值或最大值。
- Escape 关闭数值提示或禁用原因提示。

区间模式下，每个滑块有独立名称，名称分别来自 `minLabel` 和 `maxLabel`，辅助技术据此分辨当前调整的是下限还是上限。每个滑块的 ARIA 边界也会随另一个滑块的值更新，所以读出的可调范围始终和实际可选取的值一致。

## 使用建议

滑块适合在连续区间里挑选数值，不适合要求精确输入的场景。使用时注意以下几点：

- 需要精确输入时，另提供数值输入控件。
- `isRequired` 只提供必填说明，让使用辅助技术的用户知道这个字段是必填的。
- 业务层负责校验允许的数值范围。
