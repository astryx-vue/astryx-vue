<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const snippet = `export const total = 42`
</script>

<template>
  <CodeBlock :code="snippet" language="typescript" title="total.ts" />
</template>
