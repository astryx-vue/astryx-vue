<script setup lang="ts">
import type { PlainDate } from '@astryx-vue/core'
import { computed } from 'vue'
import { useScheduleContext } from './context.js'
import { formatMonthName, formatMonthTitle, isSameCalendarMonth, isSameCalendarYear, monthTitleParts } from './format.js'

defineOptions({ name: 'AstryxScheduleTitle' })

const props = defineProps<{
  start: PlainDate
  end?: PlainDate
}>()

const ctx = useScheduleContext()
const sameMonth = computed(() => props.end == null || isSameCalendarMonth(props.start, props.end, ctx.calendar))
const sameYear = computed(() => props.end == null || isSameCalendarYear(props.start, props.end, ctx.calendar))
const startParts = computed(() => monthTitleParts(props.start, ctx.locale, ctx.calendar))
const endParts = computed(() => monthTitleParts(props.end ?? props.start, ctx.locale, ctx.calendar))
const startMonth = computed(() => formatMonthName(props.start, ctx.locale, ctx.calendar))
const startFull = computed(() => formatMonthTitle(props.start, ctx.locale, ctx.calendar))
</script>

<template>
  <template v-if="sameMonth">
    <template v-for="(part, index) in startParts" :key="index">
      <span v-if="part.type === 'month'" class="astryx-schedule__title-em">{{ part.value }}</span>
      <template v-else>
        {{ part.value }}
      </template>
    </template>
  </template>
  <template v-else-if="sameYear">
    <span class="astryx-schedule__title-em">{{ startMonth }}</span>
    {{ ' - ' }}
    <template v-for="(part, index) in endParts" :key="`end-${index}`">
      <span v-if="part.type === 'month'" class="astryx-schedule__title-em">{{ part.value }}</span>
      <template v-else>
        {{ part.value }}
      </template>
    </template>
  </template>
  <template v-else>
    {{ startFull }}
    {{ ' - ' }}
    <template v-for="(part, index) in endParts" :key="`year-${index}`">
      <span v-if="part.type === 'month'" class="astryx-schedule__title-em">{{ part.value }}</span>
      <template v-else>
        {{ part.value }}
      </template>
    </template>
  </template>
</template>
