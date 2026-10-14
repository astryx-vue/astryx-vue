---
layout: component-docs
title: 复选指示器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxIndicatorLoading, checkboxIndicatorSizes, checkboxIndicatorStates } from '../../../../components/demos/checkbox-indicator'
</script>

## 使用方法

指示器是复选框、单选按钮、选择器和 Markdown 任务列表共用的选择图形。它们只负责把状态画出来。真正的控件保留输入、角色、名称、焦点和键盘。正因为拆开了，图形才可以换：先改它的类，形状不对时再按名字替换组件。

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <CheckboxIndicator state="indeterminate" size="sm" />
</template>
```

方框每种状态都画。未选中是空盒子，不是留白。半选画一条短线。

需要用户操作时，使用 [复选框](/components/checkbox-input)。勾和圆点分别是 [勾选指示器](/components/check-indicator) 和 [单选指示器](/components/radio-indicator)。

## 结构

| 元素 | 说明 |
| --- | --- |
| 外框（方框、圆点） | 必需。复选和单选指示器在每种状态都画出的盒子或圆圈。勾选指示器自己就是状态标记，没有外框。 |
| 状态标记 | 当前状态下外框里的勾、半选短线或圆点。 |

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先改稳定的类名。形状本身不对时，再替换组件。 |
| <Badge variant="success">推荐</Badge> | 用 isRenderable 判断插槽是否替换标记，不要用空值判断。它只排除空值、布尔值和空字符串。元素算数，哪怕里面后来是空的。宿主用 v-if="busy" 放转圈。条件为假时，空值判断会把状态标记删掉。 |
| <Badge variant="success">推荐</Badge> | 替换图形必须隐藏起来。角色和名称由外面的控件提供，再宣布一次就会读两遍。 |
| <Badge variant="success">推荐</Badge> | 替换图形里的颜色、圆角和边框宽度都用主题变量。 |
| <Badge variant="success">推荐</Badge> | 只渲染一个根元素，并保留焦点环要跟着走的圆角。真正的输入被藏起来时，控件把焦点环画在指示器上。环不会丢，只是根元素没有圆角时形状会不对。不要再自己画一圈。 |
| <Badge variant="error">避免</Badge> | 把悬停或按下当成属性传进去。悬停通过祖先上的 astryx-indicator-scope 到达图形，移到行上就会变色。 |
| <Badge variant="error">避免</Badge> | 以为只有选中时才会挂上图形。宿主每种状态都会渲染，并传入状态。替换图形才能在默认什么都不画的地方画出来，比如未选中行上的空心圆。某种状态不画，是指示器自己的决定。 |

## 示例

<DemoExample
  :demo="checkboxIndicatorSizes"
  description="方框的小尺寸和中等尺寸，包括未选、选中、半选和禁用。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="checkboxIndicatorStates"
  description="按钮在方框、勾和圆点之间切换状态。勾和圆点共用单选的两种状态。"
  locale="zh"
  title="切换状态"
/>

<DemoExample
  :demo="checkboxIndicatorLoading"
  description="默认插槽里的转圈会换掉标记。关掉之后方框回到勾，未选中的勾不再占位。"
  locale="zh"
  title="加载中替换标记"
/>
