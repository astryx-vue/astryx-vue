<script setup lang="ts">
import { VStack } from '@astryx-vue/core'
import { VideoPlayer } from '@astryx-vue/lab'

const src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm'
</script>

<template>
  <VStack :width="640" max-width="100%">
    <VideoPlayer
      :src="src"
      label="Flower"
      :markers="[{ time: 2, label: 'Bee lands' }]"
    />
  </VStack>
</template>
