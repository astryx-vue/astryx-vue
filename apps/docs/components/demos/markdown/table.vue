<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '## Comparison Table',
  '',
  '| Feature | React | Vue | Svelte |',
  '|:--------|:-----:|:---:|-------:|',
  '| Virtual DOM | Yes | Yes | No |',
  '| Bundle Size | ~40KB | ~30KB | ~2KB |',
  '| TypeScript | Native | Plugin | Native |',
  '| Learning Curve | Medium | Easy | Easy |',
].join('\n')
</script>

<template>
  <Markdown :content="content" />
</template>
