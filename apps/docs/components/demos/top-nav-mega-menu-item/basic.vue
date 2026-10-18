<script setup lang="ts">
import { TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="top-nav-mega-menu-item-preview__grid">
    <TopNavMegaMenuItem
      description="Run serverless code at the network edge"
      href="#edge"
      icon-class="i-carbon-flash"
      title="Edge Functions"
    />
    <TopNavMegaMenuItem
      description="Object and file storage for your application"
      href="#storage"
      icon-class="i-carbon-data-base"
      title="Storage"
    />
  </div>
</template>
