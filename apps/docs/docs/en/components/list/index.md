---
layout: component-docs
title: List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { listBasic, listBulleted, listMessages, listSteps } from '../../../../components/demos/list'
</script>

## Usage

`List` presents a collection of related entries, and `ListItem` is one row inside it. The pair renders a semantic `<ul>` or `<ol>` and lays out every row as start content, label, description, and end content, so a settings screen, an inbox, or a set of steps does not have to rebuild that row layout each time.

One row needs nothing more than a `label`:

```vue
<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List header="Inbox">
    <ListItem label="Mentions" description="Comments that name you" />
    <ListItem label="Build finished" description="main passed every check" />
  </List>
</template>
```

`description` is the secondary line under the label. The `startContent` and `endContent` slots place an icon, an avatar, a badge, or an action at either end of the row, and `label` and `description` each have a same-named slot for content that needs richer markup than a string.

The list sets the density for all of its rows, and a single row can override it. `compact` uses 4px of block padding, `balanced` is the 8px default, and `spacious` uses 12px and widens the inline padding by one step as well. `hasDividers` rules a line between neighbouring rows, and the last row never draws one.

`listStyle` decides what appears in front of each row: `disc` draws a filled bullet, `circle` draws an outlined one, and `decimal` switches the list to an `<ol>` and numbers the rows, with `start` choosing the first number. The default `none` draws no marker at all.

A row becomes interactive in one of two ways. Give it `onClick` and a button appears inside the row, filling the content area, so keyboard users can tab to it and press Enter or Space; give it `href` and that same place becomes a link, with `noopener` and `noreferrer` added automatically when `target="_blank"`. Clicking another control inside the row, such as a button in `endContent`, does not run the row's own action.

`isSelected` marks the row as selected. When the row carries a role that permits `aria-selected` — `option`, `tab`, or `row`, for instance — the state is written there; otherwise it falls back to `aria-current="true"`, which is valid on any element, so assistive technology still hears which row is current. `isDisabled` makes the row inert and dims its content.

The `header` slot renders a title above the list and associates it through `aria-labelledby`, so a screen reader announces the title when it enters the list. `edgeCompensation="inline"` is for a list placed inside a padded container: it pulls every row toward the container's inline content edges so the row text lines up with a sibling heading, cancelling no more than the container padding each edge actually publishes.

The package also exports the more general `Item` primitive. `ListItem` is that primitive rendered as an `<li>` with the density and marker from its list; use `Item` directly when the same row layout is needed outside a list, or when you need its extra controls — `as`, `align`, `labelLines`, `descriptionLines`, and `layout`. Most screens only need `List` and `ListItem`.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give the list a `header`. A screen reader announces it on entering the list, and sighted users get the context of the collection immediately. |
| <Badge variant="success">Do</Badge> | Put icons, avatars, badges, or timestamps in `startContent` and `endContent`, so the two ends of a row carry the category and the status. |
| <Badge variant="success">Do</Badge> | Use `isSelected` to distinguish the current row and let the component pick `aria-selected` or `aria-current` from the row's role, instead of writing ARIA by hand. |
| <Badge variant="success">Do</Badge> | Set `descriptionLines` when the length of the content varies, or rely on the default single-line truncation for string descriptions, so the row height does not jump. |
| <Badge variant="error">Don't</Badge> | Nest a second control inside an interactive row as its main action. The row's button already fills the content area, and two click targets make the focus order and the behaviour hard to predict. |
| <Badge variant="error">Don't</Badge> | Use a list for a single entry. A list means the entries belong together; a short paragraph reads more naturally for one item. |
| <Badge variant="error">Don't</Badge> | Mix interactive and static rows in one list without a visible difference, leaving users unsure which rows open something. |

## Examples

<DemoExample
  :demo="listBasic"
  description="Simple list with labels and descriptions for settings-style layouts."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="listBulleted"
  description="Bulleted list of feature highlights using disc markers."
  locale="en"
  title="Bulleted features"
/>

<DemoExample
  :demo="listMessages"
  description="Chat-style message list with avatars, preview text, and unread badges."
  locale="en"
  title="Message list"
/>

<DemoExample
  :demo="listSteps"
  description="Numbered step-by-step instructions using decimal list markers."
  locale="en"
  title="Ordered steps"
/>
