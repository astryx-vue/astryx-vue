---
layout: component-docs
title: useClipboard
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Copy-to-clipboard behavior: the clipboard write, a transient `isCopied` flag with its own reset timer, and an optional polite screen-reader announcement. Extracted so every copy affordance is a thin control over one implementation instead of re-deriving the timer and announcement. Rapid re-copies restart the reset timer so the confirmation always lasts the full duration, and the timer is cleaned up when the effect scope is disposed. `CodeBlock` builds its built-in copy button on it; reach for it directly when building a copy affordance that is not a plain icon button (a menu item, a labeled text button, a copy-on-click value chip).

```ts
import { useClipboard } from '@astryx-vue/core'
```

The same function is also exported as `useCopyToClipboard`, from `@astryx-vue/core` and from `@astryx-vue/core/Code`. `isCopied` is a `ref`, so the template unwraps it.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Drive the copied confirmation (copy → check icon, label swap) off the returned `isCopied` ref rather than tracking your own state. |
| <Badge variant="success">Do</Badge> | Pass a localized `announce` message so the copy is spoken by screen readers; swapping the button `aria-label` alone is not reliably announced. |
| <Badge variant="success">Do</Badge> | For the common compact icon copy button, render a ghost `IconButton` with a "Copy" tooltip and wire `@click` to `copy()`; the tooltip stays "Copy" and the icon flip is the confirmation. |
| <Badge variant="error">Don't</Badge> | Track a separate `copied` ref alongside the hook; `isCopied` already reflects the copied window and resets itself. |
