---
layout: component-docs
title: Citation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { citationInline, citationSources } from '../../../../components/demos/citation'
</script>

## Usage

`Citation` marks a source inside a sentence. The `label` variant is a chip with the source title. The `number` variant is a compact superscript. Pass `number` as the 1-based index; it is spoken in the accessible name and shown by the number variant.

When `source.url` is set, the citation is a link that opens in a new tab and uses `role="doc-noteref"`. Without a URL it is a `<span>` and does not claim to be a link. The accessible name is localized, for example “Citation 2: Release notes”. The visible title falls back to the number when `source.title` is empty.

`source.icon` wins over `source.src`. A value that looks like a URL or a path is drawn as an image. Any other string is passed to `Icon` as a CSS class. The icon is only drawn for the label variant.

```vue
<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
</script>

<template>
  <p>
    See
    <Citation :number="1" :source="{ title: 'Release notes', url: 'https://example.com/notes' }" />
    <Citation :number="1" variant="number" :source="{ title: 'Release notes', url: 'https://example.com/notes' }" />
  </p>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep `number` stable for a source inside one answer, so the chip and the superscript refer to the same note. |
| <Badge variant="success">Do</Badge> | Give `title` the name a person would recognize. The number is only a fallback. |
| <Badge variant="success">Do</Badge> | Use the number variant in dense paragraphs, and the label variant where the source name should be readable without a footnote. |
| <Badge variant="error">Don't</Badge> | Put a long sentence in `title`. The chip clips, and the accessible name would be the whole sentence. |
| <Badge variant="error">Don't</Badge> | Use a citation as a general link. It is a note reference, not a navigation control. |

## Examples

<DemoExample
  :demo="citationInline"
  description="Citations embedded within a paragraph of text, showing how they flow inline with surrounding content."
  locale="en"
  title="Citation — Inline Text"
/>

<DemoExample
  :demo="citationSources"
  description="A list of citation sources with icons, as you might show at the end of an AI-generated response or article footer."
  locale="en"
  title="Citation — Source List"
/>
