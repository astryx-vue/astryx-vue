<script setup lang="ts">
import type { SearchableItem, TypeaheadHandle, TypeaheadMenuConfig } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref, useTemplateRef } from 'vue'

type Field = SearchableItem & { values: string[] }
interface Filter { field: Field, value: string }

const fields: Field[] = [
  { id: 'status', label: 'Status', values: ['Open', 'In review', 'Closed'] },
  { id: 'priority', label: 'Priority', values: ['High', 'Medium', 'Low'] },
  { id: 'owner', label: 'Owner', values: ['Me', 'My team', 'Anyone'] },
]
const source = createStaticSource<Field>(fields)

const typeahead = useTemplateRef<TypeaheadHandle>('typeahead')
const picked = ref<Field | null>(null)
const filters = ref<Filter[]>([])
const editing = ref<Filter | null>(null)

// Picking a field switches the same menu from the result list to a dialog that edits its value.
const menu = computed<TypeaheadMenuConfig>(() => editing.value == null
  ? { role: 'listbox' }
  : { role: 'dialog', label: `${editing.value.field.label} filter` })

function edit(filter: Filter): void {
  editing.value = filter
  typeahead.value?.open()
}

function onPick(field: Field | null): void {
  if (field == null)
    return
  picked.value = null
  edit(filters.value.find(filter => filter.field.id === field.id) ?? { field, value: field.values[0]! })
}

function apply(value: string, close: () => void): void {
  const filter = editing.value
  if (filter == null)
    return
  filters.value = [...filters.value.filter(each => each.field.id !== filter.field.id), { field: filter.field, value }]
  close()
}
</script>

<template>
  <VStack :gap="3" class="demo-container">
    <Typeahead
      ref="typeahead"
      v-model="picked"
      :search-source="source"
      :menu="menu"
      label="Add a filter"
      placeholder="Add a filter..."
      :debounce-ms="0"
      has-entries-on-focus
      @change="onPick"
      @open-change="open => { if (!open) editing = null }"
    >
      <template #menu="{ listbox, query, close }">
        <template v-if="editing == null">
          <Text type="supporting" color="secondary" class="menu-note">
            {{ query === '' ? 'Filter by' : `Fields matching "${query}"` }}
          </Text>
          <component :is="listbox" />
          <Text type="supporting" color="secondary" class="menu-note">
            Arrow keys move, Enter picks
          </Text>
        </template>
        <VStack v-else :gap="2" class="menu-editor">
          <Button
            v-for="value in editing.field.values"
            :key="value"
            :label="value"
            :variant="value === editing.value ? 'primary' : 'secondary'"
            @click="apply(value, close)"
          />
        </VStack>
      </template>
    </Typeahead>
    <HStack :gap="2" wrap="wrap">
      <Text v-if="filters.length === 0" type="supporting" color="secondary">
        No filters
      </Text>
      <Button
        v-for="filter in filters"
        :key="filter.field.id"
        :label="`${filter.field.label}: ${filter.value}`"
        variant="secondary"
        size="sm"
        @click="edit(filter)"
      />
    </HStack>
  </VStack>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
.menu-note {
  padding: var(--astryx-spacing-1, 4px) var(--astryx-spacing-3, 12px);
}
.menu-editor {
  min-width: 14rem;
  padding: var(--astryx-spacing-3, 12px);
}
</style>
