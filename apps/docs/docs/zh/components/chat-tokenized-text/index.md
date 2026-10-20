---
layout: component-docs
title: 对话标记文本
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatTokenizedTextBasic, chatTokenizedTextColors } from '../../../../components/demos/chat-tokenized-text'
</script>

## 使用方法

存下来的纯文本里如果带着「标记的值」，用 `ChatTokenizedText` 就能在消息里把它们显示成行内徽章，或者显示成你自己画的内容。没匹配上的文字原样保留；标记的值是空字符串时不参与匹配，所以渲染总能收尾。

文字写在默认插槽里。要直接传一个字符串时，用 `text` 属性也一样；两个都写以属性为准。每个标记的 `value` 按字面匹配，所以输入框触发器返回的那组标记对象可以原样搬过来复用。普通标记渲染成 `Badge`；带 `render` 函数的标记渲染成你自己的内容，那部分由你负责。

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatTokenizedText } from '@astryx-vue/core/Chat'

const tokens = [
  { value: '@Cindy', label: '@Cindy', variant: 'blue' as const },
]
</script>

<template>
  <ChatMessage sender="user">
    <ChatMessageBubble>
      <ChatTokenizedText :tokens="tokens">
        Assign @Cindy as a reviewer.
      </ChatTokenizedText>
    </ChatMessageBubble>
  </ChatMessage>
</template>
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 输入框插入和消息渲染用同一份标记定义，存下来的值和看到的文字才不会对不上。 |
| <Badge variant="success">推荐</Badge> | 标记的值要非空、要稳定，这样每个定义都对得上真实存在的文字。 |
| <Badge variant="error">避免</Badge> | 用标记上的文字替代周围的正文。整句话按顺序读下来必须是通的。 |
| <Badge variant="error">避免</Badge> | 自定义标记里塞交互或无障碍行为。那部分内容归调用方自己管。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatTokenizedTextBasic" title="基础" description="一句话里带 @ 提及标记。匹配到的部分换成对应的名字徽章。" locale="zh" />

<DemoExample :demo="chatTokenizedTextColors" title="颜色" description="不同颜色的标记，用来区分人、缺陷和需求。蓝色给人，红色给缺陷，绿色给需求，一眼就能分出类别。" locale="zh" />
