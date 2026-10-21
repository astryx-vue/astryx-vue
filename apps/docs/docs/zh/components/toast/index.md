---
layout: component-docs
title: 轻提示
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toastAction, toastDedup, toastDismiss, toastStacking, toastTypes } from '../../../../components/demos/toast'
</script>

## 使用方法

`Toast` 是一种不打断操作的轻量反馈，用来确认操作结果或提示状态变化，数秒后自动消失。使用时，在应用根节点放置一次 `ToastViewport`，然后在任意组件中调用 `useToast` 弹出提示。

在触摸屏上，朝提示所在的那条边滑动可以关掉它：贴在屏幕下方的向下滑，贴在上方的向上滑。横向滑动留给页面滚动。滑在按钮或链接上时不关，那一下属于控件自己。鼠标拖动不会关掉提示。

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


<ComponentAnatomy />

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
  :demo="toastAction"
  description="常驻通知的末尾可以放按钮或链接，用来撤销删除，或者打开报告。"
  locale="zh"
  title="操作"
/>

<DemoExample
  :demo="toastDedup"
  description="uniqueID 把重复通知收成一条。ignore 保留第一条，overwrite 用新内容替换，适合进度百分比。"
  locale="zh"
  title="去重"
/>

<DemoExample
  :demo="toastDismiss"
  description="useToast 返回的函数可以关掉那一条通知，适合耗时操作自己收尾。"
  locale="zh"
  title="关闭"
/>

<DemoExample
  :demo="toastStacking"
  description="通知纵向叠放，进入和离开都有动画。再点一次会再排上一条。"
  locale="zh"
  title="堆叠"
/>

<DemoExample
  :demo="toastTypes"
  description="信息与错误并排。信息会自己消失，错误一直留到被关掉。"
  locale="zh"
  title="类型"
/>
