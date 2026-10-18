---
layout: component-docs
title: 对话输入抽屉
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatComposerDrawerAttachments, chatComposerDrawerCollapsible, chatComposerDrawerFeedback, chatComposerDrawerWithProgress } from '../../../../components/demos/chat-composer-drawer'
</script>

## 使用方法

`ChatComposerDrawer` 放在 `ChatComposer` 的 `drawer` 插槽里，用来装附件、上下文标签、预览这类补充内容。只有当你希望用户能把这部分收起来时，才传 `count`。

```ts
import { ChatComposerDrawer } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `label` 用一个具体的复数名词，例如 “Attachments”，这样“展开”“收起”读出来才有意义。 |
| <Badge variant="success">推荐</Badge> | 抽屉的开关状态归页面别处管时，用 `v-model:is-collapsed` 配合 `collapsedChange`；否则用 `defaultIsCollapsed`。 |
| <Badge variant="error">避免</Badge> | 把输入区的主要操作放进抽屉。这类控件要用 `ChatComposer` 的 `footerActions` 或 `sendActions`，抽屉收起来时它们还在。 |

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatComposerDrawerAttachments"
  description="抽屉里有两行：一行是可以横向滚动的图片缩略图，一行是可以逐个删掉的文件标签。不传 count，抽屉就一直展开。"
  locale="zh"
  title="ChatComposerDrawer — 附件"
/>

<DemoExample
  :demo="chatComposerDrawerCollapsible"
  description="条目很多、带收起开关的抽屉。传了 count 才有这个开关；收起来以后显示一个带总数的徽标和一行文字。"
  locale="zh"
  title="ChatComposerDrawer — 可收起"
/>

<DemoExample
  :demo="chatComposerDrawerFeedback"
  description="抽屉里放一个确认提问和几个带字母的可选项。用户必须先明确选一个才能继续时用它。"
  locale="zh"
  title="ChatComposerDrawer — 确认反馈"
/>

<DemoExample
  :demo="chatComposerDrawerWithProgress"
  description="抽屉配一条放在页眉的上下文进度条。附件吃掉了一部分可用字数时，用它把用量显示出来。"
  locale="zh"
  title="ChatComposerDrawer — 带进度"
/>
