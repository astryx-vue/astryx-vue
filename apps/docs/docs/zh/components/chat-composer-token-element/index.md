---
layout: component-docs
title: 对话标签元素
outline: false
footer: false
---

<script setup lang="ts">
import { chatComposerTokenElementBadge, chatComposerTokenElementCustom } from '../../../../components/demos/chat-composer-token-element'
</script>

## 使用方法

在可以编辑的输入区之外，单独画出一个小标签。它把「徽标配置」或者「自己渲染的内容」包进一个带 `data-astryx-token` 的 `span` 里，这样标签的值能被正确序列化，长得也跟输入区里面的标签一模一样。

```ts
import { ChatComposerTokenElement } from '@astryx-vue/core/Chat'
```

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatComposerTokenElementBadge"
  description="放在编辑器外面的徽标标签。每一个都保留着提交时会序列化出来的值，所以从草稿里复制出来的标签、和别处画出来的标签，读起来是同一个东西。"
  locale="zh"
  title="ChatComposerTokenElement — 徽标标签"
/>

<DemoExample
  :demo="chatComposerTokenElementCustom"
  description="需要自己的结构时，用自定义渲染。提交进草稿的仍然是它的值。"
  locale="zh"
  title="ChatComposerTokenElement — 自定义标签"
/>
