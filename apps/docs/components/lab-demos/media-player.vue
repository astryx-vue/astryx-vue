<script setup lang="ts">
import { HStack, Text, VStack } from '@astryx-vue/core'
import {
  MediaPlaybackRate,
  MediaPlayButton,
  MediaPlayer,
  MediaPlayerElement,
  MediaTime,
  MediaTimeSlider,
  MediaVolume,
  useMediaPlayer,
} from '@astryx-vue/lab'
import { computed, defineComponent, h } from 'vue'

const src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

// 任何放在 MediaPlayer 里的组件都能用 useMediaPlayer 读状态、控制播放。
const ElapsedPercent = defineComponent({
  setup() {
    const { state } = useMediaPlayer()
    const percent = computed(() => state.value.duration > 0 ? state.value.currentTime / state.value.duration : 0)
    return () => h(Text, { type: 'supporting', color: 'secondary' }, () => `${Math.round(percent.value * 100)}%`)
  },
})
</script>

<template>
  <VStack :gap="4" :width="560" max-width="100%">
    <MediaPlayer label="Recording">
      <MediaPlayerElement kind="audio" :src="src" />
      <HStack align="center" :gap="2">
        <MediaPlayButton variant="primary" />
        <MediaTimeSlider :chapters="[{ start: 0, title: 'Roar' }, { start: 1, title: 'Echo' }]" />
        <MediaTime display="remaining" />
        <ElapsedPercent />
        <MediaPlaybackRate variant="menu" />
        <MediaVolume />
      </HStack>
    </MediaPlayer>
    <MediaPlayer label="Voice note">
      <MediaPlayerElement kind="audio" :src="src" />
      <HStack align="center" :gap="1">
        <MediaPlayButton size="sm" />
        <MediaTime display="remaining" />
      </HStack>
    </MediaPlayer>
  </VStack>
</template>
