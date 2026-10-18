<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { Typeahead, TypeaheadItem } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

provideAstryxLocale('en')

interface PersonItem {
  id: string
  label: string
  auxiliaryData: { role: string }
}

const people: PersonItem[] = [
  { id: '1', label: 'Alice Johnson', auxiliaryData: { role: 'Engineer' } },
  { id: '2', label: 'Bob Smith', auxiliaryData: { role: 'Designer' } },
  { id: '3', label: 'Charlie Brown', auxiliaryData: { role: 'Product Manager' } },
]

const source = createStaticSource(people)
const value = ref<PersonItem | null>(null)
</script>

<template>
  <div class="typeahead-item-field">
    <Typeahead
      v-model="value"
      label="Assignee"
      placeholder="Search people..."
      :search-source="source"
      :debounce-ms="0"
      has-entries-on-focus
    >
      <template #item="{ item }">
        <TypeaheadItem :item="item" :description="item.auxiliaryData.role" />
      </template>
    </Typeahead>
  </div>
</template>

<style scoped>
.typeahead-item-field {
  width: 20rem;
  max-width: 100%;
}
</style>
