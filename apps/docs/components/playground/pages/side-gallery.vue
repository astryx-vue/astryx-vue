<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  AspectRatio,
  Button,
  Divider,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  Text,
  VStack,
} from '@astryx-vue/core'

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const imageClip: CSSProperties = {
  borderRadius: 'var(--astryx-radius-element)',
}

const IMAGES = [
  { src: '/template-assets/colorful-lifestyle-vertical-3.png', alt: 'Colorful lifestyle scene' },
  { src: '/template-assets/colorful-lifestyle-horizontal-1.png', alt: 'Colorful lifestyle horizontal' },
  { src: '/template-assets/colorful-lifestyle-vertical-1.png', alt: 'Colorful lifestyle vertical' },
  { src: '/template-assets/colorful-home-vertical-2.png', alt: 'Colorful home interior' },
  { src: '/template-assets/colorful-home-vertical-3.png', alt: 'Colorful home scene' },
  { src: '/template-assets/colorful-home-vertical-1.png', alt: 'Colorful home vertical' },
  { src: '/template-assets/colorful-lifestyle-horizontal-2.png', alt: 'Colorful lifestyle wide' },
  { src: '/template-assets/colorful-lifestyle-vertical-2.png', alt: 'Colorful lifestyle detail' },
  { src: '/template-assets/colorful-lifestyle-vertical-4.png', alt: 'Colorful lifestyle portrait' },
]
</script>

<template>
  <Layout height="fill" :content-width="1400">
    <LayoutContent :padding="6">
      <Grid :columns="{ minWidth: 360, repeat: 'fit' }" :gap="8" align="center">
        <VStack :gap="6" hAlign="center">
          <VStack :gap="3">
            <Text type="supporting" color="secondary" weight="semibold">
              COLORFUL
            </Text>
            <Heading :level="1">
              Make every day a little more delightful, one small detail at a time.
            </Heading>
            <Text type="body" color="secondary">
              The smallest details are the ones that matter most. A little color that catches your eye and makes you pause; that's what turns an ordinary day into something worth remembering.
            </Text>
          </VStack>
          <HStack :gap="3" align="center">
            <Button label="Explore" variant="primary" />
          </HStack>
          <VStack :gap="4">
            <Divider />
            <HStack :gap="6">
              <VStack :gap="0">
                <Text type="large" weight="bold">
                  12k+
                </Text>
                <Text type="supporting" color="secondary">
                  Photos
                </Text>
              </VStack>
              <VStack :gap="0">
                <Text type="large" weight="bold">
                  350+
                </Text>
                <Text type="supporting" color="secondary">
                  Projects
                </Text>
              </VStack>
              <VStack :gap="0">
                <Text type="large" weight="bold">
                  8yrs
                </Text>
                <Text type="supporting" color="secondary">
                  Experience
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
        <Grid :columns="3" :gap="3">
          <AspectRatio
            v-for="img in IMAGES"
            :key="img.src"
            :ratio="1"
            :style="imageClip"
          >
            <img :src="img.src" :alt="img.alt" :style="imageStyle">
          </AspectRatio>
        </Grid>
      </Grid>
    </LayoutContent>
  </Layout>
</template>
