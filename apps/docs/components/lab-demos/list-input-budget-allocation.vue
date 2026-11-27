<script setup lang="ts">
import type { ListInputColumn } from '@astryx-vue/lab'
import { NumberInput, Selector } from '@astryx-vue/core'
import { ListInput } from '@astryx-vue/lab'
import { computed, h, ref } from 'vue'

interface Allocation {
  id: string
  team: string
  percent: number | null
}

const TEAM_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
]

const allocations = ref<Allocation[]>([
  { id: 'design', team: 'design', percent: 35 },
  { id: 'engineering', team: 'engineering', percent: 40 },
  { id: 'marketing', team: 'marketing', percent: 15 },
])
let nextId = 0

function createItem(): Allocation {
  nextId += 1
  return { id: `allocation-${nextId}`, team: '', percent: null }
}
const total = computed(() => allocations.value.reduce((sum, allocation) => sum + (allocation.percent ?? 0), 0))

const columns: ListInputColumn<Allocation>[] = [
  {
    key: 'team',
    header: 'Team',
    width: { type: 'proportional', value: 2, minWidth: 180 },
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(Selector, {
      label,
      isLabelHidden,
      options: TEAM_OPTIONS,
      modelValue: item.team,
      placeholder: 'Choose a team',
      status,
      statusVariant,
      isDisabled: isDisabled || isLoading,
      onChange: (team: string | number | null) => updateItem({ ...item, team: String(team ?? '') }, 'team'),
    }),
  },
  {
    key: 'percent',
    header: 'Allocation',
    width: { type: 'pixel', value: 132 },
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(NumberInput, {
      label,
      isLabelHidden,
      modelValue: item.percent,
      min: 0,
      max: 100,
      units: '%',
      isIntegerOnly: true,
      status,
      statusVariant,
      isDisabled: isDisabled || isLoading,
      onChange: (percent: number | null) => updateItem({ ...item, percent }, 'percent'),
    }),
  },
]

function getItemStatus(allocation: Allocation) {
  const isDuplicate = allocation.team !== '' && allocations.value.some(candidate => candidate.id !== allocation.id && candidate.team === allocation.team)
  return isDuplicate ? { type: 'error' as const, message: 'Each team can only appear once.' } : undefined
}
</script>

<template>
  <div class="list-input-example">
    <ListInput
      v-model="allocations"
      label="Quarterly budget allocation"
      description="Assign each team once. The percentages must total 100%."
      item-name="allocation"
      :columns="columns"
      :get-item-key="allocation => allocation.id"
      :create-item="createItem"
      is-required
      :max-items="4"
      :status="total === 100 ? undefined : { type: 'error', message: `Allocations must total 100%. Current total: ${total}%.` }"
      :get-item-status="getItemStatus"
    />
  </div>
</template>

<style scoped>
.list-input-example {
  width: 100%;
  max-width: 680px;
}
</style>
