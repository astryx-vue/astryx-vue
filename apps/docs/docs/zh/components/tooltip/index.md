---
layout: component-docs
title: 提示框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tooltipActionBar, tooltipHook, tooltipInline } from '../../../../components/demos/tooltip'
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

<DemoExample :demo="tooltipActionBar" title="操作条" description="Save、Cancel、Delete 三个按钮，提示都出现在按钮上方。" locale="zh" />

<DemoExample :demo="tooltipHook" title="钩子" description="按钮文案是 Using hook directly，提示是 Tooltip via hook。" locale="zh" />

<DemoExample :demo="tooltipInline" title="行内文字" description="句子里的 privacy policy 和 terms of service 各自带一条提示。" locale="zh" />

## 无障碍

提示框的气泡是一个独立的浮层，组件用 ARIA 属性把它和触发元素关联起来，屏幕阅读器既能知道触发元素多了一段补充说明，也能在气泡出现时读出里面的文字：

- 气泡带有 `role="tooltip"`，辅助技术据此把它识别为提示。
- 触发元素带有 `aria-describedby`，指向气泡的 `id`。

提示只在鼠标悬停或键盘聚焦时出现。在显示状态下按 Escape 可以关闭非受控提示框；受控提示框此时会发出 `openChange(false)`，是否关闭由父组件决定。

也正因为提示转瞬即隐，用户很容易错过，触摸设备上也未必能触发，所以不要把用户完成任务必须看到的关键信息只放在提示框里。
