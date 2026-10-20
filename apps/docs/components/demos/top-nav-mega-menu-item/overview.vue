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
    <TopNavMegaMenuItem
      description="Global content delivery with instant purging"
      href="#cdn"
      icon-class="i-carbon-cloud"
      title="CDN"
    />
    <TopNavMegaMenuItem
      description="Optimized bundling and compilation pipeline"
      href="#build-tools"
      icon-class="i-carbon-tools"
      title="Build Tools"
    />
  </div>
</template>
