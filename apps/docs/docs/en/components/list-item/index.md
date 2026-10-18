---
layout: component-docs
title: List Item
outline: false
footer: false
---

<script setup lang="ts">
import { listItemBasic, listItemMedia, listItemMetadata } from '../../../../components/demos/list-item'
</script>

## Usage

List item with label, description, start/end content slots, and interactive patterns.

```ts
import { ListItem } from '@astryx-vue/core/List'
```

One row of a [List](/en/components/list), rendered as an `<li>`. The row draws itself from `label` and `description`, and takes a leading and a trailing slot around them. It stays a plain row until you give it something to do: an `@click` turns the row into a button, `href` turns it into a link, and `interactiveRef` points at a control inside the row that already carries the action.

`ListItem` is the list-shaped entry point to the general row primitive, [Item](/en/components/item). Use `Item` when the row does not live in a list.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="listItemBasic" title="Basic" description="Basic list items with labels and descriptions. Use this structure for settings, navigation summaries, and other simple collections." locale="en" />

<DemoExample :demo="listItemMedia" title="Media" description="List items with leading avatars and icons. Use startContent for compact visual identifiers that help users scan the collection." locale="en" />

<DemoExample :demo="listItemMetadata" title="Metadata" description="List items with end-aligned metadata. Use endContent for badges, counts, timestamps, and compact status details." locale="en" />
