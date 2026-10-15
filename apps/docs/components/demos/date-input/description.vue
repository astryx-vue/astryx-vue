<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { DateInput } from '@astryx-vue/core/DateInput'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<Date | null>(null)
</script>

<template>
  <VStack :gap="4" style="width: 240px; max-width: 100%">
    <Text type="supporting" color="secondary">
      Helper text explains what the field expects
    </Text>
    <DateInput
      v-model="value"
      label="Start date"
      description="Your subscription begins on this date"
      placeholder="Select a start date"
    />
  </VStack>
</template>
