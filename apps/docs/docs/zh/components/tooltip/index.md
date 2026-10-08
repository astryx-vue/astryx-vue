---
layout: component-docs
title: 提示框
outline: false
footer: false
---

<script setup lang="ts">
import { tooltipBasic, tooltipControlled, tooltipPlacements, tooltipText } from '../../../../components/demos/tooltip'
</script>

## 使用方法

`Tooltip` 在鼠标悬停或键盘聚焦时，在触发元素旁边显示简短提示。触发元素保留自身的行为。

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

## 示例

<DemoExample :demo="tooltipBasic" title="基本用法" description="悬停或聚焦按钮，短暂延迟后显示提示。" locale="zh" />

<DemoExample :demo="tooltipPlacements" title="位置" description="placement 设置提示相对触发元素的方向。空间不足时自动翻转到另一侧。" locale="zh" />

<DemoExample :demo="tooltipText" title="文字触发" description="纯文字触发元素会变为可聚焦，并显示虚线下划线。" locale="zh" />

<DemoExample :demo="tooltipControlled" title="受控" description="传入 isOpen 控制显示。按下 Escape 会发出 openChange(false)，由父组件决定是否关闭。" locale="zh" />

## 无障碍

- 气泡带有 `role="tooltip"`。
- 触发元素带有指向气泡的 `aria-describedby`。
- 非受控提示框可以通过 Escape 关闭。
- 只有悬停和聚焦会触发提示。关键信息不要只放在提示框中。
