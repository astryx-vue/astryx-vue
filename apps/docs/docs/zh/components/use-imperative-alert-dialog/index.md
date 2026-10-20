---
layout: component-docs
title: useImperativeAlertDialog
outline: false
footer: false
---

<script setup lang="ts">
import { useImperativeAlertDialogDelete } from '../../../../components/demos/use-imperative-alert-dialog'
</script>

## 使用方法

不用自己管「开没开」这个状态，就能弹出一个警示对话框。调 `alert.show(options)` 打开，调 `alert.hide()` 关掉。把 `alert.Host` 在模板里渲染一次即可。

```ts
import { useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'
```

```vue
<script setup lang="ts">
import { useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'

const alert = useImperativeAlertDialog()
const AlertHost = alert.Host

function askToDelete(): void {
  alert.show({
    title: '删除这一项？',
    description: '删除之后无法恢复。',
    actionLabel: '删除',
    onAction: () => alert.hide(),
  })
}
</script>

<template>
  <button type="button" @click="askToDelete">
    删除
  </button>
  <AlertHost />
</template>
```

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useImperativeAlertDialogDelete"
  description="删除按钮先让用户确认，确认之后才真的删。"
  locale="zh"
  title="useImperativeAlertDialog — 删除确认"
/>
