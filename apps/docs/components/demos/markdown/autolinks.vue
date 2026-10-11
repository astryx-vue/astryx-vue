<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '打开 https://example.com，或写信给 contact@example.com。也可以写成 <https://docs.example.com>。',
  'Visit https://example.com or email contact@example.com. You can also bracket links: <https://docs.example.com>.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
