---
layout: component-docs
title: Breadcrumbs
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { breadcrumbsBasic, breadcrumbsSupporting } from '../../../../components/demos/breadcrumbs'
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

<DemoExample
  :demo="breadcrumbsBasic"
  description="A standard breadcrumb trail using the default text size."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="breadcrumbsSupporting"
  description="The supporting variant uses a smaller text size for compact contexts."
  locale="en"
  title="Supporting variant"
/>
