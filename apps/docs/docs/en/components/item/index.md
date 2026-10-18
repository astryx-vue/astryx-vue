---
layout: component-docs
title: Item
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { itemBasic, itemDocumentTabs, itemMetadata, itemStartContent } from '../../../../components/demos/item'
</script>

## Usage

A single, flexible item primitive that unifies the "start content + label + description + end content" pattern across Astryx. Use it wherever you need a structured row: dropdown menus, selectors, contact lists, notifications, file browsers, and activity feeds.

```ts
import { Item } from '@astryx-vue/core/List'
```

Everything else that looks like a row is built from this one. [List Item](/en/components/list-item) adds the list element and the marker; menus, selectors, and result rows wrap it with the role their parent owns. The row paints nothing beyond text and slots, so the surrounding surface decides how it looks.

<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use named slots (`startContent`, `label`, `description`, `endContent`) for the common layout. These cover the 80% case. |
| <Badge variant="success">Do</Badge> | Use `density="compact"` for menus and dense lists, `"balanced"` for standard rows, and `"spacious"` for roomier layouts. |
| <Badge variant="success">Do</Badge> | Set `labelLines` and `descriptionLines` to control truncation when content length varies. |
| <Badge variant="success">Do</Badge> | Use `align="start"` when start or end content is taller than a single line of text. |
| <Badge variant="success">Do</Badge> | Give a swipe action a second home in the row (a menu or a button in `endContent`): the swipe is a touch accelerator, and a verb reachable only by swipe is unreachable by keyboard and by mouse. |
| <Badge variant="error">Avoid</Badge> | Don't nest interactive elements (buttons, links) inside an interactive `Item`; it creates confusing focus and click targets. |
| <Badge variant="error">Avoid</Badge> | Don't use `Item` for navigation between views; use proper navigation components instead. |
| <Badge variant="error">Avoid</Badge> | Don't add read/unread or inbox-specific behavior directly; compose a thin wrapper like PreviewItem instead. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="itemBasic" title="Basic" description="A basic item with a label, supporting description, and end-aligned timestamp. Use this for simple rows that need consistent text alignment and spacing." locale="en" />

<DemoExample :demo="itemDocumentTabs" title="Document Tabs" description="Single-row, horizontally scrollable document switcher with compact selected rows, leading file icons, instant reveal-on-hover close actions with reserved geometry, stable separators, and an add control outside the scroll area. Use for editor tabs, workspace tabs, open documents, files, canvases, or panels." locale="en" />

<DemoExample :demo="itemMetadata" title="Metadata" description="Items with end-aligned metadata and badges. Use the endContent slot for counts, status, timestamps, and other secondary row information." locale="en" />

<DemoExample :demo="itemStartContent" title="Start Content" description="Items with leading avatars and icons in the startContent slot. Keep start content small so the row stays compact and easy to scan." locale="en" />
