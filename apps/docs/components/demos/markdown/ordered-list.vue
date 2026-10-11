<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '1. 第一项\n2. 第二项\n\n上面这段到此结束。\n\n26. 从 26 开始\n\n中间再隔一段。\n\n0. 从 0 开始',
  '1. First ordered item\n2. Second ordered item\n\nThe list above ends here.\n\n26. Start 26\n\nA paragraph ends that list.\n\n0. Start 0',
))
</script>

<template>
  <Markdown :content="content" />
</template>
