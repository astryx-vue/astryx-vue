<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '# Markdown Demo',
  '',
  'Renders **markdown** with *Astryx* styling.',
  '',
  '## Features',
  '',
  'Fish &amp; chips &copy; 2026',
  '',
  '- **Bold**, *italic*, `code`',
  '  1. Nested number',
  '     - Nested square',
  '- [Links](https://example.com)',
  '',
  '```typescript',
  'interface User {name: string;}',
  '```',
  '',
  '- [x] Parser',
  '- [ ] Stories',
].join('\n')
</script>

<template>
  <Markdown :content="content" />
</template>
