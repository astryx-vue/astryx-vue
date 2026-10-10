---
layout: component-docs
title: 选择器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`Selector` 是一个下拉选择器组件，用户点击后展开选项列表，选择一项后收起。它支持搜索过滤、清除选择、禁用选项等功能。

基本用法只需要传入选项数组和绑定值：

```vue
<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const selected = ref(null)
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
]
</script>

<template>
  <Selector v-model="selected" :options="options" placeholder="选择水果" />
</template>
```

每个选项对象包含 `value`（唯一标识）和 `label`（显示文本）。可选的 `disabled` 属性可以禁用特定选项，`description` 可以添加辅助说明。

开启 `searchable` 属性后，选择器会显示搜索框，用户可以输入文字过滤选项。开启 `clearable` 后，已选中的值旁边会出现清除按钮。

```vue
<template>
  <Selector
    v-model="selected"
    :options="options"
    searchable
    clearable
    placeholder="搜索或选择"
  />
</template>
```

键盘导航完整支持：按下方向键上下移动高亮项，`Home` 和 `End` 跳到首尾，`Enter` 选中当前项，`Escape` 关闭列表。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项数量超过 10 项时开启搜索功能，帮助用户快速定位。 |
| <Badge variant="success">推荐</Badge> | 为非必填字段提供清除按钮，让用户可以取消选择。 |
| <Badge variant="success">推荐</Badge> | 使用简洁清晰的选项标签，避免过长的文本。 |
| <Badge variant="error">避免</Badge> | 在选择器中放置超过 100 项选项，考虑分页或异步加载。 |
| <Badge variant="error">避免</Badge> | 使用选择器做多选，应使用专门的多选组件。 |

## 示例

选择器组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `null` | 选中的值 |
| `options` | `SelectorOption[]` | 必填 | 选项数组 |
| `placeholder` | `string` | `'请选择'` | 占位符文本 |
| `searchable` | `boolean` | `false` | 是否支持搜索 |
| `clearable` | `boolean` | `false` | 是否可清除 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | 状态 |

## Emits

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number \| null` | 值变化时触发 |
| `change` | `value: string \| number \| null` | 值变化时触发 |
| `search` | `query: string` | 搜索输入时触发 |

## Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `selected` | `{ option: SelectorOption \| null }` | 自定义选中项显示 |
| `option` | `{ option: SelectorOption, isActive: boolean, isSelected: boolean }` | 自定义选项显示 |
| `empty` | - | 自定义空状态 |

## 键盘交互

| 按键 | 功能 |
| --- | --- |
| `Enter` / `Space` | 打开/关闭选择器 |
| `ArrowDown` | 高亮下一个选项 |
| `ArrowUp` | 高亮上一个选项 |
| `Home` | 高亮第一个选项 |
| `End` | 高亮最后一个选项 |
| `Enter` | 选中当前高亮项 |
| `Escape` | 关闭选择器 |

## 无障碍

- 使用 `role="combobox"` 和 `role="listbox"` 语义
- 支持 `aria-expanded` 状态
- 支持 `aria-activedescendant` 导航模式
- 完整的键盘导航支持
