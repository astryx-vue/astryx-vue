<script setup lang="ts">
import type { SearchableItem, SearchSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { ref } from 'vue'

const tags: SearchableItem[] = [
  { id: '1', label: 'Design' },
  { id: '2', label: 'Engineering' },
  { id: '3', label: 'Marketing' },
  { id: '4', label: 'Product' },
  { id: '5', label: 'Research' },
  { id: '6', label: 'Sales' },
]

const source: SearchSource = {
  search: (query: string) =>
    tags.filter(tag => tag.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => tags,
}

const value = ref<SearchableItem[]>([tags[0]!, tags[1]!])
</script>

<template>
  <div class="tokenizer-overview">
    <Tokenizer
      v-model="value"
      label="Tags"
      placeholder="Search..."
      :search-source="source"
    />
  </div>
</template>

<style scoped>
.tokenizer-overview {
  display: grid;
  grid-template-columns: minmax(0, 400px);
}
</style>
