---
layout: component-docs
title: useTableRowStatus
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowStatusMarkers } from '../../../../components/demos/use-table-row-status'
</script>

## 使用方法

返回一个 `TablePlugin`，在表格最前面加一列窄列，用来标示每一行的状态。语义状态返回 `{status, label}`，只接受 success、warning、error 三个值：图标和色调由当前主题决定。自定义标记返回 `{color, icon?, label}`：`color` 只决定颜色，不给 `icon` 就画一个固定的 8px 圆点，给了 `icon` 就画你指定的那个图标。图标名仍然沿用 Icon 的颜色映射；用原始 CSS 颜色的自定义图标，完全按你给的颜色画。`label` 是必填的：它既做无障碍名称，也做悬浮提示；返回 `null` 表示这一行不放标记。列表头视觉上是空的，但对读屏软件有一个本地化的名字。`getStatus` 里如果要读响应式状态，把它放进 getter 里；插件每次渲染都会调用它。

```ts
import { useTableRowStatus } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableRowStatusMarkers"
  description="行首的标记可以是主题里的语义图标（成功、警告、错误），也可以是一个自定义颜色的小圆点。label 既是无障碍名称，也是悬浮提示。"
  locale="zh"
  title="useTableRowStatus —— 行状态"
/>
