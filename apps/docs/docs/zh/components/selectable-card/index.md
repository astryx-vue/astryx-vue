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

const selected = ref('pro')
</script>

<template>
  <SelectableCard
    :is-selected="selected === 'pro'"
    label="Pro"
    @update:is-selected="(next) => { if (next) selected = 'pro' }"
  >
    Pro
  </SelectableCard>
</template>
```


<ComponentAnatomy />

## 示例

<DemoExample :demo="selectableCardElevated" description="Starter 和 Pro 停在低阴影上。选中描边叠在阴影上面。" locale="zh" title="抬升" />
<DemoExample :demo="selectableCardColors" description="React、TypeScript、Node.js、Python、Rust、Go。每张卡片保留自己的颜色，可以同时选中多张。" locale="zh" title="多选" />
