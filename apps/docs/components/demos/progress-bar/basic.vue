<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <div class="input-preview-grid">
    <ProgressBar :value="60" label="Upload" show-value />
  </div>
</template>
