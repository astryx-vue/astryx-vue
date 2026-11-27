---
title: ListInput
---

# ListInput

编辑一组结构相同的记录。每列用 `renderInput` 提供输入控件，支持添加、删除、校验以及拖动或键盘排序。

<script setup lang="ts">
import { labListInput, labListInputBudgetAllocation, labListInputFamilyMembers, labListInputMailingList } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labListInput" description="每条访客记录包含姓名和角色，可直接编辑、添加、删除或调整顺序。" locale="zh" title="可排序记录列表" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputFamilyMembers" description="每条记录三个简单字段，是建议的上限。顺序无关紧要，所以列表不开重排。宽度 640px 以下时，每条记录把字段叠起来，并重复显示列名。" locale="zh" title="家庭成员" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputBudgetAllocation" description="团队下拉框旁边放一个百分比数字框。每个团队只能出现一次（记录错误），各行合计必须是 100%（列表错误），最多添加四个团队。" locale="zh" title="预算分配" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputMailingList" description="一列、起初为空的列表，最多添加六个地址。重复的地址是记录错误，格式不对的地址在失焦后给出字段错误，删光后显示必填的列表错误。" locale="zh" title="邮件列表" /></ClientOnly>

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
