---
layout: component-docs
title: useLinkify
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLinkifyCommentThread } from '../../../../components/demos/use-linkify'
</script>

## Usage

`useLinkify` finds URLs, email addresses and custom patterns in plain text and cuts the text into segments: plain text and links. Use it wherever user-written or tool-written text should grow safe, styled links without being turned into markup first, such as activity feeds, comment threads and description fields.

Each segment is either `{ type: 'text', text }` or `{ type: 'link', text, href, isExternal }`. Render text as it is and links with `Link`. URLs open in a new tab (`isExternal`), emails link as `mailto:`.

```ts
import { useLinkify } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useLinkify } from '@astryx-vue/core'
import { Link } from '@astryx-vue/core/Link'

const segments = useLinkify('Visit https://example.com or write hi@example.com')
</script>

<template>
  <p>
    <template v-for="(segment, index) in segments" :key="index">
      <Link v-if="segment.type === 'link'" :href="segment.href" :is-external-link="segment.isExternal">
        {{ segment.text }}
      </Link>
      <template v-else>
        {{ segment.text }}
      </template>
    </template>
  </p>
</template>
```

Pass a ref or a getter and the segments follow it. Custom patterns turn project references such as `#123` or ticket IDs into links: give a regex with the global flag and an `href` builder that reads its capture groups. When matches overlap, the earliest one wins, and at the same start a custom pattern wins over the built-in ones, so a `#123` pattern lives next to URL detection in the same text.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Render the text segments as they are; the segments already interleave the unmatched text. |
| <Badge variant="success">Do</Badge> | Give every custom pattern the global flag (`g`); without it the scan only sees the first match. |
| <Badge variant="error">Don't</Badge> | Pre-parse the text into your own markup before linkifying. |

## Examples

<DemoExample
  :demo="useLinkifyCommentThread"
  description="A short comment thread in plain text: the URL and the email address become links, a custom pattern turns #123 and #456 into tracker links, and a comment without matches stays plain."
  locale="en"
  title="useLinkify — comment thread"
/>
