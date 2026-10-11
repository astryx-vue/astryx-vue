<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '> 设计系统让团队把时间花在真正的问题上。',
  '> Design systems free teams to focus on problems that matter.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
