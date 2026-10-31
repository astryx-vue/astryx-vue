<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor
    label="Release notes"
    placeholder="至少写 20 个字"
    :min-height="120"
    :max-length="20"
    :status="{ type: 'error', message: '这一版还缺少发版说明。' }"
  />
</template>
