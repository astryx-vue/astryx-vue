---
layout: component-docs
title: 字段状态
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fieldStatusBasic } from '../../../../components/demos/field-status'
</script>

## 使用方法

`FieldStatus` 就是 `Field` 里面那条状态消息。自定义控件需要同样的错误、警告或成功样式时，单独引入它。

```vue
<script setup lang="ts">
import { FieldStatus } from '@astryx-vue/core/FieldStatus'
</script>

<template>
  <FieldStatus type="error" message="此字段为必填" variant="detached" />
</template>
```

`attached` 贴在带边框控件的下方。`detached` 是独立的一块，单独使用时用这个。错误会立刻播报，警告和成功则较缓和。它没有另一套实现，就是字段里的那个组件。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 消息没有贴在输入框外壳上时，用 `detached`。 |
| <Badge variant="error">避免</Badge> | 再做一套状态样式。字段已经在用这一套。 |

## 示例

<DemoExample :demo="fieldStatusBasic" description="独立的错误消息和成功消息。" locale="zh" title="基本用法" />
