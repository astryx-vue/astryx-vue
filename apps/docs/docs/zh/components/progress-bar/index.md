---
layout: component-docs
title: 进度条
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { progressBarCustomFormat, progressBarIndeterminate, progressBarMarks, progressBarSemantic, progressBarValueLabel } from '../../../../components/demos/progress-bar'
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

<DemoExample :demo="progressBarCustomFormat" title="自定义格式" description="formatValueLabel 用当前值和最大值生成文案，例如磁盘占用的 GB 数。" locale="zh" />

<DemoExample :demo="progressBarIndeterminate" title="不确定进度" description="isIndeterminate 用于还不知道要多久的操作。" locale="zh" />

<DemoExample :demo="progressBarSemantic" title="语义颜色" description="accent、success、warning、error、neutral 叠在一起，方便对照状态颜色。" locale="zh" />

<DemoExample :demo="progressBarValueLabel" title="数值标签" description="hasValueLabel 在标签旁显示当前百分比。" locale="zh" />

<DemoExample :demo="progressBarMarks" title="刻度" description="刻度用和进度条同一把尺子。落在填充里的用填充上的颜色，还在轨道上的用文字色。悬停或聚焦时读出名称。" locale="zh" />

## 无障碍

进度条没有可以聚焦的元素，屏幕阅读器用户只能靠组件暴露的 ARIA 属性了解当前进度。因此组件在轨道上设置了 `role="progressbar"`，并由它负责补全进度数值和名称，让辅助技术能够如实播报：

- 进度范围由 `aria-valuemin` 和 `aria-valuemax` 描述，组件会依据 `min` 和 `max` 自动设置。
- 当前进度由 `aria-valuenow` 描述，同样由组件自动设置。
- 传入 `label` 时，标签通过 `aria-labelledby` 关联到轨道。
- 传入 `description` 时，说明文字通过 `aria-describedby` 关联到轨道。

`isIndeterminate` 为真时进度未知，组件会移除 `aria-valuenow`，此时屏幕阅读器只播报这是一个进度条，不再给出具体数值。
