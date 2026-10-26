<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const errorVal = ref<Date | null>(new Date(2026, 0, 25))
const warningVal = ref<Date | null>(new Date(2026, 11, 25))
const successVal = ref<Date | null>(new Date(2026, 2, 10))
</script>

<template>
  <VStack :gap="4" style="width: 240px; max-width: 100%">
    <DateInput
      v-model="errorVal"
      label="Event date"
      :status="{ type: 'error', message: 'This date is already booked' }"
    />
    <DateInput
      v-model="warningVal"
      label="Preferred date"
      :status="{ type: 'warning', message: 'This date falls on a holiday' }"
    />
    <DateInput
      v-model="successVal"
      label="Start date"
      :status="{ type: 'success', message: 'Date confirmed' }"
    />
  </VStack>
</template>
