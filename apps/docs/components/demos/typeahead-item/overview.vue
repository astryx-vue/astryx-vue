<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { Typeahead, TypeaheadItem } from '@astryx-vue/core/Typeahead'

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
</script>

<template>
  <div class="typeahead-item-field">
    <Typeahead label="Assignee" placeholder="Search people..." :search-source="source" :debounce-ms="0">
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
