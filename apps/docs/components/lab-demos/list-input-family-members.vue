<script setup lang="ts">
import type { ListInputColumn } from '@astryx-vue/lab'
import { DateInput, Selector, TextInput } from '@astryx-vue/core'
import { ListInput } from '@astryx-vue/lab'
import { h, ref } from 'vue'

interface FamilyMember {
  id: string
  fullName: string
  relationship: string
  dateOfBirth: Date | null
}

const RELATIONSHIP_OPTIONS = [
  { value: 'spouse-or-partner', label: 'Spouse or partner' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other-dependent', label: 'Other dependent' },
]

const members = ref<FamilyMember[]>([
  { id: 'jordan', fullName: 'Jordan Lee', relationship: 'spouse-or-partner', dateOfBirth: new Date(1988, 10, 2) },
  { id: 'alexandria', fullName: 'Alexandria María de la Cruz', relationship: 'child', dateOfBirth: new Date(2012, 5, 24) },
  { id: 'grace', fullName: 'Grace Lee', relationship: 'parent', dateOfBirth: new Date(1958, 3, 17) },
])
let nextId = 0

function createItem(): FamilyMember {
  nextId += 1
  return { id: `member-${nextId}`, fullName: '', relationship: '', dateOfBirth: null }
}

// 顺序无关紧要，所以这个列表不开重排。
const columns: ListInputColumn<FamilyMember>[] = [
  {
    key: 'fullName',
    header: 'Full legal name',
    width: { type: 'proportional', value: 2, minWidth: 200 },
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(TextInput, {
      label,
      isLabelHidden,
      modelValue: item.fullName,
      status,
      statusVariant,
      isDisabled,
      isLoading,
      onChange: (fullName: string) => updateItem({ ...item, fullName }, 'fullName'),
    }),
  },
  {
    key: 'relationship',
    header: 'Relationship',
    width: { type: 'proportional', value: 1.25, minWidth: 160 },
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(Selector, {
      label,
      isLabelHidden,
      options: RELATIONSHIP_OPTIONS,
      modelValue: item.relationship,
      placeholder: 'Choose relationship',
      status,
      statusVariant,
      isDisabled: isDisabled || isLoading,
      onChange: (relationship: string | number | null) => updateItem({ ...item, relationship: String(relationship ?? '') }, 'relationship'),
    }),
  },
  {
    key: 'dateOfBirth',
    header: 'Date of birth',
    width: { type: 'pixel', value: 176 },
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(DateInput, {
      label,
      isLabelHidden,
      modelValue: item.dateOfBirth,
      status,
      statusVariant,
      isDisabled,
      isLoading,
      onChange: (dateOfBirth: Date | null) => updateItem({ ...item, dateOfBirth }, 'dateOfBirth'),
    }),
  },
]
</script>

<template>
  <div class="list-input-example">
    <ListInput
      v-model="members"
      label="Family member declaration"
      description="Declare each immediate family member, their relationship to you, and their date of birth."
      item-name="family member"
      :columns="columns"
      :get-item-key="member => member.id"
      :create-item="createItem"
      is-required
    />
  </div>
</template>

<style scoped>
.list-input-example {
  width: 100%;
  max-width: 680px;
}
</style>
