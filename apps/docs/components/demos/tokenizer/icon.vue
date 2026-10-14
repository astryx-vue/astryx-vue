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
selected.value = [people.value[0]!, people.value[2]!]
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      Leading icon reinforces the search affordance
    </p>
    <Tokenizer
      v-model="selected"
      :search-source="source"
      label="Team Members"
      placeholder="Search people..."
      :debounce-ms="0"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      </template>
    </Tokenizer>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 25rem;
  max-width: calc(100vw - 4rem);
}
.demo-caption {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.demo-stack :deep(svg) {
  width: 1rem;
  height: 1rem;
}
</style>
