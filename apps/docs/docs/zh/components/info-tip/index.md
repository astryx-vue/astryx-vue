---
layout: component-docs
title: 信息提示
outline: false
footer: false
---

## 使用方法

`InfoTip` 是一个小「i」按钮，悬停或键盘聚焦时预览帮助文字。适合放在标签、数值和指标旁边。

```vue
<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
</script>

<template>
  <InfoTip content="近 30 天滚动平均值。" label="关于这个指标" />
</template>
```

## 无障碍

按钮的名称来自 `label`（默认 “More information”），并通过 `aria-describedby` 关联提示气泡。
