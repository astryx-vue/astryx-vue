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

`Spinner` 本身没有可见文字，加载状态要依靠 ARIA 属性才能被辅助技术理解。这些属性都由组件自动设置，通常不需要你手动维护，下面说明组件实际用到的属性和它们各自的作用。

- 根元素带有 `role="status"`，辅助技术会把这块区域当作状态提示来处理。
- 传入字符串类型的 `label` 时，它会显示为加载态下方的可见文字，并通过 `aria-labelledby` 成为无障碍名称。
- 不传 `label` 时，无障碍名称默认为 `Loading`；这时传入 `aria-label` 就可以改成更贴合场景的说法。
- 圆环带有 `aria-hidden`，自身不含任何文字，因此它不会被单独读出。
- 开启「减少动态效果」时，圆弧放慢为 3 秒一圈。
