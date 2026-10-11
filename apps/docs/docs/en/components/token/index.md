---
layout: component-docs
title: Token
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenBasic, tokenColors } from '../../../../components/demos/token'
</script>

## Usage

`Token` is a small chip. Typeahead, Multi Selector, and Tokenizer use it internally, and a chat composer can use it for an attachment or a mention.

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
  :demo="tokenBasic"
  description="A removable token with a prefix icon. Disabling it stops the remove button."
  locale="en"
  title="Removable"
/>

<DemoExample
  :demo="tokenColors"
  description="Colors share the Badge palette."
  locale="en"
  title="Colors"
/>
