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
| <Badge variant="success">推荐</Badge> | 再次提交仍然失败、错误没变时，由表单用 `useAnnounce` 念一次，例如 `announce(`${errors.length} 个错误。${errors[0]}`, 'assertive')`，并把焦点移到第一个无效字段。状态只在第一次出现、说明或类型变化时才播报，所以第一次提交失败时由各字段念自己的错误，表单不用再加。 |
| <Badge variant="error">避免</Badge> | 再做一套状态样式。字段已经在用这一套。 |

## 示例

<DemoExample :demo="fieldStatusBasic" description="独立的错误消息和成功消息。" locale="zh" title="基本用法" />
