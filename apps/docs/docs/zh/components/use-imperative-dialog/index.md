---
layout: component-docs
title: useImperativeDialog
outline: false
footer: false
---

<script setup lang="ts">
import {
  useImperativeDialogConfirmation,
  useImperativeDialogForm,
  useImperativeDialogRequired,
  useImperativeDialogScrollable,
} from '../../../../components/demos/use-imperative-dialog'
</script>

## 使用方法

不用自己管「开没开」这个状态，就能弹出对话框。调 `dialog.show(content, options)` 打开，调 `dialog.hide()` 关掉。把 `dialog.Host` 在模板里渲染一次即可。`content` 是个返回 VNode 的函数，所以写成 `() => h(内容组件)`。

```ts
import { useImperativeDialog } from '@astryx-vue/core/Dialog'
```

```vue
<script setup lang="ts">
import { DialogHeader, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'

const dialog = useImperativeDialog({ width: 400 })
const DialogHost = dialog.Host

function askToDelete(): void {
  dialog.show(
    () => h(DialogHeader, { title: '删除项目？', hasCloseButton: true }),
    { purpose: 'form' },
  )
}
</script>

<template>
  <button type="button" @click="askToDelete">
    删除项目
  </button>
  <DialogHost />
</template>
```

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useImperativeDialogConfirmation"
  description="做不可逆的操作前，先让用户确认。删除项目、移除成员、吊销 API key 这类事都该这么做。"
  locale="zh"
  title="Dialog — 确认"
/>

<DemoExample
  :demo="useImperativeDialogForm"
  description="不离开当前页面就收集用户输入。purpose 用 form，点遮罩不会关掉。适合改个人资料、新建条目、就地改设置。"
  locale="zh"
  title="Dialog — 表单"
/>

<DemoExample
  :demo="useImperativeDialogRequired"
  description="Escape 和点遮罩都关不掉，用户必须明确选一个动作。purpose 用 required。适合转移所有权、法律确认，以及不能跳过的关键决定。"
  locale="zh"
  title="Dialog — 必须响应"
/>

<DemoExample
  :demo="useImperativeDialogScrollable"
  description="限制对话框高度，内容超出时在框内滚动。适合条款、许可协议、更新日志，以及任何要用户读完再接受的长文。"
  locale="zh"
  title="Dialog — 可滚动"
/>
