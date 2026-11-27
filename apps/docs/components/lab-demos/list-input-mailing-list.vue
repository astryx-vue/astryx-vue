<script setup lang="ts">
import type { ListInputColumn } from '@astryx-vue/lab'
import { TextInput } from '@astryx-vue/core'
import { ListInput } from '@astryx-vue/lab'
import { h, ref } from 'vue'

interface Subscriber {
  id: string
  email: string
}

const subscribers = ref<Subscriber[]>([])
const hasChanged = ref(false)
// 字段错误等到这一格离开过一次再出现。
const touched = ref<ReadonlySet<string>>(new Set())
let nextId = 0

function createItem(): Subscriber {
  nextId += 1
  return { id: `subscriber-${nextId}`, email: '' }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.trim())
}

const columns: ListInputColumn<Subscriber>[] = [{
  key: 'email',
  header: 'Email address',
  renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(TextInput, {
    type: 'email',
    label,
    isLabelHidden,
    modelValue: item.email,
    placeholder: 'name@example.com',
    status,
    statusVariant,
    isDisabled,
    isLoading,
    onChange: (email: string) => updateItem({ ...item, email }, 'email'),
    onBlur: () => {
      if (!touched.value.has(item.id))
        touched.value = new Set(touched.value).add(item.id)
    },
  }),
}]

function onChange(next: Subscriber[]): void {
  subscribers.value = next
  hasChanged.value = true
}

function getItemStatus(subscriber: Subscriber) {
  const email = subscriber.email.trim().toLowerCase()
  const isDuplicate = email !== '' && subscribers.value.some(candidate => candidate.id !== subscriber.id && candidate.email.trim().toLowerCase() === email)
  return isDuplicate ? { type: 'error' as const, message: 'This address is already in the list.' } : undefined
}

function getFieldStatus(subscriber: Subscriber) {
  if (!touched.value.has(subscriber.id))
    return undefined
  if (subscriber.email.trim() === '')
    return { type: 'error' as const, message: 'Enter an email address.' }
  return isValidEmail(subscriber.email) ? undefined : { type: 'error' as const, message: 'Enter a valid email address.' }
}
</script>

<template>
  <div class="list-input-example">
    <ListInput
      :model-value="subscribers"
      label="Mailing list"
      description="Add up to six addresses."
      item-name="subscriber"
      :columns="columns"
      :get-item-key="subscriber => subscriber.id"
      :create-item="createItem"
      is-required
      :max-items="6"
      :status="hasChanged && subscribers.length === 0 ? { type: 'error', message: 'Add at least one subscriber.' } : undefined"
      :get-item-status="getItemStatus"
      :get-field-status="getFieldStatus"
      @update:model-value="onChange"
    />
  </div>
</template>

<style scoped>
.list-input-example {
  width: 100%;
  max-width: 680px;
}
</style>
