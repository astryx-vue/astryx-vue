<script setup lang="ts">
import type { ScheduleDayViewOptions } from './dayView.js'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { enumerateDates } from './dateMath.js'
import { formatFullDate } from './format.js'
import ScheduleFrame from './ScheduleFrame.vue'
import ScheduleTitle from './ScheduleTitle.vue'
import TimeGridView from './TimeGridView.vue'

defineOptions({ name: 'AstryxScheduleDayView' })

defineProps<{ options: ScheduleDayViewOptions }>()
const ctx = useScheduleContext()
const day = computed(() => ctx.date.toPlainDate())
const days = computed(() => enumerateDates(ctx.range.startDate, ctx.range.endDate))
const titleLabel = computed(() => formatFullDate(day.value, ctx.locale))
</script>

<template>
  <ScheduleFrame :title-label="titleLabel" :is-loading="ctx.isLoading">
    <template #title>
      <ScheduleTitle :start="day" />
    </template>
    <TimeGridView
      :days="days"
      :events="ctx.events"
      :focus-date="ctx.focusDate.toPlainDate()"
      :timezone-i-d="ctx.timezoneID"
      :min-hour="options.minHour ?? 0"
      :max-hour="options.maxHour ?? 24"
      :hour-height="options.hourHeight ?? 100"
      :label="titleLabel"
      :render-popover="options.renderPopover"
    />
  </ScheduleFrame>
</template>
