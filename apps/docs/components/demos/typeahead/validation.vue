<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'

const selected = ref(null)
const source = computed(() => createStaticSource([
  { id: 'ny', label: 'New York' },
  { id: 'sf', label: 'San Francisco' },
  { id: 'london', label: 'London' },
  { id: 'berlin', label: 'Berlin' },
  { id: 'tokyo', label: 'Tokyo' },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      label="Office"
      placeholder="Search offices..."
      status="error"
      status-message="Please select an office location"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
