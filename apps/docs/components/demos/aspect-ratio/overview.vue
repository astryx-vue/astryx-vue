<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
</script>

<template>
  <div class="aspect-ratio-overview">
    <AspectRatio :ratio="1" fit="cover" shape="ellipse">
      <img alt="" src="/template-assets/light-home-square-1.png">
    </AspectRatio>
    <AspectRatio :ratio="16 / 9" fit="cover">
      <img alt="" src="/template-assets/light-scene-horizontal-1.png">
    </AspectRatio>
  </div>
</template>
