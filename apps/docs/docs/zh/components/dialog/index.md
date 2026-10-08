---
layout: component-docs
title: 对话框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dialogBasic, dialogForm, dialogFullscreen, dialogImperative, dialogRequired } from '../../../../components/demos/dialog'
</script>

## 使用方法

`Dialog` 在页面内容上方呈现一个模态对话框，用来承载需要用户专注处理的任务。它基于原生 `<dialog>` 元素，会自动锁定背景、把焦点限制在对话框内，关闭后焦点还会还给打开它的元素。搭配 `DialogHeader` 使用，可以获得可聚焦的标题、可选的副标题和关闭按钮：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="分享项目" variant="secondary" @click="isOpen = true" />
  <Dialog :is-open="isOpen" @open-change="isOpen = $event">
    <DialogHeader title="分享项目" has-close-button @open-change="isOpen = $event" />
    <p>复制链接并发送给团队成员。</p>
  </Dialog>
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选择正确的用途：info 用于可关闭的内容，form 用于防止误点遮罩关闭，required 用于必须由用户作出响应的场景。 |
| <Badge variant="success">推荐</Badge> | 在头部添加清晰的标题，让用户立即了解对话框要他们做什么。 |
| <Badge variant="success">推荐</Badge> | 含有输入内容的对话框使用 purpose="form"。这样用户不会因误点遮罩而丢失数据。 |
| <Badge variant="success">推荐</Badge> | 对话框只处理单一任务。内容超出可容纳范围时，考虑改用整页。 |
| <Badge variant="error">避免</Badge> | 用对话框展示简单消息。这类消息可以内联显示，或使用 Toast 通知。 |
| <Badge variant="error">避免</Badge> | 在对话框中嵌套对话框。应把流程拆成单个对话框内的多个步骤。 |
| <Badge variant="error">避免</Badge> | 为简单确认使用 fullscreen 变体。它适用于编辑器或长表单等复杂内容。 |

## 示例

<DemoExample :demo="dialogBasic" title="基本用法" description="包含副标题与关闭按钮的标题区。对话框打开时标题获得焦点。" locale="zh" />

<DemoExample :demo="dialogForm" title="表单" description="purpose 为 form 时允许 Escape 关闭，但忽略点击遮罩，避免已输入的内容意外丢失。" locale="zh" />

<DemoExample :demo="dialogRequired" title="必须响应" description="purpose 为 required 时禁用 Escape 与点击遮罩关闭。用户必须做出选择时使用 alertdialog 语义。" locale="zh" />

<DemoExample :demo="dialogFullscreen" title="全屏" description="variant 为 fullscreen 时占满视口，适合长篇编辑任务，并尊重安全区域。" locale="zh" />

<DemoExample :demo="dialogImperative" title="命令式" description="useImperativeDialog 无需管理 isOpen 即可打开内容。在模板中渲染一次它的 Host。" locale="zh" />

## 无障碍

- 对话框通过 `showModal()` 打开，因此打开期间页面其余部分不可交互。
- 初始焦点落在第一个带有 `data-autofocus` 的元素上；没有时落在 `DialogHeader` 的标题上。
- 对话框以 `DialogHeader` 的标题命名。显式设置 `aria-label` 或 `aria-labelledby` 时会替代该名称。
- Escape 与点击遮罩会发出 `openChange(false)`，由父组件决定是否关闭。
- 关闭时，如果打开前的元素仍在页面中，焦点回到该元素。

## 限制

- Tooltip 与 Popover 会渲染到 `body`。在打开的 `Dialog` 内使用时，它们位于模态顶层之下，无法看到也无法操作。在它们获得对话框自身的层级之前，请勿嵌套在对话框中。
- 对话框不可嵌套。请把流程拆分为同一对话框内的步骤。

## 布局

标准变体通过 `width` 与 `maxHeight` 定尺寸，在窄屏上以间距令牌为边距夹取到视口内。`position` 设置静态偏移；逻辑属性 `start` 与 `end` 在 RTL 下自动镜像。
