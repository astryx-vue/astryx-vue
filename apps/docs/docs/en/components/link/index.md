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
  description="isExternalLink opens a new tab and shows the external indicator. hasUnderline adds a line under the label."
  locale="en"
  title="External links"
/>

<DemoExample
  :demo="linkInline"
  description="A link sitting inside a sentence, on the same line as the words around it."
  locale="en"
  title="Inline text"
/>

<DemoExample
  :demo="linkTooltips"
  description="A tooltip on hover or focus says where the link goes."
  locale="en"
  title="With tooltips"
/>
