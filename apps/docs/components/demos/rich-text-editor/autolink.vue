<script setup lang="ts">
import { RichTextEditor, RichTextEditorAutoLinkPlugin, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="Notes" placeholder="输入网址或邮箱，会自动变成链接" :min-height="120">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
    <RichTextEditorAutoLinkPlugin />
  </RichTextEditor>
</template>
