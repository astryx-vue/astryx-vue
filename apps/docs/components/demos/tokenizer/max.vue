<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'

const maxSkills = 3
const skills = computed(() => [
  { id: 'react', label: 'React' },
  { id: 'ts', label: 'TypeScript' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
])
const source = computed(() => createStaticSource(skills.value))
const selected = ref<SearchableItem[]>([skills.value[0]!, skills.value[1]!])
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      {{ `Limited to ${maxSkills} selections — ${maxSkills - selected.length} remaining` }}
    </p>
    <Tokenizer
      v-model="selected"
      :search-source="source"
      label="Top Skills"
      placeholder="Search skills..."
      :description="`Choose up to ${maxSkills} skills`"
      :max-entries="maxSkills"
      :debounce-ms="0"
    />
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
