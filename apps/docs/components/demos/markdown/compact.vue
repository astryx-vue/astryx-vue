<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '## 紧凑间距\n\n块与块之间更近，适合嵌在回复里。\n\n- 第一项\n- 第二项',
  '## Compact rhythm\n\nBlocks sit closer together, which suits a reply.\n\n- First item\n- Second item',
))
</script>

<template>
  <Markdown :content="content" density="compact" />
</template>
