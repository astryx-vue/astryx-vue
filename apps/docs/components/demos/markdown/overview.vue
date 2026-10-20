<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '## Markdown',
  '',
  '**粗体**、*斜体* 和 `代码`。',
  '',
  '- 标题、列表按设计规范排版',
  '- 链接自动识别外链',
  '',
  '> 引用也会缩进显示',
].join('\n')
</script>

<template>
  <Markdown :content="content" />
</template>
