<script setup lang="ts">
import type { PopoverProps } from './types.js'
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'
import { Button } from '../Button/index.js'
import { useMergedRefs } from '../composables/useMergedRefs.js'
import { usePopover } from './usePopover.js'
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
  closeButtonLabel: 'Close',
  hasAutoFocus: true,
  hasLightDismiss: true,
  hasEscapeDismiss: true,
  anchor: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()

const DEFAULT_MAX_WIDTH = 320
const popover = usePopover({
  placement: () => props.placement,
  alignment: () => props.alignment,
  isOpen: () => props.isOpen,
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
})

const {
  triggerRef,
  anchorRef,
  contentRef,
  isOpen: isOpenState,
  contentStyle: layerStyle,
  resolvedPlacement,
  surfaceProps,
} = popover

// 浮层元素挂进 hook 的内容 ref，定位和关闭逻辑都靠它。
const setContentRef = useMergedRefs<HTMLElement>([contentRef])

const wrapperRef = ref<HTMLElement | null>(null)
const anchorWidth = ref(0)
// 组件自己再算一层位置样式：宽高和 padding 是 Popover 自己的外观，不属于浮层内核。
const surfaceStyle = computed(() => {
  const style: Record<string, string> = {
    '--_popover-padding': `var(--astryx-spacing-${String(props.padding).replace('.', '-')})`,
    'top': layerStyle.value.top as string,
    'left': layerStyle.value.left as string,
  }
  if (props.width != null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  else {
    style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`
    style.maxWidth = `min(${DEFAULT_MAX_WIDTH}px, calc(100vw - 16px))`
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
  <Teleport to="body">
    <div
      v-show="isOpenState"
      :ref="setContentRef"
      class="astryx-popover"
      :data-placement="resolvedPlacement"
      :style="surfaceStyle"
      v-bind="surfaceProps"
    >
      <div class="astryx-popover__body">
        <slot name="content" />
      </div>
      <div v-if="hasCloseButton" class="astryx-popover__close">
        <Button variant="secondary" :label="closeButtonLabel" @click="popover.hide()" />
      </div>
    </div>
  </Teleport>
</template>
