<script setup lang="ts">
import type { TextColor } from '@astryx-vue/core/Text'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const colors: { color: TextColor, description: string }[] = [
  { color: 'primary', description: 'Primary — Default for headings and body text' },
  { color: 'secondary', description: 'Secondary — Supporting details and metadata' },
  { color: 'accent', description: 'Accent — Links, emphasis, and accent-colored text' },
  { color: 'disabled', description: 'Disabled — Unavailable or inactive content' },
  { color: 'placeholder', description: 'Placeholder — Empty field hints' },
]
</script>

<template>
  <VStack :gap="3">
    <Text v-for="item in colors" :key="item.color" type="body" :color="item.color">
      {{ item.description }}
    </Text>
  </VStack>
</template>
