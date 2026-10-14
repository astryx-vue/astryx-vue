<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
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
      Action button in the end slot
    </p>
    <Tokenizer
      v-model="selected"
      :search-source="source"
      label="Team Members"
      placeholder="Search people..."
      :debounce-ms="0"
    >
      <template #end>
        <Button label="Apply" variant="primary" size="sm" />
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
</style>
