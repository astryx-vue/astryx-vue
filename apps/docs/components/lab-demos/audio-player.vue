<script setup lang="ts">
import { VStack } from '@astryx-vue/core'
import { AudioPlayer } from '@astryx-vue/lab'

const src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
</script>

<template>
  <VStack :width="480" max-width="100%">
    <AudioPlayer
      :src="src"
      title="T-Rex roar"
      subtitle="Sound effects"
      :skip-back-seconds="5"
      :skip-forward-seconds="5"
    />
  </VStack>
</template>
