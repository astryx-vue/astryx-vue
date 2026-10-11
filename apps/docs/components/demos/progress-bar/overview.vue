<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <div class="overview-fill">
    <ProgressBar :value="60" label="Upload" show-value />
    <ProgressBar :value="40" label="Review" variant="success" />
  </div>
</template>
