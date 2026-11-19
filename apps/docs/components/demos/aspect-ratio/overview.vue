<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const items = [
  { ratio: 1, label: '1 : 1', src: '/template-assets/light-home-square-1.png', alt: '1:1 square' },
  { ratio: 4 / 3, label: '4 : 3', src: '/template-assets/illustrative-horizontal-1.png', alt: '4:3 standard' },
  { ratio: 16 / 9, label: '16 : 9', src: '/template-assets/light-scene-horizontal-1.png', alt: '16:9 widescreen' },
]
</script>

<template>
  <HStack :gap="4" align="start">
    <VStack v-for="item in items" :key="item.label" :gap="2" h-align="center">
      <AspectRatio
        :ratio="item.ratio"
        fit="cover"
        style="height: 120px; width: auto; border-radius: var(--astryx-radius-container)"
      >
        <img :src="item.src" :alt="item.alt">
      </AspectRatio>
      <Text type="supporting" color="secondary">
        {{ item.label }}
      </Text>
    </VStack>
  </HStack>
</template>
