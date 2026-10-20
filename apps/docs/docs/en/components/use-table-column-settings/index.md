---
layout: component-docs
title: useTableColumnSettings
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnSettingsPicker } from '../../../../components/demos/use-table-column-settings'
</script>

## Usage

Headless column visibility and ordering management for Table. The plugin keeps only the columns whose key is in `activeColumnKeys`, in that array's order, so one list drives both your column picker and the table. `useTableColumnSettingsState` is the toggle helper: it holds the keys, puts `isAlwaysVisible` columns back when they are removed, and knows which set to restore for "Reset to default".

```ts
import { useTableColumnSettings, useTableColumnSettingsState } from '@astryx-vue/core/Table'
```

The config is read again on every access, so pass a getter when the keys live in a `ref`. A plain object works too, but the table keeps the keys it saw first.

The picker itself is yours to build. `MultiSelector` takes `{ value, label, disabled }` options, so map each column to that shape and mark `isAlwaysVisible` ones as disabled. Give an option a `group` and you can render the columns under headings.

`defaultColumnKeys` is the column set behind "Reset to default". Without it, resetting shows every column.

```ts
const state = useTableColumnSettingsState({
  columns: columnOptions,
  activeColumnKeys: activeKeys,
  onChangeActiveColumnKeys(keys) {
    activeKeys.value = [...keys]
  },
  defaultColumnKeys: ['name', 'email'],
})
```

`resetToDefault()` hands `defaultColumnKeys` to `onChangeActiveColumnKeys`; `showAllColumns()` hands every column instead. The two are what the reset button and the "select all" row in a picker call.

`useTableColumnSettings()` hides and reorders columns. It does not decide which columns exist; the table still receives every column, and the plugin drops the ones that are turned off.

## Examples

<DemoExample
  :demo="useTableColumnSettingsPicker"
  description="Table with a column visibility picker in the toolbar. Toggle columns on and off; the Name column always stays."
  locale="en"
  title="Table — Column Settings"
/>
