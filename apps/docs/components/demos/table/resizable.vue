<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, proportional, Table, useTableColumnResize } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface User extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'PM' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Engineer' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Analyst' },
]

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email', width: proportional(2) },
  { key: 'role', header: 'Role', width: pixel(120) },
]

const columnWidths = ref<Record<string, number>>({})
const resizePlugin = useTableColumnResize<User>(() => ({
  columnWidths: columnWidths.value,
  onColumnResizeEnd: (updates) => {
    columnWidths.value = { ...columnWidths.value, ...updates }
  },
}))
</script>

<template>
  <Table
    :data="users"
    :columns="columns"
    id-key="id"
    has-hover
    :plugins="{ columnResize: resizePlugin }"
  />
</template>
