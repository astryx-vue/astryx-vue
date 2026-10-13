<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Lightbox } from '@astryx-vue/core/Lightbox'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="Play video" @click="isOpen = true" />
  <Lightbox
    :is-open="isOpen"
    :media="{
      src: '/template-assets/Nature-1.mp4',
      alt: 'Flower blooming in time-lapse',
      type: 'video',
      caption: 'A flower blooming in time-lapse',
    }"
    @update:is-open="isOpen = $event"
  />
</template>
