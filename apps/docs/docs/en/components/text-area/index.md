---
layout: component-docs
title: Text Area
outline: false
footer: false
---

<script setup lang="ts">
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
