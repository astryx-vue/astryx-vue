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

## Usage

Smooths bursty streamed text into a steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on grapheme boundaries, so a slice never cuts a surrogate pair, a flag, or a joined emoji in half. Animation timing comes from the `--astryx-duration-fast-min` motion token, with a fallback outside a theme provider. Snaps to full text when `isStreaming` becomes false, and stays on the full text while the reader prefers reduced motion.

Pass the accumulated text, not individual chunks; the hook handles the incremental reveal itself. `displayedText` is a `ComputedRef<string>`, so render it straight away.

```ts
import { useStreamingText } from '@astryx-vue/core'
import { ref } from 'vue'

const targetText = ref('')
const isStreaming = ref(true)
const displayedText = useStreamingText(targetText, isStreaming, { speed: 'natural' })
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass the accumulated text (not individual chunks) as `targetText`; the hook handles incremental reveal internally. |
| <Badge variant="success">Do</Badge> | Set `isStreaming` to false when the stream completes to snap to the final text. |
| <Badge variant="success">Do</Badge> | Use `speed="instant"` for non-animated contexts like search results or when reduced motion is preferred. |
| <Badge variant="error">Don't</Badge> | Use for static text that does not change; the hook adds unnecessary overhead for non-streaming content. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useStreamingTextResponse"
  description="Smooth bursty generated text into a steady reveal with useStreamingText."
  locale="en"
  title="useStreamingText — Streaming Response"
/>
