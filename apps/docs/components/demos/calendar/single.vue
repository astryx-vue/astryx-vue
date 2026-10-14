<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { Calendar } from '@astryx-vue/core/Calendar'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<Date | null>(new Date(2026, 0, 15))
const focusDate = new Date(2026, 0, 1)

function iso(date: Date | null): string {
  if (!date)
    return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
</script>

<template>
  <VStack :gap="4" h-align="center">
    <Text type="supporting" color="secondary">
      {{ value ? `Selected: ${iso(value)}` : 'Pick a date' }}
    </Text>
    <Calendar v-model="value" mode="single" :focus-date="focusDate" />
  </VStack>
</template>
