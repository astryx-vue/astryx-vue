<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '# 行宽\n\n这段被 `contentWidth` 限制在 680 像素。代码块和表格仍然用容器的宽度。',
  '# Measure\n\nThis paragraph is capped at 680 pixels by `contentWidth`. Code blocks and tables still use the container width.',
))
</script>

<template>
  <Markdown :content="content" :content-width="680" />
</template>
