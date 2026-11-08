<script setup lang="ts">
import type { CalendarEvent } from './types.js'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { isDayEvent } from './dateMath.js'
import { formatEventStartTime, formatEventTimeRange, getEventCategory } from './format.js'
import ScheduleTime from './ScheduleTime.vue'

defineOptions({ name: 'AstryxScheduleEventPill' })

const props = withDefaults(defineProps<{
  event: CalendarEvent
  past?: boolean
  /** `title` 先写标题，时间跟在后面；`time` 先写时间。 */
  lead?: 'title' | 'time'
  /** 跟在标题后面的时间。不传时按事件自己算。 */
  timeLabel?: string | null
}>(), {
  past: false,
  lead: 'title',
  timeLabel: undefined,
})

const ctx = useScheduleContext()
const category = computed(() => getEventCategory(props.event, ctx.categories))
const time = computed(() => {
  if (props.timeLabel !== undefined)
    return props.timeLabel
  if (isDayEvent(props.event))
    return null
  return props.lead === 'title'
    ? formatEventStartTime(props.event, ctx.timezoneID, ctx.locale)
    : formatEventTimeRange(props.event, ctx.timezoneID, ctx.locale)
})
</script>

<template>
  <span class="astryx-schedule__pill" :data-color="category.color" :data-past="past ? 'true' : undefined">
    <span v-if="lead === 'title'" class="astryx-schedule__title-line">
      <span class="astryx-schedule__pill-title">{{ event.title }}</span>
      <span v-if="time" class="astryx-schedule__pill-time">
        <ScheduleTime>{{ time }}</ScheduleTime>
      </span>
    </span>
    <template v-else>
      <span v-if="time" class="astryx-schedule__event-time">
        <ScheduleTime>{{ time }}</ScheduleTime>
      </span>
      <span class="astryx-schedule__pill-title">{{ event.title }}</span>
    </template>
  </span>
</template>
