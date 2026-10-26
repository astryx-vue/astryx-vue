<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const value = ref<Date | null>(new Date(2026, 2, 21))

function shipBy(iso: string): string {
  return `Ship by ${iso}`
}
</script>

<template>
  <VStack :gap="4" style="width: 320px; max-width: 100%">
    <Text type="supporting" color="secondary">
      The same committed date, displayed with different formats.
    </Text>
    <DateInput v-model="value" label="Short month (date)" format="date" />
    <DateInput v-model="value" label="Long month (date_long, default)" format="date_long" />
    <DateInput v-model="value" label="With weekday (date_weekday)" format="date_weekday" />
    <DateInput v-model="value" label="ISO 8601 (system_date)" format="system_date" />
    <DateInput v-model="value" label="Custom function" :format="shipBy" />
  </VStack>
</template>
