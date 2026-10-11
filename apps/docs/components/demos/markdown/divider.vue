<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '上一段。\n\n---\n\n分隔线下面是下一段。',
  'The paragraph above the rule.\n\n---\n\nThe paragraph under the rule.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
