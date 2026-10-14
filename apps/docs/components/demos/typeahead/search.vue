<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'

const selected = ref(null)
const source = computed(() => createStaticSource([
  { id: 'olivia', label: 'Olivia Martin' },
  { id: 'jackson', label: 'Jackson Lee' },
  { id: 'isabella', label: 'Isabella Nguyen' },
  { id: 'william', label: 'William Kim' },
  { id: 'sofia', label: 'Sofia Davis' },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      label="Team member"
      placeholder="Search people..."
      :debounce-ms="0"
      show-on-focus
    >
      <template #icon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
      </template>
    </Typeahead>
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
.demo-container :deep(svg) {
  width: 1rem;
  height: 1rem;
}
</style>
