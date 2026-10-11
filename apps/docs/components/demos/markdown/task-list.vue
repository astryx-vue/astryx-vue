<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '- [x] 解析\n- [x] 渲染\n- [ ] Storybook 示例',
  '- [x] Parser\n- [x] Renderer\n- [ ] Storybook stories',
))
</script>

<template>
  <Markdown :content="content" />
</template>
