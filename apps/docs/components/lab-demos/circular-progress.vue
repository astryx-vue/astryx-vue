<script setup lang="ts">
import { CircularProgress } from '@astryx-vue/lab'
</script>

<template>
  <div class="lab-demo-row">
    <CircularProgress :value="68" label="Upload progress" has-value-label />
    <CircularProgress :value="82" label="Completed tasks" variant="success" size="lg" has-value-label />
    <CircularProgress is-indeterminate label="Loading data" />
  </div>
</template>
