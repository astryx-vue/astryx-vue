---
layout: component-docs
title: useCollapsible
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCollapsibleCustom } from '../../../../components/demos/use-collapsible'
</script>

## Usage

Reusable hook that encapsulates the collapsible state machine. Supports three modes: group-controlled (inside `CollapsibleGroup`), controlled (`isOpen` + `onOpenChange`), and uncontrolled (self-managed with `defaultIsOpen`). Used internally by `Collapsible`.

```ts
import { useCollapsible } from '@astryx-vue/core/Collapsible'
```

Call it in `setup()` and read `isOpen` / `isEnabled`, or bind `isOpen` to `v-show`. The hook only owns state; the trigger markup stays yours.

```vue
<script setup lang="ts">
import { useCollapsible } from '@astryx-vue/core/Collapsible'

const { isOpen, toggle } = useCollapsible({ isCollapsible: true })
</script>

<template>
  <button type="button" :aria-expanded="isOpen" @click="toggle">
    Details
  </button>
  <div v-show="isOpen">
    Hidden while collapsed.
  </div>
</template>
```

Pass an object to `isCollapsible` for controlled state. `isOpen` is the model ref, usually `v-model:isOpen`:

```ts
const isOpen = ref<boolean | undefined>(false)
const collapsible = useCollapsible({
  isCollapsible: { isOpen, onOpenChange: (next) => { isOpen.value = next } },
})
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the hook directly when building custom collapsible components that need Astryx collapsible behavior without the `Collapsible` wrapper. |
| <Badge variant="success">Do</Badge> | For accordion behavior, wrap items in `CollapsibleGroup` and pass unique `value` props. |
| <Badge variant="error">Don't</Badge> | Pass local `isOpen`, `defaultIsOpen`, or `onOpenChange` expecting them to run for a `value`-bound group item; the group owns that state and notification path. |
| <Badge variant="error">Don't</Badge> | Implement your own open/close state when `useCollapsible` already provides it; the hook handles group coordination automatically. |

## Examples

Custom disclosure UI built directly with `useCollapsible` for headless open/close state.

<DemoExample
  :demo="useCollapsibleCustom"
  description="Custom disclosure UI built directly with useCollapsible for headless open/close state."
  locale="en"
  title="useCollapsible — Custom Disclosure"
/>
