<script setup lang="ts">
import type { AudioPlayerProps, AudioPlayerSlots, MediaPlayerEmits } from './types.js'
import { Section } from '@astryx-vue/core'
import AudioPlayerLayout from './AudioPlayerLayout.vue'
import MediaPlayer from './MediaPlayer.vue'
import MediaPlayerElement from './MediaPlayerElement.vue'
import '../../styles/audio-player.css'

/**
 * 现成的音频播放器，适合节目、录音和音乐：标题和封面、时间轴、后退和前进、速度、音量。
 * 它放在 Section 容器里，背景和内边距跟随主题。播放队列和歌单归产品管。
 *
 * @example
 * ```vue
 * <AudioPlayer src="/media/episode-12.mp3" title="为每块屏幕设计" subtitle="界面漫谈 · 第 12 期" />
 * ```
 */
defineOptions({ name: 'AstryxAudioPlayer' })
withDefaults(defineProps<AudioPlayerProps>(), {
  artworkAspectRatio: 1,
  skipBackSeconds: 15,
  skipForwardSeconds: 30,
  preload: 'metadata',
})
const emit = defineEmits<MediaPlayerEmits>()
const slots = defineSlots<AudioPlayerSlots>()
</script>

<template>
  <Section>
    <MediaPlayer
      class="astryx-audio-player"
      :label="label ?? title"
      @play="emit('play')"
      @pause="emit('pause')"
      @ended="emit('ended')"
      @error="error => emit('error', error)"
    >
      <MediaPlayerElement kind="audio" :src="src" :preload="preload" :cross-origin="crossOrigin" />
      <AudioPlayerLayout
        :title="title"
        :subtitle="subtitle"
        :artwork-src="artworkSrc"
        :artwork-aspect-ratio="artworkAspectRatio"
        :skip-back-seconds="skipBackSeconds"
        :skip-forward-seconds="skipForwardSeconds"
        :on-previous-track="onPreviousTrack"
        :on-next-track="onNextTrack"
        :chapters="chapters"
        :markers="markers"
      >
        <template v-if="slots.artwork" #artwork>
          <slot name="artwork" />
        </template>
      </AudioPlayerLayout>
    </MediaPlayer>
  </Section>
</template>
