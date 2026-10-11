<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = [
  '## Design Tokens',
  '',
  'Tokens are the **shared language** between design and code.',
  '',
  '```typescript',
  'const tokens = {',
  '  primary: \'#0066FF\',',
  '  spacing: \'8px\',',
  '};',
  '```',
  '',
  '- **Composable** — small pieces',
  '- **Accessible** — built-in a11y',
  '',
  '> Opinionated enough for consistency, *flexible* enough for edge cases.',
].join('\n')
</script>

<template>
  <Markdown :content="content" density="compact" :heading-level-start="3" />
</template>
