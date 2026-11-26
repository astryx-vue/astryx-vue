<script setup lang="ts">
import type { DropdownMenuButtonProps } from '@astryx-vue/core'
import type { MediaPlaybackRateProps } from './types.js'
import { Button, DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem, Slider, useAstryxLocale } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { DEFAULT_PLAYBACK_RATES, formatRate } from './mediaFormat.js'
import MediaSliderReveal from './MediaSliderReveal.vue'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaPlaybackRate' })

const props = withDefaults(defineProps<MediaPlaybackRateProps>(), {
  variant: 'slider',
  rates: () => DEFAULT_PLAYBACK_RATES,
  sliderPlacement: 'end',
})

/** 速度滑块展开后的宽度。 */
const RATE_SLIDER_WIDTH = 88

const { store, holdControls } = useMediaPlayerContext('MediaPlaybackRate')
const messages = useMediaPlayerMessages()
const locale = useAstryxLocale()
const rate = computed(() => store.state.value.playbackRate)
const rateLabel = (value: number): string => messages.value.playbackRate(formatRate(value, locale.value))
const buttonLabel = computed(() => rateLabel(rate.value))
const buttonName = computed(() => messages.value.playbackSpeedValue(formatRate(rate.value, locale.value)))
const hasSlider = computed(() => props.variant === 'slider')
// 按钮上写当前速度，读屏念「播放速度，1.5×」。
const menuButton = computed(() => ({
  'label': buttonLabel.value,
  'aria-label': buttonName.value,
  'tooltip': messages.value.playbackSpeed,
  'variant': 'ghost',
  'size': props.size,
  'class': 'astryx-media-playback-rate-button',
}) as DropdownMenuButtonProps)

// 离当前速度最近的那一档，别处设的速度也能放好滑块。
const rateIndex = computed(() => props.rates.reduce(
  (best, option, candidate) => Math.abs(option - rate.value) < Math.abs((props.rates[best] ?? 1) - rate.value) ? candidate : best,
  0,
))

// 按一下在正常速度和上一次的其他速度之间切换，像静音键那样；还没有别的速度时升一档。
let lastRate: number | null = null
function toggleRate(): void {
  const current = store.state.value.playbackRate
  if (current !== 1) {
    lastRate = current
    store.actions.setPlaybackRate(1)
    return
  }
  store.actions.setPlaybackRate(lastRate ?? props.rates.find(option => option > 1) ?? 1)
}
</script>

<template>
  <MediaSliderReveal class="astryx-media-playback-rate" :data-variant="variant" :has-slider="hasSlider" :placement="sliderPlacement">
    <Button
      v-if="hasSlider"
      class="astryx-media-playback-rate-button"
      :label="buttonLabel"
      :aria-label="buttonName"
      :tooltip="messages.playbackSpeed"
      variant="ghost"
      :size="size"
      @click="toggleRate"
    />
    <DropdownMenu
      v-else
      :button="menuButton"
      @open-change="isOpen => holdControls('menu', isOpen)"
    >
      <DropdownMenuRadioGroup
        :label="messages.playbackSpeed"
        :model-value="String(rate)"
        @change="value => store.actions.setPlaybackRate(Number(value))"
      >
        <DropdownMenuRadioItem v-for="option in rates" :key="option" :value="String(option)" :label="rateLabel(option)" />
      </DropdownMenuRadioGroup>
    </DropdownMenu>
    <template #slider>
      <Slider
        class="astryx-media-playback-rate-slider"
        :model-value="rateIndex"
        :label="messages.playbackSpeed"
        is-label-hidden
        :min="0"
        :max="Math.max(rates.length - 1, 1)"
        :step="1"
        value-display="tooltip"
        :format-value="value => rateLabel(rates[value] ?? 1)"
        :width="RATE_SLIDER_WIDTH"
        @change="value => store.actions.setPlaybackRate(rates[value] ?? 1)"
      />
    </template>
  </MediaSliderReveal>
</template>
