<script setup lang="ts">
import { createDiffFile, DiffViewer } from '@astryx-vue/lab'

const file = createDiffFile({
  path: 'src/app.ts',
  oldValue: 'const answer = 41;\n',
  newValue: 'const answer = 42;\n',
})
</script>

<template>
  <DiffViewer :file="file" />
</template>
