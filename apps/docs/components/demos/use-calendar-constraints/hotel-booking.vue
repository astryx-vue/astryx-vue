<script setup lang="ts">
import type { CalendarDay, PlainDate } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { useCalendarConstraints, useCalendarDays } from '@astryx-vue/core/Calendar'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const checkIn = ref<PlainDate | null>(null)
const checkOut = ref<PlainDate | null>(null)

// 6 月 5 日到 25 日营业，最多住 7 晚（跨 8 天），周一不开门。订好以后放开起点，整季都能看。
const { isDateDisabled } = useCalendarConstraints(() => ({
  min: '2026-06-05',
  max: '2026-06-25',
  maxRangeSpan: 8,
  rangeAnchor: checkOut.value ? null : checkIn.value,
  dateConstraints: [(date: Date) => date.getDay() !== 1],
}))
const { weeks, dayNames } = useCalendarDays({ year: 2026, month: 6, hasVariableRowCount: true })

const status = computed(() => {
  if (!checkIn.value)
    return 'Pick a check-in date'
  if (!checkOut.value)
    return `Check-in: Jun ${checkIn.value.day} (pick check-out)`
  return `Booked: Jun ${checkIn.value.day} – Jun ${checkOut.value.day}`
})

function isPicked(day: CalendarDay): boolean {
  return day.date.day === checkIn.value?.day || day.date.day === checkOut.value?.day
}

function select(day: CalendarDay): void {
  if (isDateDisabled(day.date))
    return
  if (!checkIn.value || checkOut.value || day.date.day <= checkIn.value.day) {
    checkIn.value = day.date
    checkOut.value = null
  }
  else {
    checkOut.value = day.date
  }
}

function reset(): void {
  checkIn.value = null
  checkOut.value = null
}
</script>

<template>
  <VStack :gap="3">
    <VStack :gap="1">
      <Text type="body" weight="bold">
        Hotel Booking — June 2026
      </Text>
      <Text type="supporting" color="secondary">
        Season: Jun 5 – Jun 25 · Max stay: 7 nights · Closed Mondays
      </Text>
    </VStack>
    <HStack :gap="2" align="center">
      <Text type="supporting">
        {{ status }}
      </Text>
      <Button v-if="checkIn" label="Reset" size="sm" variant="secondary" @click="reset" />
    </HStack>
    <table :style="{ tableLayout: 'fixed', width: '280px' }">
      <thead>
        <tr>
          <th v-for="name in dayNames" :key="name" scope="col">
            <Text type="supporting" color="secondary">
              {{ name }}
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]!.iso">
          <td v-for="day in week" :key="day.iso" align="center">
            <button
              v-if="!day.isOutside"
              type="button"
              :disabled="isDateDisabled(day.date)"
              :aria-pressed="isPicked(day)"
              :aria-label="`June ${day.dayNumber}`"
              :style="{ width: '32px', height: '32px', borderRadius: '6px', border: isPicked(day) ? '1px solid currentColor' : 'none', background: 'transparent', opacity: isDateDisabled(day.date) ? 0.35 : 1, cursor: isDateDisabled(day.date) ? 'not-allowed' : 'pointer' }"
              @click="select(day)"
            >
              <Text type="body" :color="isDateDisabled(day.date) ? 'secondary' : 'primary'">
                {{ day.dayNumber }}
              </Text>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </VStack>
</template>
