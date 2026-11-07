<script setup lang="ts">
import type { ScheduleView } from '@astryx-vue/lab'
import {
  createEventFromISO,
  createScheduleDayView,
  createScheduleListView,
  createScheduleMonthlyView,
  createScheduleWeeklyView,
  Schedule,
  useSchedulePaginationPlugin,
  useScheduleViewSelectorPlugin,
} from '@astryx-vue/lab'
import { computed, h, ref } from 'vue'

const date = ref(Date.UTC(2026, 10, 7, 15, 0))
const details = (event: { title: string }) => h('p', event.title)
const month = createScheduleMonthlyView({ renderPopover: details }) as ScheduleView
const week = createScheduleWeeklyView({ renderPopover: details }) as ScheduleView
const day = createScheduleDayView({ renderPopover: details }) as ScheduleView
const list = createScheduleListView() as ScheduleView
const views = [
  { view: month, label: 'Month' },
  { view: week, label: 'Week' },
  { view: day, label: 'Day' },
  { view: list, label: 'List' },
]
const view = ref(month)
const plugins = [
  useSchedulePaginationPlugin(),
  useScheduleViewSelectorPlugin(views, {
    onChangeView: (next) => {
      view.value = next
    },
  }),
]
const categories = [
  { label: 'Work', color: 'blue' as const },
  { label: 'Design', color: 'purple' as const },
  { label: 'Launch', color: 'orange' as const },
]
const events = [
  createEventFromISO({ id: 'plan', title: 'Planning', category: 'Work', start: '2026-11-02', end: '2026-11-04' }),
  createEventFromISO({ id: 'design', title: 'Design review', category: 'Design', start: '2026-11-04T10:00:00.000Z', end: '2026-11-04T11:30:00.000Z' }),
  createEventFromISO({ id: 'launch', title: 'Launch check', category: 'Launch', start: '2026-11-07T14:00:00.000Z', end: '2026-11-07T15:30:00.000Z' }),
]
const scheduleView = computed(() => view.value)
</script>

<template>
  <div class="schedule-demo">
    <Schedule
      :view="scheduleView"
      :events="events"
      :categories="categories"
      :date="date"
      :plugins="plugins"
      timezone-i-d="UTC"
      @change-date="date = $event"
    />
  </div>
</template>

<style scoped>
.schedule-demo {
  min-height: 720px;
}
</style>
