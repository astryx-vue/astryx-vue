---
layout: component-docs
title: 滑块
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sliderBasic, sliderRange, sliderMarks, sliderStates, sliderDirections, sliderForm } from '../../../../components/demos/slider'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 必须提供标签，即使将其隐藏，让屏幕阅读器用户也能理解滑块。 |
| <Badge variant="success">推荐</Badge> | 使用有意义的单位格式化数值，例如 “$50” 或 “75%”，避免只显示原始数字。 |
| <Badge variant="error">避免</Badge> | 用于精确的数值输入。应搭配文本输入框，或使用 NumberInput。 |
| <Badge variant="error">避免</Badge> | 把步长设得过大，导致只能选择少数几个位置。应改用 SegmentedControl 或单选按钮。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的滑块来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample :demo="sliderBasic" title="基本用法与格式化" description="数值可显示在提示中或控件旁边。formatValue 同时提供无障碍数值文本。" locale="zh" />

<DemoExample :demo="sliderRange" title="区间选择" description="数组的第一项表示下限，第二项表示上限。两个滑块不能交叉。" locale="zh" />

<DemoExample :demo="sliderMarks" title="刻度" description="点击刻度可选择对应值。拖动和键盘操作仍遵守 step。" locale="zh" />

<DemoExample :demo="sliderStates" title="禁用与状态消息" description="带禁用原因的滑块保留键盘焦点。状态消息显示在控件下方。" locale="zh" />

<DemoExample :demo="sliderDirections" title="垂直与从右到左" description="垂直方向从下向上增加。RTL 水平方向从右向左增加。" locale="zh" />

<DemoExample :demo="sliderForm" title="表单与操作结束事件" description="区间提交两个同名字段。changeEnd 在一次调整结束时触发。" locale="zh" />

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
