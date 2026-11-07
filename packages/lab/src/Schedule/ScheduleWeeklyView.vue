<script setup lang="ts">
import type { ScheduleWeeklyViewOptions } from './weeklyView.js'
import { plainDateAddDays } from '@astryx-vue/core'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { enumerateDates } from './dateMath.js'
import { formatWeekTitle } from './format.js'
import ScheduleFrame from './ScheduleFrame.vue'
import ScheduleTitle from './ScheduleTitle.vue'
import TimeGridView from './TimeGridView.vue'

defineOptions({ name: 'AstryxScheduleWeeklyView' })

defineProps<{ options: ScheduleWeeklyViewOptions }>()
const ctx = useScheduleContext()
const days = computed(() => enumerateDates(ctx.range.startDate, ctx.range.endDate))
const start = computed(() => days.value[0] ?? ctx.range.startDate)
const end = computed(() => days.value[days.value.length - 1] ?? plainDateAddDays(ctx.range.endDate, -1))
const titleLabel = computed(() => formatWeekTitle(start.value, end.value, ctx.locale))
</script>

<template>
  <ScheduleFrame :title-label="titleLabel" :is-loading="ctx.isLoading">
    <template #title>
      <ScheduleTitle :start="start" :end="end" />
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
