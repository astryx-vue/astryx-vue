---
layout: component-docs
title: createSwipe
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { createSwipeMail } from '../../../../components/demos/create-swipe'
</script>

## Usage

`createSwipe` gives a list row the actions a sideways swipe uncovers, the way a mail row reveals Archive and Delete on a phone. Pass its value as `swipe` on `ListItem` or `Item`.

```ts
import { createSwipe } from '@astryx-vue/core/Swipe'
```

```vue
<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
import { createSwipe } from '@astryx-vue/core/Swipe'

const mailSwipe = createSwipe({
  trailing: [
    { id: 'archive', label: 'Archive', onActivate: ({ itemKey }) => archive(itemKey) },
    { id: 'delete', label: 'Delete', onActivate: ({ itemKey }) => remove(itemKey), variant: 'destructive', hasRemoval: true },
  ],
})
</script>

<template>
  <List>
    <ListItem v-for="message in messages" :key="message.id" :item-key="message.id" :label="message.subject" :swipe="mailSwipe" />
  </List>
</template>
```

`leading` opens when the row is dragged toward its inline end (rightward in left-to-right text), and `trailing` toward its start. Entries are listed outermost last. Each `onActivate` gets the action's `id` and the row's `itemKey`, so one swipe defined at module scope serves every row. `createSwipe` is a plain function, not a composable: it does no DOM work, so it is safe at module scope and on the server. Put it in a `computed` when its handlers read component state.

- **Finger, pen or trackpad**: the row follows the drag. A fast release goes the way it moves, and a slow one past half the panel rests the row open. A flick never fires an action.
- **Full swipe**: drag past the confirm point and the row runs ahead while the outermost action covers its place. Letting go there fires it once the row has left its box; backing out closes the row. On a side with two or more actions, only a drag that starts on an open row fires.
- **`hasRemoval`**: the row stays out after the action fires instead of springing back, so the app can remove it.
- **Closing**: a tap on the row's content, a pointer down outside it, a scroll, or Escape closes an open row.
- **`swipeBehavior: 'commit'`**: nothing rests open. A full swipe slides the row out and fires the side's one action; a side with two or more actions fires none and warns in development.
- **Reduce Motion**: the drag still follows the finger; releases and confirmations fade instead of sliding.

A mouse never drags a row, so give every action a second home in the row, such as a button in `endContent`. A disabled row, the enlarged target of a control inside it, and a row whose role is `option` or a menu item do not swipe. The row's `swipeActions` and `swipeBehavior` props still work but are deprecated.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Define one swipe at module scope and read the row from <code>itemKey</code> in each handler. |
| <Badge variant="success">Do</Badge> | Keep every action reachable without a swipe, such as a button in <code>endContent</code> or a row menu. |
| <Badge variant="success">Do</Badge> | Use <code>hasRemoval</code> for an action that removes the row, so it stays out while the list takes it away. |
| <Badge variant="error">Don't</Badge> | Give a <code>commit</code> side more than one action: it fires none. |

## Examples

<DemoExample
  :demo="createSwipeMail"
  description="Swipe a row right to mark it read, or left for Archive and Delete. A full swipe left deletes. The buttons in each row do the same for a mouse or a keyboard."
  locale="en"
  title="createSwipe — inbox"
/>
