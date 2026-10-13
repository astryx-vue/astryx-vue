<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  AspectRatio,
  Heading,
  Layout,
  LayoutContent,
  Text,
  VStack,
} from '@astryx-vue/core'

interface GalleryImage {
  src: string
  title: string
}

const containerStyle: CSSProperties = {
  containerType: 'inline-size',
  containerName: 'gallery',
}

const imgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const clipStyle: CSSProperties = {
  borderRadius: 'var(--radius-element)',
}

const IMAGES: GalleryImage[] = [
  { src: '/template-assets/illustrative-horizontal-1.png', title: 'Going places' },
  { src: '/template-assets/light-home-horizontal-1.png', title: 'Making memories' },
  { src: '/template-assets/light-lifestyle-horizontal-1.png', title: 'Being free' },
  { src: '/template-assets/light-working-horizontal-2.png', title: 'Getting it done' },
  { src: '/template-assets/light-scene-horizontal-1.png', title: 'Finding calm' },
]
</script>

<template>
  <Layout height="fill" :content-width="1400">
    <LayoutContent :padding="6">
      <VStack :gap="6" :style="containerStyle">
        <VStack :gap="2" h-align="center">
          <Heading :level="1" justify="center">
            Make every day a little more delightful, one detail at a time.
          </Heading>
          <Text type="body" justify="center">
            We believe the smallest details are the ones that matter most. That's what turns an ordinary day into something worth remembering.
          </Text>
        </VStack>
        <div class="mixed-gallery-grid">
          <AspectRatio
            :ratio="3 / 1"
            class="mixed-gallery-hero"
            :style="clipStyle"
          >
            <img :src="IMAGES[0].src" :alt="IMAGES[0].title" :style="imgStyle">
          </AspectRatio>
          <AspectRatio :ratio="3 / 2" :style="clipStyle">
            <img :src="IMAGES[2].src" :alt="IMAGES[2].title" :style="imgStyle">
          </AspectRatio>
          <AspectRatio :ratio="3 / 2" :style="clipStyle">
            <img :src="IMAGES[3].src" :alt="IMAGES[3].title" :style="imgStyle">
          </AspectRatio>
          <AspectRatio :ratio="3 / 2" :style="clipStyle">
            <img :src="IMAGES[4].src" :alt="IMAGES[4].title" :style="imgStyle">
          </AspectRatio>
          <AspectRatio :ratio="3 / 2" :style="clipStyle">
            <img :src="IMAGES[1].src" :alt="IMAGES[1].title" :style="imgStyle">
          </AspectRatio>
        </div>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style>
.mixed-gallery-grid {
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.mixed-gallery-hero {
  grid-column: span 2;
}
@container gallery (max-width: 720px) {
  .mixed-gallery-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .mixed-gallery-hero {
    grid-column: 1 / -1;
    aspect-ratio: 3 / 2;
  }
}
</style>
