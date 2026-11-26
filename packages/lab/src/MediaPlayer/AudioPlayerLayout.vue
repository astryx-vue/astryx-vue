<script setup lang="ts">
import type { AudioPlayerSlots, MediaTimelineChapter, MediaTimelineMarker } from './types.js'
import { AspectRatio, Icon } from '@astryx-vue/core'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import MediaPlaybackRate from './MediaPlaybackRate.vue'
import MediaPlayButton from './MediaPlayButton.vue'
import MediaSeekButton from './MediaSeekButton.vue'
import MediaTime from './MediaTime.vue'
import MediaTimeSlider from './MediaTimeSlider.vue'
import MediaTrackButton from './MediaTrackButton.vue'
import MediaVolume from './MediaVolume.vue'
import { useMediaSession } from './useMediaSession.js'

defineOptions({ name: 'AstryxAudioPlayerLayout' })

const props = defineProps<{
  title: string
  subtitle?: string
  artworkSrc?: string
  artworkAspectRatio: number
  skipBackSeconds: number
  skipForwardSeconds: number
  onPreviousTrack?: () => void
  onNextTrack?: () => void
  chapters?: readonly MediaTimelineChapter[]
  markers?: readonly MediaTimelineMarker[]
}>()

defineSlots<AudioPlayerSlots>()

/** 封面的高度，和标题、副标题两行一样高。 */
const ARTWORK_HEIGHT = 48

const { store } = useMediaPlayerContext('AudioPlayer')
useMediaSession(store, () => props)
const placeholderIcon = useMediaIcon('audioFile')
</script>

<template>
  <div class="astryx-audio-player__header">
    <AspectRatio
      class="astryx-audio-player__artwork"
      :ratio="artworkAspectRatio"
      fit="cover"
      :style="{ width: `${ARTWORK_HEIGHT * artworkAspectRatio}px` }"
    >
      <slot name="artwork">
        <img v-if="artworkSrc != null" :src="artworkSrc" alt="">
        <span v-else class="astryx-audio-player__artwork-placeholder">
          <Icon v-if="typeof placeholderIcon === 'string'" :icon="placeholderIcon" />
          <component :is="placeholderIcon" v-else />
        </span>
      </slot>
    </AspectRatio>
    <div class="astryx-audio-player__titles">
      <span class="astryx-audio-player__title">{{ title }}</span>
      <span v-if="subtitle != null" class="astryx-audio-player__subtitle">{{ subtitle }}</span>
    </div>
  </div>
  <MediaTimeSlider :chapters="chapters" :markers="markers" />
  <div class="astryx-audio-player__times" dir="ltr">
    <MediaTime display="current" class="astryx-audio-player__time" />
    <MediaTime display="remaining" class="astryx-audio-player__time" />
  </div>
  <div class="astryx-audio-player__controls" dir="ltr">
    <MediaPlaybackRate class="astryx-audio-player__speed" />
    <div class="astryx-audio-player__transport">
      <MediaTrackButton v-if="onPreviousTrack != null" direction="previous" @click="onPreviousTrack" />
      <MediaSeekButton :offset="-skipBackSeconds" />
      <MediaPlayButton size="lg" variant="primary" />
      <MediaSeekButton :offset="skipForwardSeconds" />
      <MediaTrackButton v-if="onNextTrack != null" direction="next" @click="onNextTrack" />
    </div>
    <MediaVolume class="astryx-audio-player__volume" />
  </div>
</template>
