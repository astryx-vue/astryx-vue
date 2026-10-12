<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time24 = shallowRef('14:30')
const timeSec = shallowRef('14:30:45')
</script>

<template>
  <VStack :gap="4">
    <Text type="supporting" color="secondary">
      Format variations for different contexts
    </Text>
    <VStack :gap="3">
      <TimeInput v-model="time24" label="24-hour" hour-format="24h" />
      <TimeInput v-model="timeSec" label="With seconds" has-seconds />
    </VStack>
  </VStack>
</template>
