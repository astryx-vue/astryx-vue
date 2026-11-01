---
layout: lab-docs
title: ListInput
---

# ListInput

编辑一组结构相同的记录。每列用 `renderInput` 提供输入控件，支持添加、删除、校验以及拖动或键盘排序。

<script setup lang="ts">
import { labListInput } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labListInput" description="每条访客记录包含姓名和角色，可直接编辑、添加、删除或调整顺序。" locale="zh" title="可排序记录列表" /></ClientOnly>

## 导入

```ts
import { ListInput } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `T[]` | `[]` | 记录数组，使用 `v-model`。 |
| `label` | `string` | 必填 | 列表标签和无障碍名称。 |
| `columns` | `ListInputColumn<T>[]` | 必填 | 列定义和单元格渲染器。 |
| `getItemKey` | `(item) => string \| number` | 必填 | 返回记录唯一键。 |
| `createItem` | `() => T` | 必填 | 添加时创建新记录。 |
| `description` / `itemName` | `string` | `undefined` | 列表说明和操作使用的单数名词。 |
| `status` | `FieldStatus` | `undefined` | 整个列表的校验状态。 |
| `getItemStatus` | `(item, index) => FieldStatus` | `undefined` | 单条记录的校验状态。 |
| `getFieldStatus` | `(item, columnKey, index) => FieldStatus` | `undefined` | 单元格的校验状态。 |
| `isReorderable` | `boolean` | `false` | 是否允许排序。 |
| `isDisabled` / `isLoading` | `boolean` | `false` | 禁用或忙碌状态。 |
| `maxItems` | `number` | `undefined` | 最大记录数。 |
| `isLabelHidden` / `isOptional` / `isRequired` | `boolean` | `false` | 标签和必填标记。 |

列包含 `key`、`header`、可选 `width` 和 `renderInput`。渲染器会收到当前记录、无障碍标签、校验状态、禁用状态以及 `updateItem`，示例演示了如何接入 core 的 `TextInput`。

## 事件

`change` 同时返回新数组和本次改动，改动类型为 `add`、`update`、`remove` 或 `reorder`。
