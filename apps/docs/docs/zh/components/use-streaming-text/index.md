---
layout: component-docs
title: useStreamingText
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useStreamingTextResponse } from '../../../../components/demos/use-streaming-text'
</script>

## 使用方法

把一坨一坨到达的文字抹平成稳定的逐字显示，用 requestAnimationFrame 推进。到达的速度和显示的速度互不影响。每次推进会退回到字素边界，所以不会把代理对、旗帜或拼在一起的 emoji 切成两半。节奏取自 `--astryx-duration-fast-min` 这个动效 token，不在主题里时用兜底值。`isStreaming` 变成 false 时直接跳到全文；用户偏好减少动态效果时也一直是全文。

传累积后的整段文字，不要传一块一块的分片，增量显示它自己会处理。`displayedText` 是 `ComputedRef<string>`，直接拿去渲染就行。

```ts
import { useStreamingText } from '@astryx-vue/core'
import { ref } from 'vue'

const targetText = ref('')
const isStreaming = ref(true)
const displayedText = useStreamingText(targetText, isStreaming, { speed: 'natural' })
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | `targetText` 传累积后的整段文字，不要传一块一块的分片；增量显示它自己会处理。 |
| <Badge variant="success">Do</Badge> | 流结束的时候把 `isStreaming` 设成 false，直接跳到最终文字。 |
| <Badge variant="success">Do</Badge> | 不需要动画的场合用 `speed="instant"`，比如搜索结果，或者用户偏好减少动态效果。 |
| <Badge variant="error">Don't</Badge> | 用在不会变的静态文字上；它本来就不流式，白搭一层开销。 |

## 示例

常见的用法和不同的状态。

<DemoExample
  :demo="useStreamingTextResponse"
  description="用 useStreamingText 把一阵一阵到达的生成文字抹平成稳定显示。"
  locale="zh"
  title="useStreamingText — 流式回复"
/>
