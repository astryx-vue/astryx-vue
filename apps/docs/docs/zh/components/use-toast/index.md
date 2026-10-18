---
layout: component-docs
title: useToast
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useToastShow } from '../../../../components/demos/use-toast'
</script>

## 使用方法

在组件树的任何位置弹出轻提示。返回一个函数，传入提示配置就会弹出来。提示数据放在模块级的 store 里，所以这个 hook 在任何组件里都能用；再渲染一次 `ToastViewport` 给它们一个出现的位置。`LayerProvider` 只负责给视口定位置和可见条数。

```ts
import { useToast } from '@astryx-vue/core/Toast'
```

```vue
<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <button type="button" @click="toast({ body: '文档已保存', type: 'success' })">
    弹出提示
  </button>
  <ToastViewport />
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在不需要用户操作的短暂反馈上，例如成功和失败提示。 |
| <Badge variant="success">推荐</Badge> | 用户连点会重复弹的时候，用 `uniqueID` 去重。 |
| <Badge variant="success">推荐</Badge> | 在应用根部渲染一次 `ToastViewport`，让所有提示都有地方出现。 |
| <Badge variant="error">避免</Badge> | 需要用户确认的严重错误别用它；用 `AlertDialog`。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useToastShow"
  description="用 useToast 主动弹出轻提示，由 toast 视口负责渲染。"
  locale="zh"
  title="useToast — 弹出提示"
/>
