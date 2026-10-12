<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { paginateData, proportional, Table, useTablePagination } from '@astryx-vue/core/Table'
import { computed, ref } from 'vue'

interface User extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
}

const names = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Brown',
  'Diana Prince',
  'Eve Davis',
  'Frank Miller',
  'Grace Lee',
  'Hank Wilson',
  'Ivy Chen',
  'Jack Turner',
  'Karen White',
  'Leo Garcia',
  'Mia Thompson',
  'Noah Martinez',
  'Olivia Clark',
  'Paul Harris',
  'Quinn Walker',
  'Rachel Adams',
  'Sam Robinson',
  'Tina Scott',
]
const roles = ['Engineer', 'Designer', 'Manager', 'Admin', 'Analyst']
const users: User[] = names.map((name, index) => ({
  id: String(index + 1),
  name,
  email: `${name.split(' ')[0]!.toLowerCase()}@example.com`,
  role: roles[index % roles.length]!,
}))

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
  { key: 'role', header: 'Role', width: proportional(1) },
]

const page = ref(1)
const pageSize = 5
const plugin = useTablePagination<User>(() => ({
  page: page.value,
  onPageChange(next) {
    page.value = next
  },
  totalItems: users.length,
  pageSize,
}))
const rows = computed(() => paginateData(users, page.value, pageSize))
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    id-key="id"
    :plugins="{ pagination: plugin }"
  />
</template>
