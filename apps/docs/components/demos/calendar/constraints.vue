<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { Calendar } from '@astryx-vue/core/Calendar'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<Date | null>(null)
const focusDate = new Date(2026, 0, 1)
const min = new Date(2026, 0, 10)
const max = new Date(2026, 2, 20)

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <VStack :gap="4" h-align="center">
    <Text type="supporting" color="secondary">
      Jan 10 – Mar 20, weekdays only
    </Text>
    <Calendar
      v-model="value"
      mode="single"
      :min="min"
      :max="max"
      :is-date-disabled="isWeekend"
      :focus-date="focusDate"
    />
  </VStack>
</template>
