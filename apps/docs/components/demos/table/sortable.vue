<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, proportional, Table, useTableSortable, useTableSortableState } from '@astryx-vue/core/Table'

interface Employee extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
  age: number
}

const employees: Employee[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer', age: 32 },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer', age: 28 },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager', age: 45 },
  { id: '4', name: 'Diana', email: 'diana@example.com', role: 'Engineer', age: 37 },
  { id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin', age: 29 },
]

const columns: TableColumn<Employee>[] = [
  { key: 'name', header: 'Name', width: proportional(1), sortable: true },
  { key: 'email', header: 'Email', width: proportional(2), sortable: true },
  { key: 'role', header: 'Role', width: proportional(1), sortable: true },
  { key: 'age', header: 'Age', width: pixel(80), sortable: true },
]

const { sortedData, sortConfig } = useTableSortableState<Employee>({
  data: employees,
  defaultSort: [{ sortKey: 'name', direction: 'ascending' }],
})
const sortablePlugin = useTableSortable<Employee>(sortConfig)
</script>

<template>
  <Table
    :data="sortedData"
    :columns="columns"
    id-key="id"
    :plugins="{ sortable: sortablePlugin }"
  />
</template>
