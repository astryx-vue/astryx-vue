---
layout: component-docs
title: 勾选指示器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkIndicatorLoading, checkIndicatorReplace, checkIndicatorStates } from '../../../../components/demos/check-indicator'
</script>

## 使用方法

指示器是复选框、单选按钮、选择器和 Markdown 任务列表共用的选择图形。它们只负责把状态画出来。真正的控件保留输入、角色、名称、焦点和键盘。正因为拆开了，图形才可以换：先改它的类，形状不对时再按名字替换组件。

```vue
<script setup lang="ts">
import { CheckIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <CheckIndicator state="checked" />
</template>
```

这是选中项上的标记。未选中、插槽里又没有内容时，它什么都不渲染，列表不会在每一行旁边留一个空盒子。它没有自己的外框，本身就是那枚图形，所以宿主传入的类会落在图标同一个元素上。

想让所有单选标记都变成圆点时，把这个名字映射到 [单选指示器](/components/radio-indicator)。没选中的行也会画出空心圆。方框是 [复选指示器](/components/checkbox-indicator)。

## 结构

| 元素 | 说明 |
| --- | --- |
| 外框（方框、圆点） | 方框和圆点必需，它们每种状态都画。勾选指示器自己就是状态标记，没有外框。 |
| 状态标记 | 选中时画出的勾。未选中时，除非插槽里有可渲染的内容，否则什么都不画。 |

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先改稳定的类名。形状本身不对时，再替换组件。 |
| <Badge variant="success">推荐</Badge> | 用 isRenderable 判断插槽是否替换标记，不要用空值判断。它只排除空值、布尔值和空字符串。元素算数，哪怕里面后来是空的。宿主用 v-if="busy" 放转圈。条件为假时，空值判断会把已选中的勾删掉。 |
| <Badge variant="success">推荐</Badge> | 替换图形必须隐藏起来。角色和名称由外面的控件提供，再宣布一次就会读两遍。 |
| <Badge variant="success">推荐</Badge> | 替换图形里的颜色、圆角和边框宽度都用主题变量。 |
| <Badge variant="success">推荐</Badge> | 只渲染一个根元素，并保留焦点环要跟着走的圆角。真正的输入被藏起来时，控件把焦点环画在指示器上。不要再自己画一圈。 |
| <Badge variant="error">避免</Badge> | 把悬停或按下当成属性传进去。悬停通过祖先上的 astryx-indicator-scope 到达图形。 |
| <Badge variant="error">避免</Badge> | 以为只有选中时才会挂上图形。宿主每种状态都会渲染，并传入状态。替换图形才能在未选中的行上画出空心圆。 |

## 示例

<DemoExample
  :demo="checkIndicatorStates"
  description="未选中不留盒子。选中时两种尺寸都画这枚图形。禁用时用禁用色。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="checkIndicatorReplace"
  description="同一行标记。左边是默认的勾。右边包在主题里之后变成圆点，没选中也会画出空心圆。"
  locale="zh"
  title="按名字替换"
/>

<DemoExample
  :demo="checkIndicatorLoading"
  description="插槽里的转圈会占住勾的位置，选中与否都一样。关掉之后，未选中的行不再占位。"
  locale="zh"
  title="加载中替换标记"
/>
