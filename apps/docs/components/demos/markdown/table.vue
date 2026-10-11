<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '## Comparison Table\n\n| Feature | React | Vue | Svelte |\n|:--------|:-----:|:---:|-------:|\n| Virtual DOM | Yes | Yes | No |\n| Bundle Size | ~40KB | ~30KB | ~2KB |\n| TypeScript | Native | Plugin | Native |\n| Learning Curve | Medium | Easy | Easy |',
  '## Comparison Table\n\n| Feature | React | Vue | Svelte |\n|:--------|:-----:|:---:|-------:|\n| Virtual DOM | Yes | Yes | No |\n| Bundle Size | ~40KB | ~30KB | ~2KB |\n| TypeScript | Native | Plugin | Native |\n| Learning Curve | Medium | Easy | Easy |',
))
</script>

<template>
  <Markdown :content="content" />
</template>
