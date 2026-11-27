---
layout: component-docs
title: 开关
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { switchDescription, switchDisabled, switchSettings, switchStatus } from '../../../../components/demos/switch'
</script>

## 使用方法

`Switch` 用于切换单个布尔状态。

在触屏上，它的手感和 iOS 的开关一样：按下时圆钮微微鼓起、带一层淡淡的阴影；横着拖动，圆钮跟着手指走，拖过大半条轨道就翻到另一边，松手才算数。轻点照常切换，按住不动或短距离拖动在松手时切换；竖着拖是滚动页面，开关会放手。用鼠标或触控笔也能拖动切换，规则相同，外观保持桌面样式；按着拖出开关再松开，开关不会变。粗指针下点击区域会悄悄放大到接近 44 × 44 px。开启“减少动态效果”后，触屏上改成淡入淡出，鼠标下直接切换。

```vue
<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const enabled = shallowRef(false)
</script>

<template>
  <Switch v-model="enabled" label="Notifications" />
</template>
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用于立即生效的设置。切换后应直接生效，无需单独的保存操作。 |
| <Badge variant="success">推荐</Badge> | 搭配清晰、简洁的标签，说明所控制的设置。 |
| <Badge variant="error">避免</Badge> | 需要提交表单才能生效的选项使用开关。应改用复选框。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的开关来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample
  :demo="switchDisabled"
  description="禁用的开关带上标签和说明，用来表示还没开放的功能。"
  locale="zh"
  title="禁用"
/>

<DemoExample
  :demo="switchSettings"
  description="几项设置放在同一张卡片里，每一项是一个开关。"
  locale="zh"
  title="设置面板"
/>

<DemoExample
  :demo="switchDescription"
  description="标签下面再写一行说明，交代打开之后会发生什么。"
  locale="zh"
  title="带说明"
/>

<DemoExample
  :demo="switchStatus"
  description="error、warning、success 三种校验结果，写在开关下面。"
  locale="zh"
  title="校验状态"
/>

## 键盘操作

开关在底层是一个原生复选框，键盘行为沿用浏览器自带的规则，用户不用鼠标也能完成切换。焦点落在开关上之后，可以使用以下按键：

- 按 Tab 把焦点移到开关上。
- 按 Space 切换选中状态。
- 按 Escape 关闭禁用原因提示。

「禁用原因提示」只在开关被禁用、并且传入了 `disabledMessage` 时才会出现，所以 Escape 也只在那种情况下有效。

## 使用建议

开关适合「改完立即生效」的二元选项，例如打开或关闭通知。如果一个选项要等提交表单才算确认，就应该改用复选框，否则用户会误以为开关已经保存了这次修改。

`isRequired` 只负责显示必填提示并设置 `aria-required`，不执行校验，也不会阻止表单提交。
