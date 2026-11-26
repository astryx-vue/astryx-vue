<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { proportional, Table, useTableRowIndex, useTableRowsVirtualization, useTableSelection, useTableSelectionState } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface Order extends Record<string, unknown> {
  id: string
  customer: string
  city: string
  total: number
}

const CITIES = ['Lisbon', 'Osaka', 'Denver', 'Nairobi', 'Oslo', 'Lima']

const orders: Order[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `order-${index + 1}`,
  customer: `Customer ${index + 1}`,
  city: CITIES[index % CITIES.length]!,
  total: 20 + (index * 37) % 480,
}))

const columns: TableColumn<Order>[] = [
  { key: 'customer', header: 'Customer', width: proportional(2) },
  { key: 'city', header: 'City', width: proportional(1) },
  { key: 'total', header: 'Total ($)', width: proportional(1), align: 'end' },
]

const selectedKeys = ref(new Set<string>())
const { selectionConfig } = useTableSelectionState<Order>({
  data: orders,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
})
const selection = useTableSelection<Order>(selectionConfig)
const numbers = useTableRowIndex<Order>({ data: orders, getRowKey: order => order.id })
const rows = useTableRowsVirtualization<Order>({ rowHeight: 40, initialViewportHeight: 320 })
</script>

<template>
  <div style="height: 320px">
    <Table
      :data="orders"
      :columns="columns"
      id-key="id"
      :plugins="{ selection, numbers, rows }"
    />
  </div>
</template>
