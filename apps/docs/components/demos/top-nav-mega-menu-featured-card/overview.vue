<script setup lang="ts">
import { TopNavMegaMenuFeaturedCard } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="featured-card-overview">
    <TopNavMegaMenuFeaturedCard
      title="Introducing v2.0"
      description="Our biggest release yet with new components, faster builds, and a refreshed design language."
      link-label="Explore the release"
      link-href="#release"
    />
  </div>
</template>

<style scoped>
/* 原版卡片在画布里按内容收宽；我们的卡片是 width: 100%，外面包一层按内容收宽的盒子。 */
.featured-card-overview {
  max-width: 100%;
}
</style>
