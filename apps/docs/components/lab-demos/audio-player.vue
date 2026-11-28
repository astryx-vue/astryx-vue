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
      class="audio-player-demo"
    />
  </VStack>
</template>

<style scoped>
/* 播放器外层是 Section 色块，单独摆在卡片上时圆角跟卡片一致。 */
.audio-player-demo :deep(.astryx-section__inner) {
  border-radius: var(--astryx-radius-container, 12px);
}
</style>
