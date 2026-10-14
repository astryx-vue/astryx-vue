---
layout: component-docs
title: Text Area
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textAreaCount, textAreaStates, textAreaValidation, textAreaIcon } from '../../../../components/demos/text-area'
</script>

## Usage

Use `TextArea` to enter multi-line plain text.

```vue
<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const bio = shallowRef('')
</script>

<template>
  <TextArea v-model="bio" label="Bio" :rows="4" />
</template>
```

Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Provide a visible label so users know what to enter. If the label must be hidden, set isLabelHidden with a descriptive label for screen readers. |
| <Badge variant="success">Do</Badge> | Set maxLength with a character counter when there is a defined limit; it helps users stay within bounds before they submit. |
| <Badge variant="success">Do</Badge> | Use the status prop to surface validation feedback inline: show success when input is valid, warning for soft limits, and error for hard failures. |
| <Badge variant="success">Do</Badge> | Add a description or placeholder to clarify expected content, like "Describe the issue in detail," but never rely on placeholder alone as the only label. |
| <Badge variant="error">Don't</Badge> | Avoid using TextArea for short, single-line values like names or emails; use TextInput instead. |
| <Badge variant="error">Don't</Badge> | Don't rely solely on placeholder text to communicate the purpose of the field; placeholders disappear on focus and are not accessible labels. |
| <Badge variant="error">Don't</Badge> | Don't show a status message without also setting the status type; the colored border and icon are what draw the user's attention to the message. |
| <Badge variant="error">Don't</Badge> | Don't wrap a disabled TextArea in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead. |

## Examples

<DemoExample
  :demo="textAreaCount"
  description="A status update with a 280-character limit and a live counter."
  locale="en"
  title="Character count"
/>

<DemoExample
  :demo="textAreaStates"
  description="Required, disabled, and loading fields."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="textAreaValidation"
  description="Error, warning, and success messages, plus an error with no message."
  locale="en"
  title="Validation"
/>

<DemoExample
  :demo="textAreaIcon"
  description="Meeting notes with a pencil icon and a short description."
  locale="en"
  title="Icon"
/>

## Keyboard controls

The control is a real `textarea`, so it keeps the browser's native key behaviour, and the component only adds handling on top of a few keys. Most keystrokes therefore behave exactly as they do in any other multi-line field:

- Tab moves focus into or out of the text area.
- Shift + Enter inserts a newline at the caret.
- Enter emits the `enter` event, so your handler can take over submit-like logic.
- Escape closes an open disabled reason tooltip or status tooltip.

When submit-on-Enter behaviour makes sense for your form, implement it in the `enter` handler.

## Usage guidance

The text area does not constrain what users type, so length limits and validation belong to your application:

- When the expected length matters, state `minlength` and `maxlength` in the `description` so users know it before they submit.
- `isRequired` only shows the required indicator and sets the matching ARIA state; it does not run native validation.
- Whether the content meets your business rules is up to validation in application code.
