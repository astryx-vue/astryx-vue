<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

provideAstryxLocale('en')

const ship = ref<Date | null>(new Date(2026, 2, 21))
const due = ref<Date | null>(null)

function save(value: Date | null): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, value ? 900 : 400)
  })
}
</script>

<template>
  <VStack :gap="4" style="width: 240px; max-width: 100%">
    <DateInput
      v-model="ship"
      label="Ship date"
      description="Saved when the date changes."
      label-tooltip="Warehouse days are Monday to Friday."
      is-required
      clearable
      :change-action="save"
      :date-constraints="[(date: Date) => date.getDay() !== 0 && date.getDay() !== 6]"
    />
    <DateInput
      v-model="due"
      label="Follow-up"
      is-optional
      placeholder="Select a date"
    />
  </VStack>
</template>
