<script setup lang="ts">
import { CodeBlock, githubDark, SyntaxTheme } from '@astryx-vue/core/Code'

const commands = `$ astryx init --features agents
✓ AI agent docs installed → AGENTS.md
$ pnpm astryx component CodeBlock --dense`
</script>

<template>
  <SyntaxTheme :theme="githubDark" style="width: 100%; max-width: 480px">
    <CodeBlock :code="commands" language="bash" has-copy-button width="100%" />
  </SyntaxTheme>
</template>
