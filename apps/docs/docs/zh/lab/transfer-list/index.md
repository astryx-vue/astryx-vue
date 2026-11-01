---
layout: lab-docs
title: TransferList
---

# TransferList

在“可选”和“已选”两个面板之间移动条目，支持搜索、分组、拖动排序和键盘排序。

<script setup lang="ts">
import { labTransferList } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTransferList" description="两栏共用搜索框；已选项可排序，也可全部添加或清空。" locale="zh" title="双栏选择" /></ClientOnly>

## 导入

```ts
import { TransferList } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `readonly T[]` | `[]` | 已选值及其顺序，使用 `v-model`。 |
| `options` | `readonly TransferListOption<T>[]` | 必填 | 完整选项表，`value` 必须唯一。 |
| `label` | `string` | 必填 | 整个控件的无障碍名称。 |
| `selectedLabel` / `availableLabel` | `string` | 内置文案 | 两个面板的标题。 |
| `description` | `string` | `undefined` | 标签下方的说明。 |
| `isLabelHidden` | `boolean` | `false` | 是否视觉隐藏标签。 |
| `hasSearch` | `boolean` | `false` | 是否显示共用搜索框。 |
| `searchLabel` / `searchPlaceholder` | `string` | 内置文案 | 搜索框名称和提示。 |
| `isReorderable` | `boolean` | `true` | 已选项是否可排序。 |
| `hasSelectAll` / `hasClear` | `boolean` | `false` | 是否显示全部添加和清空。 |
| `selectedEmptyText` / `availableEmptyText` / `noResultsText` | `string` | 内置文案 | 空状态文案。 |

选项可设置 `group`、`description`、`isTransferDisabled`、`isReorderDisabled` 和 `disabledMessage`。`change` 会返回最新值；`#option="{ option }"` 可自定义行内容。
