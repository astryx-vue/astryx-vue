---
layout: component-docs
title: List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { listBasic, listBulleted, listEdgeFlush, listEdgeInCard, listMessages, listSteps, listSwipe } from '../../../../components/demos/list'
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

The `header` slot renders a title above the list and associates it through `aria-labelledby`, so a screen reader announces the title when it enters the list.

`edge` decides where each row's text, dividers, and hover and selection backgrounds sit relative to the list's edges and the padding of the container around it. The default `padded` keeps the row's own inline padding. `flush` removes it, so text starts on the line of a heading above the list and lines and backgrounds stop at the text. `outset` keeps text on that line and lets lines and backgrounds reach into the container's padding. `bleed` puts text on the container's padding line and runs lines and backgrounds to its edges with square corners, like table rows in a Card. A row's first content — its marker, icon, or avatar, otherwise its label — is what lines up with the heading.

`outset` and `bleed` read the padding published by the nearest container that shares it: a Card, Section, BottomSheet, a padded ScrollableArea, or a Layout region. Place the list directly in that container's padding; padding that Stack, Center, or your own styles add in between is not counted. With no such container, such as a standalone list or one in a Popover, they look like `padded`. `edgeCompensation="inline"` still works as a deprecated alias of `edge="outset"`; set `edge` in new code.

The package also exports the more general `Item` primitive. `ListItem` is that primitive rendered as an `<li>` with the density and marker from its list; use `Item` directly when the same row layout is needed outside a list, or when you need its extra controls — `as`, `align`, `labelLines`, `descriptionLines`, and `layout`. Most screens only need `List` and `ListItem`.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give the list a `header`. A screen reader announces it on entering the list, and sighted users get the context of the collection immediately. |
| <Badge variant="success">Do</Badge> | Put icons, avatars, badges, or timestamps in `startContent` and `endContent`, so the two ends of a row carry the category and the status. |
| <Badge variant="success">Do</Badge> | Use `isSelected` to distinguish the current row and let the component pick `aria-selected` or `aria-current` from the row's role, instead of writing ARIA by hand. |
| <Badge variant="success">Do</Badge> | Set `descriptionLines` when the length of the content varies, or rely on the default single-line truncation for string descriptions, so the row height does not jump. |
| <Badge variant="success">Do</Badge> | Use `edge` to line row text up with a heading above the list: `flush` for static rows, `outset` or `bleed` for rows inside a Card, Section, or BottomSheet. |
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

<DemoExample
  :demo="listSwipe"
  description="A touch drag reveals Archive. A mouse drag does not start, so the same action stays in the row."
  locale="en"
  title="Swipe actions"
/>

<DemoExample
  :demo="listEdgeFlush"
  description="Static rows with flush drop their inline padding, so text, dividers, and backgrounds all sit on the heading's line."
  locale="en"
  title="Flush rows"
/>

<DemoExample
  :demo="listEdgeInCard"
  description="Interactive rows in a Card use outset so text lines up with the heading while backgrounds keep their room; bleed runs rows to the card's edges with square corners, like table rows."
  locale="en"
  title="Edge in a card"
/>
