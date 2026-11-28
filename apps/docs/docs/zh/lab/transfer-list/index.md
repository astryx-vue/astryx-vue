---
title: TransferList
---

# TransferList

在“可选”和“已选”两个面板之间移动条目，支持搜索、分组和重排。已选项的重排用 core `List` 的同一套引擎：行尾的重排手柄可以鼠标拖、手指按住再拖，也可以点一下进入重排模式后用方向键挪；搜索时暂停重排。

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
| `isDisabled` | `boolean` | `false` | 禁用所有搬运、排序、清空、全部添加和搜索，行上的按钮和搜索框仍可聚焦。 |
| `hasSearch` | `boolean` | `false` | 是否显示共用搜索框。 |
| `searchLabel` / `searchPlaceholder` | `string` | 内置文案 | 搜索框名称和提示。 |
| `reorderable` | `Reorderable<T>` | `undefined` | 自己接管已选项的重排：传 `useReorderable` 或 `createReorderable` 做的对象，挪动交给它的 `onReorder`（`to` 是在整个值里的位置），它的 `isReorderable` 决定哪些值能挪。传了就不看 `isReorderable`。 |
| `isReorderable` | `boolean` | `true` | 没传 `reorderable` 时，是否用内置重排：挪动走 `v-model` 和 `change`。 |
| `hasSelectAll` / `hasClear` | `boolean` | `false` | 是否显示全部添加和清空。 |
| `selectedEmptyText` / `availableEmptyText` / `noResultsText` | `string` | 内置文案 | 空状态文案。 |

选项可设置 `group`、`description`、`isTransferDisabled`、`isReorderDisabled` 和 `disabledMessage`。`isReorderDisabled` 的选项没有手柄，留在原位。`change` 会返回最新值；`#option="{ option }"` 可自定义行内容。
