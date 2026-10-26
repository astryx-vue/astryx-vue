<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Badge,
  Button,
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  Table,
  Text,
} from '@astryx-vue/core'
import { h, ref } from 'vue'

interface Item extends Record<string, unknown> {
  id: string
  name: string
  status: 'active' | 'inactive'
  updatedAt: string
}

const data = ref<Item[]>([
  { id: '1', name: 'Item One', status: 'active', updatedAt: '2025-01-15' },
  { id: '2', name: 'Item Two', status: 'inactive', updatedAt: '2025-01-14' },
  { id: '3', name: 'Item Three', status: 'active', updatedAt: '2025-01-13' },
])

const columns: TableColumn<Item>[] = [
  {
    key: 'name',
    header: 'Name',
    renderCell: item => h(Text, { type: 'body', weight: 'semibold' }, () => item.name),
  },
  {
    key: 'status',
    header: 'Status',
    renderCell: item => h(Badge, {
      variant: item.status === 'active' ? 'success' : 'neutral',
      label: item.status,
    }),
  },
  {
    key: 'updatedAt',
    header: 'Updated',
    renderCell: item => h(Text, { type: 'body', color: 'secondary' }, () => item.updatedAt),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: () => h(Button, { label: 'Edit', variant: 'secondary', size: 'sm' }),
  },
]
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <HStack h-align="between" align="center">
          <Text type="large" weight="semibold">
            Items
          </Text>
          <Button label="Add Item" variant="primary" />
        </HStack>
      </LayoutHeader>
    </template>
    <LayoutContent>
      <Table :data="data" :columns="columns" id-key="id" has-hover />
    </LayoutContent>
  </Layout>
</template>
