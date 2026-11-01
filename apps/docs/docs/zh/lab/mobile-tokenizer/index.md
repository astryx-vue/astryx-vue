---
layout: lab-docs
title: MobileTokenizer
---

# MobileTokenizer

面向窄屏和触屏的多选输入器。点击触发器后，在底部面板里搜索、勾选或创建条目。

<script setup lang="ts">
import { labMobileTokenizer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labMobileTokenizer" description="打开底部面板后可搜索并多选；输入没有匹配项的文字时可以创建新条目。" locale="zh" title="底部面板多选" /></ClientOnly>

## 导入

```ts
import { MobileTokenizer } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `readonly T[]` | `[]` | 已选条目，使用 `v-model`。 |
| `label` | `string` | 必填 | 字段标签和底部面板的无障碍名称。 |
| `searchSource` | `SearchSource<T>` | 必填 | 同步或异步搜索源，可提供 `bootstrap`。 |
| `placeholder` | `string` | `undefined` | 未选择时的提示。 |
| `description` | `string` | `undefined` | 标签下方的说明。 |
| `isOptional` / `isDisabled` | `boolean` | `false` | 可选标记或禁用状态。 |
| `hasCreate` | `boolean` | `false` | 是否允许创建新条目。 |
| `maxEntries` | `number` | `undefined` | 最多选择条数。 |
| `maxMenuItems` | `number` | `undefined` | 搜索结果最多保留条数。 |
| `minQueryLength` | `number` | `undefined` | 开始搜索所需的最少字符数。 |
| `debounceMs` | `number` | `undefined` | 搜索防抖毫秒数。 |
| `emptySearchResultsText` | `string` | 内置文案 | 无结果提示。 |

条目结构为 `{ id, label, disabled?, description? }`。`search` 会收到查询文字和可选的 `AbortSignal`，因此可直接接入远程搜索。

## 事件

除 `update:modelValue` 外，还提供 `change`、`update:query`、`changeQuery` 和 `openChange`。`change` 会区分 `add`、`create` 和 `remove`。
