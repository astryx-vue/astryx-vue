<script setup lang="ts">
import type { SearchableItem, SearchSource } from '@astryx-vue/core'
import { Avatar } from '@astryx-vue/core/Avatar'
import { Center } from '@astryx-vue/core/Center'
import { Typeahead, TypeaheadItem } from '@astryx-vue/core/Typeahead'
import { shallowRef } from 'vue'

interface PersonItem extends SearchableItem {
  auxiliaryData: { role: string }
}

const people: PersonItem[] = [
  { id: '1', label: 'Alice Johnson', auxiliaryData: { role: 'Engineer' } },
  { id: '2', label: 'Bob Smith', auxiliaryData: { role: 'Designer' } },
  { id: '3', label: 'Charlie Brown', auxiliaryData: { role: 'Product Manager' } },
  { id: '4', label: 'Diana Prince', auxiliaryData: { role: 'Data Scientist' } },
  { id: '5', label: 'Eve Davis', auxiliaryData: { role: 'QA Engineer' } },
]

const peopleSource: SearchSource<PersonItem> = {
  search: (query: string) =>
    people.filter(p => p.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => people.slice(0, 4),
}

const value = shallowRef<PersonItem | null>(null)
</script>

<template>
  <Center :width="320">
    <Typeahead
      v-model="value"
      label="Assignee"
      placeholder="Search people..."
      :search-source="peopleSource"
    >
      <template #item="{ item }">
        <TypeaheadItem :item="item" :description="item.auxiliaryData.role">
          <template #icon>
            <Avatar :name="item.label" size="md" />
          </template>
        </TypeaheadItem>
      </template>
    </Typeahead>
  </Center>
</template>
