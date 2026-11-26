<script setup lang="ts">
import type { MediaPlayerEmits, VideoPlayerProps } from './types.js'
import { computed, useTemplateRef } from 'vue'
import MediaPlayer from './MediaPlayer.vue'
import MediaPlayerElement from './MediaPlayerElement.vue'
import { useCueLayout } from './useCueLayout.js'
import VideoControlBar from './VideoControlBar.vue'
import VideoStatusLayer from './VideoStatusLayer.vue'
import '../../styles/video-player.css'

/**
 * 现成的视频播放器。控件浮在画面上的毛玻璃条里：悬停、指针移动、键盘焦点时出现，
 * 播放时空闲 2 秒后藏起；触屏上点一下出现，再点一下藏起。宽度不超过 360px 时控件条变紧凑。
 *
 * @example
 * ```vue
 * <VideoPlayer src="/media/product-tour.mp4" poster="/media/product-tour.jpg" label="产品导览" />
 * ```
 */
defineOptions({ name: 'AstryxVideoPlayer' })
const props = withDefaults(defineProps<VideoPlayerProps>(), {
  aspectRatio: 16 / 9,
  hasAutoPlay: false,
  isLooping: false,
  preload: 'metadata',
})
const emit = defineEmits<MediaPlayerEmits>()

const mediaElement = useTemplateRef<{ element: HTMLMediaElement | null }>('media')
const controlBar = useTemplateRef<{ element: HTMLDivElement | null }>('bar')
const video = computed(() => {
  const element = mediaElement.value?.element
  return element instanceof HTMLVideoElement ? element : null
})
useCueLayout(video, computed(() => controlBar.value?.element ?? null))
</script>

<template>
  <MediaPlayer
    class="astryx-video-player"
    :style="{ aspectRatio }"
    :label="label"
    @play="emit('play')"
    @pause="emit('pause')"
    @ended="emit('ended')"
    @error="error => emit('error', error)"
  >
    <MediaPlayerElement
      ref="media"
      kind="video"
      :src="src"
      :poster="poster"
      :preload="preload"
      :cross-origin="crossOrigin"
      :autoplay="hasAutoPlay"
      :muted="hasAutoPlay"
      :loop="isLooping"
    >
      <track
        v-for="track in props.captions"
        :key="track.src"
        :kind="track.kind ?? 'captions'"
        :src="track.src"
        :label="track.label"
        :srclang="track.language"
        :default="track.isDefault || undefined"
      >
    </MediaPlayerElement>
    <VideoStatusLayer />
    <VideoControlBar ref="bar" :chapters="chapters" :markers="markers" />
  </MediaPlayer>
</template>
