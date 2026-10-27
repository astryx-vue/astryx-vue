<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'

const source = createStaticSource([
  { id: 'alice', label: 'Alice Johnson' },
  { id: 'bob', label: 'Bob Smith' },
  { id: 'charlie', label: 'Charlie Brown' },
])
</script>

<template>
  <div class="overview-field">
    <Tokenizer
      label="Team Members"
      placeholder="Search people..."
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
