---
layout: component-docs
title: Empty State
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { emptyStateActions, emptyStateCompact, emptyStateContainer } from '../../../../components/demos/empty-state'
</script>

## Usage

`EmptyState` fills a region that has no content yet: a search that returned nothing, a list that is still empty, a page the user is visiting for the first time. It carries three things that a bare "No data" line does not — why the region is empty now, what will live there, and what the user can do about it.

The component has four parts: an icon or illustration, a title, a description, and actions. Only `title` is required:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms, or clear the filters."
  >
    <template #icon>
      <!-- Your icon class; UnoCSS's icon preset fills the container, so size the box. -->
      <span class="i-carbon-search" style="width: 24px; height: 24px" />
    </template>
    <template #actions>
      <Button label="Clear filters" variant="secondary" />
      <Button label="Create item" variant="primary" />
    </template>
  </EmptyState>
</template>
```

astryx-vue ships no icons of its own: what goes into the `icon` slot is yours. Put a CSS icon class there (an UnoCSS class such as `i-carbon-search`, for instance), or your own component or inline drawing. UnoCSS's icon preset makes the glyph fill its container, so give the element that carries the class a size; the example does it with an inline style, and a size class of your own works just as well.

The icon or illustration goes into the `icon` slot. That slot sits inside an `aria-hidden="true"` wrapper, because the artwork only supports the text and should not be announced on its own; an icon placed there therefore needs no `label`.

`title` renders as a heading, `h3` by default. `headingLevel` changes only the tag itself (h1–h6) so the title joins the document outline, and the title's size stays the same at every level — choosing `h2` does not make it larger.

`description` takes a string, or richer content through the slot of the same name. It renders as a `<div>` rather than a `<p>`, so the slot can hold block content such as a list or a link:

```vue
<EmptyState title="No results found">
  <template #description>
    <ul>
      <li>Check the spelling of the search term.</li>
      <li>Remove one of the active filters.</li>
    </ul>
  </template>
</EmptyState>
```

Actions go into the `actions` slot, usually one or two of them, and they give the user a clear next step. Just like the title and the description, `title` and `description` also each have a slot of the same name that overrides the plain text passed as a prop.

In tight places such as cards and sidebars, `isCompact` reduces the spacing and the text sizes, and stacks the actions in a column.

The component carries `role="status"`, so when it appears after data finishes loading a screen reader announces it. Attributes you pass — `class`, `style`, `data-*`, and the rest — land on the root element, and an explicit `role` overrides that default.


<ComponentAnatomy />

## Illustration and icon guidance

The `icon` slot sits centered above the title. Whether it holds an icon or an illustration depends on how much room the region has.

| Region | What goes there | Size |
| --- | --- | --- |
| Inside a card, sidebar, or table | One line icon | 20 to 24px |
| A full-page empty state, or a first visit | One flat illustration | 120 to 200px |
| An onboarding or welcome screen | One flat illustration | Up to 240px |

The wrapper around the `icon` slot is already marked `aria-hidden="true"`: the artwork only supports the words. So an image there takes an empty `alt`; it does not need to repeat the title.

```vue
<script setup lang="ts">
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <EmptyState
    title="No projects yet"
    description="Create your first project, or start from a template."
  >
    <template #icon>
      <img src="/illustrations/empty-projects.svg" alt="" width="160" height="160">
    </template>
  </EmptyState>
</template>
```

A few rules.

- **One illustration set throughout.** Do not mix sources or line weights in one product.
- **Line work and colors follow the theme.** Draw with `currentColor`, or reference `var(--astryx-color-*)` only, and dark mode needs no second file. When a bitmap is unavoidable, ship a light and a dark version and switch them with `light-dark()` or a media query.
- **Size against the container.** Give the illustration a fixed `width` and `height` so nothing jumps while it loads, and let it shrink with a narrowing container instead of bursting the card.
- **The illustration sets the mood; the title does the talking.** Remove the artwork and the reader should still know why the area is empty.
- **Do not add artwork just to fill space.** The bottom of a list with nothing after it needs nothing. An illustration belongs where something should have been there and isn't.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Offer a clear next step next to the title, so the user knows what to do from here. |
| <Badge variant="success">Do</Badge> | Use an icon or illustration that fits the situation, so the missing content is obvious at a glance. |
| <Badge variant="success">Do</Badge> | Set `isCompact` inside cards and sidebars, where space is limited. |
| <Badge variant="error">Don't</Badge> | Leave the empty state without guidance. Always say what happened and what the user can do about it. |
| <Badge variant="error">Don't</Badge> | Write a generic message such as "No data". Be specific about what is empty and why. |
| <Badge variant="error">Don't</Badge> | Use an empty state for an error that needs immediate attention; use a [Banner](/components/banner) instead. |

## Examples

<DemoExample
  :demo="emptyStateActions"
  description="Full empty state with icon, message, and action buttons. Use when a search returns no results, a filter clears all items, or a list has been emptied. The buttons give the user a way forward."
  locale="en"
  title="Actions"
/>

<DemoExample
  :demo="emptyStateCompact"
  description="Smaller empty state with reduced spacing for constrained areas. Use inside sidebar panels, card widgets, or notification drawers where a full-size empty state would overwhelm the layout."
  locale="en"
  title="Compact"
/>

<DemoExample
  :demo="emptyStateContainer"
  description="Empty state wrapped in a Card for first-time setup or onboarding. Use when the user has not created any items yet, like a project list that will fill once they take action."
  locale="en"
  title="Container"
/>
