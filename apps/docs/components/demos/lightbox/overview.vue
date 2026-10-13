<script setup lang="ts">
import { Lightbox } from '@astryx-vue/core/Lightbox'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <button type="button" @click="isOpen = true">
    View image
  </button>
  <Lightbox
    :is-open="isOpen"
    :media="{
      src: '/template-assets/light-scene-horizontal-1.png',
      alt: 'Coastal shoreline with ocean waves',
      caption: 'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
    }"
    @update:is-open="isOpen = $event"
  />
</template>
