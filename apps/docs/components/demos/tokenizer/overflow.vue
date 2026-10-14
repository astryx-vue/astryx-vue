<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'

const people = computed<SearchableItem[]>(() => [
  { id: 'alice', label: 'Alice Johnson' },
  { id: 'bob', label: 'Bob Smith' },
  { id: 'charlie', label: 'Charlie Brown' },
  { id: 'diana', label: 'Diana Prince' },
  { id: 'eve', label: 'Eve Williams' },
  { id: 'frank', label: 'Frank Miller' },
])
const source = computed(() => createStaticSource(people.value))
const inlineValue = ref<SearchableItem[]>([])
const layerValue = ref<SearchableItem[]>([])
inlineValue.value = people.value.map(item => ({ ...item }))
layerValue.value = people.value.map(item => ({ ...item }))
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      Inline overflow — content shifts down on expand
    </p>
    <Tokenizer
      v-model="inlineValue"
      :search-source="source"
      label="Inline Overflow"
      placeholder="Add more..."
      overflow="unfocused-inline"
      :debounce-ms="0"
    />
    <p class="demo-caption">
      Layer overflow — expands as overlay, no layout shift
    </p>
    <Tokenizer
      v-model="layerValue"
      :search-source="source"
      label="Layer Overflow"
      placeholder="Add more..."
      overflow="unfocused-layer"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 25rem;
  max-width: calc(100vw - 4rem);
}
.demo-caption {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
