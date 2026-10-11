<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Stage | What it does | When it runs | What it needs | What it emits | Who reads it |\n|---|---|---|---|---|---|\n| Parse | Turns the source text into blocks and inline nodes | On every edit | The raw document | A canonical tree | The renderer |\n| Render | Maps each node in the tree onto a part | After a parse | A canonical tree | Rendered output | The reader |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
