<script setup lang="ts">
import { RichTextView } from '@astryx-vue/richtext'
import { seed } from './shared'
</script>

<template>
  <RichTextView :value="seed" />
</template>
