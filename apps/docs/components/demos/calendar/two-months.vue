<script setup lang="ts">
import type { CalendarRangeValue } from '@astryx-vue/core/Calendar'
import { provideAstryxLocale } from '@astryx-vue/core'
import { Calendar } from '@astryx-vue/core/Calendar'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const range = ref<CalendarRangeValue>({
  start: new Date(2026, 0, 25),
  end: new Date(2026, 1, 5),
})
const focusDate = new Date(2026, 0, 1)

function iso(date: Date | null): string {
  if (!date)
    return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
</script>

<template>
  <VStack :gap="4" h-align="center">
    <Text type="supporting" color="secondary">
      {{ range.start && range.end ? `${iso(range.start)} → ${iso(range.end)}` : 'Pick a date range' }}
    </Text>
    <Calendar v-model:range="range" mode="range" :number-of-months="2" :focus-date="focusDate" />
  </VStack>
</template>
