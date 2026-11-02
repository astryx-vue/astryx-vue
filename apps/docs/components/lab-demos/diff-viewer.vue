<script setup lang="ts">
import { createDiffFile, DiffViewer } from '@astryx-vue/lab'

const file = createDiffFile({
  path: 'src/greet.ts',
  oldValue: `export function greet(name: string) {
  return 'Hello ' + name;
}
`,
  newValue: `export function greet(name: string) {
  const greeting = 'Hello';
  return \`\${greeting}, \${name}\`;
}
`,
})
</script>

<template>
  <div style="display: grid; gap: 16px; width: 100%">
    <DiffViewer :file="file" />
    <DiffViewer :file="file" view-mode="split" />
  </div>
</template>
