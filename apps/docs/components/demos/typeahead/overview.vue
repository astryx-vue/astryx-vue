<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'

const source = createStaticSource([
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
  { id: 'grape', label: 'Grape' },
])
</script>

<template>
  <div class="overview-field">
    <Typeahead
      label="Fruit"
      placeholder="Search fruits..."
      :search-source="source"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.overview-field {
  width: 20rem;
  max-width: 100%;
}
</style>
