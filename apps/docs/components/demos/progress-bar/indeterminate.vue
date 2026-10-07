<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <div class="input-preview-grid">
    <ProgressBar :value="0" is-indeterminate label="Loading..." />
  </div>
</template>
