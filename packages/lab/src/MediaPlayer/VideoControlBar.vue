<script setup lang="ts">
import type { MediaTimelineChapter, MediaTimelineMarker } from './types.js'
import { MediaTheme } from '@astryx-vue/core'
import { computed, useTemplateRef } from 'vue'
import { useMediaPlayerContext } from './context.js'
import MediaCaptionsButton from './MediaCaptionsButton.vue'
import MediaFullscreenButton from './MediaFullscreenButton.vue'
import MediaPlayButton from './MediaPlayButton.vue'
import MediaTime from './MediaTime.vue'
import MediaTimeSlider from './MediaTimeSlider.vue'
import MediaVolume from './MediaVolume.vue'

/**
 * 浮在画面底部的毛玻璃控件条。控件显示时出现，藏起时往下沉并淡出。
 * 开始播放前大播放键代替它，但它仍在 Tab 序里，键盘焦点进来时会出现。
 */
defineOptions({ name: 'AstryxVideoControlBar' })
defineProps<{
  chapters?: readonly MediaTimelineChapter[]
  markers?: readonly MediaTimelineMarker[]
}>()

const { store, isControlsVisible } = useMediaPlayerContext('VideoPlayer')
// 播完以后控件条留在重播键旁边，时间轴还够得着。
const isBeforePlayback = computed(() => store.state.value.error == null && !store.state.value.hasStarted)
const element = useTemplateRef<HTMLDivElement>('bar')

defineExpose({ element })
</script>

<template>
  <MediaTheme mode="dark">
    <div
      ref="bar"
      class="astryx-video-player__frosted astryx-video-player__bar"
      dir="ltr"
      :data-visible="isControlsVisible ? 'true' : 'false'"
      :data-before-playback="isBeforePlayback || undefined"
    >
      <MediaPlayButton class="astryx-video-player__control" />
      <MediaTimeSlider :chapters="chapters" :markers="markers" />
      <MediaTime class="astryx-video-player__time" />
      <MediaVolume class="astryx-video-player__volume" />
      <MediaCaptionsButton class="astryx-video-player__control" />
      <MediaFullscreenButton class="astryx-video-player__control" />
    </div>
  </MediaTheme>
</template>
