<script setup lang="ts">
import type { MediaVolumeProps } from './types.js'
import { IconButton, Slider, useAstryxLocale } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import MediaSliderReveal from './MediaSliderReveal.vue'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaVolume' })

const props = withDefaults(defineProps<MediaVolumeProps>(), { hasSlider: true, sliderPlacement: 'start' })

/** 音量滑块展开后的宽度。 */
const VOLUME_SLIDER_WIDTH = 72

const { store } = useMediaPlayerContext('MediaVolume')
const messages = useMediaPlayerMessages()
const locale = useAstryxLocale()
const state = store.state
const isSilent = computed(() => state.value.isMuted || state.value.volume === 0)
const muteLabel = computed(() => isSilent.value ? messages.value.unmute : messages.value.mute)
const icon = useMediaIcon(() => isSilent.value ? 'volumeOff' : state.value.volume < 0.5 ? 'volumeLow' : 'volumeHigh')
// 浏览器不理脚本改音量的地方（iOS）不显示滑块，由设备的音量键调。
const showsSlider = computed(() => props.hasSlider && state.value.canSetVolume)
const sliderValue = computed(() => Math.round((state.value.isMuted ? 0 : state.value.volume) * 100))
const percent = computed(() => new Intl.NumberFormat(locale.value, { style: 'percent' }))
</script>

<template>
  <MediaSliderReveal class="astryx-media-volume" :has-slider="showsSlider" :placement="sliderPlacement">
    <IconButton
      class="astryx-media-volume-button"
      :label="muteLabel"
      :tooltip="muteLabel"
      :icon="icon"
      variant="ghost"
      :size="size"
      @click="store.actions.toggleMuted()"
    />
    <template #slider>
      <Slider
        class="astryx-media-volume-slider"
        :model-value="sliderValue"
        :label="messages.volume"
        is-label-hidden
        :min="0"
        :max="100"
        :step="1"
        value-display="tooltip"
        :format-value="value => percent.format(value / 100)"
        :width="VOLUME_SLIDER_WIDTH"
        @change="value => store.actions.setVolume(value / 100)"
      />
    </template>
  </MediaSliderReveal>
</template>
