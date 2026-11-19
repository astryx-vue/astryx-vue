<script setup lang="ts">
import type { SearchableItem, SearchSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { shallowRef } from 'vue'

const fruits: SearchableItem[] = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
  { id: '4', label: 'Date' },
  { id: '5', label: 'Elderberry' },
  { id: '6', label: 'Fig' },
  { id: '7', label: 'Grape' },
  { id: '8', label: 'Honeydew' },
]

const fruitSource: SearchSource = {
  search: (query: string) =>
    fruits.filter(f => f.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => fruits.slice(0, 5),
}

const value = shallowRef<SearchableItem | null>(null)
</script>

<template>
  <div class="typeahead-overview">
    <Typeahead
      v-model="value"
      label="Fruit"
      placeholder="Search fruits..."
      :search-source="fruitSource"
    />
  </div>
</template>

<style scoped>
.typeahead-overview {
  width: 320px;
}
</style>
