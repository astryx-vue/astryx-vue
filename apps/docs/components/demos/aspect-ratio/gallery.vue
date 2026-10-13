<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Center } from '@astryx-vue/core/Center'
import { Grid } from '@astryx-vue/core/Grid'

const images = [
  { id: 1, alt: 'Mountain landscape' },
  { id: 2, alt: 'Ocean sunset' },
  { id: 3, alt: 'Forest trail' },
  { id: 4, alt: 'City skyline' },
  { id: 5, alt: 'Desert dunes' },
  { id: 6, alt: 'Snowy peaks' },
]
</script>

<template>
  <Center :width="600">
    <Grid :columns="3" :gap="4" width="100%">
      <AspectRatio v-for="image in images" :key="image.id" :ratio="4 / 3" fit="cover">
        <img :alt="image.alt" src="/template-assets/illustrative-horizontal-1.png" style="border-radius: var(--astryx-radius-element)">
      </AspectRatio>
    </Grid>
  </Center>
</template>
