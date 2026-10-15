<script setup lang="ts">
import type { MultiSelectorCreateChange } from '@astryx-vue/core/MultiSelector'
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

interface Permission {
  value: string
  label: string
}

const base: Permission[] = [
  { value: 'read', label: 'Read' },
  { value: 'billing', label: 'Billing' },
]

const options = ref<Permission[]>([...base])
const selected = ref<string[]>([])
const summary = ref(['read', 'billing'])
const locked = ref(['read'])

function onChange(values: (string | number)[], change?: MultiSelectorCreateChange): void {
  selected.value = values.map(String)
  if (change?.type !== 'create')
    return
  const query = change.query
  if (options.value.some(option => option.label.toLowerCase() === query.toLowerCase()))
    return
  options.value = [...options.value, { value: query, label: query }]
}
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <VStack :gap="6">
      <MultiSelector
        :model-value="selected"
        label="Permissions"
        :options="options"
        searchable
        has-create
        @change="onChange"
      />
      <MultiSelector
        v-model="summary"
        label="Summary"
        :options="base"
        trigger-display="labels"
        :format-value="items => items.map(item => item.label).join(' & ')"
      />
      <MultiSelector v-model="locked" label="Locked" :options="base" is-read-only />
    </VStack>
  </div>
</template>
