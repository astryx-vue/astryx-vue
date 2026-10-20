<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'

const selected = ref(null)
const source = computed(() => createStaticSource([
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
  { id: 'de', label: 'Germany' },
  { id: 'fr', label: 'France' },
  { id: 'jp', label: 'Japan' },
  { id: 'br', label: 'Brazil' },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      label="Country"
      placeholder="Search countries..."
      :debounce-ms="0"
      :max-menu-items="3"
      has-entries-on-focus
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
