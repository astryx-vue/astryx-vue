---
layout: component-docs
title: Breadcrumbs
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { breadcrumbsDeep, breadcrumbsIcons, breadcrumbsMenu, breadcrumbsSeparators, breadcrumbsVariants } from '../../../../components/demos/breadcrumbs'
</script>

## Usage

Import `Breadcrumbs` and `BreadcrumbItem` from their dedicated entry.

```vue
<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="/components">
      Components
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Breadcrumbs
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use semantic `<nav>` and `<ol>` markup so screen readers can identify the path. |
| <Badge variant="success">Recommended</Badge> | Use `is-current` for the current page and render it as a `<span>` with `aria-current="page"`. |
| <Badge variant="success">Recommended</Badge> | Keep separators decorative with `aria-hidden="true"`. |
| <Badge variant="error">Don't</Badge> | Use overly long labels that wrap awkwardly on small screens. |
| <Badge variant="error">Don't</Badge> | Make the current page a clickable link; this creates circular navigation. |

## Examples

<DemoExample :demo="breadcrumbsSeparators" description="Swap the default slash for a chevron, an arrow, or a dot when the page calls for a different separator." locale="en" title="Separators" />

<DemoExample :demo="breadcrumbsDeep" description="A five-level trail for a deeply nested page, with a home icon on the root." locale="en" title="Deep path" />

<DemoExample :demo="breadcrumbsMenu" description="A crumb in the middle of the trail opens a menu for switching between sibling destinations." locale="en" title="Menu item" />

<DemoExample :demo="breadcrumbsVariants" description="The default trail next to the supporting variant, which stays quieter in a dense admin page." locale="en" title="Variants" />

<DemoExample :demo="breadcrumbsIcons" description="Icons before the labels make the root and the settings section recognizable at a glance." locale="en" title="Icons" />
