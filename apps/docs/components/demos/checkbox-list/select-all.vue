<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { computed, shallowRef } from 'vue'

const documents = [
  { id: 'transactions', label: 'Transaction history' },
  { id: 'statements', label: 'Account statements' },
  { id: 'tax', label: 'Tax documents' },
  { id: 'invoices', label: 'Invoices' },
]
const selected = shallowRef(['transactions'])
const allIds = documents.map(document => document.id)
const allChecked = computed(() => allIds.every(id => selected.value.includes(id)))
const selectAllState = computed(() => allChecked.value ? true : selected.value.length === 0 ? false : 'indeterminate' as const)

function toggleAll(checked: boolean): void {
  selected.value = checked ? [...allIds] : []
}

function toggle(id: string, checked: boolean): void {
  selected.value = checked ? [...selected.value, id] : selected.value.filter(value => value !== id)
}
</script>

<template>
  <CheckboxList label="Include in export" has-dividers>
    <CheckboxListItem label="Select all" :is-checked="selectAllState" @check="toggleAll" />
    <CheckboxListItem
      v-for="document in documents"
      :key="document.id"
      :label="document.label"
      :is-checked="selected.includes(document.id)"
      @check="checked => toggle(document.id, checked)"
    />
  </CheckboxList>
</template>
