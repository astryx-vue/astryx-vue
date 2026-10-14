---
layout: component-docs
title: Link
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { linkExternal, linkInline, linkTooltips } from '../../../../components/demos/link'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <Link href="/docs">
    Documentation
  </Link>
  <Link href="https://github.com" is-external-link>
    GitHub
  </Link>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use link text that describes the destination, e.g. "View docs" or "Contact us". Avoid "click here". |
| <Badge variant="success">Recommended</Badge> | Use `isExternalLink` for off-site links to add `target="_blank"` and `rel="noopener noreferrer"`. |
| <Badge variant="success">Recommended</Badge> | Use `color="secondary"` to reduce visual weight in groups of links or paragraphs. |
| <Badge variant="error">Don't</Badge> | Make every piece of text a link; it weakens link discoverability. |
| <Badge variant="error">Don't</Badge> | Make a critical action only a link. Important actions should use Button. |

## Examples

<DemoExample
  :demo="linkExternal"
  description="A vertical list of external links that open in a new tab with an indicator icon."
  locale="en"
  title="External links"
/>

<DemoExample
  :demo="linkInline"
  description="A link embedded within a paragraph of body text."
  locale="en"
  title="Inline text"
/>

<DemoExample
  :demo="linkTooltips"
  description="Horizontal row of standalone links with descriptive hover tooltips."
  locale="en"
  title="With tooltips"
/>
