---
layout: component-docs
title: 加载态
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { spinnerBasic, spinnerLabel, spinnerShades, spinnerSizes } from '../../../../components/demos/spinner'
</script>

## 使用方法

`Spinner` 用于在耗时未知的过程中给出加载反馈，例如获取数据或提交表单，避免用户误以为页面没有响应。从独立入口导入后直接使用：

```vue
<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <Spinner label="加载数据" />
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 通过 `label` 说明正在加载的内容，屏幕阅读器用户才能理解当前发生了什么。 |
| <Badge variant="success">推荐</Badge> | 在深色或强调色背景上使用时选择 `onMedia` 色调，保证圆环清晰可见。 |
| <Badge variant="error">避免</Badge> | 在尺寸已知的内容区域只放 `Spinner`，它会撑开并挤压布局；改用 `Skeleton` 占位可以保持页面稳定。 |
| <Badge variant="error">避免</Badge> | 在同一视图中堆叠多个 `Spinner`，会让加载状态显得混乱；用一个 `Spinner` 表示整体加载即可。 |

## 示例

<DemoExample :demo="spinnerBasic" title="基本用法" description="默认的加载态，使用强调色和 md 尺寸，适合大多数常规场景。" locale="zh" />

<DemoExample :demo="spinnerSizes" title="尺寸" description="尺寸可选 sm、md、lg、xl，环的直径依次为 10px、14px、18px、28px，按场景空间的大小选择即可。" locale="zh" />

<DemoExample :demo="spinnerShades" title="色调" description="default 和 subtle 适合浅色背景，onMedia 适合深色或强调色背景，inherit 直接继承周围文字颜色，嵌入文本段落时很方便。" locale="zh" />

<DemoExample :demo="spinnerLabel" title="文字标签" description="设置 label 后，加载态下方会显示可见文字，同时作为屏幕阅读器播报的无障碍名称。" locale="zh" />

## 无障碍

- 根元素带有 `role="status"`。
- 字符串类型的 `label` 通过 `aria-labelledby` 提供无障碍名称。
- 未提供 `label` 时，默认名称为 `Loading`。设置 `aria-label` 可以修改。
- 圆环带有 `aria-hidden`，不包含任何文字。
- 开启减少动态效果时，圆弧放慢为 3 秒一圈。
