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

`TableSelectionToolbar` 是配合「勾选行」用的批量操作条。`useTableSelectionState` 返回两份东西，分别交给对应的使用者：`selectionConfig` 交给 `useTableSelection`，`selectionState` 交给这条工具栏。工具栏从这份状态里读条数，并负责清空全部选中的键，所以永远跟勾选框对得上。老写法传 `count` 并自己处理 `clear` 也照样能用。

自己的操作按钮放进 `start` 插槽，计数文字和清空按钮由工具栏负责，排在末端。这条本身不管表格布局，也不管吸顶：放在表格上方跟着正常流排，或者用 `class`、`style` 自己固定住。

```ts
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 直接把 `useTableSelectionState` 返回的 `selectionState` 传进来，选中数字和清空命令才会跟行勾选保持同步。 |
| <Badge variant="success">推荐</Badge> | 产品自己的操作放进 `start` 插槽，不要把它们编码成一串配置对象。 |
| <Badge variant="error">避免</Badge> | 通过 Table 插件或它的横向滚动容器把这个工具栏塞进去。 |
