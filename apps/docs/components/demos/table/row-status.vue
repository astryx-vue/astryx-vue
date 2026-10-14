<script setup lang="ts">
import type { TableColumn, TableRowStatus } from '@astryx-vue/core/Table'
import { proportional, Table, useTableRowStatus } from '@astryx-vue/core/Table'

interface Check extends Record<string, unknown> {
  id: string
  name: string
  detail: string
  state: 'success' | 'warning' | 'error' | 'neutral'
}

const checks: Check[] = [
  { id: '1', name: 'Payments', detail: 'Settled', state: 'success' },
  { id: '2', name: 'Inventory', detail: 'Low stock', state: 'warning' },
  { id: '3', name: 'Mail', detail: 'Bounced', state: 'error' },
  { id: '4', name: 'Notes', detail: 'No signal', state: 'neutral' },
]

const columns: TableColumn<Check>[] = [
  { key: 'name', header: 'Service', width: proportional(1) },
  { key: 'detail', header: 'Detail', width: proportional(1) },
]

function statusFor(check: Check): TableRowStatus | null {
  if (check.state === 'neutral')
    return { color: 'gray', label: 'No signal' }
  if (check.state === 'success')
    return { status: 'success', label: 'Settled' }
  if (check.state === 'warning')
    return { status: 'warning', label: 'Low stock' }
  return { status: 'error', label: 'Bounced' }
}

const status = useTableRowStatus<Check>({ getStatus: statusFor })
</script>

<template>
  <Table
    :data="checks"
    :columns="columns"
    id-key="id"
    :plugins="{ status }"
  />
</template>
