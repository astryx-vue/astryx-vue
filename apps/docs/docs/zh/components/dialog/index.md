---
layout: component-docs
title: 对话框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dialogAdaptive, dialogConfirmation, dialogForm, dialogFullscreen, dialogRequired, dialogScrollable } from '../../../../components/demos/dialog'
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

<DemoExample :demo="dialogAdaptive" title="自适应呈现" description="默认仍是对话框。触屏且宽度不超过 lg 时，同一份资料表单改为底部弹层。" locale="zh" />

<DemoExample :demo="dialogConfirmation" title="确认" description="破坏性操作前先确认。页面上的预览一直留着，点按钮才会打开真正的对话框。" locale="zh" />

<DemoExample :demo="dialogForm" title="表单" description="不离开当前页面就能改名字和简介。purpose 为 form 时保留 Escape，并忽略点击遮罩。" locale="zh" />

<DemoExample :demo="dialogFullscreen" title="全屏" description="variant 为 fullscreen 时占满视口，适合文档这类长内容。" locale="zh" />

<DemoExample :demo="dialogScrollable" title="可滚动" description="maxHeight 把对话框压短，条款在内部滚动。" locale="zh" />

<DemoExample :demo="dialogRequired" title="必须响应" description="purpose 为 required 时，Escape 和遮罩都不能关掉。用户必须选择取消或转让。" locale="zh" />

## 无障碍

`Dialog` 基于原生 `<dialog>` 元素构建，模态行为、焦点限制和关闭后的焦点归还都由浏览器提供，因此不需要额外配置就能获得正确的无障碍表现。

对话框通过 `showModal()` 打开，打开期间页面其余部分不可交互。打开后，初始焦点落在第一个带有 `data-autofocus` 的元素上；如果没有元素带这个属性，焦点落在 `DialogHeader` 的标题上。

对话框的名称默认取自 `DialogHeader` 的标题，组件会把标题与对话框通过 `aria-labelledby` 关联起来。如果显式设置了 `aria-label` 或 `aria-labelledby`，则以你提供的名称为准。

Escape 与点击遮罩不会直接关闭对话框，它们只发出 `openChange(false)`，由父组件决定是否关闭。关闭后，如果打开对话框之前的那个元素仍在页面中，焦点会回到它身上。

## 限制

下面两点决定了你能在对话框里放什么内容，在组合 Tooltip、Popover 或多步流程之前需要先了解。

- Tooltip 与 Popover 会渲染到 `body`。在打开的 `Dialog` 内使用时，它们位于模态顶层之下，因此既看不到也无法操作；在它们获得对话框自身的层级之前，请不要把它们嵌套进对话框。
- 对话框不可嵌套。需要多步流程时，请把流程拆分为同一个对话框内的步骤。

## 布局

标准变体通过 `width` 与 `maxHeight` 定尺寸，在窄屏上以间距令牌为边距夹取到视口内。`position` 设置静态偏移；逻辑属性 `start` 与 `end` 在 RTL 下自动镜像。
