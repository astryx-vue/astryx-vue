---
layout: component-docs
title: 单选指示器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { radioIndicatorStates } from '../../../../components/demos/radio-indicator'
</script>

## 使用方法

指示器是复选框、单选按钮、选择器和 Markdown 任务列表共用的选择图形。它们只负责把状态画出来。真正的控件保留输入、角色、名称、焦点和键盘。正因为拆开了，图形才可以换：先改它的类，形状不对时再按名字替换组件。

```vue
<script setup lang="ts">
import { RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <RadioIndicator state="checked" />
</template>
```

圆点两种状态都画。未选中是空心圆，所以它能替到勾的位置上。没有半选。放在没有尺寸的单选按钮里时，圆是 18px，点是 8px。单独使用时，小尺寸是 20px，中等尺寸是 24px。

方框是 [复选指示器](/components/checkbox-indicator)。想让各处的勾都变成这个圆点时，替换的是 [勾选指示器](/components/check-indicator)。

## 结构

| 元素 | 说明 |
| --- | --- |
| 外框（方框、圆点） | 必需。每种状态都画出的圆圈。勾选指示器没有自己的外框。 |
| 状态标记 | 选中后才出现的实心内点。 |

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先改稳定的类名。形状本身不对时，再替换组件。 |
| <Badge variant="success">推荐</Badge> | 用 isRenderable 判断插槽是否替换标记，不要用空值判断。插槽为空，包括条件不成立时，圆圈和内点都还在。 |
| <Badge variant="success">推荐</Badge> | 替换图形必须隐藏起来。角色和名称由外面的控件提供，再宣布一次就会读两遍。 |
| <Badge variant="success">推荐</Badge> | 替换图形里的颜色、圆角和边框宽度都用主题变量。 |
| <Badge variant="success">推荐</Badge> | 只渲染一个根元素，并保留焦点环要跟着走的圆角。真正的输入聚焦时，单选按钮把焦点环画在圆圈上。不要再自己画一圈。 |
| <Badge variant="error">避免</Badge> | 把悬停或按下当成属性传进去。悬停通过祖先上的 astryx-indicator-scope 到达圆圈。 |
| <Badge variant="error">避免</Badge> | 以为只有选中时才会挂上图形。宿主也会渲染空心圆。勾在未选中时什么都不画，圆点才能替上去。 |

## 示例

<DemoExample
  :demo="radioIndicatorStates"
  description="小尺寸和中等尺寸的空心圆与实心圆，包括禁用。未选中始终是空心圆。"
  locale="zh"
  title="状态"
/>
