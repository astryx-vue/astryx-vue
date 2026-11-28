<script setup lang="ts">
import type { VNode } from 'vue'
import type { BottomSheetPanelMotion, BottomSheetPanelState } from './panelState.js'
import type { ScrimFade } from './sheetDragExit.js'
import type { BottomSheetReplacedMotion } from './stack/stackState.js'
import type { BottomSheetHeight, BottomSheetPadding, BottomSheetSnapPoint } from './types.js'
import { computed, onMounted, onUpdated, useAttrs, useTemplateRef, watch } from 'vue'
import { attachScrollKeyboardDelegation } from '../composables/internal/scrollKeyboardDelegation.js'
import { useMobileKeyboard } from '../keyboard/useMobileKeyboard.js'
import { provideLayerDepth } from '../layer/layerDepth.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { provideLayoutContainer } from '../Layout/context.js'
import { defaultPrefersReducedMotion } from '../motion/animator'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { motionForPanelState } from './panelState.js'
import { dragExitFade, playDragExit, resetDragExit, supportsWebAnimations } from './sheetDragExit.js'
import { waitForTransition } from './sheetTransition.js'
import { resolveSnapPoints } from './snapOffsets.js'
import { useSheetGestures } from './useSheetGestures.js'
import { isSizedByCaller, useSheetReserve } from './useSheetReserve.js'

defineOptions({ name: 'AstryxBottomSheetPanel' })

const props = withDefaults(defineProps<{
  state: BottomSheetPanelState
  /** 被替换的面板（`retained`）正在走的交接动作。 */
  retainedMotion?: BottomSheetReplacedMotion
  /** 被替换的面板向下对齐的像素。 */
  alignmentOffset?: number
  label: string
  height?: BottomSheetHeight | number | string
  padding?: BottomSheetPadding
  snapPoints?: readonly BottomSheetSnapPoint[]
  isSwipeDismissAllowed?: boolean
  /** Whether the host has locked page scrolling (a modal, scrim-backed sheet). */
  isPageScrollLocked?: boolean
}>(), {
  retainedMotion: 'covered',
  alignmentOffset: 0,
  height: 'capped',
  padding: undefined,
  snapPoints: undefined,
  isSwipeDismissAllowed: true,
  isPageScrollLocked: false,
})

const emit = defineEmits<{
  dismiss: []
  scrimOpacity: [opacity: number]
  motionStart: [motion: BottomSheetPanelMotion]
  motionComplete: [motion: BottomSheetPanelMotion]
  snap: [visibleHeight: number]
  scrimFade: [fade: ScrimFade | null]
}>()

defineSlots<{ default?: () => VNode[] }>()

// 面板内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
// 嵌套深度加一，里面再开的浮层会排在面板上面。
resetLayerScopedContext()
provideLayerDepth()
provideLayoutContainer('bottom-sheet')

// The gap a Tall sheet keeps between its focused field and the keyboard, CSS
// px: room for the keyboard's suggestion strip. The body's scroll padding
// keeps the same gap.
const MOBILE_KEYBOARD_BOTTOM_CLEARANCE = 48

const HEIGHT_BUDGETS: Record<BottomSheetHeight, string> = {
  hug: '92dvh',
  capped: '62dvh',
  tall: '92dvh',
}

const panel = useTemplateRef<HTMLElement>('panel')
const body = useTemplateRef<HTMLElement>('body')
const content = useTemplateRef<HTMLElement>('content')
useScrollbars(body)
const isInteractive = computed(() => props.state === 'open')
const isRetained = computed(() => props.state === 'retained')
const motion = computed(() => motionForPanelState(props.state, props.retainedMotion))
// 减弱动效时被替换的面板不往下对齐（那是位移），原地淡出。
const retainedOffset = computed(() => isRetained.value && !defaultPrefersReducedMotion() ? props.alignmentOffset : 0)
const attrs = useAttrs()
const reserve = useSheetReserve(computed(() => props.state !== 'hidden'), () => isSizedByCaller(attrs))

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

// The drag's own callback dismisses the keyboard as the sheet starts to move.
// The keyboard reads the gestures' full height, so it is created after them.
let dismissKeyboard: (focusTarget?: HTMLElement) => void = () => {}

const gestures = useSheetGestures({
  panel,
  body,
  isOpen: isInteractive,
  canDismiss: computed(() => props.isSwipeDismissAllowed),
  reserve,
  getSnapHeights: () => {
    const points = props.snapPoints
    if (!points?.length || typeof window === 'undefined')
      return []
    return resolveSnapPoints(points, window.innerHeight)
  },
  onScrimOpacity: opacity => emit('scrimOpacity', opacity),
  onSnap: visibleHeight => emit('snap', visibleHeight),
  onDismiss: () => emit('dismiss'),
  // Focusing the sheet dismisses the keyboard as the sheet starts to move.
  onTravelStart: () => dismissKeyboard(panel.value ?? undefined),
})

const keyboard = useMobileKeyboard(panel, {
  move: 'ride',
  inset: true,
  body,
  offset: MOBILE_KEYBOARD_BOTTOM_CLEARANCE,
  isEnabled: () => props.height === 'tall' && props.state !== 'hidden',
  isExpanded: gestures.isAtFullHeight,
  isOpen: isInteractive,
  isPageScrollLocked: () => props.isPageScrollLocked,
})
dismissKeyboard = keyboard.dismiss

// A finger's swipe close under reduced motion fades out where the finger left the sheet.
const isCrossFade = computed(() => gestures.isDismissedByTouchDrag.value && defaultPrefersReducedMotion())
// A finger's swipe close plays the dismiss spring from the release speed.
const playedDragExit = computed(() => {
  const exit = gestures.dragExit.value
  return exit != null && !isCrossFade.value && !defaultPrefersReducedMotion() && supportsWebAnimations() ? exit : null
})
// The close holds the drag's transform while its spring or its fade plays.
const holdsDragClose = computed(() => gestures.dragExit.value != null && (playedDragExit.value != null || isCrossFade.value))

// The scrim's fade follows the close's spring. It is written as the close is
// asked for, so it lands with the host's own scrim change.
watch(playedDragExit, (exit) => {
  emit('scrimFade', exit != null && panel.value != null ? dragExitFade(panel.value, exit) : null)
}, { flush: 'sync' })

const panelStyle = computed<Record<string, string | undefined>>(() => {
  const style: Record<string, string | undefined> = {
    '--_sheet-budget': budget.value,
    '--_sheet-reserve': `${reserve.value}px`,
  }
  // The gesture geometry belongs to an interactive sheet. While it exits, only
  // the resized layout height is kept, so the stylesheet's own off-screen
  // transform drives the departure, unless a swipe's close holds the sheet.
  if (isInteractive.value) {
    style.transform = gestures.panelTransform.value
    style.height = gestures.panelHeight.value
  }
  else if (isRetained.value) {
    style.height = gestures.panelHeight.value
    const offset = retainedOffset.value
    if (offset > 0)
      style.transform = [gestures.panelTransform.value, `translateY(${offset}px)`].filter(Boolean).join(' ')
    else
      style.transform = gestures.panelTransform.value
  }
  else if (props.state === 'exiting') {
    style.height = gestures.panelHeight.value
    if (holdsDragClose.value)
      style.transform = gestures.panelTransform.value ?? 'translateY(0px)'
  }
  return style
})

const bodyStyle = computed(() => {
  const inset = gestures.scrollPreservationInset.value
  return inset > 0 ? { paddingBlockEnd: `${inset}px` } : undefined
})

const overflowTabStop = computed(() => isInteractive.value && gestures.isOverflowing.value)

let cancelMotionWait: (() => void) | null = null
/** The element a swipe's close moved on the animator, until the sheet is hidden. */
let dragExitElement: HTMLElement | null = null

function waitForMotion(motion: BottomSheetPanelMotion, isReactivated: boolean): void {
  cancelMotionWait?.()
  emit('motionStart', motion)
  const complete = (): void => {
    cancelMotionWait = null
    emit('motionComplete', motion)
  }
  // 淡出途中又打开的面板就在该在的位置，进场一开始就走完了。
  if (motion === 'entering' && isReactivated) {
    cancelMotionWait = null
    complete()
    return
  }
  const element = panel.value
  const exit = playedDragExit.value
  if (motion === 'exiting' && exit != null && element != null) {
    dragExitElement = element
    cancelMotionWait = playDragExit(element, exit, { onSettled: () => emit('scrimFade', null), complete })
    return
  }
  // 淡出看透明度，进场、对齐、退场看位移。减弱动效下手指拖走的退场原地淡出，也看透明度。
  const property = motion === 'fading' || (motion === 'exiting' && isCrossFade.value) ? 'opacity' : 'transform'
  cancelMotionWait = waitForTransition(element, property, complete)
}

watch(() => [motion.value, props.state] as const, ([next, state], [previous, previousState]) => {
  if (next != null) {
    if (next !== previous)
      waitForMotion(next, previousState === 'retained')
    return
  }
  cancelMotionWait?.()
  cancelMotionWait = null
  if (state === 'hidden' && dragExitElement != null) {
    resetDragExit(dragExitElement)
    dragExitElement = null
  }
}, { flush: 'post' })

onMounted(() => {
  gestures.updateOverflow()
})

onUpdated(() => {
  gestures.updateOverflow()
})

watch([body, content], ([viewport, box], _previous, onCleanup) => {
  if (viewport == null || box == null)
    return
  onCleanup(attachScrollKeyboardDelegation(viewport, box))
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
    class="astryx-bottom-sheet astryx-layer"
    :data-state="state"
    :data-motion="isRetained ? retainedMotion : undefined"
    :data-height="heightKind"
    :data-dragging="gestures.isDragging.value || undefined"
    :data-reconciling="gestures.isReconciling.value || undefined"
    :data-exit="state === 'exiting' && isCrossFade ? 'fade' : undefined"
    :style="panelStyle"
    tabindex="-1"
  >
    <div
      class="astryx-bottom-sheet__handle astryx-bottom-sheet-handle"
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
      <div ref="content" class="astryx-bottom-sheet__content" :data-padding="padding">
        <slot />
      </div>
    </div>
  </div>
</template>
