<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'

const photos = [
  { src: '/template-assets/Neutral-Backpack.png', alt: 'Backpack', caption: 'Backpack on a neutral background' },
  { src: '/template-assets/Neutral-Blanket.png', alt: 'Blanket', caption: 'Cozy blanket on a neutral background' },
  { src: '/template-assets/Neutral-Headphones.png', alt: 'Headphones', caption: 'Wireless headphones on a neutral background' },
  { src: '/template-assets/Neutral-Tumbler.png', alt: 'Tumbler', caption: 'Stainless tumbler on a neutral background' },
  { src: '/template-assets/Neutral-Wallet.png', alt: 'Wallet', caption: 'Leather wallet on a neutral background' },
  { src: '/template-assets/Neutral-Watch.png', alt: 'Watch', caption: 'Wristwatch on a neutral background' },
]

const { bindings, getTriggerProps } = useLightbox({ media: photos })
</script>

<template>
  <Grid :columns="3" :gap="2" :width="304">
    <img
      v-for="(photo, index) in photos"
      :key="photo.alt"
      :src="photo.src"
      :alt="photo.alt"
      width="96"
      height="96"
      style="object-fit: cover"
      v-bind="getTriggerProps(index)"
    >
  </Grid>
  <Lightbox v-bind="bindings" />
</template>
