---
layout: component-docs
title: useTypeahead
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Adds APG type-to-focus search to a collection: printable keystrokes are buffered (resetting after a pause), and the first item whose label starts with the buffer is reported through `onMatch`. Pressing the same letter repeatedly cycles through the matches rather than filtering deeper. It moves nothing itself; pair it with the collection's own focus management, most often `useListFocus` or `useGridRovingFocus`.

`onKeyDown` takes a native `KeyboardEvent` and returns `true` when it consumed a printable character, so let it look at the event first and fall through to arrow-key navigation only when it returns `false`. Space counts as part of the query only when something is already typed, so Space still activates the focused item. `reset()` clears a pending buffer, for example when the collection closes.

```ts
import { useTypeahead } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useTypeahead } from '@astryx-vue/core'
import { ref } from 'vue'

const items = ['Apple', 'Banana', 'Cherry']
const activeIndex = ref(-1)

const { onKeyDown } = useTypeahead({
  getItemLabels: () => items,
  getCurrentIndex: () => activeIndex.value,
  onMatch: (index) => {
    activeIndex.value = index
  },
})

function handleArrows(event: KeyboardEvent): void {
  const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  if (step === 0)
    return
  event.preventDefault()
  activeIndex.value = (activeIndex.value + step + items.length) % items.length
}
</script>

<template>
  <ul role="listbox" tabindex="0" @keydown="(event) => { if (!onKeyDown(event)) handleArrows(event) }">
    <li
      v-for="(item, index) in items"
      :key="item"
      role="option"
      :aria-selected="index === activeIndex"
      tabindex="-1"
    >
      {{ item }}
    </li>
  </ul>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Wire `onMatch` to the focus manager you already have (`useListFocus().focusItem`) instead of moving focus yourself. |
| <Badge variant="success">Do</Badge> | Let it see the key event first and fall through to arrow-key navigation only when it returns `false`. |
| <Badge variant="success">Do</Badge> | Pass `getCurrentIndex` so repeated presses of one letter walk through matches instead of sticking on the first. |
| <Badge variant="error">Don't</Badge> | Use it on a text input; the field already receives the characters, and typeahead would fight the value. |
