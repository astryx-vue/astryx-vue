---
layout: component-docs
title: 指示器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { indicatorLoading, indicatorReplace, indicatorStates } from '../../../../components/demos/indicator'
</script>

## 使用方法

勾、方框和圆点只负责画出选择状态。真正能点、能聚焦的控件仍保留输入、角色、名称和键盘。复选框、单选按钮、选择器，以及 Markdown 里的任务列表，都从同一套图形里取标记。换一次，用到的地方一起变。

三种图形分工不同。勾只在选中时出现，没选中的行不留空盒子。方框始终在，半选时画一条短线。圆点两种状态都画，没选中是空心圆，所以它能替到勾的位置上。

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
import { CheckIndicator, RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <CheckIndicator state="checked" />
  <CheckboxIndicator state="indeterminate" size="sm" />
  <RadioIndicator state="unchecked" />
</template>
```

方框仍从原来的路径引入。勾和圆点从指示器入口引入。

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

要整组换成别的图形，在主题里按名字替换。下面把勾换成圆点之后，选择器里的单选标记会变成圆点，没选中的行也会画出空心圆。调用处不用逐个改插槽。

```vue
<script setup lang="ts">
import { RadioIndicator } from '@astryx-vue/core/Indicator'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
</script>

<template>
  <Theme :theme="defineTheme({ name: 'radio-marks', indicators: { check: RadioIndicator } })">
    <slot />
  </Theme>
</template>
```

三个核心名字是勾、方框和圆点，分别对应 check、checkbox、radio。读取当前图形用 useIndicator。核心名字一定能拿到组件。自己扩充的名字，只有最近的主题提供了组件才有。

悬停不要靠属性传下去。把作用域类写在真正的控件上，方框和圆点会跟着变深一点。图形自己没有悬停属性。

加载中的转圈放进默认插槽。插槽里没有可渲染的内容时，原来的标记还在。条件不成立时，不会把已选中的勾删掉。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 换整组图形时写在主题的指示器表里，让选择器、复选框和任务列表一起变。 |
| <Badge variant="success">推荐</Badge> | 加载中的转圈放进默认插槽，并用条件控制它是否出现。 |
| <Badge variant="success">推荐</Badge> | 自己的图形继续用主题里的颜色、圆角和边框变量，不要写死十六进制颜色。 |
| <Badge variant="error">避免</Badge> | 在每个调用点传不同的插槽来换图形。换一次就漏一处。 |
| <Badge variant="error">避免</Badge> | 给图形加角色、焦点或键盘。这些属于外面的控件。 |
| <Badge variant="error">避免</Badge> | 用空值判断来决定要不要画标记。条件为假时会把已选中的勾删掉。 |

## 示例

<DemoExample
  :demo="indicatorStates"
  description="点按钮在三种方框状态和两种单选状态之间切换。勾和圆点共用后一个状态。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="indicatorReplace"
  description="同一行标记，左边是默认的勾，右边包在主题里之后变成圆点。没选中的勾不占位，圆点则会画出空心圆。"
  locale="zh"
  title="按名字替换"
/>

<DemoExample
  :demo="indicatorLoading"
  description="转圈放在默认插槽里。关掉之后，方框回到勾，未选中的勾不再占位。"
  locale="zh"
  title="加载中替换标记"
/>

## 无障碍

- 三个图形的根上都是隐藏的，不向辅助技术宣布自己。
- 组件不设置交互角色，也不提供点击或键盘行为。
- 传入的角色、Tab 顺序、可编辑属性和以 aria 开头的属性会被丢掉，留在外面的控件上。
- 模板引用的元素在勾被画出来或被插槽占住时才有，未选中且没有插槽时为空。
