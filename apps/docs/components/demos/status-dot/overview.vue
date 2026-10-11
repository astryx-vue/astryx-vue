<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <div class="overview-row">
    <StatusDot label="Offline" />
    <StatusDot label="Online" variant="success" />
    <StatusDot label="Busy" variant="error" />
    <StatusDot label="Away" variant="warning" />
    <StatusDot label="Pending" variant="info" />
  </div>
</template>
