<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '# Markdown Demo',
  '',
  'Renders **markdown** with *design-system-consistent* styling.',
  '',
  '## Features',
  '',
  '- Headings mapped to the Astryx type scale',
  '- **Bold**, *italic*, and ~~strikethrough~~ text',
  '- [Links](https://example.com) with external detection',
  '',
  '> Block quote indented text',
].join('\n')
</script>

<template>
  <Markdown :content="content" />
</template>
