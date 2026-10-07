---
layout: component-docs
title: 进度条
outline: false
footer: false
---

<script setup lang="ts">
import { progressBarBasic, progressBarIndeterminate, progressBarSizes, progressBarVariants } from '../../../../components/demos/progress-bar'
</script>

## 使用方法

`ProgressBar` 展示某项操作的完成比例。

```vue
<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <ProgressBar :value="60" label="Upload" show-value />
</template>
```

## 示例

<DemoExample :demo="progressBarBasic" title="基本用法" description="使用 value 和 max 控制完成比例。show-value 显示百分比。" locale="zh" />

<DemoExample :demo="progressBarSizes" title="尺寸" description="提供 sm、md、lg 三种轨道高度。" locale="zh" />

<DemoExample :demo="progressBarVariants" title="颜色变体" description="根据状态使用不同颜色。" locale="zh" />

<DemoExample :demo="progressBarIndeterminate" title="不确定状态" description="isIndeterminate 用于未知进度的加载场景。" locale="zh" />

## 无障碍

- 轨道使用 `role="progressbar"`。
- 自动设置 `aria-valuemin`、`aria-valuemax`、`aria-valuenow`。
- 提供 `label` 时，通过 `aria-labelledby` 关联标签。
- 提供 `description` 时，通过 `aria-describedby` 关联说明。
- `isIndeterminate` 时移除 `aria-valuenow`。
