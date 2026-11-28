<script setup lang="ts">
import type { ListInputColumn } from '@astryx-vue/lab'
import { TextInput, useReorderable } from '@astryx-vue/core'
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
const reorderable = useReorderable<string>({
  onReorder: ({ key, to }) => {
    const moved = guests.value.find(guest => guest.id === key)
    if (moved == null)
      return
    const next = guests.value.filter(guest => guest !== moved)
    next.splice(to, 0, moved)
    guests.value = next
  },
})
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
  <div class="list-input-preview">
    <ListInput
      v-model="guests"
      :columns="columns"
      :get-item-key="item => item.id"
      :create-item="createItem"
      label="Guests"
      item-name="guest"
      :reorderable="reorderable"
    />
  </div>
</template>

<style scoped>
.list-input-preview {
  width: 100%;
}
</style>
