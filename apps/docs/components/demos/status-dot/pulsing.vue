<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <div class="status-dot-preview__row">
    <StatusDot label="Live" variant="success" is-pulsing />
    <StatusDot label="Recording" variant="error" is-pulsing />
    <StatusDot label="Syncing" variant="info" is-pulsing />
  </div>
</template>
