<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <div class="input-preview-stack">
    <Banner status="info" title="An update is available" description="Restart the application to use the new version." />
    <Banner status="success" title="Changes saved" description="Your team can now use the updated settings." />
    <Banner status="warning" title="Storage is nearly full" description="Remove unused files before uploading more content." />
    <Banner status="error" title="Changes could not be saved" description="Check your connection and try again." />
  </div>
</template>
