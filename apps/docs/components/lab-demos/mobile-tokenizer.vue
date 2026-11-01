<script setup lang="ts">
import type { SearchableItem, SearchSource } from '@astryx-vue/lab'
import { MobileTokenizer } from '@astryx-vue/lab'
import { ref } from 'vue'

const items: SearchableItem[] = [
  { id: 'design', label: 'Design', description: 'Product design and research' },
  { id: 'engineering', label: 'Engineering', description: 'Application development' },
  { id: 'documentation', label: 'Documentation', description: 'Guides and references' },
  { id: 'accessibility', label: 'Accessibility', description: 'Inclusive experience' },
]
const source: SearchSource = {
  search: query => items.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => items,
}
const selected = ref<SearchableItem[]>([items[0]!])
</script>

<template>
  <MobileTokenizer
    v-model="selected"
    :search-source="source"
    label="Project tags"
    placeholder="Add tags"
    has-create
    :debounce-ms="0"
    style="width: min(100%, 360px)"
  />
</template>
