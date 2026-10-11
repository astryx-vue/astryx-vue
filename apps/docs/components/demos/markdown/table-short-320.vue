<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Step | Time | Code | Tier | Runs | Team |\n|---|---|---|---|---|---|\n| Init | 12 ms | 200 | A | 3 | Core |\n| Sync | 84 ms | 200 | A | 1 | Core |\n| Lint | 2.1 s | 422 | B | 2 | Docs |\n| Ship | 9.4 s | 200 | A | 1 | Docs |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 320px">
    <Markdown :content="content" />
  </div>
</template>
