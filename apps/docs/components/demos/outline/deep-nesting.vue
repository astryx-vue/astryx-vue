<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core/Outline'
import { Outline } from '@astryx-vue/core/Outline'

const items: OutlineItem[] = [
  { id: 'deep-introduction', label: 'Introduction', level: 1 },
  { id: 'deep-concepts', label: 'Core concepts', level: 2 },
  { id: 'deep-tokens', label: 'Tokens', level: 3 },
  { id: 'deep-color', label: 'Color', level: 4 },
  { id: 'deep-spacing', label: 'Spacing', level: 4 },
  { id: 'deep-components', label: 'Components', level: 2 },
  { id: 'deep-primitives', label: 'Primitives', level: 3 },
  { id: 'deep-patterns', label: 'Patterns', level: 3 },
  { id: 'deep-resources', label: 'Resources', level: 1 },
]
</script>

<template>
  <div style="width: 240px">
    <Outline :items="items" active-id="deep-color" />
  </div>
</template>
