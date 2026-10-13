<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const code = `{
  "name": "@astryxdesign/core",
  "version": "0.0.5",
  "dependencies": {
    "@astryxdesign/theme-neutral": "^0.1.0",
    "react": "^19.0.0"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  }
}`
</script>

<template>
  <CodeBlock :code="code" language="json" title="package.json" has-line-numbers />
</template>
