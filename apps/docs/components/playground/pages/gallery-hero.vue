<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  AspectRatio,
  Button,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Text,
  VStack,
} from '@astryx-vue/core'

const IMAGES = [
  { src: '/template-assets/colorful-home-horizontal-1.png', alt: 'Colorful home interior with vibrant decor' },
  { src: '/template-assets/colorful-lifestyle-horizontal-1.png', alt: 'Colorful lifestyle portrait with natural lighting' },
  { src: '/template-assets/colorful-lifestyle-horizontal-2.png', alt: 'Colorful lifestyle scene with warm tones' },
]

const galleryImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const galleryImageClip: CSSProperties = {
  borderRadius: 'var(--astryx-radius-container)',
}
</script>

<template>
  <Layout>
    <LayoutContent :padding="6">
      <VStack :gap="10">
        <VStack :gap="6" h-align="center">
          <VStack :gap="3" h-align="center">
            <Heading :level="1" type="display-2" justify="center" text-wrap="balance">
              Little joys, everywhere you go
            </Heading>
            <Text type="body" color="secondary" justify="center" text-wrap="balance">
              Sometimes all it takes is one small thing to turn your whole day around.
            </Text>
          </VStack>
          <HStack :gap="3">
            <Button label="Get started" variant="primary">
              <template #end>
                <Icon icon="chevronRight" size="sm" color="inherit" />
              </template>
            </Button>
            <Button label="Learn more" variant="secondary" />
          </HStack>
        </VStack>
        <Grid :columns="{ minWidth: 200, repeat: 'fit' }" :gap="4">
          <AspectRatio
            v-for="image in IMAGES"
            :key="image.src"
            :ratio="4 / 5"
            :style="galleryImageClip"
          >
            <img :style="galleryImage" :src="image.src" :alt="image.alt">
          </AspectRatio>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
