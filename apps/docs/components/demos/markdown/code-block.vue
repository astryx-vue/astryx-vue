<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '一段说明。\n\n```ts\nexport const ready = true\n```',
  'A short note.\n\n```ts\nexport const ready = true\n```',
))
</script>

<template>
  <Markdown :content="content" />
</template>
