<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core/Outline'
import { Outline } from '@astryx-vue/core/Outline'

const items: OutlineItem[] = [
  { id: 'showcase-overview', label: 'Overview', level: 2 },
  { id: 'showcase-installation', label: 'Installation', level: 2 },
  { id: 'showcase-theming', label: 'Theming', level: 2 },
  { id: 'showcase-tokens', label: 'Tokens', level: 3 },
  { id: 'showcase-accessibility', label: 'Accessibility', level: 2 },
]
</script>

<template>
  <div style="width: 240px">
    <Outline :items="items" active-id="showcase-theming" />
  </div>
</template>
