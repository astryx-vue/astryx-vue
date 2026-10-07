<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <div class="slider-preview-stack">
    <Banner status="info" title="Card notification" description="Use a rounded card inside page content." elevation="low" />
    <Banner status="warning" title="Scheduled maintenance" description="The service will be unavailable during the maintenance window." container="section" />
  </div>
</template>
