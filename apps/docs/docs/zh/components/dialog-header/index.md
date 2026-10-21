---
layout: component-docs
title: 对话框页眉
outline: false
footer: false
---

<script setup lang="ts">
import { dialogHeaderBasic } from '../../../../components/demos/dialog-header'
import { DialogHeader } from '@astryx-vue/core/Dialog'
</script>

## 使用方法

`DialogHeader` 给对话框提供一块带标签的标题区，以及可选的关闭按钮。它从父级 `Dialog` 读取上下文：标题会成为对话框的无障碍名称，对话框打开时焦点也落在标题上。

标题是必填的。副标题为空字符串时不渲染。传入 `hasCloseButton` 才会出现关闭按钮，点击时发出 `openChange(false)`，由父组件决定是否真的关闭。

```vue
<script setup lang="ts">
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Dialog :is-open="isOpen" @open-change="isOpen = $event">
    <DialogHeader
      title="编辑资料"
      subtitle="更新你的个人信息"
      has-close-button
      @open-change="isOpen = $event"
    />
    <p>对话框正文。</p>
  </Dialog>
</template>
```

单独使用 `DialogHeader` 时没有父级上下文，标题不会关联到任何对话框，关闭按钮也不会获得默认聚焦行为。它应当始终放在 `Dialog` 的默认插槽里。

<ComponentAnatomy />

## 示例

<DemoExample :demo="dialogHeaderBasic" title="基础" description="标题、副标题和关闭按钮放在 Dialog 的默认插槽里。传入 hasCloseButton 才会渲染关闭按钮。" locale="zh" />

## 无障碍

标题通过 `role="heading"` 和 `aria-level="2"` 暴露给辅助技术，同时用 `aria-labelledby` 与父级对话框关联，所以屏幕阅读器读到的对话框名称就是标题文字。

对话框打开时，标题带 `tabindex="-1"` 并接收初始焦点。这让键盘用户一进入对话框就听到名称，而不是从正文中间开始。

关闭按钮是 `IconButton`。没写 `closeButtonLabel` 时，无障碍名称跟界面语言走：英文 Close，中文「关闭」。

标题和副标题都可以用插槽放行内内容，例如一段强调或一个链接。副标题是空字符串、又没有插槽时，那一行不渲染。

换肤挂点是 `dialog-header`、`dialog-header-start-content`、`dialog-header-title-block`、`dialog-header-end-content`、`dialog-header-close-icon`，分别落在标题行、前置槽、标题块、后置槽和关闭图标上。有关闭按钮时，后置槽默认把上下和行末各收进一档间距，用来抵消按钮自己的内边距。`endContentEdgeCompensation` 可以只收行末（`inline`）、只收上下（`block`），或两边都收（`all`）。
