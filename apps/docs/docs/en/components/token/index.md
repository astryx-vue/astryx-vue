---
layout: component-docs
title: Token
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenClickable, tokenColors, tokenEnd, tokenIcon, tokenRemovable } from '../../../../components/demos/token'
</script>

## Usage

`Token` is an interactive chip. It can be removed, clicked, or used as a link, for a selected value or a filter. `Badge` is a static status or count marker.

Typeahead, Multi Selector, and Tokenizer use `Token` internally, and a chat composer can use it for an attachment or a mention.

`removable` shows a focusable remove button. Click, `Backspace`, and `Delete` all emit `remove`. `disabled` ignores that action. `#icon` sits before the text and is the place for a type icon.

`href` renders a link. When a remove button is also present, the link and the button are siblings, so the button is not nested inside the link.

```vue
<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <Token label="Design review" color="blue" removable>
    <template #icon>
      <span aria-hidden="true">#</span>
    </template>
  </Token>
</template>
```

The remove button’s accessible name defaults to `Remove Design review`. `provideAstryxLocale('zh-CN')` switches it to Chinese.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Turn on `removable` when the person can dismiss the chip, and update your list in `remove`. |
| <Badge variant="success">Do</Badge> | Use `#icon` for the type. Keep the icon out of `label`. |
| <Badge variant="error">Don't</Badge> | Use Token for success or warning status. Use `Badge` for that. |

## Examples

<DemoExample
  :demo="tokenClickable"
  description="Interactive tokens that respond to clicks. Use for toggleable filters or tokens that open a detail view."
  locale="en"
  title="Clickable"
/>

<DemoExample
  :demo="tokenColors"
  description="All 11 color variants in default and disabled states."
  locale="en"
  title="Colors"
/>

<DemoExample
  :demo="tokenEnd"
  description="Tokens with trailing content like a count badge or status indicator."
  locale="en"
  title="End Content"
/>

<DemoExample
  :demo="tokenIcon"
  description="Tokens with a leading icon that identifies the entity type."
  locale="en"
  title="Icon"
/>

<DemoExample
  :demo="tokenRemovable"
  description="Tokens with a dismiss button for selections the user can undo."
  locale="en"
  title="Removable"
/>
