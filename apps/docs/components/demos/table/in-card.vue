<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { proportional, Table } from '@astryx-vue/core/Table'

interface User extends Record<string, unknown> {
  id: string
  name: string
  role: string
  email: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', role: 'PM', email: 'charlie@example.com' },
  { id: '4', name: 'Diana Prince', role: 'Engineer', email: 'diana@example.com' },
]

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'role', header: 'Role', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
]
</script>

<template>
  <Card :width="520">
    <Stack direction="vertical" :gap="3">
      <Heading :level="3">
        Team Members
      </Heading>
      <Table :data="users" :columns="columns" id-key="id" has-hover />
    </Stack>
  </Card>
</template>
