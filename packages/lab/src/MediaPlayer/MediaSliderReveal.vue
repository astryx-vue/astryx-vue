<script setup lang="ts">
import type { MediaSliderPlacement } from './types.js'
import { useContainerReveal } from '@astryx-vue/core'
import { computed } from 'vue'

/**
 * 一个按钮，旁边带一个悬停或聚焦时展开的滑块；触屏上一直展开。
 * 滑块那一列和滑块本身用的是同一套揭示条件，所以一起打开。
 */
defineOptions({ name: 'AstryxMediaSliderReveal' })
const props = defineProps<{
  hasSlider: boolean
  placement: MediaSliderPlacement
}>()
defineSlots<{
  default: () => unknown
  slider: () => unknown
}>()

const reveal = useContainerReveal({ isEnabled: () => props.hasSlider })
const isBefore = computed(() => props.placement === 'start')
const groupProps = computed(() => reveal.containerProps())
const slotProps = computed(() => reveal.contentProps({ isLayoutPreserved: true }))
</script>

<template>
  <div
    v-bind="groupProps"
    class="astryx-media-reveal"
    :data-placement="hasSlider ? placement : 'none'"
  >
    <span v-if="hasSlider && isBefore" v-bind="slotProps" class="astryx-media-reveal__slot">
      <slot name="slider" />
    </span>
    <slot />
    <span v-if="hasSlider && !isBefore" v-bind="slotProps" class="astryx-media-reveal__slot">
      <slot name="slider" />
    </span>
  </div>
</template>
