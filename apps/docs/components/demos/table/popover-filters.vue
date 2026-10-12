<script setup lang="ts">
import type { TableColumn, TableFilterField } from '@astryx-vue/core/Table'
import { applyTableFilters, proportional, Table, useTableFiltering, useTableFilterState } from '@astryx-vue/core/Table'
import { computed } from 'vue'

interface Employee extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
  department: string
}

const employees: Employee[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer', department: 'Platform' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer', department: 'Product' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager', department: 'Platform' },
  { id: '4', name: 'Diana', email: 'diana@example.com', role: 'Engineer', department: 'Infrastructure' },
  { id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin', department: 'Operations' },
]

const fields: TableFilterField[] = [
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'email', type: 'string', label: 'Email' },
  {
    key: 'role',
    type: 'enum',
    label: 'Role',
    options: [
      { value: 'Engineer', label: 'Engineer' },
      { value: 'Designer', label: 'Designer' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Admin', label: 'Admin' },
    ],
  },
]

const columns: TableColumn<Employee>[] = [
  { key: 'name', header: 'Name', width: proportional(1), filter: 'name' },
  { key: 'email', header: 'Email', width: proportional(2), filter: 'email' },
  { key: 'role', header: 'Role', width: proportional(1), filter: 'role' },
  { key: 'department', header: 'Department', width: proportional(1) },
]

const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering<Employee>(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
}))
const rows = computed(() => applyTableFilters(employees, filters.value, fields))
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    id-key="id"
    :plugins="{ filter: filterPlugin }"
  />
</template>
