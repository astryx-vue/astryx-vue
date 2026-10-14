<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { DateInput } from '@astryx-vue/core/DateInput'
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { VStack } from '@astryx-vue/core/Stack'
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { ref } from 'vue'

interface Deadline {
  preset: 'today' | 'next-week' | 'custom'
  date: Date
  time: string
}

const labels = {
  'today': 'Today',
  'next-week': 'Next week',
  'custom': 'Custom date',
} as const

const value = ref<Deadline>({
  preset: 'today',
  date: new Date(2026, 3, 6),
  time: '17:00',
})

function iso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function formatDeadline(item: Deadline): string {
  if (item.preset === 'custom')
    return `${iso(item.date)} at ${item.time}`
  return labels[item.preset]
}
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <ComplexSelector
      v-model="value"
      label="Deadline"
      description="Choose a preset or set a custom date and time."
      :trigger-label="formatDeadline(value)"
      width="100%"
    >
      <template #default="{ value: selected, commit, close }">
        <VStack :gap="4" style="width: 320px">
          <RadioList
            label="When is it due?"
            :model-value="selected.preset"
            @update:model-value="preset => commit({ ...selected, preset: preset as Deadline['preset'] })"
          >
            <RadioListItem label="Today" value="today" />
            <RadioListItem label="Next week" value="next-week" />
            <RadioListItem label="Custom date" value="custom" />
          </RadioList>
          <VStack v-if="selected.preset === 'custom'" :gap="3">
            <DateInput
              label="Date"
              :model-value="selected.date"
              @update:model-value="value => value && commit({ ...selected, date: value })"
            />
            <TimeInput
              label="Time"
              :model-value="selected.time"
              @update:model-value="next => { if (typeof next === 'string' && next) commit({ ...selected, time: next }) }"
            />
          </VStack>
          <Button label="Apply" variant="primary" @click="close" />
        </VStack>
      </template>
    </ComplexSelector>
  </div>
</template>
