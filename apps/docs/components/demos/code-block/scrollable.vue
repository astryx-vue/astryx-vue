<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const code = Array.from({ length: 50 }, (_, index) => `const line${index + 1} = ${index + 1};`).join('\n')
</script>

<template>
  <CodeBlock :code="code" language="typescript" title="many-lines.ts" has-line-numbers :max-height="280" />
</template>
