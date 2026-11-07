<script setup lang="ts">
import type { CalendarEvent } from './types.js'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { isDayEvent } from './dateMath.js'
import { formatEventTimeRange, getEventCategory } from './format.js'
import ScheduleTime from './ScheduleTime.vue'

defineOptions({ name: 'AstryxScheduleListEventRow' })

const props = defineProps<{
  event: CalendarEvent
  past?: boolean
}>()

const ctx = useScheduleContext()
const category = computed(() => getEventCategory(props.event, ctx.categories))
const time = computed(() => isDayEvent(props.event)
  ? 'All day'
  : formatEventTimeRange(props.event, ctx.timezoneID, ctx.locale))
</script>

<template>
  <div class="astryx-schedule__list-row">
    <span class="astryx-schedule__dot" :data-color="category.color" :data-past="past ? 'true' : undefined" aria-hidden="true" />
    <span class="astryx-schedule__list-time">
      <ScheduleTime>{{ time }}</ScheduleTime>
    </span>
    <span class="astryx-schedule__list-title" :data-past="past ? 'true' : undefined">{{ event.title }}</span>
  </div>
</template>
