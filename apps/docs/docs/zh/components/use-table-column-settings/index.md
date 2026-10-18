---
layout: component-docs
title: useTableColumnSettings
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnSettingsPicker } from '../../../../components/demos/use-table-column-settings'
</script>

## 使用方法

给 Table 做列的显示与排序，只管逻辑，不画控件。插件只留下 key 在 `activeColumnKeys` 里的列，顺序也按这个数组来，所以列选择器和表格读的是同一份列表。`useTableColumnSettingsState` 是配套的开关助手：它保存 key，被删掉的 `isAlwaysVisible` 列会被放回最前面。

```ts
import { useTableColumnSettings, useTableColumnSettingsState } from '@astryx-vue/core/Table'
```

每次读配置都会重新取值，所以 key 存在 `ref` 里时要传 getter。直接传对象也能跑，但表格会用第一次读到的 key。

列选择器由你自己搭。`MultiSelector` 的选项是 `{ value, label, disabled }`，把每列映射成这个形状，`isAlwaysVisible` 的标成禁用即可。

`useTableColumnSettings()` 只负责藏起和重排。列本身还是全部交给表格，插件从中挑出要显示的那些。

## 示例

<DemoExample
  :demo="useTableColumnSettingsPicker"
  description="工具栏里放一个列选择器的表格。可以开关列，Name 列始终保留。"
  locale="zh"
  title="Table — 列设置"
/>
