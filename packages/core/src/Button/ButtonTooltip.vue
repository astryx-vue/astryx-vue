<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

defineOptions({
  name: 'ButtonTooltip',
})

const props = defineProps<{
  anchor: HTMLElement | null
  id: string
  open: boolean
  text: string
}>()

const emit = defineEmits<{
  pointerEnter: []
  pointerLeave: []
}>()

const isMounted = shallowRef(false)
const tooltip = useTemplateRef<HTMLElement>('tooltip')
const tooltipStyle = shallowRef<CSSProperties>({
  left: '0px',
  top: '0px',
  visibility: 'hidden',
})
let isListening = false

function updatePosition(): void {
  const anchor = props.anchor
  const element = tooltip.value

  if (anchor == null || element == null || typeof window === 'undefined')
    return

  const anchorRect = anchor.getBoundingClientRect()
  const tooltipRect = element.getBoundingClientRect()
  const gap = 8
  const viewportGap = 8
  const centeredLeft = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2
  const maxLeft = Math.max(viewportGap, window.innerWidth - tooltipRect.width - viewportGap)
  const left = Math.min(Math.max(centeredLeft, viewportGap), maxLeft)
  const above = anchorRect.top - tooltipRect.height - gap
  const top = above >= viewportGap
    ? above
    : Math.min(anchorRect.bottom + gap, window.innerHeight - tooltipRect.height - viewportGap)

  tooltipStyle.value = {
    left: `${Math.round(left)}px`,
    top: `${Math.round(Math.max(viewportGap, top))}px`,
    visibility: 'visible',
  }
}

defineExpose({ updatePosition })

function startListening(): void {
  if (isListening || typeof window === 'undefined')
    return

  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  isListening = true
}

function stopListening(): void {
  if (!isListening || typeof window === 'undefined')
    return

  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  isListening = false
}

watch(
  () => [props.anchor, props.open] as const,
  async ([, open]) => {
    if (!open) {
      stopListening()
      return
    }

    tooltipStyle.value = {
      left: '0px',
      top: '0px',
      visibility: 'hidden',
    }

    await nextTick()
    updatePosition()
    startListening()
  },
  { flush: 'post' },
)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(stopListening)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isMounted"
      v-show="open"
      :id="id"
      ref="tooltip"
      class="astryx-button-tooltip"
      role="tooltip"
      :style="tooltipStyle"
      @pointerenter="emit('pointerEnter')"
      @pointerleave="emit('pointerLeave')"
    >
      {{ text }}
    </div>
  </Teleport>
</template>
