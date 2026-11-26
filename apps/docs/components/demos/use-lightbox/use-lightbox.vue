<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'

const photos = [
  {
    src: '/template-assets/Neutral-Backpack.png',
    alt: 'Backpack',
    caption: 'A backpack displayed on a neutral background.',
  },
  {
    src: '/template-assets/building.png',
    alt: 'Modern building',
    caption: 'A modern building with a contemporary architectural design.',
  },
  {
    src: '/template-assets/light-scene-horizontal-1.png',
    alt: 'Coastal shoreline with ocean waves',
    caption: 'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
  },
  {
    src: '/template-assets/illustrative-vertical-1.png',
    alt: 'Illustrated lakeside landscape at sunset',
    caption: 'A stylized landscape illustration featuring pink clouds reflected over a calm lake at sunset.',
  },
]

const { bindings, open } = useLightbox({ media: photos })
</script>

<template>
  <Grid :columns="2" :gap="2" :width="136">
    <Thumbnail
      v-for="(photo, index) in photos"
      :key="photo.src"
      :src="photo.src"
      :alt="photo.alt"
      :label="photo.alt"
      @click="open(index)"
    />
  </Grid>
  <Lightbox v-bind="bindings" />
</template>
