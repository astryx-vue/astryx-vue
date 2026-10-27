<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import {
  Center,
  Grid,
  Heading,
  Layout,
  LayoutContent,
  Section,
  Tab,
  TabList,
  Text,
  VStack,
} from '@astryx-vue/core'

type Category = 'all' | 'lifestyle' | 'scene' | 'home'

interface GalleryImage {
  src: string
  alt: string
  category: Category
}

const outer: CSSProperties = {
  maxWidth: '1200px',
  width: '100%',
  paddingInline: 'var(--astryx-spacing-6)',
  paddingBlock: 'var(--astryx-spacing-8)',
}

const imageWrapper: CSSProperties = {
  position: 'relative',
  aspectRatio: '3/2',
  borderRadius: 'var(--astryx-radius-container)',
  overflow: 'clip',
}

const textCenter: CSSProperties = {
  textAlign: 'center',
}

const imgFill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const GALLERY_IMAGES: GalleryImage[] = [
  { src: '/template-assets/moody-scene-horizontal-1.png', alt: 'Moody scene landscape', category: 'scene' },
  { src: '/template-assets/moody-lifestyle-vertical-1.png', alt: 'Moody lifestyle portrait', category: 'lifestyle' },
  { src: '/template-assets/moody-home-vertical-1.png', alt: 'Moody home interior', category: 'home' },
  { src: '/template-assets/moody-scene-horizontal-2.png', alt: 'Moody scene vista', category: 'scene' },
  { src: '/template-assets/moody-lifestyle-vertical-2.png', alt: 'Moody lifestyle scene', category: 'lifestyle' },
  { src: '/template-assets/moody-lifestyle-horizontal-1.png', alt: 'Moody lifestyle horizontal', category: 'lifestyle' },
  { src: '/template-assets/moody-scene-vertical-1.png', alt: 'Moody scene vertical', category: 'scene' },
  { src: '/template-assets/moody-home-vertical-2.png', alt: 'Moody home vertical', category: 'home' },
  { src: '/template-assets/moody-home-horizontal-1.png', alt: 'Moody home horizontal', category: 'home' },
  { src: '/template-assets/moody-scene-vertical-2.png', alt: 'Moody scene vertical', category: 'scene' },
]

const filter = ref<Category>('all')

const filteredImages = computed(() =>
  filter.value === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === filter.value),
)
</script>

<template>
  <Layout height="fill">
    <LayoutContent :padding="0">
      <Center axis="horizontal">
        <VStack :gap="8" :style="outer">
          <Center axis="horizontal">
            <Section variant="transparent" :max-width="680" :padding="0">
              <VStack :gap="4" h-align="center" :style="textCenter">
                <VStack :gap="2" h-align="center">
                  <Heading :level="1">
                    Make every day a little more delightful, one detail at a time.
                  </Heading>
                  <Text type="body" color="secondary">
                    We believe the smallest details are the ones that matter most. A little color, a thoughtful touch, a moment that catches your eye and makes you pause; that's what turns an ordinary day into something worth remembering.
                  </Text>
                </VStack>
                <TabList v-model:value="filter">
                  <Tab value="all" label="All" />
                  <Tab value="lifestyle" label="Lifestyle" />
                  <Tab value="scene" label="Scenery" />
                  <Tab value="home" label="Home" />
                </TabList>
              </VStack>
            </Section>
          </Center>
          <Grid :columns="{ minWidth: 260, repeat: 'fit' }" :gap="4">
            <div
              v-for="(image, i) in filteredImages"
              :key="i"
              :style="imageWrapper"
            >
              <img :src="image.src" :alt="image.alt" :style="imgFill">
            </div>
          </Grid>
        </VStack>
      </Center>
    </LayoutContent>
  </Layout>
</template>
