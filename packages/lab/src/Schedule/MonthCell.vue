<script setup lang="ts">
import type { PlainDate } from '@astryx-vue/core'
import type { VNodeChild } from 'vue'
import type { MonthChipPlacement } from './monthLayout.js'
import type { CalendarEvent } from './types.js'
import type { SchedulePopover } from './useSchedulePopover.js'
import { plainDateToISO, Text } from '@astryx-vue/core'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import EventPill from './EventPill.vue'
import { formatDayNumber, formatEventAccessibilityLabel, formatFullDate, isEventInPast } from './format.js'
import { MONTH_VISIBLE_LEVELS } from './monthLayout.js'
import { chipKey, dayKey, formatEventDays, formatMonthEventName, parseKey } from './monthModel.js'

defineOptions({ name: 'AstryxScheduleMonthCell' })

const props = defineProps<{
  day: PlainDate
  days: ReadonlyArray<PlainDate>
  column: number
  isOutside: boolean
  isLastColumn: boolean
  isLastRow: boolean
  isFocus: boolean
  cellChips: ReadonlyArray<MonthChipPlacement>
  dayEvents: ReadonlyArray<CalendarEvent>
  hiddenCount?: number
  currentTime: number
  renderPopover?: (event: CalendarEvent) => VNodeChild
  popover: SchedulePopover
}>()

const ctx = useScheduleContext()
const dayISO = computed(() => plainDateToISO(props.day))
const fullDate = computed(() => formatFullDate(props.day, ctx.locale))
const hasPopover = computed(() => props.renderPopover != null)

function past(event: CalendarEvent): boolean {
  return isEventInPast(event, props.currentTime, ctx.timezoneID)
}

function nameFor(event: CalendarEvent, dayLabel: string): string {
  return formatMonthEventName(event, dayLabel, ctx.timezoneID, ctx.categories, ctx.locale)
}

function sinceLabel(chip: MonthChipPlacement): string {
  const start = props.days[chip.week * 7 + chip.columnStart]
  const when = start == null ? fullDate.value : formatFullDate(start, ctx.locale)
  return nameFor(chip.event, `since ${when}`)
}

function ownsRow(openKey: string): boolean {
  const parsed = parseKey(openKey)
  return parsed?.kind === 'row'
    && parsed.dayISO === dayISO.value
    && props.dayEvents.some(event => event.id === parsed.eventID)
}
</script>

<template>
  <div
    class="astryx-schedule__month-cell"
    :class="{ 'is-last-column': isLastColumn, 'is-last-row': isLastRow, 'is-outside': isOutside }"
    role="cell"
    :aria-label="fullDate"
    :aria-colindex="column + 2"
    :aria-current="isFocus ? 'date' : undefined"
    tabindex="-1"
    :data-schedule-day="dayISO"
  >
    <div class="astryx-schedule__day-number" :class="{ 'is-current': isFocus }">
      <Text type="supporting" color="inherit" weight="medium" has-tabular-numbers>
        {{ formatDayNumber(day, ctx.locale) }}
      </Text>
    </div>
    <template v-for="chip in cellChips" :key="chipKey(chip)">
      <span v-if="chip.columnStart !== column && hasPopover" class="astryx-schedule__sr">
        {{ sinceLabel(chip) }}
      </span>
      <template v-else-if="chip.columnStart === column">
        <button
          v-if="hasPopover && renderPopover?.(chip.event) != null"
          type="button"
          class="astryx-schedule__event-button astryx-schedule__chip"
          :class="{ 'is-last-column': isLastColumn }"
          :style="{ '--span': String(chip.columnEnd - chip.columnStart + 1), '--level': String(chip.level) }"
          :aria-label="nameFor(chip.event, formatEventDays(chip.event, ctx.timezoneID, ctx.locale))"
          data-schedule-month-chip=""
          v-bind="popover.getTriggerProps(chipKey(chip))"
        >
          <EventPill :event="chip.event" :past="past(chip.event)" />
        </button>
        <div
          v-else
          class="astryx-schedule__chip"
          :class="{ 'is-last-column': isLastColumn }"
          :style="{ '--span': String(chip.columnEnd - chip.columnStart + 1), '--level': String(chip.level) }"
          :aria-hidden="hasPopover ? undefined : 'true'"
          data-schedule-month-chip=""
        >
          <span v-if="hasPopover" class="astryx-schedule__sr">
            {{ nameFor(chip.event, formatEventDays(chip.event, ctx.timezoneID, ctx.locale)) }}
          </span>
          <EventPill :event="chip.event" :past="past(chip.event)" :aria-hidden="hasPopover ? 'true' : undefined" />
        </div>
      </template>
    </template>
    <ul v-if="!hasPopover && dayEvents.length > 0" class="astryx-schedule__sr">
      <li v-for="event in dayEvents" :key="event.id">
        {{ formatEventAccessibilityLabel(event, day, ctx.timezoneID, ctx.categories, ctx.locale) }}
      </li>
    </ul>
    <button
      v-if="hiddenCount != null"
      type="button"
      class="astryx-schedule__event-button astryx-schedule__more"
      :style="{ '--level': String(MONTH_VISIBLE_LEVELS - 1) }"
      :aria-label="`${hiddenCount} more ${hiddenCount === 1 ? 'event' : 'events'}, ${fullDate}`"
      v-bind="popover.getTriggerProps(dayKey(dayISO), ownsRow)"
    >
      <bdi>+{{ hiddenCount }} more</bdi>
    </button>
  </div>
</template>
