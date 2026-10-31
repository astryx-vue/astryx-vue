<script setup lang="ts">
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
import { seed } from './shared'
</script>

<template>
  <RichTextEditor label="Release notes" :default-value="seed" :min-height="200">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
  </RichTextEditor>
</template>
