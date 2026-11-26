<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { VStack } from '@astryx-vue/core/Stack'
import { Table, useTableSortable, useTableSortableState } from '@astryx-vue/core/Table'
import { Text } from '@astryx-vue/core/Text'
import { computed } from 'vue'

interface Order extends Record<string, unknown> {
  id: string
  customer: string
  total: number
}

const orders: Order[] = [
  { id: '1042', customer: 'Chen', total: 85 },
  { id: '1043', customer: 'Ana', total: 120 },
  { id: '1044', customer: 'Ben', total: 40 },
  { id: '1045', customer: 'Ana', total: 35 },
  { id: '1046', customer: 'Chen', total: 15 },
  { id: '1047', customer: 'Ben', total: 210 },
  { id: '1048', customer: 'Ana', total: 60 },
]

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order' },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'total', header: 'Total ($)', sortable: true, align: 'end' },
]

const { sortedData, sort, sortConfig } = useTableSortableState<Order>({ data: orders, columns })
// Shift-click adds a second sort column.
const sortablePlugin = useTableSortable<Order>(() => ({
  sort: sort.value,
  onSortChange: sortConfig.onSortChange,
  isMultiSortEnabled: true,
}))

const sortedBy = computed(() => sort.value.length === 0
  ? 'none'
  : sort.value.map(({ sortKey, direction }) => `${sortKey} ${direction}`).join(', then '))
</script>

<template>
  <VStack :gap="3" width="100%">
    <Text type="supporting" color="secondary">
      Sorted by: {{ sortedBy }}
    </Text>
    <Table :data="sortedData" :columns="columns" id-key="id" :plugins="{ sortable: sortablePlugin }" />
  </VStack>
</template>
