---
layout: component-docs
title: 轻提示
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toastBasic, toastStack } from '../../../../components/demos/toast'
</script>

## 使用方法

`Toast` 是一种不打断操作的轻量反馈，用来确认操作结果或提示状态变化，数秒后自动消失。使用时，在应用根节点放置一次 `ToastViewport`，然后在任意组件中调用 `useToast` 弹出提示：

```vue
<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

toast({ body: '操作成功', type: 'success' })
</script>

<template>
  <div>
    <button @click="toast({ body: '已保存' })">
      保存
    </button>
    <ToastViewport />
  </div>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 将 `ToastViewport` 放在应用顶层，确保提示能覆盖所有页面，位置与堆叠顺序也保持一致。 |
| <Badge variant="success">推荐</Badge> | 错误信息使用 `type="error"`，组件会自动应用 `role="alert"`，让屏幕阅读器优先播报。 |
| <Badge variant="success">推荐</Badge> | 保持提示文本简洁，一行说明操作结果即可，用户通常只会扫一眼。 |
| <Badge variant="error">避免</Badge> | 避免同时弹出大量提示：信息过载会让用户忽略真正重要的内容，必要时合并为一条。 |
| <Badge variant="error">避免</Badge> | 避免用 Toast 替代需要用户确认的对话框：提示会自动消失，用户可能来不及做出响应。 |

## 示例

<DemoExample
  :demo="toastBasic"
  description="点击按钮即可触发轻提示，示例中展示了不同的 type 和 duration 组合。"
  locale="zh"
  title="基础用法"
/>

<DemoExample
  :demo="toastStack"
  description="多条轻提示会在视口中依次堆叠，并保持出现的先后顺序。"
  locale="zh"
  title="堆叠"
/>
