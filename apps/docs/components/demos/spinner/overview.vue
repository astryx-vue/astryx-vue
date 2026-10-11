<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <div class="overview-row">
    <Spinner size="sm" aria-label="Small" />
    <Spinner size="md" aria-label="Medium" />
    <Spinner size="lg" aria-label="Large" />
  </div>
</template>
