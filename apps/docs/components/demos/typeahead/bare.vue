<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'

const selected = ref(null)
const source = computed(() => createStaticSource([
  { id: 'files', label: 'Search files', description: 'Jump to a file' },
  { id: 'settings', label: 'Open settings', description: 'Preferences' },
  { id: 'theme', label: 'Toggle theme', description: 'Light or dark' },
]))
</script>

<template>
  <div class="demo-container">
    <BaseTypeahead
      v-model="selected"
      :search-source="source"
      label="Command"
      placeholder="Type a command"
      :debounce-ms="0"
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
