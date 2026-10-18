---
layout: component-docs
title: 表格单元格
outline: false
footer: false
---

<script setup lang="ts">
import { TableCell } from '@astryx-vue/core/Table'
</script>

## 使用方法

`TableCell` 就是一个 `<td>`。放在 `Table` 里时，它会读父级表格的上下文，自动套上对应密度下的内边距、字号和分隔线。

```ts
import { TableCell } from '@astryx-vue/core/Table'
```
