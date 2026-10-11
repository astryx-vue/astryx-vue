<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '把结果交给 `content`，不要再包一层平滑。',
  'Pass the result as `content` instead of smoothing it again.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
