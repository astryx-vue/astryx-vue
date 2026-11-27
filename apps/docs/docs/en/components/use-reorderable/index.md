---
layout: component-docs
title: useReorderable
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useReorderablePlaylist } from '../../../../components/demos/use-reorderable'
</script>

## Usage

`useReorderable` makes a list's rows reorderable. Call it once in `setup`, pass the result to `List`'s `reorderable`, and give each `ListItem` an `itemKey` from your data. Each row with a key then ends with a handle.

```ts
import { useReorderable } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useReorderable } from '@astryx-vue/core'
import { List, ListItem } from '@astryx-vue/core/List'
import { ref } from 'vue'

const items = ref([{ id: 'a', label: 'Inbox' }, { id: 'b', label: 'Sent' }])

const reorderable = useReorderable<string>({
  onReorder: ({ key, to }) => {
    const moved = items.value.find(item => item.id === key)!
    const next = items.value.filter(item => item.id !== key)
    next.splice(to, 0, moved)
    items.value = next
  },
})
</script>

<template>
  <List :reorderable="reorderable">
    <ListItem v-for="item in items" :key="item.id" :item-key="item.id" :label="item.label" />
  </List>
</template>
```

`onReorder` is called once per committed move with the moved row's key and its index after the move. Apply it by rendering the items in the new order. An order you keep sends the rows back to their places.

- **Finger**: hold a handle still for a moment, then drag. A flick on the handle still scrolls. The row stays in its place, dimmed, while a copy follows the finger and an accent line marks where it would land. The other rows stay still, the page scrolls near its edges, and on release the rows glide to their new places. A pen held still where the primary pointer is coarse does the same.
- **Mouse**: drag a handle once it moves 4 px. The rows take their places without motion. A cancelled drag puts everything back at once.
- **Keyboard and taps**: without a drag, the handle toggles reorder mode for its row (a click, Space or Enter). Each arrow key moves the row one place at once, and Escape or Done ends the mode, keeping the moves. A hint below the handle shows Move up, Move down and Done as buttons, so taps alone reorder too.
- **Screen readers**: each move is announced with the row's place and its neighbours once it lands. A move into a row that keeps its place is refused and announced.

A row that `isReorderable` rejects shows no handle. Rows it rejects at either end of the list also bound the others: nothing drops beyond them.

To start reorder mode from your own UI, such as a Move item in a row's menu, call `reorderable.start(key)`. The focus moves to that row's handle. A key that cannot move or is not mounted does nothing and warns in development.

`options` may be a ref or a getter: each move reads its latest value, so a new `onReorder` needs no new object. Outside a component, use `createReorderable(options)`, which takes the same plain options and returns the same object.

The reorder code ships with this function: a list without `reorderable` loads none of it.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give each row a stable key from your data, a string or a number (<code>:item-key="item.id"</code>), and apply each move at once. |
| <Badge variant="success">Do</Badge> | Use <code>isReorderable</code> for rows that must stay put, such as a pinned first row. |
| <Badge variant="success">Do</Badge> | Offer reorder mode from your own UI too, such as a row's menu, with <code>reorderable.start(item.id)</code>. |
| <Badge variant="error">Don't</Badge> | Use list indexes as keys: a move changes every index after it. |

## Examples

<DemoExample
  :demo="useReorderablePlaylist"
  description="Drag a handle, or press it and use the arrow keys. Intro is pinned: it has no handle, and nothing moves above it."
  locale="en"
  title="useReorderable — playlist"
/>
