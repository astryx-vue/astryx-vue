<script setup lang="ts">
import type { TextWeight } from '@astryx-vue/core/Text'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const weights: { weight: TextWeight, label: string }[] = [
  { weight: 'normal', label: 'Normal' },
  { weight: 'medium', label: 'Medium' },
  { weight: 'semibold', label: 'Semibold' },
  { weight: 'bold', label: 'Bold' },
]
</script>

<template>
  <VStack :gap="3">
    <Text
      v-for="item in weights"
      :key="item.weight"
      type="body"
      :weight="item.weight"
      display="block"
    >
      {{ item.label }}
    </Text>
  </VStack>
</template>
