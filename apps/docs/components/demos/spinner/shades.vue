<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <div class="input-preview-grid">
    <Spinner shade="default" />
    <Spinner shade="subtle" />
    <div style="padding: 12px; border-radius: 8px; background: #171717;">
      <Spinner shade="onMedia" />
    </div>
    <span style="color: #1b1b1b;">
      <Spinner shade="inherit" />
    </span>
  </div>
</template>
