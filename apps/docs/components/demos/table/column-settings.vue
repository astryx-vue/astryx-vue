<script setup lang="ts">
import type { ColumnSettingsOption, TableColumn } from '@astryx-vue/core/Table'
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { Stack } from '@astryx-vue/core/Stack'
import { proportional, Table, useTableColumnSettings, useTableColumnSettingsState } from '@astryx-vue/core/Table'
import { Text } from '@astryx-vue/core/Text'
import { Toolbar } from '@astryx-vue/core/Toolbar'
import { ref } from 'vue'

interface User extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer', department: 'Platform', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', department: 'Product', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager', department: 'Platform', status: 'Away' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Engineer', department: 'Infra', status: 'Active' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', department: 'Operations', status: 'Inactive' },
]

const allColumns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
  { key: 'role', header: 'Role', width: proportional(1) },
  { key: 'department', header: 'Department', width: proportional(1) },
  { key: 'status', header: 'Status', width: proportional(1) },
]

const columnOptions: ColumnSettingsOption<string>[] = [
  { key: 'name', label: 'Name', isAlwaysVisible: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
]

const activeKeys = ref(columnOptions.map(column => column.key))
const state = useTableColumnSettingsState<string>({
  columns: columnOptions,
  activeColumnKeys: activeKeys,
  onChangeActiveColumnKeys(keys) {
    activeKeys.value = [...keys]
  },
})
const plugin = useTableColumnSettings<User>(state.columnSettingsConfig)
const selectorOptions = columnOptions.map(column => ({
  value: column.key,
  label: column.label,
  disabled: column.isAlwaysVisible === true,
}))

function onColumnsChange(keys: (string | number)[]) {
  state.setActiveColumnKeys(keys.map(String))
}
</script>

<template>
  <Stack direction="vertical" :gap="3" width="100%">
    <Toolbar label="Table actions">
      <template #start>
        <Text type="label">
          Team
        </Text>
      </template>
      <template #end>
        <MultiSelector
          label="Columns"
          label-hidden
          :options="selectorOptions"
          :model-value="[...state.activeColumnKeys]"
          @update:model-value="onColumnsChange"
        />
      </template>
    </Toolbar>
    <Table
      :data="users"
      :columns="allColumns"
      id-key="id"
      has-hover
      :plugins="{ columnSettings: plugin }"
    />
  </Stack>
</template>
