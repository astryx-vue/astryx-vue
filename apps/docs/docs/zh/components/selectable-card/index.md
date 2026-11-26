---
layout: component-docs
title: 可选卡片
outline: false
footer: false
---

<script setup lang="ts">
import { selectableCardColors, selectableCardElevated } from '../../../../components/demos/selectable-card'
</script>

## 使用方法

`SelectableCard` 是带选中状态的卡片。键盘焦点落在一个视觉上隐藏的复选框上。单张卡片用 `v-model:is-selected`。几张卡片共用一个值时，传入 `:is-selected`，再处理 `update:isSelected`。

选中后画出强调色边框和一条内描边。`elevation` 仍是阴影，描边叠在阴影上面。`variant` 会换这道强调色。

```vue
<script setup lang="ts">
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { ref } from 'vue'

const selected = ref(new Set(['pro']))

function toggle(id: string, isSelected: boolean) {
  const next = new Set(selected.value)
  if (isSelected)
    next.add(id)
  else
    next.delete(id)
  selected.value = next
}
</script>

<template>
  <SelectableCard
    :is-selected="selected.has('pro')"
    label="Pro"
    @update:is-selected="(next) => toggle('pro', next)"
  >
    Pro
  </SelectableCard>
</template>
```

`SelectableCard` 适合多选：筛选标签、功能附加项、可以同时选几个的选项网格，选中的 ID 用 `Set` 记录。不要拿它做单选组：每张卡片都是一个复选框，辅助技术会把它读成多选组，而且每张卡片各占一个 Tab 停靠点。几个里选一个，用 `RadioList`。


<ComponentAnatomy />

## 示例

<DemoExample :demo="selectableCardElevated" description="Starter 和 Pro 停在低阴影上。选中描边叠在阴影上面。" locale="zh" title="抬升" />
<DemoExample :demo="selectableCardColors" description="React、TypeScript、Node.js、Python、Rust、Go。每张卡片保留自己的颜色，可以同时选中多张。" locale="zh" title="多选" />
