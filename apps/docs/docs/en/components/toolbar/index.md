---
layout: component-docs
title: Toolbar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toolbarBulk, toolbarCard, toolbarFilter, toolbarSizes, toolbarTabs } from '../../../../components/demos/toolbar'
</script>

## Usage

`Toolbar` is a `role="toolbar"`. `label` is required. `start`, `center`, and `end` are three groups. Arrow keys move focus across them, and Home and End jump to the ends. While an input is being edited, arrows stay with the caret until it reaches the edge of the field.

Hand overflow to `OverflowList`. Extra actions go into a More menu. The toolbar itself does not measure width.

```vue
<script setup lang="ts">
import { Toolbar } from '@astryx-vue/core/Toolbar'
</script>

<template>
  <Toolbar label="Formatting">
    <template #start>
      <button type="button">
        Bold
      </button>
      <button type="button">
        Italic
      </button>
    </template>
  </Toolbar>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Name the toolbar for its job, for example “Formatting”. |
| <Badge variant="success">Do</Badge> | Put a long set of actions in an <code>OverflowList</code> instead of letting buttons wrap out of the bar. |
| <Badge variant="error">Avoid</Badge> | Do not nest a toolbar inside a toolbar. Arrow keys stop at the inner boundary. |

## Examples

<DemoExample :demo="toolbarBulk" description="After a multi-select, the count stays at the start and batch actions stay at the end." locale="en" title="Bulk Actions" />

<DemoExample :demo="toolbarCard" description="The card title sits on the left. Icon actions sit on the right." locale="en" title="Card Header" />

<DemoExample :demo="toolbarSizes" description="Small, medium, and large side by side. Size cascades to the buttons inside." locale="en" title="Sizes" />

<DemoExample :demo="toolbarFilter" description="Search leads the row. Status, priority, and customer sit beside it, with a live result count." locale="en" title="Table Filter" />

<DemoExample :demo="toolbarTabs" description="Tabs sit in the start group. One action sits at the end." locale="en" title="Tab Navigation" />
