<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '- 标题映射到正文标题字号\n- **粗体**、*斜体* 和 ~~删除线~~\n- 行内 `code` 和代码块',
  '- Headings use the prose heading scale\n- **Bold**, *italic*, and ~~strikethrough~~\n- Inline `code` and fenced code blocks',
))
</script>

<template>
  <Markdown :content="content" />
</template>
