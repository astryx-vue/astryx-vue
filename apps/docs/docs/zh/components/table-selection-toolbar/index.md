---
layout: component-docs
title: 表格选择工具栏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`TableSelectionToolbar` 是配合「勾选行」用的批量操作条。把 `useTableSelectionState` 里的东西交给它：`selectedKeys` 里有几个键，就把这个数字传给 `count`；它发出 `clear` 时，就把这个集合清空。这样数字和「取消全选」永远跟勾选框对得上。

自己的操作按钮放进默认插槽。这条本身不管表格布局，也不管吸顶：放在表格上方跟着正常流排，或者用 `class`、`style` 自己固定住。

```ts
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 条数直接取自 `useTableSelectionState`，选中数字和「取消全选」才会跟行勾选保持同步。 |
| <Badge variant="success">推荐</Badge> | 产品自己的操作放进默认插槽，不要把它们编码成一串配置对象。 |
| <Badge variant="error">避免</Badge> | 通过 Table 插件或它的横向滚动容器把这个工具栏塞进去。 |
