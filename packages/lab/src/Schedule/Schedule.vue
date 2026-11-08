<script setup lang="ts">
import type { ScheduleEmits, ScheduleProps } from './types.js'
import type { ZonedDateTimeRange } from './zonedDateTime.js'
import { plainDateFromInstant, useLocale } from '@astryx-vue/core'
import { computed, provide, reactive, toRaw, watchEffect } from 'vue'
import { ScheduleContext } from './context.js'
import { eventOverlapsRange, getBrowserTimezoneID, sortEvents } from './dateMath.js'
import { defaultSchedulePlugins } from './plugins.js'
import { TimeGridScrollKey } from './timeGridScroll.js'
import { useAsyncEvents } from './useAsyncEvents.js'
import { createZonedDateTime } from './zonedDateTime.js'
import '../../styles/schedule.css'

defineOptions({ name: 'AstryxSchedule', inheritAttrs: false })

const props = withDefaults(defineProps<ScheduleProps>(), {
  categories: () => [],
  plugins: () => defaultSchedulePlugins,
  headingLevel: 3,
})
const emit = defineEmits<ScheduleEmits>()

const { locale } = useLocale()
const timezoneID = computed(() => props.timezoneID ?? getBrowserTimezoneID())
const mountedFocus = Date.now()
const focusInstant = computed(() => props.focusDate ?? mountedFocus)
const zoned = computed(() => createZonedDateTime(props.date, timezoneID.value))
const focusZoned = computed(() => createZonedDateTime(focusInstant.value, timezoneID.value))
const rawView = computed(() => toRaw(props.view))

function updateDate(next: number): void {
  if (props.onChangeDate) {
    props.onChangeDate(next)
    return
  }
  emit('changeDate', next)
}

const previous = computed(() => rawView.value.getPreviousDateRange(zoned.value))
const nextRange = computed(() => rawView.value.getNextDateRange(zoned.value))

function shift(range: ZonedDateTimeRange): void {
  const current = rawView.value.getDateRange(zoned.value)
  updateDate(zoned.value.instant + range[0].instant - current[0].instant)
}

const scheduleRange = computed(() => {
  const [start, end] = rawView.value.getDateRange(zoned.value)
  return {
    start: start.instant,
    end: end.instant,
    startDate: plainDateFromInstant(start.instant, start.timezoneID),
    endDate: plainDateFromInstant(end.instant, end.timezoneID),
  }
})

const loaded = useAsyncEvents(() => props.events, () => ({
  start: scheduleRange.value.start,
  end: scheduleRange.value.end,
}))

const resolvedEvents = computed(() => {
  if (loaded.value.loading)
    return []
  return sortEvents(
    loaded.value.events.filter(event => eventOverlapsRange(event, scheduleRange.value, timezoneID.value)),
    timezoneID.value,
  )
})

const ctx = reactive({
  events: resolvedEvents.value,
  categories: props.categories,
  date: zoned.value,
  focusDate: focusZoned.value,
  timezoneID: timezoneID.value,
  locale: locale.value,
  range: scheduleRange.value,
  isLoading: loaded.value.loading,
  onPreviousDate: () => shift(previous.value.range),
  previousDateLabel: previous.value.label,
  onToday: () => updateDate(Date.now()),
  onNextDate: () => shift(nextRange.value.range),
  nextDateLabel: nextRange.value.label,
  view: rawView.value,
  plugins: props.plugins,
  headingLevel: props.headingLevel,
})

watchEffect(() => {
  ctx.events = resolvedEvents.value
  ctx.categories = props.categories
  ctx.date = zoned.value
  ctx.focusDate = focusZoned.value
  ctx.timezoneID = timezoneID.value
  ctx.locale = locale.value
  ctx.range = scheduleRange.value
  ctx.isLoading = loaded.value.loading
  ctx.onPreviousDate = () => shift(previous.value.range)
  ctx.previousDateLabel = previous.value.label
  ctx.onToday = () => updateDate(Date.now())
  ctx.onNextDate = () => shift(nextRange.value.range)
  ctx.nextDateLabel = nextRange.value.label
  ctx.view = rawView.value
  ctx.plugins = props.plugins
  ctx.headingLevel = props.headingLevel
})

provide(ScheduleContext, ctx)
provide(TimeGridScrollKey, { key: null, offset: 0 })
</script>

<template>
  <div class="astryx-schedule" v-bind="$attrs">
    <component :is="rawView.component" :options="rawView.options" />
  </div>
</template>
