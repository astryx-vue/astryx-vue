---
layout: component-docs
title: 分隔线
outline: false
footer: false
---

<script setup lang="ts">
import { dividerBasic, dividerLabel, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
</script>

## 使用方法

`Divider` 用细线分隔不同的内容组。可以在线条中间放置文字。

```vue
<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
</script>

<template>
  <Divider label="或" />
</template>
```

## 示例

<DemoExample :demo="dividerBasic" title="基本用法" description="水平分隔线占满可用宽度。" locale="zh" />

<DemoExample :demo="dividerLabel" title="文字标签" description="文字位于线条中间，使用辅助文字样式。" locale="zh" />

<DemoExample :demo="dividerVariants" title="变体" description="subtle 为默认强度。strong 使用强调边框色。" locale="zh" />

<DemoExample :demo="dividerVertical" title="垂直" description="在固定高度的行内设置 orientation 为 vertical。" locale="zh" />

## 无障碍

- 根元素带有 `role="separator"` 和 `aria-orientation`。
- 提供 `label` 时，文字通过 `aria-labelledby` 成为无障碍名称。
- 设置 `aria-label` 可以用其他文字为分隔线命名。
