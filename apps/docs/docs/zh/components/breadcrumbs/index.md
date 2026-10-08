---
layout: component-docs
title: 面包屑
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { breadcrumbsBasic, breadcrumbsSupporting } from '../../../../components/demos/breadcrumbs'
</script>

## 使用方法

从独立入口导入 `Breadcrumbs` 与 `BreadcrumbItem`。

```vue
<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      首页
    </BreadcrumbItem>
    <BreadcrumbItem href="/components">
      组件
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      面包屑
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 使用语义化 `<nav>` 与 `<ol>` 结构，便于屏幕阅读器识别路径。 |
| <Badge variant="success">推荐</Badge> | 对当前页使用 `is-current` 并渲染为 `<span>`，自动添加 `aria-current="page"`。 |
| <Badge variant="success">推荐</Badge> | 为分隔符设置 `aria-hidden="true"`，避免辅助技术重复朗读。 |
| <Badge variant="error">避免</Badge> | 在面包屑中使用过长的标签，导致小屏换行后难以阅读。 |
| <Badge variant="error">避免</Badge> | 把当前页做成可点击链接，这会使用户迷失在循环导航中。 |

## 示例

<DemoExample
  :demo="breadcrumbsBasic"
  description="标准的面包屑路径，使用默认文本尺寸。"
  locale="zh"
  title="基础用法"
/>

<DemoExample
  :demo="breadcrumbsSupporting"
  description="supporting 变体使用更小的辅助文本尺寸，适合紧凑场景。"
  locale="zh"
  title="辅助变体"
/>
