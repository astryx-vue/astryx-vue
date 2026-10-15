<script setup lang="ts">
import type { CalendarHandle } from '@astryx-vue/core/Calendar'
import { provideAstryxLocale } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Calendar } from '@astryx-vue/core/Calendar'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const range = ref({ start: new Date(2026, 0, 12), end: new Date(2026, 0, 14) })
const calendar = ref<CalendarHandle | null>(null)

function bindCalendar(handle: CalendarHandle | null): void {
  calendar.value = handle
}

function jump(): void {
  calendar.value?.navigateTo(new Date(2026, 5, 8))
}
</script>

<template>
  <VStack :gap="3">
    <HStack :gap="2">
      <Button size="sm" variant="secondary" label="June" @click="jump" />
      <Text type="supporting" color="secondary">
        At most three days, Sundays excluded. Escape cancels a range that is still open.
      </Text>
    </HStack>
    <Calendar
      v-model:range="range"
      mode="range"
      :handle-ref="bindCalendar"
      :focus-date="new Date(2026, 0, 1)"
      :max-range-span="3"
      :date-constraints="[(date: Date) => date.getDay() !== 0]"
    />
  </VStack>
</template>
