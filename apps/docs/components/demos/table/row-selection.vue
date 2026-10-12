<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { proportional, Table, useTableSelection, useTableSelectionState } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface User extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager' },
  { id: '4', name: 'Diana', email: 'diana@example.com', role: 'Engineer' },
  { id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin' },
]

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
  { key: 'role', header: 'Role', width: proportional(1) },
]

const selectedKeys = ref(new Set<string>())
const { selectionConfig } = useTableSelectionState<User>({
  data: users,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
})
const selectionPlugin = useTableSelection<User>(selectionConfig)
</script>

<template>
  <Table
    :data="users"
    :columns="columns"
    id-key="id"
    :plugins="{ selection: selectionPlugin }"
  />
</template>
