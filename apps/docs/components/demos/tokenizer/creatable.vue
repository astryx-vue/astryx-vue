<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'

const tags = ref<SearchableItem[]>([])
const members = ref<SearchableItem[]>([])
const emptySource = createStaticSource<SearchableItem>([])
const people = computed(() => createStaticSource([
  { id: 'alice', label: 'Alice Johnson' },
  { id: 'bob', label: 'Bob Smith' },
  { id: 'charlie', label: 'Charlie Brown' },
  { id: 'diana', label: 'Diana Prince' },
  { id: 'eve', label: 'Eve Williams' },
]))
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      Free-text only
    </p>
    <Tokenizer
      v-model="tags"
      :search-source="emptySource"
      label="Tags"
      placeholder="Type a tag and press Enter..."
      has-create
      :debounce-ms="0"
    />
    <p class="demo-caption">
      Create or search
    </p>
    <Tokenizer
      v-model="members"
      :search-source="people"
      label="Team Members"
      placeholder="Search or type a new name..."
      has-create
      has-entries-on-focus
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
