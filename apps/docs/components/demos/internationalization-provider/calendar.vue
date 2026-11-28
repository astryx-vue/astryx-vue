<script setup lang="ts">
import type { CalendarSystem } from '@astryx-vue/core'
import { Calendar } from '@astryx-vue/core/Calendar'
import { DateInput } from '@astryx-vue/core/DateInput'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const calendar = ref<CalendarSystem>('japanese')
const value = ref<Date | null>(new Date(2026, 9, 30))

function iso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <InternationalizationProvider locale="en" :calendar="calendar">
    <VStack :gap="4" h-align="center">
      <SegmentedControl v-model="calendar" label="Calendar" size="sm">
        <SegmentedControlItem value="gregory" label="Gregorian" />
        <SegmentedControlItem value="japanese" label="Japanese" />
        <SegmentedControlItem value="buddhist" label="Buddhist" />
        <SegmentedControlItem value="persian" label="Persian" />
      </SegmentedControl>
      <DateInput v-model="value" label="Date" />
      <Calendar v-model="value" />
      <Text type="supporting" color="secondary">
        {{ value ? `Value: ${iso(value)}` : 'No date' }}
      </Text>
    </VStack>
  </InternationalizationProvider>
</template>
