<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Status | Owner |\n|---|---|\n\n| A | B | C |\n|---|---|---|\n|  | only the middle cell has content |  |\n\n| Key | Value |\n|---|---|\n| digest | a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5a1b2c3d4e5 |\n\n| Ref | Where it points |\n|---|---|\n| [the parser guide](https://example.com/docs/parser) and `parseDocument` | Both in one cell |\n\n| Id | Description |\n|---|---|\n| 7 | A column at the minimum floor next to one that reaches the cap and keeps going well past it |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
