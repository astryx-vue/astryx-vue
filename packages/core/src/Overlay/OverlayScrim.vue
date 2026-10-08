<script setup lang="ts">
import type { OverlayScrimProps, OverlayScrimSlots } from './types.js'
import { computed } from 'vue'
import '../../styles/overlay.css'

defineOptions({ name: 'AstryxOverlayScrim' })

const props = withDefaults(defineProps<OverlayScrimProps>(), {
  scrim: 'dark',
  position: 'fill',
  align: 'end',
  showOn: 'always',
  isOpen: undefined,
})

defineSlots<OverlayScrimSlots>()

const isControlled = computed(() => props.isOpen !== undefined)
const isInert = computed(() => isControlled.value && props.isOpen !== true)

const mediaMode = computed(() => {
  if (props.scrim === 'dark')
    return 'dark'
  return props.scrim === 'light' ? 'light' : undefined
})

const scrimMode = computed(() => (props.scrim === false ? 'none' : props.scrim))

const visibility = computed(() => {
  if (isControlled.value)
    return props.isOpen ? 'visible' : 'hidden'
  if (props.showOn === 'always')
    return 'visible'
  return props.showOn === 'focus' ? 'focus' : 'hover'
})
</script>

<template>
  <div
    class="astryx-overlay-scrim"
    :data-position="position"
    :data-align="align"
    :data-scrim="scrimMode"
    :data-visibility="visibility"
    :inert="isInert ? true : undefined"
  >
    <div
      v-if="mediaMode"
      class="astryx-overlay-scrim__media"
      :data-astryx-media="mediaMode"
    >
      <slot />
    </div>
    <slot v-else />
  </div>
</template>
