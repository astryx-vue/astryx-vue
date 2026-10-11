<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  [
    '## 发布说明',
    '',
    '段落里可以写 **强调**、`代码` 和 [链接](https://example.com)。',
    '',
    '- 已稳定的块保持不动',
    '- 新出现的文字会淡入',
  ].join('\n'),
  [
    '## Release notes',
    '',
    'A paragraph can hold **emphasis**, `code`, and a [link](https://example.com).',
    '',
    '- Settled blocks stay where they are',
    '- New text fades in',
  ].join('\n'),
))
</script>

<template>
  <Markdown :content="content" />
</template>
