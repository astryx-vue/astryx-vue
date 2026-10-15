---
layout: component-docs
title: Tree List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { treeListFileTree, treeListMailbox, treeListNavigation, treeListSettings, treeListVariants } from '../../../../components/demos/tree-list'
</script>

## Usage

`TreeList` is a data-driven tree. Each item has an `id` and a `label`. `children` nests the next level. `isExpanded` is the starting state. A click on a branch toggles it. A leaf with `href` is a link. A leaf with `onClick` is a button.

`variant="lineGuides"` draws the connectors. `noGuides` keeps the indent and drops the lines. `density` changes the row padding: compact 4px, balanced 8px, spacious 12px.

`icon` and `endIcon` are either an `Icon` glyph name or a CSS icon class that starts with `i-`. `badge` is a short trailing count. The `start` and `end` slots can replace those strings when the content is richer than an icon.

Keyboard behavior follows the tree pattern: up and down move, left and right collapse and expand (they swap in right-to-left layouts), Home and End jump, Enter and Space activate, and typing focuses a matching label.

```vue
<script setup lang="ts">
import { TreeList } from '@astryx-vue/core/TreeList'

const items = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [{ id: 'app', label: 'App.tsx', onClick: () => {} }],
  },
]
</script>

<template>
  <TreeList :items="items" />
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give every item a stable `id`. Focus and expansion are tracked by it. |
| <Badge variant="success">Do</Badge> | Use `lineGuides` when the nesting is deep enough that indent alone is hard to follow. |
| <Badge variant="success">Do</Badge> | Put counts in `badge` and a trailing affordance in `endIcon`, instead of appending them to the label. |
| <Badge variant="error">Don't</Badge> | Mix links and buttons in one row. A row is one action. |
| <Badge variant="error">Don't</Badge> | Expand every branch by default in a large tree. Start from the path the reader is on. |

## Examples

<DemoExample
  :demo="treeListFileTree"
  description="File browser tree with folder and document icons distinguishing directories from files."
  locale="en"
  title="TreeList — File Tree With Icons"
/>

<DemoExample
  :demo="treeListSettings"
  description="Settings tree with clickable items and a documentation link."
  locale="en"
  title="TreeList — Interactive Settings"
/>

<DemoExample
  :demo="treeListMailbox"
  description="Email folder tree with unread badge counts."
  locale="en"
  title="TreeList — Mailbox Tree"
/>

<DemoExample
  :demo="treeListNavigation"
  description="Navigation tree with a selected item for the current page."
  locale="en"
  title="TreeList — Navigation Tree"
/>

<DemoExample
  :demo="treeListVariants"
  description="lineGuides draws connectors between a parent and its children. noGuides keeps the indent and drops the lines. Density is separate and only changes the row padding."
  locale="en"
  title="Tree List — Variants"
/>
