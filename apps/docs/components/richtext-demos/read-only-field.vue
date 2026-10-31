<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
import { seed } from './shared'
</script>

<template>
  <RichTextEditor label="Release notes" :default-value="seed" :min-height="160" is-read-only />
</template>
