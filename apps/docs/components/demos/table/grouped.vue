<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, proportional, Table, useTableGroupedRows, useTableRowIndex } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface Employee extends Record<string, unknown> {
  id: string
  name: string
  role: string
}

const employees: Employee[] = [
  { id: '1', name: 'Alice', role: 'Engineer' },
  { id: '2', name: 'Bob', role: 'Designer' },
  { id: '3', name: 'Carol', role: 'Engineer' },
  { id: '4', name: 'Diego', role: 'Designer' },
]

const columns: TableColumn<Employee>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'role', header: 'Role', width: pixel(140) },
]

const collapsed = ref(new Set<string>())

function toggleGroup(key: string) {
  const next = new Set(collapsed.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  collapsed.value = next
}

const { data: groupedRows, plugin: groupedPlugin, idKey } = useTableGroupedRows<Employee>(() => ({
  data: employees,
  groupBy: employee => employee.role,
  collapsedGroups: collapsed.value,
  onToggleGroup: toggleGroup,
  getRowKey: employee => employee.id,
  groupOrder: ['Designer', 'Engineer'],
}))

const numbers = useTableRowIndex<Employee>(() => ({
  data: groupedRows.value,
  getRowKey: employee => employee.id,
}))
</script>

<template>
  <Table
    :data="groupedRows"
    :columns="columns"
    :id-key="idKey"
    :plugins="{ grouped: groupedPlugin, numbers }"
  />
</template>
