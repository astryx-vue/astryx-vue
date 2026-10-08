<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const snippet = `const queue = []

function enqueue(job) {
  queue.push(job)
  if (queue.length === 1) run()
}

function run() {
  const job = queue.shift()
  if (!job) return
  job().finally(run)
}`
</script>

<template>
  <div class="code-preview__stack">
    <CodeBlock
      :code="snippet"
      language="javascript"
      title="queue.js"
      has-line-numbers
      :highlight-lines="[4, 5]"
    />
  </div>
</template>
