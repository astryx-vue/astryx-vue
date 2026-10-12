<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { Card } from '@astryx-vue/core/Card'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { pixel, proportional, Table } from '@astryx-vue/core/Table'

provideAstryxLocale('en')

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
]

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
  { key: 'role', header: 'Role', width: proportional(1) },
  { key: 'age', header: 'Age', width: pixel(80) },
]
</script>

<template>
  <Card :width="600">
    <Table :data="users" :columns="columns" id-key="id" has-hover />
  </Card>
</template>
