<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { Badge } from '@astryx-vue/core/Badge'
import { Link } from '@astryx-vue/core/Link'
import { pixel, proportional, Table } from '@astryx-vue/core/Table'
import { h } from 'vue'

interface User extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
  age: number
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer', age: 30 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', age: 25 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'PM', age: 35 },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Engineer', age: 28 },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Designer', age: 32 },
]

const roleVariant: Record<string, 'blue' | 'purple' | 'green'> = {
  Engineer: 'blue',
  Designer: 'purple',
  PM: 'green',
}

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'email',
    header: 'Email',
    width: proportional(2),
    renderCell: item => h(Link, { href: `mailto:${item.email}` }, () => String(item.email)),
  },
  {
    key: 'role',
    header: 'Role',
    renderCell: item => h(Badge, { variant: roleVariant[item.role] ?? 'neutral' }, () => item.role),
  },
  { key: 'age', header: 'Age', width: pixel(80) },
]
</script>

<template>
  <Table :data="users" :columns="columns" id-key="id" has-hover />
</template>
