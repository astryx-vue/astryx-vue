<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
import { seed } from './shared'
</script>

<template>
  <RichTextEditor label="Release notes" placeholder="写点什么" :default-value="seed" :min-height="180" />
</template>
