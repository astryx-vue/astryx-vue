<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'

const people = computed(() => [
  { id: 'alice', label: 'Alice Johnson' },
  { id: 'bob', label: 'Bob Smith' },
  { id: 'charlie', label: 'Charlie Brown' },
  { id: 'diana', label: 'Diana Prince' },
  { id: 'eve', label: 'Eve Williams' },
])
const source = computed(() => createStaticSource(people.value))
const selected = ref<SearchableItem[]>([])
selected.value = people.value.slice(0, 2)
</script>

<template>
  <div class="demo-container">
    <Tokenizer
      v-model="selected"
      :search-source="source"
      label="Team Members"
      placeholder="Search people..."
      :debounce-ms="0"
      has-clear
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
