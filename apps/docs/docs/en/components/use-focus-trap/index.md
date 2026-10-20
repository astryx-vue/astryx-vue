---
layout: component-docs
title: useFocusTrap
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Traps focus within a container element following the WAI-ARIA dialog focus trap pattern. While the trap is active it listens to `keydown` on the document and wraps Tab and Shift+Tab, so focus cycles inside the container instead of leaving it. Turning the trap on also moves focus in: the element returned by `initialFocus`, or else the first focusable element. Turning it off is the whole teardown, so a dialog can toggle the state without unmounting the hook.

When the trap deactivates or unmounts, focus goes back to the element that was focused before activation. It stays put when focus was already moved elsewhere, or when focus never entered the trap — so a popup that keeps focus on its trigger, like a combobox, is left alone. Mouse clicks outside the container are not intercepted; use a light-dismiss handler for that.

```ts
import { useFocusTrap } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useFocusTrap } from '@astryx-vue/core'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const trap = useFocusTrap({
  container: containerRef,
  isActive: isOpen,
  onEscape: () => { isOpen.value = false },
})
</script>

<template>
  <div ref="containerRef" role="dialog">
    <button @click="trap.focusFirst()">
      First field
    </button>
  </div>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Call `focusFirst()` when opening a dialog/modal to move focus into the trapped region. |
| <Badge variant="success">Do</Badge> | Provide an `onEscape` callback to close the dialog when Escape is pressed. |
| <Badge variant="success">Do</Badge> | Rely on the built-in focus restoration on close; only add your own focus handling when you need to send focus somewhere other than the previously-focused element. |
| <Badge variant="error">Don't</Badge> | Use on non-modal content like tooltips or dropdowns; those need light-dismiss, not focus trapping. |
