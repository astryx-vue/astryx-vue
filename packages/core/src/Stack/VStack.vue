<script setup lang="ts">
import type { VStackProps } from './types.js'
import Stack from './Stack.vue'

defineOptions({
  name: 'VStack',
})

const props = defineProps<VStackProps>()

defineSlots<{
  default: () => unknown
}>()
</script>

<template>
  <Stack
    v-bind="props"
    direction="vertical"
  >
    <slot />
  </Stack>
</template>
