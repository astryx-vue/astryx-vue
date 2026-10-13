<script setup lang="ts">
import { CodeBlock, githubLight, SyntaxTheme } from '@astryx-vue/core/Code'

const code = `const status = response.ok ? 'success' : 'error';
console.log({status});`
</script>

<template>
  <SyntaxTheme :theme="githubLight" style="width: min(100%, 420px)">
    <CodeBlock :code="code" language="tsx" title="GitHub Light preset" width="100%" />
  </SyntaxTheme>
</template>
