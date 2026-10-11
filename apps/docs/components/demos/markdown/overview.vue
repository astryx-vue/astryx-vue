<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '## Release notes',
  '',
  'A paragraph can hold **emphasis**, `code`, and a [link](https://example.com).',
  '',
  '- Settled blocks stay put',
  '- New text fades in',
].join('\n')
</script>

<template>
  <Markdown :content="content" />
</template>
