<script setup lang="ts">
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <div style="width: 480px; max-width: 100%">
    <RichTextEditor
      label="Release notes"
      description="Capture formatted context for your team."
      placeholder="Write an update…"
      :min-height="112"
    >
      <template #toolbar>
        <RichTextEditorToolbar />
      </template>
    </RichTextEditor>
  </div>
</template>
