<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, proportional, Table, useTableRowExpansion } from '@astryx-vue/core/Table'
import { h, ref } from 'vue'

interface Order extends Record<string, unknown> {
  id: string
  customer: string
  total: string
  note: string
}

const orders: Order[] = [
  { id: '1042', customer: 'Northwind', total: '$240', note: 'Two seats, ships Friday.' },
  { id: '1043', customer: 'Contoso', total: '$80', note: 'Gift wrap requested.' },
  { id: '1044', customer: 'Fabrikam', total: '$560', note: 'Hold for pickup.' },
]

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', width: pixel(100) },
  { key: 'customer', header: 'Customer', width: proportional(1) },
  { key: 'total', header: 'Total', width: pixel(100) },
]

const expanded = ref(new Set<string>(['1042']))

function toggle(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  expanded.value = next
}

const expansion = useTableRowExpansion<Order>(() => ({
  expandedKeys: expanded.value,
  onToggle: toggle,
  getRowKey: order => order.id,
  panelVariant: 'muted',
  hasRowClickExpansion: true,
  renderExpanded: order => h('p', order.note),
}))
</script>

<template>
  <Table
    :data="orders"
    :columns="columns"
    id-key="id"
    :plugins="{ expansion }"
  />
</template>
