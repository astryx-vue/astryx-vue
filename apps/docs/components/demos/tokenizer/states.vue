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
])
const source = computed(() => createStaticSource(people.value))
const errorValue = ref<SearchableItem[]>([])
const warningValue = ref<SearchableItem[]>([])
const successValue = ref<SearchableItem[]>([])
warningValue.value = [people.value[0]!]
successValue.value = [people.value[1]!, people.value[3]!]
const disabledValue = computed(() => [people.value[0]!, people.value[2]!])
</script>

<template>
  <div class="demo-stack">
    <Tokenizer
      :model-value="disabledValue"
      :search-source="source"
      label="Disabled field"
      disabled
    />
    <Tokenizer
      v-model="errorValue"
      :search-source="source"
      label="Error message"
      placeholder="Search people..."
      required
      status="error"
      status-message="At least one reviewer is required"
      :debounce-ms="0"
    />
    <Tokenizer
      v-model="warningValue"
      :search-source="source"
      label="Warning message"
      placeholder="Search people..."
      status="warning"
      status-message="Consider adding at least 2 approvers"
      :debounce-ms="0"
    />
    <Tokenizer
      v-model="successValue"
      :search-source="source"
      label="Success message"
      placeholder="Search people..."
      status="success"
      status-message="All required reviewers added"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 25rem;
  max-width: calc(100vw - 4rem);
}
</style>
