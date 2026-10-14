<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<Date | null>(new Date(2026, 3, 6))

function iso(date: Date | null): string {
  if (!date)
    return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
</script>

<template>
  <VStack :gap="4" width="100%" style="min-width: 240px; max-width: 400px">
    <Text type="supporting" color="secondary">
      {{ value ? `Selected: ${iso(value)}` : 'No date selected' }}
    </Text>
    <DateInput
      v-model="value"
      label="Event date"
      description="Pick a date for your event"
      placeholder="Select a date"
      clearable
    />
  </VStack>
</template>
