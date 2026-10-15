---
layout: component-docs
title: File Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fileInputBasic } from '../../../../components/demos/file-input'
</script>

## Usage

`FileInput` picks one file, or several. The value is a `File`, a `File[]` when `isMultiple` is set, or `null`.

```vue
<script setup lang="ts">
import { FileInput } from '@astryx-vue/core/FileInput'
import { shallowRef } from 'vue'

const resume = shallowRef<File | File[] | null>(null)
</script>

<template>
  <FileInput v-model="resume" label="Resume" accept=".pdf,.docx" />
</template>
```

`mode="input"` is the compact field. `mode="dropzone"` is a dashed target that also accepts a drop. Files that miss `accept`, `maxSize`, or `maxFiles` stay out of the value and the field shows an error. Placeholder, clear, and error text follow `provideAstryxLocale`.


<ComponentAnatomy />

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Name the field with `label`, and put the accepted types in `description`. |
| <Badge variant="success">Do</Badge> | Set `maxSize` in bytes so an oversized file is rejected before upload. |
| <Badge variant="error">Don't</Badge> | Use the dropzone for a single required document that people expect to look like a text field. |

## Examples

<DemoExample
  :demo="fileInputBasic"
  description="A resume field that accepts a PDF or Word document up to 5 MB."
  locale="en"
  title="Basic"
/>
