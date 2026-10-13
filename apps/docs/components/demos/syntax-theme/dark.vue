<script setup lang="ts">
import { CodeBlock, dracula, SyntaxTheme } from '@astryx-vue/core/Code'

const code = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`
</script>

<template>
  <SyntaxTheme :theme="dracula" style="width: min(100%, 420px)">
    <CodeBlock :code="code" language="tsx" title="Dracula preset" width="100%" />
  </SyntaxTheme>
</template>
