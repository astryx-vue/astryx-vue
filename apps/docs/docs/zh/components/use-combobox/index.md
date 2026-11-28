---
layout: component-docs
title: useCombobox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useComboboxAssignTo } from '../../../../components/demos/use-combobox'
</script>

## 使用方法

组合框的交互逻辑：展开状态、高亮的选项、搜索过滤和键盘导航。它不渲染任何东西，输入框和列表由你自己写。高亮移动时会跳过禁用项，打开时会停在当前选中的值上。

```ts
import { useCombobox } from '@astryx-vue/core'
```

把选项和当前值作为 ref 传进去，再把 `onKeyDown` 绑到输入框上，用 `filteredOptions` 渲染列表。`activeIndex` 用来填 `aria-activedescendant`，选中某项时调用 `select(value)`；选中后列表会关闭，搜索词也会清空。

## 自己渲染的输入框

给自己渲染的单行文本框接组合框时，直接展开属性生成器，不用手写那些属性。焦点始终留在输入框里：高亮的选项由 `aria-activedescendant` 指出，输入框保留列表用不到的所有按键。

```vue
<script setup lang="ts">
import { useCombobox } from '@astryx-vue/core'
import { computed, ref } from 'vue'

const query = ref('')
const picked = ref<string | null>(null)
const options = computed(() => people.filter(person => person.label.toLowerCase().includes(query.value.toLowerCase())))
const combobox = useCombobox({ options, modelValue: picked, onChange: value => (picked.value = value as string | null), listboxId: 'people' })
</script>

<template>
  <input v-model="query" aria-label="指派给" v-bind="combobox.getFieldProps()" @input="combobox.open()">
  <ul v-if="combobox.isOpen.value && options.length > 0" aria-label="人员" v-bind="combobox.getListboxProps()">
    <li v-for="(option, index) in options" :key="option.value" v-bind="combobox.getOptionProps(index)">
      {{ option.label }}
    </li>
  </ul>
</template>
```

- `getFieldProps(handlers?)` 返回 `role="combobox"`、`aria-autocomplete="list"`、`aria-expanded`、只在列表显示（已打开且至少有一个选项）时才有的 `aria-controls`、只在有高亮选项时才有的 `aria-activedescendant`，以及按键处理。自己的 `onKeydown` 传在这里：它在组合框的处理之后运行，组合框认领了的按键就不再交给它。
- `getListboxProps()` 返回 `id`、`role="listbox"`，以及按下时不把焦点从输入框带走的处理。列表打开且有选项时才渲染它，用 `aria-label` 或 `aria-labelledby` 给它起名。创建按钮、空状态这类别的控件放在列表旁边，不要放进去。
- `getOptionProps(index)` 返回 `id`、`role="option"`、`aria-selected`（高亮的那个为 true）、禁用项的 `aria-disabled`、指针移过去高亮但不动焦点的处理，以及点击选中。
- `getItemId(index)` 是选项的 id。`listboxId` 是列表的 id，不传会自动生成。

列表显示时，`ArrowDown`、`ArrowUp` 移动高亮并首尾循环；`Enter` 只在有高亮选项时选中并拦下输入框自己的回车；`Escape` 不管带不带修饰键都收起列表，外层的对话框或弹出框不会在同一次按键里一起关掉。列表收起时，有选项的话 `ArrowDown` 把它显示出来。`Home`、`End`、`Shift+Enter` 这类带修饰键的组合和其余所有键都交给输入框。输入法组词时，任何键都不会移动、选中或收起。新的查询改变了选项时，自己设置 `activeIndex`：设为 `0`，回车选第一项；设为 `-1`，回车仍归输入框。用 `useAnnounce` 播报结果数。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 输入框加 `role="combobox"`、`aria-expanded` 和 `aria-activedescendant`，列表加 `role="listbox"`，每行用 `role="option"`。 |
| <Badge variant="success">推荐</Badge> | 在 `mousedown` 里选中并 `preventDefault`，输入框才不会失焦，blur 处理也不会抢在选中前把列表关掉。 |
| <Badge variant="error">避免</Badge> | 自己重写键盘处理。`onKeyDown` 已经覆盖方向键、Home、End、Enter、Escape 和按字母跳转。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useComboboxAssignTo"
  description="用 useCombobox 做的「指派给」字段：输入会过滤人名，方向键会跳过被禁用的名字，按 Enter 指派高亮的那个人。"
  locale="zh"
  title="useCombobox — 指派给字段"
/>
