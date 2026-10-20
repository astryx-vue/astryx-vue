<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { proportional, Table, useTableRowIndex } from '@astryx-vue/core/Table'

interface Track extends Record<string, unknown> {
  id: string
  title: string
  artist: string
  plays: number
}

const tracks: Track[] = [
  { id: 'nightfall', title: 'Nightfall', artist: 'Ava Chen', plays: 1820 },
  { id: 'ember', title: 'Ember', artist: 'Liam Park', plays: 942 },
  { id: 'tidal', title: 'Tidal', artist: 'Zoe Vega', plays: 3310 },
  { id: 'cinder', title: 'Cinder', artist: 'Max Ross', plays: 604 },
  { id: 'halcyon', title: 'Halcyon', artist: 'Mia Cole', plays: 2075 },
]

const columns: TableColumn<Track>[] = [
  { key: 'title', header: 'Title', width: proportional(2) },
  { key: 'artist', header: 'Artist', width: proportional(2) },
  { key: 'plays', header: 'Plays', width: proportional(1), align: 'end' },
]

const rowIndex = useTableRowIndex<Track>({
  data: tracks,
  getRowKey: track => track.id,
})
</script>

<template>
  <Table
    :data="tracks"
    :columns="columns"
    id-key="id"
    :plugins="{ rowIndex }"
  />
</template>
