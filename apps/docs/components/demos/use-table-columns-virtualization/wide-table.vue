<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { pixel, Table, useTableColumnsVirtualization, useTableStickyColumns } from '@astryx-vue/core/Table'

type Reading = Record<string, unknown> & { id: string, station: string }

const HOURS = Array.from({ length: 48 }, (_, index) => `h${index}`)

const readings: Reading[] = Array.from({ length: 12 }, (_, row) => ({
  id: `station-${row + 1}`,
  station: `Station ${row + 1}`,
  ...Object.fromEntries(HOURS.map((key, hour) => [key, `${10 + (row * 3 + hour * 7) % 25}°`])),
}))

const columns: TableColumn<Reading>[] = [
  { key: 'station', header: 'Station', width: pixel(140) },
  ...HOURS.map((key, hour) => ({ key, header: `Day ${Math.floor(hour / 24) + 1} ${String(hour % 24).padStart(2, '0')}:00`, width: pixel(120) })),
]

const sticky = useTableStickyColumns<Reading>({ startKeys: ['station'] })
const columnWindow = useTableColumnsVirtualization<Reading>({ initialViewportWidth: 720 })
</script>

<template>
  <Table
    :data="readings"
    :columns="columns"
    id-key="id"
    :plugins="{ sticky, columnWindow }"
  />
</template>
