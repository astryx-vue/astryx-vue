<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
</script>

<template>
  <div class="aspect-ratio-overview">
    <AspectRatio :ratio="1" fit="cover" shape="ellipse">
      <img alt="" src="/layout/square.svg">
    </AspectRatio>
    <AspectRatio :ratio="16 / 9" fit="cover">
      <img alt="" src="/layout/wide.svg">
    </AspectRatio>
  </div>
</template>
