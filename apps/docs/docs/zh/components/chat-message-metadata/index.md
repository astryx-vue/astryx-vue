---
layout: component-docs
title: 对话消息元信息
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatMessageMetadataFooterActions, chatMessageMetadataStatus, chatMessageMetadataTimestamps } from '../../../../components/demos/chat-message-metadata'
</script>

## 使用方法

`ChatMessageMetadata` 放在消息下面，或者放进最后一条气泡的元信息插槽，用来显示时间、页脚内容和送达状态。这三样都是可选的。传空字符串这种「什么都不渲染」的值，不会多出一个分隔点；插槽里传数字 0 会照常显示。页脚里放什么由调用方决定，组件不接管。

`timestamp`、`footer`、`status` 三样都没有时，整行什么都不渲染。中间的小圆点只挨着真正有内容的那一段出现，所以两段是「2:30 PM · 已读」，三段是「2:30 PM · GPT-4o · 已读」。

```vue
<script setup lang="ts">
import { ChatMessageMetadata } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageMetadata status="read" timestamp="2:30 PM" />
</template>
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 消息用了气泡时，元信息放进最后一条气泡的元信息插槽，它就会跟气泡内容走。 |
| <Badge variant="success">推荐</Badge> | 时间和页脚分开传。值是「什么都不渲染」的类型时，分隔点会跟着省掉。插槽内容原样使用，组件不改。 |
| <Badge variant="error">避免</Badge> | 页脚里放按钮，却不给可读名字和交互行为。这些控件不归元信息这一行管。 |
| <Badge variant="error">避免</Badge> | 同一份元信息既放在气泡上，又放在外层消息上。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatMessageMetadataFooterActions" title="页脚操作" description="助手消息的页脚放一排操作：复制、重试、点赞、点踩，再加模型名。适合需要反馈或小工具的 AI 回复。" locale="zh" />

<DemoExample :demo="chatMessageMetadataStatus" title="送达状态" description="五种送达状态全放一遍（发送中、已发送、已送达、已读、失败），每条都带时间。用来显示投递进度，或者把失败摆出来。" locale="zh" />

<DemoExample :demo="chatMessageMetadataTimestamps" title="时间" description="用户和助手消息都只显示时间。可以是绝对时间，也可以是「5 个月前」这种相对说法。" locale="zh" />
