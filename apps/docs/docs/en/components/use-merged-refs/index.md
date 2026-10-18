---
layout: component-docs
title: useMergedRefs
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Combines multiple object or callback refs into one stable callback ref. Use it when a component must forward a consumer ref while also attaching internal refs. Unlike writing an inline function in a `:ref` binding, the callback identity stays stable across unrelated rerenders, so Vue does not detach and reattach the element.

```ts
import { useMergedRefs } from '@astryx-vue/core'
```

Bind the returned function as the element's `:ref`. Every entry in the array receives the same value; `null` and `undefined` slots are skipped, so an optional forwarded ref can sit in the list unconditionally. Vue calls it with `null` when the element unmounts, which clears each target.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use useMergedRefs when one element must receive both a forwarded ref and one or more internal refs. |
| <Badge variant="success">Do</Badge> | Keep the call in `setup` and bind the function it returns, so the element sees the same callback on every render. |
| <Badge variant="error">Don't</Badge> | Write an inline arrow function in a `:ref` binding; that creates a new callback on every render and forces unnecessary detach and attach work. |
