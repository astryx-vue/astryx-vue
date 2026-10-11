<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '阅读 [组件文档](https://example.com/docs)。',
  'Read the [component docs](https://example.com/docs).',
))
</script>

<template>
  <Markdown :content="content" />
</template>
