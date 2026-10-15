<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Calendar } from '@astryx-vue/core/Calendar'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<Date | null>(new Date(2026, 1, 12))
const weekNumbers = ref(true)
const outside = ref(true)
const variable = ref(true)
const monday = ref(true)
</script>

<template>
  <VStack :gap="3">
    <HStack :gap="2" wrap="wrap">
      <Button size="sm" :label="weekNumbers ? 'Week numbers on' : 'Week numbers off'" :variant="weekNumbers ? 'primary' : 'secondary'" @click="weekNumbers = !weekNumbers" />
      <Button size="sm" :label="outside ? 'Outside days on' : 'Outside days off'" :variant="outside ? 'primary' : 'secondary'" @click="outside = !outside" />
      <Button size="sm" :label="variable ? 'Short month' : 'Six rows'" :variant="variable ? 'primary' : 'secondary'" @click="variable = !variable" />
      <Button size="sm" :label="monday ? 'Starts Monday' : 'Starts Sunday'" :variant="monday ? 'primary' : 'secondary'" @click="monday = !monday" />
    </HStack>
    <Text type="supporting" color="secondary">
      February 2026. Adjacent days stay visible but cannot be selected.
    </Text>
    <Calendar
      v-model="value"
      :focus-date="new Date(2026, 1, 1)"
      :has-week-numbers="weekNumbers"
      :has-outside-days="outside"
      :has-variable-row-count="variable"
      :week-starts-on="monday ? 'mon' : 'sun'"
    />
  </VStack>
</template>
