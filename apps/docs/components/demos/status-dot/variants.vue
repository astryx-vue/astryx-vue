<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <div class="status-dot-preview__row">
    <StatusDot label="离线" />
    <StatusDot label="在线" variant="success" />
    <StatusDot label="忙碌" variant="error" />
    <StatusDot label="离开" variant="warning" />
    <StatusDot label="处理中" variant="info" />
  </div>
</template>
