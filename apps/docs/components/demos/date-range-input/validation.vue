<script setup lang="ts">
import type { DateRange } from '@astryx-vue/core/DateRangeInput'
import { DateRangeInput } from '@astryx-vue/core/DateRangeInput'
import { VStack } from '@astryx-vue/core/Stack'
import { shallowRef } from 'vue'

const errorRange = shallowRef<DateRange | null>({ start: '2026-01-01', end: '2026-01-31' })
const warningRange = shallowRef<DateRange | null>({ start: '2026-06-01', end: '2026-06-30' })
const successRange = shallowRef<DateRange | null>({ start: '2026-03-01', end: '2026-03-31' })
</script>

<template>
  <VStack :gap="4" style="width: 100%; max-width: 400px">
    <DateRangeInput v-model="errorRange" label="Booking period" :status="{ type: 'error', message: 'Selected dates are no longer available' }" />
    <DateRangeInput v-model="warningRange" label="Preferred period" :status="{ type: 'warning', message: 'High demand — limited availability' }" />
    <DateRangeInput v-model="successRange" label="Confirmed period" :status="{ type: 'success', message: 'Dates confirmed and available' }" />
  </VStack>
</template>
