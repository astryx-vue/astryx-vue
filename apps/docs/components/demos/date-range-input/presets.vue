<script setup lang="ts">
import type { DateRange } from '@astryx-vue/core/DateRangeInput'
import { DateRangeInput } from '@astryx-vue/core/DateRangeInput'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'

function isoDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const range = shallowRef<DateRange | null>(null)
const presets = [
  { label: 'Last 7 days', getRange: () => ({ start: isoDaysAgo(7), end: isoDaysAgo(0) }) },
  { label: 'Last 14 days', getRange: () => ({ start: isoDaysAgo(14), end: isoDaysAgo(0) }) },
  { label: 'Last 30 days', getRange: () => ({ start: isoDaysAgo(30), end: isoDaysAgo(0) }) },
  { label: 'Last 90 days', getRange: () => ({ start: isoDaysAgo(90), end: isoDaysAgo(0) }) },
]
</script>

<template>
  <VStack :gap="4" style="width: 100%; max-width: 400px">
    <Text type="supporting" color="secondary">
      {{ range ? `${range.start} → ${range.end}` : 'No range selected' }}
    </Text>
    <DateRangeInput
      v-model="range"
      label="Report period"
      description="Use a preset or pick a custom range"
      :presets="presets"
    />
  </VStack>
</template>
