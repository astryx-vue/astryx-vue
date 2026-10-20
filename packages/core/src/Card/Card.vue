<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { CardProps, CardSizeValue, CardSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'

import '../../styles/card.css'

defineOptions({ name: 'AstryxCard' })

const props = withDefaults(defineProps<CardProps>(), {
  elevation: 'none',
  variant: 'default',
})

defineSlots<CardSlots>()

const element = useTemplateRef<HTMLDivElement>('element')

const hasFixedHeight = computed(() => props.height != null && props.height !== 'auto')
useScrollbars(element, { enabled: hasFixedHeight })

function formatSize(value: CardSizeValue | undefined): string | undefined {
  if (value == null)
    return undefined

  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<CSSProperties>(() => ({
  height: formatSize(props.height),
  maxWidth: formatSize(props.maxWidth),
  minHeight: formatSize(props.minHeight),
  width: formatSize(props.width),
}))

defineExpose({ element })
</script>

<template>
  <div
    ref="element"
    class="astryx-card"
    :data-elevation="elevation"
    :data-padding="padding"
    :data-scrollable="hasFixedHeight || undefined"
    :data-variant="variant"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
