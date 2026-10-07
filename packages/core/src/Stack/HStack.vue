<script setup lang="ts">
import type { HStackProps } from './types.js'
import Stack from './Stack.vue'

defineOptions({
  name: 'HStack',
})

const props = defineProps<HStackProps>()

defineSlots<{
  default: () => unknown
}>()
</script>

<template>
  <Stack
    v-bind="props"
    direction="horizontal"
  >
    <slot />
  </Stack>
</template>
