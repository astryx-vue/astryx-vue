<script setup lang="ts">
import type { BottomSheetMotion } from '../BottomSheet/types.js'
import type { PopoverPadding } from './types.js'
import { nextTick, onBeforeUnmount, provide, watch } from 'vue'
import { bottomSheetEscapeKey } from '../BottomSheet/escape.js'
import { LazyBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import { Button } from '../Button/index.js'
import { focusElement } from '../layer/focus.js'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import { initialFocusCandidates } from './initialFocus.js'

defineOptions({ name: 'AstryxPopoverSheet' })

const props = defineProps<{
  id: string
  isOpen: boolean
  label: string
  padding: PopoverPadding
  hasEscapeDismiss: boolean
  hasCloseButton: boolean
  closeLabel: string
}>()

const emit = defineEmits<{
  openChange: [isOpen: boolean]
  motionComplete: [motion: BottomSheetMotion]
}>()

const FALLBACK_CLOSE = '[data-astryx-popover-fallback-close]'
/** 底部弹层按需加载：第一次打开时面板可能晚几帧才挂上，最多等这么多帧。 */
const MAX_FOCUS_FRAMES = 30

// 底部弹层总能轻点外面、向下轻扫关闭；Escape 跟着 `hasEscapeDismiss`。
provide(bottomSheetEscapeKey, () => props.hasEscapeDismiss)

let frame: number | null = null

function cancelFocus(): void {
  if (frame != null)
    cancelAnimationFrame(frame)
  frame = null
}

/**
 * 每次打开都把焦点送进内容，和锚定浮层一样：调用方的 `[data-autofocus]`，否则第一个
 * 真正的内容控件（跳过后备关闭按钮），都没有就留在弹层自己的面板上。
 */
function focusContent(framesLeft: number): void {
  frame = requestAnimationFrame(() => {
    frame = null
    if (!props.isOpen)
      return
    const panel = document.getElementById(props.id)
    const dialog = panel?.closest('dialog')
    if (panel == null || dialog == null || !dialog.open) {
      if (framesLeft > 0)
        focusContent(framesLeft - 1)
      return
    }
    const active = panel.ownerDocument.activeElement
    if (active != null && active !== panel && panel.contains(active) && active.closest(FALLBACK_CLOSE) == null)
      return
    const box = panel.querySelector<HTMLElement>('.astryx-bottom-sheet__content') ?? panel
    const autofocus = box.querySelector<HTMLElement>('[data-autofocus]')
    if (autofocus != null && focusElement(autofocus))
      return
    for (const candidate of initialFocusCandidates(box, FALLBACK_CLOSE)) {
      if (focusElement(candidate))
        return
    }
    if (active !== panel)
      focusElement(panel)
  })
}

watch(() => props.isOpen, (open) => {
  cancelFocus()
  if (open)
    void nextTick(() => focusContent(MAX_FOCUS_FRAMES))
}, { immediate: true })

onBeforeUnmount(cancelFocus)
</script>

<template>
  <LazyBottomSheet
    :id="id"
    :is-open="isOpen"
    :label="label"
    height="tall"
    :padding="padding"
    @open-change="emit('openChange', $event)"
    @motion-complete="emit('motionComplete', $event)"
  >
    <LayerContentBoundary>
      <slot />
    </LayerContentBoundary>
    <Button
      v-if="hasCloseButton"
      class="astryx-popover__sheet-close"
      data-astryx-popover-fallback-close=""
      variant="secondary"
      :label="closeLabel"
      @click="emit('openChange', false)"
    />
  </LazyBottomSheet>
</template>
