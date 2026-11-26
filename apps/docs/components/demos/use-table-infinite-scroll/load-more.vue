<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { proportional, Table, useTableInfiniteScroll } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface Walk extends Record<string, unknown> {
  id: string
  trail: string
  distance: number
}

const TOTAL = 30
const BATCH = 8

function makeWalk(index: number): Walk {
  return { id: `walk-${index}`, trail: `Trail ${index + 1}`, distance: 2 + (index * 7) % 13 }
}

const columns: TableColumn<Walk>[] = [
  { key: 'trail', header: 'Trail', width: proportional(2) },
  { key: 'distance', header: 'Distance (km)', width: proportional(1), align: 'end' },
]

const rows = ref<Walk[]>(Array.from({ length: BATCH }, (_, index) => makeWalk(index)))
const isLoading = ref(false)
const hasMore = ref(true)

async function loadMore(): Promise<void> {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  const start = rows.value.length
  const next = Array.from({ length: Math.min(BATCH, TOTAL - start) }, (_, offset) => makeWalk(start + offset))
  rows.value = [...rows.value, ...next]
  hasMore.value = rows.value.length < TOTAL
  isLoading.value = false
}

const infiniteScroll = useTableInfiniteScroll<Walk>(() => ({
  hasMore: hasMore.value,
  isLoading: isLoading.value,
  onLoadMore: loadMore,
}))
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    id-key="id"
    :plugins="{ infiniteScroll }"
  />
</template>
