<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { AspectRatioProps, AspectRatioSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import '../../styles/aspect-ratio.css'

defineOptions({
  name: 'AstryxAspectRatio',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AspectRatioProps>(), {
  shape: 'rectangle',
})

defineSlots<AspectRatioSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-aspect-ratio', attrs.class])

const rootStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  { '--astryx-aspect-ratio': String(props.ratio) },
])
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-shape="shape"
    :style="rootStyle"
  >
    <div class="astryx-aspect-ratio__child" :data-astryx-aspect-ratio-override="fit" :data-fit="fit">
      <slot />
    </div>
  </div>
</template>
