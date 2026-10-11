<script setup lang="ts">
import { Toast } from '@astryx-vue/core/Toast'
</script>

<template>
  <div class="overview-fill">
    <Toast body="Changes saved." type="success" :auto-close="false" />
    <Toast body="Failed to upload file." type="error" :auto-close="false" />
  </div>
</template>
