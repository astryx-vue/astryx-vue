<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, Table, useTableStickyColumns } from '@astryx-vue/core/Table'

interface Shift extends Record<string, unknown> {
  id: string
  name: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
}

const shifts: Shift[] = [
  { id: '1', name: 'Alice', monday: 'Desk', tuesday: 'Desk', wednesday: 'Remote', thursday: 'Desk', friday: 'Off' },
  { id: '2', name: 'Bob', monday: 'Remote', tuesday: 'Desk', wednesday: 'Desk', thursday: 'Remote', friday: 'Desk' },
  { id: '3', name: 'Carol', monday: 'Off', tuesday: 'Remote', wednesday: 'Desk', thursday: 'Desk', friday: 'Remote' },
]

const columns: TableColumn<Shift>[] = [
  { key: 'name', header: 'Name', width: pixel(140) },
  { key: 'monday', header: 'Monday', width: pixel(140) },
  { key: 'tuesday', header: 'Tuesday', width: pixel(140) },
  { key: 'wednesday', header: 'Wednesday', width: pixel(160) },
  { key: 'thursday', header: 'Thursday', width: pixel(140) },
  { key: 'friday', header: 'Friday', width: pixel(140) },
]

const sticky = useTableStickyColumns<Shift>({
  startKeys: ['name'],
  endKeys: ['friday'],
})
</script>

<template>
  <Table
    :data="shifts"
    :columns="columns"
    id-key="id"
    :plugins="{ sticky }"
  />
</template>
