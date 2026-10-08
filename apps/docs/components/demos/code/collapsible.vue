<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const snippet = `{
  "name": "@astryx-vue/core",
  "type": "module",
  "exports": {
    "./Code": {
      "source": "./src/Code/index.ts",
      "types": "./dist/Code/index.d.ts",
      "import": "./dist/Code/index.js"
    }
  },
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsdown",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json"
  }
}`
</script>

<template>
  <div class="code-preview__stack">
    <CodeBlock :code="snippet" language="json" title="package.json" is-collapsible :max-height="196" />
  </div>
</template>
