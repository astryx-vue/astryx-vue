---
layout: component-docs
title: useClickableContainer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useClickableContainerProjectCard } from '../../../../components/demos/use-clickable-container'
</script>

## Usage

Makes a container element clickable while preserving nested interactive element behavior. Solves the "nested interactive elements" problem: when a card is clickable but contains buttons/links, clicking those should NOT trigger the card's action. Detects interactive ancestors between the click target and the container, and ignores text selections. Supports href navigation (including middle-click and Ctrl/Cmd+click for new tabs).

```ts
import { useClickableContainer } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useClickableContainer } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const cardRef = useTemplateRef<HTMLElement>('card')
const { onClick, onMouseUp } = useClickableContainer({
  containerRef: cardRef,
  href: '/reports/quarterly',
})
</script>

<template>
  <div ref="card" v-bind="{ onClick, onMouseUp }">
    <button type="button">
      Download
    </button>
  </div>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Attach both `onClick` and `onMouseUp` to the container element (`@click` and `@mouseup`) for full click handling including middle-click. |
| <Badge variant="success">Do</Badge> | Use inside `ClickableCard` or `SelectableCard` for the standard card interaction pattern. |
| <Badge variant="error">Don't</Badge> | Use when the entire container is a single interactive element; just use a `<button>` or `<a>` directly. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useClickableContainerProjectCard"
  description="A project card that useClickableContainer makes clickable anywhere: a click on the card follows its title link, while the Star button, the owner link and a text selection keep their own behavior, and Ctrl/Cmd+click or middle-click opens the project in a new tab."
  locale="en"
  title="useClickableContainer — Clickable Project Card"
/>
