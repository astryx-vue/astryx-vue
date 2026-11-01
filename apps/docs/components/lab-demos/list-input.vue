<script setup lang="ts">
import type { ListInputColumn } from '@astryx-vue/lab'
import { TextInput } from '@astryx-vue/core'
import { ListInput } from '@astryx-vue/lab'
import { h, ref } from 'vue'

interface Guest {
  id: string
  name: string
  role: string
}

const guests = ref<Guest[]>([
  { id: 'ada', name: 'Ada Lovelace', role: 'Engineer' },
  { id: 'grace', name: 'Grace Hopper', role: 'Reviewer' },
])
let nextId = 0
const createItem = (): Guest => ({ id: `guest-${++nextId}`, name: '', role: '' })
const columns: ListInputColumn<Guest>[] = ['name', 'role'].map(key => ({
  key,
  header: key === 'name' ? 'Name' : 'Role',
  renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(TextInput, {
    label,
    isLabelHidden,
    modelValue: item[key as keyof Guest],
    status,
    statusVariant,
    isDisabled,
    isLoading,
    onChange: (value: string) => updateItem({ ...item, [key]: value }, key),
  }),
}))
</script>

<template>
  <ListInput
    v-model="guests"
    :columns="columns"
    :get-item-key="item => item.id"
    :create-item="createItem"
    label="Guests"
    item-name="guest"
    is-reorderable
    style="width: 100%"
  />
</template>
