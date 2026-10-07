<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <div class="input-preview-grid">
    <ProgressBar :value="75" label="Neutral" />
    <ProgressBar :value="75" label="Success" variant="success" />
    <ProgressBar :value="75" label="Warning" variant="warning" />
    <ProgressBar :value="75" label="Error" variant="error" />
    <ProgressBar :value="75" label="Info" variant="info" />
  </div>
</template>
