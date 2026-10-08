<script setup lang="ts">
import type { VNode } from 'vue'
import type { BottomSheetHeight, BottomSheetMotion, BottomSheetPadding, BottomSheetSnapPoint, BottomSheetState } from './types.js'
import { computed, onMounted, onUpdated, useTemplateRef, watch } from 'vue'
import { resolveSnapPoints } from './snapOffsets.js'
import { useSheetGestures, waitForTransition } from './useSheetGestures.js'

defineOptions({ name: 'AstryxBottomSheetPanel' })

const props = withDefaults(defineProps<{
  state: BottomSheetState
  label: string
  height?: BottomSheetHeight | number | string
  padding?: BottomSheetPadding
  snapPoints?: readonly BottomSheetSnapPoint[]
  isSwipeDismissAllowed?: boolean
}>(), {
  height: 'capped',
  padding: undefined,
  snapPoints: undefined,
  isSwipeDismissAllowed: true,
})

const emit = defineEmits<{
  dismiss: []
  scrimOpacity: [opacity: number]
  motionStart: [motion: BottomSheetMotion]
  motionComplete: [motion: BottomSheetMotion]
  snap: [visibleHeight: number]
}>()

defineSlots<{ default?: () => VNode[] }>()

const HEIGHT_BUDGETS: Record<BottomSheetHeight, string> = {
  hug: '92dvh',
  capped: '62dvh',
  tall: '92dvh',
}

const panel = useTemplateRef<HTMLElement>('panel')
const body = useTemplateRef<HTMLElement>('body')
const isInteractive = computed(() => props.state === 'open')

const heightKind = computed(() => {
  const height = props.height
  return height === 'hug' || height === 'capped' || height === 'tall' ? height : 'custom'
})

const budget = computed(() => {
  const height = props.height
  if (typeof height === 'string' && height in HEIGHT_BUDGETS)
    return HEIGHT_BUDGETS[height as BottomSheetHeight]
  return typeof height === 'number' ? `${height}px` : height
})

const gestures = useSheetGestures({
  panel,
  body,
  isOpen: isInteractive,
  canDismiss: computed(() => props.isSwipeDismissAllowed),
  getSnapHeights: () => {
    const points = props.snapPoints
    if (!points?.length || typeof window === 'undefined')
      return []
    return resolveSnapPoints(points, window.innerHeight)
  },
  onScrimOpacity: opacity => emit('scrimOpacity', opacity),
  onSnap: visibleHeight => emit('snap', visibleHeight),
  onDismiss: () => emit('dismiss'),
})

const contentStyle = computed(() => {
  if (props.padding == null)
    return undefined
  return { '--_sheet-padding': `var(--astryx-spacing-${String(props.padding).replace('.', '-')})` }
})

const panelStyle = computed<Record<string, string | undefined>>(() => {
  const style: Record<string, string | undefined> = { '--_sheet-budget': budget.value }
  // The gesture geometry belongs to an interactive sheet. While it exits, only
  // the resized layout height is kept, so the stylesheet's own off-screen
  // transform drives the departure.
  if (isInteractive.value) {
    style.transform = gestures.panelTransform.value
    style.height = gestures.panelHeight.value
  }
  else if (props.state === 'exiting') {
    style.height = gestures.panelHeight.value
  }
  return style
})

const bodyStyle = computed(() => {
  const inset = gestures.scrollPreservationInset.value
  return inset > 0 ? { paddingBlockEnd: `${inset}px` } : undefined
})

const overflowTabStop = computed(() => isInteractive.value && gestures.isOverflowing.value)

let cancelMotionWait: (() => void) | null = null

function waitForMotion(motion: BottomSheetMotion): void {
  cancelMotionWait?.()
  emit('motionStart', motion)
  cancelMotionWait = waitForTransition(panel.value, 'transform', () => {
    cancelMotionWait = null
    emit('motionComplete', motion)
  })
}

watch(() => props.state, (state) => {
  if (state === 'open' || state === 'exiting')
    waitForMotion(state === 'open' ? 'entering' : 'exiting')
  else
    cancelMotionWait?.()
}, { flush: 'post' })

onMounted(() => {
  gestures.updateOverflow()
})

onUpdated(() => {
  gestures.updateOverflow()
})

defineExpose({
  element: computed(() => panel.value ?? null),
  focus: (options?: FocusOptions) => panel.value?.focus(options),
  blur: () => panel.value?.blur(),
})
</script>

<template>
  <div
    ref="panel"
    class="astryx-bottom-sheet"
    :data-state="state"
    :data-height="heightKind"
    :data-dragging="gestures.isDragging.value || undefined"
    :data-reconciling="gestures.isReconciling.value || undefined"
    :style="panelStyle"
    tabindex="-1"
  >
    <div
      class="astryx-bottom-sheet__handle"
      aria-hidden="true"
      @pointerdown="gestures.onHandlePointerDown"
    >
      <div class="astryx-bottom-sheet__handle-pill" />
    </div>
    <div
      ref="body"
      class="astryx-bottom-sheet__body"
      :data-keyboard="height === 'tall' ? 'tall' : undefined"
      :tabindex="overflowTabStop ? 0 : undefined"
      :role="overflowTabStop ? 'group' : undefined"
      :aria-label="overflowTabStop ? label : undefined"
      :style="bodyStyle"
      @pointerdown="gestures.onBodyPointerDown"
    >
      <div class="astryx-bottom-sheet__content" :style="contentStyle">
        <slot />
      </div>
    </div>
  </div>
</template>
