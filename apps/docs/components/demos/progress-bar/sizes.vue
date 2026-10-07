<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <div class="input-preview-grid">
    <ProgressBar :value="40" label="Small" size="sm" />
    <ProgressBar :value="60" label="Medium" size="md" />
    <ProgressBar :value="80" label="Large" size="lg" />
  </div>
</template>
