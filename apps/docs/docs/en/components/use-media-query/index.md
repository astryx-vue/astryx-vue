---
layout: component-docs
title: useMediaQuery
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useMediaQueryAdaptive } from '../../../../components/demos/use-media-query'
</script>

## Usage

SSR-safe media query hook that subscribes to `window.matchMedia` changes. Returns whether the given media query matches. The first value is read during setup whenever `matchMedia` exists, so a layout decision does not have to wait for mount; on the server the ref starts as `false`. Changes are followed while the component is alive, and the listener is removed on unmount.

The query argument is a plain string, read once per call. To follow a query that itself changes, call the hook again from wherever that value comes from.

```ts
import { useMediaQuery } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for responsive layout switching based on viewport width, color scheme, or motion preferences. |
| <Badge variant="success">Do</Badge> | Prefer Astryx responsive tokens and component props over manual breakpoint logic when possible. |
| <Badge variant="error">Don't</Badge> | Use for server-rendered content that must match on first paint; on the server the hook always returns false. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useMediaQueryAdaptive"
  description="The media query is product policy and the presentation stays a deterministic override on top of it: the hook only answers whether the touch-oriented range matches."
  locale="en"
  title="useMediaQuery — Adaptive presentation"
/>
