<script setup lang="ts">
import type { CalendarDay, ISODateString } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { useCalendarDays, useCalendarNavigation } from '@astryx-vue/core/Calendar'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { nextTick, ref, watch } from 'vue'

const focusDate = ref<ISODateString>('2026-06-01')
const { monthYearLabel, visibleCalendarMonths, navigateMonth, pendingFocus, clearPendingFocus } = useCalendarNavigation(() => ({
  focusDate: focusDate.value,
  onFocusDateChange: (next: ISODateString) => {
    focusDate.value = next
  },
}))
const { weeks, dayNames } = useCalendarDays(() => ({ ...visibleCalendarMonths.value[0]!, hasVariableRowCount: true }))

const buttons = new Map<string, HTMLButtonElement>()
function bind(iso: string, el: unknown): void {
  if (el instanceof HTMLButtonElement)
    buttons.set(iso, el)
  else
    buttons.delete(iso)
}

// 跨月后，等新的一个月画出来再把焦点放到目标日子上。
watch(pendingFocus, async (target) => {
  if (!target)
    return
  await nextTick()
  buttons.get(target)?.focus()
  clearPendingFocus()
})

function onKeydown(event: KeyboardEvent, day: CalendarDay): void {
  const rtl = getComputedStyle(event.currentTarget as Element).direction === 'rtl'
  const step = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') ? 1 : event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') ? -1 : 0
  if (step === 0)
    return
  event.preventDefault()
  const inMonth = weeks.value.flat().filter(d => !d.isOutside)
  const index = inMonth.findIndex(d => d.iso === day.iso) + step
  if (index < 0 || index >= inMonth.length)
    navigateMonth(step, day.iso, 1)
  else
    buttons.get(inMonth[index]!.iso)?.focus()
}
</script>

<template>
  <VStack :gap="3" :width="280">
    <HStack :gap="2" align="center" justify="between">
      <Button label="Previous" size="sm" variant="secondary" aria-label="Previous month" @click="navigateMonth(-1)" />
      <Text type="body" weight="bold">
        {{ monthYearLabel }}
      </Text>
      <Button label="Next" size="sm" variant="secondary" aria-label="Next month" @click="navigateMonth(1)" />
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
            <Text v-if="day.isOutside" type="body" color="secondary" aria-hidden="true">
              {{ day.dayNumber }}
            </Text>
            <button
              v-else
              :ref="el => bind(day.iso, el)"
              type="button"
              :aria-label="`${monthYearLabel} ${day.dayNumber}`"
              :style="{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer' }"
              @keydown="onKeydown($event, day)"
            >
              <Text type="body">
                {{ day.dayNumber }}
              </Text>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </VStack>
</template>
