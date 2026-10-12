<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { VStack } from '@astryx-vue/core/Stack'
import { shallowRef } from 'vue'

const errorVal = shallowRef('2026-01-25T09:00')
const warningVal = shallowRef('2026-12-25T14:00')
const successVal = shallowRef('2026-03-10T10:30')
</script>

<template>
  <div class="date-time-demo">
    <VStack :gap="4">
      <DateTimeInput v-model="errorVal" label="Meeting time" :status="{ type: 'error', message: 'This time slot is already booked' }" />
      <DateTimeInput v-model="warningVal" label="Preferred time" :status="{ type: 'warning', message: 'This falls outside business hours' }" />
      <DateTimeInput v-model="successVal" label="Start time" :status="{ type: 'success', message: 'Time confirmed' }" />
    </VStack>
  </div>
</template>

<style scoped>
.date-time-demo {
  width: 25rem;
  max-width: 100%;
}
</style>
