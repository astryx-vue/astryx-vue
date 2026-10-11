<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <div class="overview-fill">
    <Banner status="info" title="An update is available" description="Restart to use the new version." />
    <Banner status="success" title="Changes saved" description="Your team can use the updated settings." />
  </div>
</template>
