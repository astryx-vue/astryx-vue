---
layout: component-docs
title: useTruncation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useTruncationTableCell } from '../../../../components/demos/use-truncation'
</script>

## 使用方法

量一段文字此刻有没有被截断。`Text` 和 `Heading` 的截断提示就建在它上面。自己的组件也要「文字被截断时才显示全文提示」，比如表格单元格，就直接用它：只在 `isTruncated` 为真时打开提示，提示里放 `fullText`。

```ts
import { useTruncation } from '@astryx-vue/core/Text'
```

```vue
<script setup lang="ts">
import { useTruncation } from '@astryx-vue/core/Text'
import { Tooltip } from '@astryx-vue/core/Tooltip'

defineProps<{ name: string }>()
const truncation = useTruncation(1)
</script>

<template>
  <Tooltip :content="truncation.fullText.value" :is-enabled="truncation.isTruncated.value">
    <span :ref="truncation.bind" class="cell">{{ name }}</span>
  </Tooltip>
</template>
```

全页共用一个 ResizeObserver 和一个 MutationObserver，几百个单元格也只有各一个观察者；第一次测量在浏览器排版之后进行，挂载时不额外强制排版。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 截断的样式自己加，并且和 `maxLines` 对上：一行用 `white-space: nowrap` 加省略号，多行用 `-webkit-line-clamp`，这样看到的和量的是同一个形状。 |
| <Badge variant="success">推荐</Badge> | 文字被截断、又要靠键盘看到全文时，给它加 `tabindex="0"`，提示才能在键盘聚焦时出现。 |
| <Badge variant="error">避免</Badge> | 文字完整显示时还挂着提示。没被截断时提示只会重复一遍同样的话。 |

## 示例

<DemoExample
  :demo="useTruncationTableCell"
  description="窄窄的一列路径：只有 useTruncation 报告被截断的那几格才在提示里显示完整路径，短路径没有提示。中间那格夹成两行，演示多行的情况。"
  locale="zh"
  title="useTruncation —— 被截断时才显示提示"
/>
