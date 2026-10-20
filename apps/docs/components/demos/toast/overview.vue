<script setup lang="ts">
import { Toast } from '@astryx-vue/core/Toast'
</script>

<template>
  <div class="overview-fill">
    <Toast body="Changes saved." type="success" :is-auto-hide="false" />
    <Toast body="Failed to upload file." type="error" :is-auto-hide="false" />
  </div>
</template>
