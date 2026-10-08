---
layout: component-docs
title: 进度条
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选择与场景匹配的颜色变体：一般进度用 accent，完成用 success，提醒用 warning 或 error。 |
| <Badge variant="error">避免</Badge> | 在进度条内放置图标或文字。应使用布局组件将它们与进度条并排组合。 |
| <Badge variant="error">避免</Badge> | 为同一操作叠放多个进度条。应使用一个进度条，并显示数值标签。 |

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
