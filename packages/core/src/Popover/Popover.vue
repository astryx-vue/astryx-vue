<script setup lang="ts">
import type { PopoverProps } from './types.js'
import { computed, nextTick, onMounted, onUpdated, ref, useId, watch } from 'vue'
import { Button } from '../Button/index.js'
import { useResolvedLayerTeleport } from '../composables/useLayerMountTarget.js'
import { useMergedRefs } from '../composables/useMergedRefs.js'
import { clampInlineSize, LAYER_MAX_INLINE_SIZE } from '../layer/inlineSize.js'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import { useComponentMessages } from '../locale/context.js'
import { popoverMessages } from '../locale/messages/popover.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import PopoverSheet from './PopoverSheet.vue'
import { usePopoverSurface } from './usePopover.js'
import { usePopoverSheet } from './usePopoverSheet.js'
import { usePopoverSurfaceMotion } from './usePopoverSurfaceMotion.js'
import '../../styles/popover.css'

defineOptions({ name: 'AstryxPopover' })
const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'below',
  alignment: 'start',
  isOpen: undefined,
  isEnabled: true,
  width: undefined,
  padding: 3,
  label: undefined,
  role: 'dialog',
  isModal: true,
  hasCloseButton: true,
  closeButtonLabel: undefined,
  hasAutoFocus: true,
  hasLightDismiss: true,
  hasEscapeDismiss: true,
  anchor: undefined,
  presentation: 'popover',
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()

const messages = useComponentMessages({ popover: popoverMessages })
const closeLabel = computed(() => props.closeButtonLabel ?? messages.value.popover.close)

const DEFAULT_MAX_WIDTH = 320
// 底部弹层呈现先建：锚定浮层的受控开关要读它在打开那一刻做的选择。
let popover: ReturnType<typeof usePopoverSurface> | null = null
const sheet = usePopoverSheet({
  presentation: () => props.presentation,
  controlledOpen: () => props.isOpen,
  isPopoverOpen: () => popover?.isOpen.value ?? false,
  onOpenChange: open => emit('openChange', open),
})
const sheetId = useId()
popover = usePopoverSurface({
  placement: () => props.placement,
  alignment: () => props.alignment,
  isOpen: sheet.popoverControlledOpen,
  isEnabled: () => props.isEnabled,
  hasLightDismiss: () => props.hasLightDismiss,
  hasEscapeDismiss: () => props.hasEscapeDismiss,
  hasAutoFocus: () => props.hasAutoFocus,
  closeButtonSelector: '.astryx-popover__close',
  dialogLabel: () => props.label,
  role: () => props.role,
  isModal: () => props.isModal,
  onShow: () => emit('openChange', true),
  onHide: () => emit('openChange', false),
}, {
  onTriggerPress: sheet.onTriggerPress,
  sheetTrigger: () => sheet.isMounted.value
    ? { expanded: sheet.isOpen.value || (popover?.isOpen.value ?? false), controls: sheetId }
    : null,
})

const {
  triggerRef,
  anchorRef,
  contentRef,
  isOpen: isOpenState,
  contentStyle: layerStyle,
  resolvedPlacement,
  surfaceProps,
  hide: hidePopover,
} = popover

// 浮层元素挂进 hook 的内容 ref，定位和关闭逻辑都靠它。
const setContentRef = useMergedRefs<HTMLElement>([contentRef])

const wrapperRef = ref<HTMLElement | null>(null)
// Dialog 里挂进对话框；触发器在段落或链接里时挂到安全的父级；其余挂到 body。
const teleportTarget = useResolvedLayerTeleport(computed(() => props.anchor ?? wrapperRef.value))
const bodyRef = ref<HTMLElement | null>(null)
useScrollbars(bodyRef)
const anchorWidth = ref(0)
// 组件自己再算一层位置样式：宽高和 padding 是 Popover 自己的外观，不属于浮层内核。
const surfaceStyle = computed(() => {
  const style: Record<string, string> = {
    '--_popover-padding': `var(--astryx-spacing-${String(props.padding).replace('.', '-')})`,
    'top': layerStyle.value.top as string,
    'left': layerStyle.value.left as string,
    // 视口上限永远管着宽度：显式 width 也不能把它顶破。
    'maxWidth': props.width == null ? clampInlineSize(`${DEFAULT_MAX_WIDTH}px`) : LAYER_MAX_INLINE_SIZE,
  }
  if (props.width != null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  else {
    // 不窄于触发器，也压在视口上限之内：最小宽度优先于最大宽度，不压会撑出屏幕。
    style.minWidth = clampInlineSize(`min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`)
  }
  return style
})

// 浮层跟着外部锚点走，没有外部锚点就跟着包住触发器内容的这层 span。
function triggerHost(): HTMLElement | null {
  return props.anchor ?? wrapperRef.value
}

function findTriggerButton(element: HTMLElement | null): HTMLElement | null {
  if (!element)
    return null
  if (element.matches('button, [role="button"]'))
    return element
  return element.querySelector<HTMLElement>('button, [role="button"]')
}

function syncTrigger(): void {
  anchorRef.value = triggerHost()
  triggerRef.value = findTriggerButton(triggerHost())
}

// 手指下浮层从触发器长出、缩回：打开时元素还没画出来，开始关闭时它还显示着。
const surfaceMotion = usePopoverSurfaceMotion()
watch(isOpenState, (open) => {
  if (open)
    surfaceMotion.present(contentRef.value, anchorRef.value ?? triggerRef.value)
  else
    surfaceMotion.closeStart()
}, { flush: 'sync' })

// 打开时按触发器宽度算最小宽度，浮层不会比触发器还窄。
watch(isOpenState, (open) => {
  if (!open)
    return
  anchorWidth.value = triggerHost()?.getBoundingClientRect().width ?? 0
})

// 挂载后才拿到的模板 ref 是以 prop 变更的形式到达的，所以要在它变化时重新绑定。
watch(() => props.anchor, () => {
  void nextTick(syncTrigger)
})

onMounted(syncTrigger)
onUpdated(syncTrigger)
</script>

<template>
  <span v-if="!anchor" ref="wrapperRef" class="astryx-popover-trigger">
    <slot />
  </span>
  <slot v-else />
  <Teleport :to="teleportTarget">
    <div
      v-show="isOpenState"
      :ref="setContentRef"
      class="astryx-popover"
      :data-placement="resolvedPlacement"
      :style="surfaceStyle"
      v-bind="surfaceProps"
    >
      <div ref="bodyRef" class="astryx-popover__body">
        <LayerContentBoundary v-if="!sheet.isMounted.value">
          <slot name="content" />
        </LayerContentBoundary>
      </div>
      <div v-if="hasCloseButton" class="astryx-popover__close">
        <Button variant="secondary" :label="closeLabel" @click="hidePopover" />
      </div>
    </div>
  </Teleport>
  <PopoverSheet
    v-if="sheet.isMounted.value"
    :id="sheetId"
    :is-open="sheet.isOpen.value"
    :label="label ?? sheet.triggerText.value"
    :padding="padding"
    :has-escape-dismiss="hasEscapeDismiss"
    :has-close-button="hasCloseButton"
    :close-label="closeLabel"
    @open-change="sheet.setOpen"
    @motion-complete="sheet.onMotionComplete"
  >
    <slot name="content" />
  </PopoverSheet>
</template>
