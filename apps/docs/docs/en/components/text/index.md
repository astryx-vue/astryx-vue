---
layout: component-docs
title: Text
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textColors, textHeadingLevels, textInline, textTruncation, textTypes, textWeight, textWordBreak, textWrap } from '../../../../components/demos/text'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Text type="body">
    Body content
  </Text>
  <Text type="supporting">
    Supporting details
  </Text>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use `type` for semantic hierarchy: `large` for emphasis, `supporting` for hints, `label` for form labels. |
| <Badge variant="success">Recommended</Badge> | Set `as="p"` or `display="block"` when you need block-level layout. |
| <Badge variant="success">Recommended</Badge> | Use `maxLines` to clamp long text to a fixed number of lines. |
| <Badge variant="error">Don't</Badge> | Use `Text` in place of `Heading`. Headings should use the `Heading` component for correct semantics. |
| <Badge variant="error">Don't</Badge> | Mix too many `type` and `size` combinations in the same short passage. |

## Examples

<DemoExample
  :demo="textColors"
  description="Primary, secondary, accent, disabled, and placeholder colors, each used for the kind of text it names."
  locale="en"
  title="Colors"
/>

<DemoExample
  :demo="textHeadingLevels"
  description="Heading levels 1 through 6, with the type scale stepping down at each level."
  locale="en"
  title="Heading levels"
/>

<DemoExample
  :demo="textInline"
  description="Text is inline by default, so body copy and a code span can share one line."
  locale="en"
  title="Inline"
/>

<DemoExample
  :demo="textTruncation"
  description="maxLines clamps a paragraph to one, two, or three lines and ends the overflow with an ellipsis."
  locale="en"
  title="Truncation"
/>

<DemoExample
  :demo="textTypes"
  description="The body, large, label, supporting, and code types, plus strikethrough and tabular figures."
  locale="en"
  title="Types"
/>

<DemoExample
  :demo="textWeight"
  description="Normal, medium, semibold, and bold. Normal is the same weight as regular."
  locale="en"
  title="Weight"
/>

<DemoExample
  :demo="textWordBreak"
  description="break-word keeps a long token together when it can; break-all splits it at any character."
  locale="en"
  title="Word break"
/>

<DemoExample
  :demo="textWrap"
  description="Wrap, nowrap, balance, and pretty, each in a box of the same width."
  locale="en"
  title="Wrap"
/>
