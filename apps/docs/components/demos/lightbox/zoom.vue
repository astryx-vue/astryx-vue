<script setup lang="ts">
import { Lightbox } from '@astryx-vue/core/Lightbox'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Thumbnail
    src="/template-assets/light-scene-horizontal-1.png"
    alt="Coastal shoreline with ocean waves"
    label="Coastal shoreline with ocean waves"
    @click="isOpen = true"
  />
  <Lightbox
    :is-open="isOpen"
    has-zoom
    :media="{
      src: '/template-assets/light-scene-horizontal-1.png',
      alt: 'Coastal shoreline with ocean waves',
      caption: 'A scenic coastline. Double-click to zoom in and drag to pan.',
    }"
    @update:is-open="isOpen = $event"
  />
</template>
