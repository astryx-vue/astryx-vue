---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Imperatively announces a message to screen readers through a visually-hidden live region. Use it for state that is only conveyed visually; search result counts, "no results", loading and saved confirmations, validation errors (WCAG 4.1.3 Status Messages). The polite and assertive regions are created empty on first use and stay mounted, which is what makes announcements reliable: most screen readers ignore a live region that is inserted together with its content. Each message is cleared a couple of seconds after it is announced so stale status does not linger in the accessibility tree.

```ts
import { useAnnounce } from '@astryx-vue/core'
```

```ts
const announce = useAnnounce()

announce('12 results')
announce('The file could not be saved.', 'assertive')
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reach for this instead of hand-rolling an `aria-live` div; a region rendered with its content usually does not announce at all. |
| <Badge variant="success">Do</Badge> | Keep `"polite"` for status and result counts; reserve `"assertive"` for errors and time-sensitive alerts, since it interrupts whatever the screen reader is saying. |
| <Badge variant="success">Do</Badge> | Announce the outcome, not the interaction; `"12 results"` rather than `"search ran"`. |
| <Badge variant="error">Don't</Badge> | Announce content that is already visible and correctly labeled in the DOM; that doubles up for screen reader users. |
