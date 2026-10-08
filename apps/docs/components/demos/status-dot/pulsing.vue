<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <div class="status-dot-preview__row">
    <StatusDot label="直播中" variant="success" is-pulsing />
    <StatusDot label="录制中" variant="error" is-pulsing />
    <StatusDot label="同步中" variant="info" is-pulsing />
  </div>
</template>
