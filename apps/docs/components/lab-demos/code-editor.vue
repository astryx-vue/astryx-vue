<script setup lang="ts">
import { CodeEditor } from '@astryx-vue/lab'
import { ref } from 'vue'

const value = ref(`const greeting = 'Hello';
function greet(name) {
  return \`\${greeting}, \${name}\`;
}`)
</script>

<template>
  <CodeEditor
    :value="value"
    label="TypeScript example"
    language="typescript"
    has-line-numbers
    :max-height="240"
    @change="value = $event"
  />
</template>
