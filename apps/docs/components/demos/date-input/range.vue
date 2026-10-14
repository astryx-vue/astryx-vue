<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const startDay = 8
const endDay = 21
const min = new Date(year, month, startDay)
const max = new Date(year, month, endDay)
const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'short' })
const description = `Available dates: ${monthName} ${startDay} – ${endDay}, ${year}`
const value = ref<Date | null>(null)

function iso(date: Date | null): string {
  if (!date)
    return ''
  const monthNumber = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${monthNumber}-${day}`
}
</script>

<template>
  <VStack :gap="4" width="100%" style="min-width: 240px; max-width: 400px">
    <Text type="supporting" color="secondary">
      {{ value ? `Booked: ${iso(value)}` : 'Pick a date in the available range' }}
    </Text>
    <DateInput
      v-model="value"
      label="Booking date"
      :min="min"
      :max="max"
      :description="description"
      placeholder="Select a booking date"
      presentation="adaptive-bottom-sheet"
    />
  </VStack>
</template>
