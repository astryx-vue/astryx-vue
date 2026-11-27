<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { DismissEscape } from '../layer/dismissStack.js'
import type { DrawerEmits, DrawerProps, DrawerSlots } from './types.js'
import { computed, provide, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useFocusTrap, useScrollLock } from '../composables/index.js'
import { DIALOG_CONTEXT_KEY } from '../Dialog/context.js'
import { findInitialFocusTarget } from '../Dialog/initialFocus.js'
import { formatDialogSize } from '../Dialog/position.js'
import { provideLayerDepth } from '../layer/layerDepth.js'
import { provideLayerMountTarget } from '../layer/mount.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useBackdropPress } from '../layer/useBackdropPress.js'
import { provideLayoutContainer } from '../Layout/context.js'
import { useDrawerLayerDismiss } from './useDrawerLayerDismiss.js'
import { useDrawerPresence } from './useDrawerPresence.js'
import '../../styles/drawer.css'

/**
 * 贴边的侧边面板，浮在页面上面，不挤动下面的布局。
 *
 * 带遮罩（默认）时用 `showModal()` 打开：顶层、焦点陷阱、滚动锁、点遮罩关闭。
 * 不带遮罩时用 `popover="manual"` 进入顶层：旁边的页面照常能点、能滚，焦点不关在里面。
 * 进场从贴着的那一边滑入，退场从同一边滑出，播完才离开顶层。
 */
defineOptions({ name: 'AstryxDrawer', inheritAttrs: false })
const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'end',
  width: 400,
  padding: undefined,
  purpose: 'info',
  hasScrim: true,
})
const emit = defineEmits<DrawerEmits>()
defineSlots<DrawerSlots>()
const attrs = useAttrs()

// 抽屉内容是这一层的成员边界，里面再开的浮层比它深一层，浮层也挂进抽屉自己里面。
resetLayerScopedContext()
provideLayoutContainer('dialog')
provide(DIALOG_CONTEXT_KEY, {
  titleId: `astryx-drawer-title-${useId()}`,
  isInline: computed(() => false),
  registerTitle: () => {},
})
provideLayerDepth()
const layerHostRef = ref<HTMLElement | null>(null)
provideLayerMountTarget(layerHostRef)

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const contentRef = useTemplateRef<HTMLElement>('contentRef')

function initialFocusTarget(): HTMLElement | null {
  const dialog = dialogRef.value
  if (dialog == null)
    return null
  return findInitialFocusTarget(dialog) ?? contentRef.value
}

const { isRendered, isHostOpen } = useDrawerPresence({
  dialog: dialogRef,
  isOpen: () => props.isOpen,
  isModal: () => props.hasScrim,
  initialFocus: initialFocusTarget,
})

useFocusTrap({
  container: dialogRef,
  isEnabled: computed(() => props.isOpen && props.hasScrim && isHostOpen.value),
  initialFocus: initialFocusTarget,
})
useScrollLock(computed(() => props.isOpen && props.hasScrim && isHostOpen.value))

// 面板贴着的一边，也是它退场要滑回去的一边。打开期间跟着 placement 走，关上时锁住：
// 调用方常把 placement 和打开状态从同一份选中数据算出来，关闭时数据一清空，
// placement 跟着变回默认值，不锁住的话面板会跳到另一边、朝反方向滑走。
const exitSide = ref(props.placement)
watch(() => [props.isOpen, props.placement] as const, ([open, placement]) => {
  if (open)
    exitSide.value = placement
})
const anchoredSide = computed(() => (props.isOpen ? props.placement : exitSide.value))

function requestClose(): void {
  emit('openChange', false)
}

// 非模态抽屉的 Escape 走全页关闭栈；模态抽屉走原生 cancel，见 onCancel。
useDrawerLayerDismiss({
  isActive: computed(() => !props.hasScrim && isRendered.value),
  escape: computed<DismissEscape>(() => (props.isOpen && props.purpose !== 'required' ? 'close' : 'block')),
  getContainer: () => dialogRef.value,
  onDismiss: requestClose,
})

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== dialogRef.value)
    return
  // 关闭权交给调用方：浏览器不自己关，按 purpose 发出请求。
  event.preventDefault()
  if (props.isOpen && props.purpose !== 'required')
    requestClose()
}

// 只有按下和松手都在遮罩上才算点遮罩。非模态抽屉没有遮罩。
const backdropPress = useBackdropPress(() => dialogRef.value, () => {
  if (props.hasScrim && props.isOpen && props.purpose === 'info')
    requestClose()
})

const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
))

const rootStyle = computed(() => ({ '--_drawer-width': formatDialogSize(props.width) }))

const contentStyle = computed(() => {
  if (props.padding == null)
    return undefined
  return { '--_drawer-padding': `var(--astryx-spacing-${String(props.padding).replace('.', '-')})` }
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 遮罩点击只作用于原生 dialog 元素本身；Escape 由原生 cancel 和关闭栈处理。 -->
  <dialog
    ref="dialogRef"
    v-bind="rootAttrs"
    class="astryx-drawer astryx-layer"
    :class="[`astryx-drawer--${anchoredSide}`, { 'astryx-drawer--scrim': hasScrim }, attrs.class]"
    :style="[rootStyle, attrs.style as StyleValue]"
    :data-side="anchoredSide"
    :data-open="isOpen ? '' : undefined"
    :data-rendered="isRendered ? '' : undefined"
    :popover="hasScrim ? undefined : 'manual'"
    :role="(attrs.role as string | undefined) ?? (purpose === 'required' && hasScrim ? 'alertdialog' : undefined)"
    :aria-modal="hasScrim && isHostOpen ? 'true' : undefined"
    :aria-label="label"
    @pointerdown="backdropPress.onPointerDown"
    @click="backdropPress.onClick"
    @cancel="onCancel"
  >
    <div ref="contentRef" class="astryx-drawer__content" tabindex="-1" :style="contentStyle">
      <div class="astryx-drawer-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="astryx-drawer-footer">
        <slot name="footer" />
      </div>
    </div>
    <div ref="layerHostRef" class="astryx-drawer__layer-host" />
  </dialog>
</template>
