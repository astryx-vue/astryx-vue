---
layout: component-docs
title: Text Area
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textAreaBasic, textAreaSizes, textAreaRows, textAreaStates, textAreaValidation, textAreaAsync } from '../../../../components/demos/text-area'
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

<DemoExample :demo="textAreaBasic" title="Basic usage" description="For longer text. Label, description, and status are linked through Field." locale="en" />

<DemoExample :demo="textAreaSizes" title="Sizes" description="Three heights are available: sm, md, and lg. Width is controlled by the width prop." locale="en" />

<DemoExample :demo="textAreaRows" title="Rows and length" description="rows, cols, minlength, and maxlength are forwarded to the native textarea." locale="en" />

<DemoExample :demo="textAreaStates" title="Disabled and read-only" description="Disabled values are not submitted. A disabledMessage keeps the control focusable and explains why." locale="en" />

<DemoExample :demo="textAreaValidation" title="Validation states" description="status shows an error, warning, or success message. The message is attached below the field by default." locale="en" />

<DemoExample :demo="textAreaAsync" title="Async save" description="changeAction runs after each content change. A loading indicator appears while the action is pending." locale="en" />

## Keyboard controls

- Tab: focus the text area.
- Shift + Enter: insert a newline.
- Enter: fire the `enter` event.
- Escape: close the disabled reason or status tooltip.

## Usage guidance

- State exact length expectations in the description when using minlength and maxlength.
- `isRequired` only adds a required description. It does not run native validation.
- Validate content in application code.
