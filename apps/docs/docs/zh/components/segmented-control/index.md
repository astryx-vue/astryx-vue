---
layout: component-docs
title: 分段控件
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { segmentedControlDisabled, segmentedControlFill, segmentedControlIconOnly, segmentedControlIcons } from '../../../../components/demos/segmented-control'
</script>

## 使用方法

`SegmentedControl` 把少量互斥的选项排成一行，用户始终选中其中的一个。它看起来像标签栏，行为却是单选组：选择的结果是一个值或一种模式，而不是切换页面。因为所有选项都同时可见，用户不必先展开再比较。

```vue
<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('overview')
</script>

<template>
  <SegmentedControl v-model="view" label="Workspace view">
    <SegmentedControlItem label="Overview" value="overview" />
    <SegmentedControlItem label="Activity" value="activity" />
    <SegmentedControlItem label="Members" value="members" />
  </SegmentedControl>
</template>
```

选中项通过 `v-model` 双向绑定。控件本身渲染为一个 `role="radiogroup"` 的容器，`label` 会写进 `aria-label`，只在屏幕阅读器中起作用，页面上不会出现可见的组标题。每个 `SegmentedControlItem` 渲染成一个 `role="radio"` 的按钮，`aria-checked` 反映它是否被选中。

键盘操作遵循单选组的惯例：左右方向键在分段之间移动，`Home` 和 `End` 跳到第一个和最后一个可用分段，越界时循环；焦点移动到哪个分段，选中就跟着落到哪个分段。整个控件在同一时刻只有一个 Tab 停靠点（roving tabindex），按 Tab 会直接穿过控件而不是逐个分段停留。禁用的分段会从方向键的行走顺序和 Tab 顺序里被跳过。

`size` 提供 `sm`、`md`、`lg` 三档，默认 `md`。`layout` 默认是 `hug`，控件和每个分段都按内容取宽，并且不会超出所在容器：容器太窄时标签会以省略号截断，而不是把控件挤出边界；改成 `fill` 后，分段会平均分摊整行宽度，适合放在窄卡片里。

`isDisabled` 会禁用整个控件，此时所有分段都不能选择，控件也退出 Tab 顺序。如果还想说明禁用的原因，请使用 `disabledMessage`（而不是把控件包进 Tooltip）：禁用控件会吞掉外部 Tooltip 需要的指针事件，而 `disabledMessage` 会让控件保持可获得焦点，把原因同时呈现给鼠标和键盘用户，选择仍然被阻止。单独禁用某一个分段则用 `SegmentedControlItem` 自己的 `isDisabled`。

分段可以在标签前面放一个图标，把图标写进 `#icon` 插槽即可；图标会跟随控件的尺寸。只显示图标时设置 `isLabelHidden`，此时 `label` 会转成 `aria-label`，分段的无障碍名称不会丢失。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在 2 到 5 个互斥的视图或模式之间切换，并且希望所有选项同时可见的场合。 |
| <Badge variant="success">推荐</Badge> | 始终给出 `label`，用一句话说明这组选项在控制什么，比如「Workspace view」。屏幕阅读器用户需要它才能知道当前在选什么。 |
| <Badge variant="success">推荐</Badge> | 标签尽量短。窄容器里标签会截断，两三个词的标签在手机上也能完整读出。 |
| <Badge variant="success">推荐</Badge> | 禁用整个控件时用 `disabledMessage` 说明原因，键盘用户同样能读到这条信息。 |
| <Badge variant="error">避免</Badge> | 用它做页面级导航。那是 `TabList` 的职责：`TabList` 切换的是内容区域，`SegmentedControl` 是一个输入，任何时候都必须有一个选中项。 |
| <Badge variant="error">避免</Badge> | 用它表达简单的开与关。开关有独立状态，分段控件则强制单选，语义不同。 |
| <Badge variant="error">避免</Badge> | 把禁用的分段控件包进 `Tooltip`。禁用控件不会触发外部 Tooltip 需要的指针事件，请改用 `disabledMessage`。 |
| <Badge variant="error">避免</Badge> | 放进超过 5 个分段，也避免让标签长度差得很悬殊。选项一多，用户就要逐个读完才能比较。 |

## 示例

<DemoExample
  :demo="segmentedControlDisabled"
  description="某一项单独禁用，用来表示暂时不可用的选项。"
  locale="zh"
  title="禁用项"
/>

<DemoExample
  :demo="segmentedControlFill"
  description="各段等分并撑满可用宽度，适合固定宽度的容器。"
  locale="zh"
  title="撑满布局"
/>

<DemoExample
  :demo="segmentedControlIconOnly"
  description="隐藏标签、只显示图标的紧凑分段控制，适合空间有限的布局。"
  locale="zh"
  title="仅图标"
/>

<DemoExample
  :demo="segmentedControlIcons"
  description="图标和文字成对出现，用来切换视图模式。"
  locale="zh"
  title="带图标"
/>
