---
layout: component-docs
title: 提示框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tooltipBasic, tooltipControlled, tooltipPlacements, tooltipText } from '../../../../components/demos/tooltip'
</script>

## 使用方法

`Tooltip` 为触发元素补充一段简短的说明文字，在鼠标悬停或键盘聚焦时出现在它旁边，适合解释图标按钮的含义、补充字段的格式要求这类轻量场景；触发元素自身的行为不受影响。最简单的用法是用 `content` 传入提示文字，并把触发元素放进默认插槽：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Tooltip content="保存你的更改">
    <Button label="保存" />
  </Tooltip>
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 保持提示框内容简洁，纯文本建议少于 140 个字符。 |
| <Badge variant="success">推荐</Badge> | 为没有可见标签的纯图标按钮和控件添加提示框。 |
| <Badge variant="error">避免</Badge> | 在提示框中放置链接或按钮这类可交互元素。应改用 HoverCard 或 Popover。 |
| <Badge variant="error">避免</Badge> | 用提示框展示用户完成任务必须看到的关键信息。 |

## 示例

<DemoExample :demo="tooltipBasic" title="基本用法" description="悬停或聚焦按钮，短暂延迟后显示提示。" locale="zh" />

<DemoExample :demo="tooltipPlacements" title="位置" description="placement 设置提示相对触发元素的方向。空间不足时自动翻转到另一侧。" locale="zh" />

<DemoExample :demo="tooltipText" title="文字触发" description="纯文字触发元素会变为可聚焦，并显示虚线下划线。" locale="zh" />

<DemoExample :demo="tooltipControlled" title="受控" description="传入 isOpen 控制显示。按下 Escape 会发出 openChange(false)，由父组件决定是否关闭。" locale="zh" />

## 无障碍

- 气泡带有 `role="tooltip"`。
- 触发元素带有指向气泡的 `aria-describedby`。
- 非受控提示框可以通过 Escape 关闭。
- 只有悬停和聚焦会触发提示。关键信息避免只放在提示框中。
