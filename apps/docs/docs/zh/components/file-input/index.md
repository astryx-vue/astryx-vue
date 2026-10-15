---
layout: component-docs
title: 文件输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fileInputBasic } from '../../../../components/demos/file-input'
</script>

## 使用方法

`FileInput` 用来选择一个或一组文件。值是 `File`；打开 `isMultiple` 后是 `File[]`；没有选择时是 `null`。

```vue
<script setup lang="ts">
import { FileInput } from '@astryx-vue/core/FileInput'
import { shallowRef } from 'vue'

const resume = shallowRef<File | File[] | null>(null)
</script>

<template>
  <FileInput v-model="resume" label="简历" accept=".pdf,.docx" />
</template>
```

`mode="input"` 是紧凑的输入框。`mode="dropzone"` 是虚线区域，也可以把文件拖进去。不符合 `accept`、`maxSize` 或 `maxFiles` 的文件不会进入值，字段会显示错误。占位符、清除按钮和错误文案跟随 `provideAstryxLocale`。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `label` 说明这个字段要什么，用 `description` 写清接受的类型。 |
| <Badge variant="success">推荐</Badge> | 用字节数设置 `maxSize`，超大的文件在上传前就被拒绝。 |
| <Badge variant="error">避免</Badge> | 一份必填文档却用拖放区。人们这时更期待一个普通输入框。 |

## 示例

<DemoExample
  :demo="fileInputBasic"
  description="简历字段，接受不超过 5 MB 的 PDF 或 Word 文档。"
  locale="zh"
  title="基本用法"
/>
