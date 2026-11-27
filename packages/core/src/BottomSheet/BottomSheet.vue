<script setup lang="ts">
import type { DismissEscape } from '../layer/dismissStack.js'
import type { BottomSheetPanelMotion, BottomSheetPanelState } from './panelState.js'
import type { BottomSheetEmits, BottomSheetProps, BottomSheetSlots } from './types.js'
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref, toValue, useAttrs, useTemplateRef, watch } from 'vue'
import { useScrollLock } from '../composables/useScrollLock.js'
import { holdKeptInside } from '../layer/inputHold.js'
import { provideNestedLayerMountTarget } from '../layer/mount.js'
import { isImeKeyEvent } from '../utils/ime.js'
import BottomSheetPanel from './BottomSheetPanel.vue'
import BottomSheetStep from './BottomSheetStep.vue'
import { bottomSheetEscapeKey } from './escape.js'
import { isPublicMotion } from './panelState.js'
import { bottomSheetHostKey } from './sheetHostContext.js'
import { isSheetHostPresented } from './stack/sheetHost.js'
import { stackRecedeClasses, stackStateAttribute } from './stack/stackPresentation.js'
import { useModalOutletWhile } from './stack/useModalOutletWhile.js'
import { useStandaloneSheetStack } from './stack/useStandaloneSheetStack.js'
import { bottomSheetSwitcherKey } from './switcher.js'
import { useSheetLayerDismiss } from './useSheetLayerDismiss.js'
import '../../styles/bottom-sheet.css'

defineOptions({ name: 'AstryxBottomSheet', inheritAttrs: false })

const props = withDefaults(defineProps<BottomSheetProps>(), {
  isInline: false,
  height: 'capped',
  snapPoints: undefined,
  padding: undefined,
  purpose: 'info',
  hasScrim: true,
  finalFocusRef: null,
})

const emit = defineEmits<BottomSheetEmits>()
defineSlots<BottomSheetSlots>()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const switcher = inject(bottomSheetSwitcherKey, null)
const host = inject(bottomSheetHostKey, null)
const isEscapeAllowed = inject(bottomSheetEscapeKey, () => true)
provide(bottomSheetEscapeKey, () => true)
const hosted = computed(() => switcher != null && props.sheetId != null)
// 写在另一张面板内容里的面板只在外面那张打开时呈现；自己的 isOpen 从不被改写。
const effectiveOpen = computed(() => !hosted.value && isOpen.value && (host?.isOpen.value ?? true))
provide(bottomSheetHostKey, { isOpen: effectiveOpen })

const attrs = useAttrs()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
provideNestedLayerMountTarget(useTemplateRef<HTMLElement>('layerHost'))
const panel = useTemplateRef<InstanceType<typeof BottomSheetPanel>>('panel')
const step = useTemplateRef<InstanceType<typeof BottomSheetStep>>('step')
const isMounted = ref(false)
// 服务端渲染时就开着的面板，水合后直接以静止状态呈现，不播进场；第一次关闭后恢复动效。
const isSettled = ref(getCurrentInstance()?.vnode.el != null && isOpen.value && !hosted.value && !props.isInline)

function panelElement(): HTMLElement | null {
  if (hosted.value)
    return step.value?.element ?? null
  return panel.value?.element ?? null
}

const stack = useStandaloneSheetStack({
  isOpen: effectiveOpen,
  hasScrim: () => props.hasScrim,
  isEnabled: () => !hosted.value && !props.isInline && typeof document !== 'undefined',
  getDialog: () => dialog.value ?? null,
  getPanel: panelElement,
  getFinalFocus: () => toValue(props.finalFocusRef) ?? null,
})
const view = stack.view

const panelState = computed<BottomSheetPanelState>(() => {
  if (props.isInline)
    return isOpen.value ? 'open' : 'hidden'
  if (effectiveOpen.value)
    return 'open'
  if (stack.isReplaced.value)
    return 'retained'
  if (stack.isPresented.value)
    return stack.isCloseSettled.value ? 'exiting' : 'open'
  return 'hidden'
})

const isDismissible = computed(() => props.purpose === 'info')
const isExiting = computed(() => !hosted.value && !props.isInline && !effectiveOpen.value && stack.isPresented.value)
// 被盖住、里面也没有正在呈现的面板时整个对话框 inert；被替换的面板在交接期间也是。
const isInert = computed(() => (isExiting.value && stack.isReplaced.value) || view.value.isBlocked)

useScrollLock(computed(() => isMounted.value && !hosted.value && !props.isInline && props.hasScrim && stack.shouldPresent.value))

// 打开着、带遮罩、在叠放的最上面时，这个对话框是全局 toast 的挂载点。
useModalOutletWhile(
  () => dialog.value ?? null,
  () => effectiveOpen.value && props.hasScrim && (view.value.isTop || !view.value.isStacked),
)

/** The dialog carries the accessible name; the panel keeps every other attribute. */
const dialogLabel = computed(() => {
  if (attrs['aria-labelledby'] != null)
    return undefined
  return (attrs['aria-label'] as string | undefined) ?? props.label
})

const labelledBy = computed(() => attrs['aria-labelledby'] as string | undefined)

function panelAttrs(): Record<string, unknown> {
  const { 'aria-label': _label, 'aria-labelledby': _labelledBy, ...rest } = attrs
  return rest
}

const layerActive = computed(() => !hosted.value && !props.isInline && stack.shouldPresent.value)
const layerEscape = computed<DismissEscape>(() => {
  if (!effectiveOpen.value || props.purpose === 'required' || !isEscapeAllowed())
    return 'block'
  if (!props.hasScrim)
    return 'ignore'
  return 'close'
})
const layer = useSheetLayerDismiss({
  isActive: layerActive,
  escape: layerEscape,
  getContainer: () => dialog.value ?? null,
  // 被盖住或被替换的面板还在屏幕上，但按键从来不是给它的：交给最上面那张。
  isPresent: () => isSheetHostPresented(dialog.value) && !view.value.isCovered && view.value.replacedMotion == null,
  onDismiss: () => {
    if (!effectiveOpen.value || props.purpose === 'required')
      return
    requestClose()
  },
})

function requestClose(): void {
  isOpen.value = false
  emit('openChange', false)
}

function dismissOnEscape(): void {
  if (!effectiveOpen.value || props.purpose === 'required' || !isEscapeAllowed())
    return
  requestClose()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !layer.isTop())
    return
  event.preventDefault()
  if (isImeKeyEvent(event))
    return
  dismissOnEscape()
}

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== dialog.value)
    return
  event.preventDefault()
  if (!layer.isTop())
    return
  dismissOnEscape()
}

function onDialogClick(event: MouseEvent): void {
  if (event.target !== event.currentTarget)
    return
  if (props.hasScrim && isDismissible.value && effectiveOpen.value)
    requestClose()
}

function onPanelMotionStart(motion: BottomSheetPanelMotion): void {
  if (isPublicMotion(motion))
    emit('motionStart', motion)
  stack.onMotionStart(motion)
}

function onPanelMotionComplete(motion: BottomSheetPanelMotion): void {
  if (isPublicMotion(motion))
    emit('motionComplete', motion)
  stack.onMotionComplete(motion)
}

watch(isOpen, (value) => {
  if (!value)
    isSettled.value = false
})

// 关闭中的面板交给浮层运行时的输入暂挡：页面照常可点；焦点还留在里面时内容不藏，
// 只放行 Tab，焦点一离开就整个变成 inert。关闭配成替换的不暂挡（交接期间它整个 inert）；
// 关闭是不是替换要等这一批答复，答复之前也不暂挡，免得第一下就把焦点藏起来。
const isExitHeld = computed(() => isExiting.value && !stack.isReplaced.value && stack.isCloseSettled.value)
let releaseExitHold: (() => void) | null = null
watch(isExitHeld, (held) => {
  releaseExitHold?.()
  releaseExitHold = null
  const element = dialog.value
  if (held && element != null)
    releaseExitHold = holdKeptInside(element, new Promise<never>(() => {}))
}, { flush: 'post' })

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  releaseExitHold?.()
  releaseExitHold = null
})

defineExpose({
  element: computed(() => panelElement()),
  focus: (options?: FocusOptions) => panelElement()?.focus(options),
  blur: () => panelElement()?.blur(),
})
</script>

<template>
  <BottomSheetStep
    v-if="hosted && switcher != null && sheetId != null"
    ref="step"
    v-bind="attrs"
    :switcher="switcher"
    :sheet-id="sheetId"
    :label="label"
    :height="height"
    :padding="padding"
    :snap-points="snapPoints"
    :purpose="purpose"
    @snap="emit('snap', $event)"
    @motion-start="emit('motionStart', $event)"
    @motion-complete="emit('motionComplete', $event)"
  >
    <slot />
  </BottomSheetStep>
  <div v-else-if="isInline" class="astryx-bottom-sheet-inline">
    <div v-if="isOpen" class="astryx-bottom-sheet__positioner astryx-bottom-sheet__positioner--inline">
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="false"
        @snap="emit('snap', $event)"
      >
        <slot />
      </BottomSheetPanel>
    </div>
  </div>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘走原生 cancel 和下面的 keydown。 -->
  <dialog
    v-else
    ref="dialog"
    class="astryx-bottom-sheet-dialog"
    :class="[
      stackRecedeClasses(view),
      {
        'astryx-bottom-sheet-dialog--scrim': hasScrim,
        'astryx-bottom-sheet-dialog--closing': isExiting,
        'astryx-bottom-sheet-dialog--replacing': !hasScrim && view.isReplacing,
      },
    ]"
    :data-settled="isSettled || undefined"
    :data-sheet-stack="hasScrim ? stackStateAttribute(view, effectiveOpen) : undefined"
    :data-sheet-stack-depth="hasScrim && view.depth > 0 ? view.depth : undefined"
    :aria-label="dialogLabel"
    :aria-labelledby="labelledBy"
    :aria-modal="hasScrim && effectiveOpen && stack.isModalShown.value ? 'true' : undefined"
    :aria-hidden="isInert ? 'true' : undefined"
    :inert="isInert || undefined"
    :role="purpose === 'required' ? 'alertdialog' : undefined"
    @cancel="onCancel"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <div class="astryx-bottom-sheet__positioner">
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :retained-motion="view.replacedMotion ?? 'covered'"
        :alignment-offset="view.alignmentOffset"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="purpose === 'info'"
        :is-page-scroll-locked="hasScrim && stack.shouldPresent.value"
        @dismiss="requestClose"
        @scrim-opacity="stack.onScrimOpacity"
        @scrim-fade="stack.onScrimFade"
        @snap="emit('snap', $event)"
        @motion-start="onPanelMotionStart"
        @motion-complete="onPanelMotionComplete"
      >
        <slot />
      </BottomSheetPanel>
    </div>
    <div class="astryx-bottom-sheet__edge-tint" aria-hidden="true" />
    <div ref="layerHost" class="astryx-bottom-sheet__layer-host" />
  </dialog>
</template>
