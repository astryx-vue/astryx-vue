<script setup lang="ts">
import type { VNode } from 'vue'
import type { TooltipProps } from './types.js'
import { computed, getCurrentInstance, nextTick, onMounted, onUpdated, ref, Teleport, useAttrs, watch } from 'vue'
import TooltipSurface from './TooltipSurface.vue'
import { useTooltip } from './useTooltip.js'
import '../../styles/tooltip.css'

defineOptions({ name: 'AstryxTooltip', inheritAttrs: false })
const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'above',
  alignment: 'center',
  delay: 200,
  hideDelay: 0,
  focusTrigger: 'auto',
  touchTrigger: 'auto',
  isEnabled: true,
  hasHoverIndication: 'auto',
  isOpen: undefined,
  isDefaultOpen: false,
  anchorsOnSelf: false,
  anchor: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()

const attrs = useAttrs()
const instance = getCurrentInstance()

const tooltip = useTooltip({
  placement: () => props.placement,
  alignment: () => props.alignment,
  delay: () => props.delay,
  hideDelay: () => props.hideDelay,
  focusTrigger: () => props.focusTrigger,
  touchTrigger: () => props.touchTrigger,
  isEnabled: () => props.isEnabled,
  isOpen: () => props.isOpen,
  isDefaultOpen: props.isDefaultOpen,
  onShow: () => emit('openChange', true),
  onHide: () => emit('openChange', false),
})

const { triggerRef } = tooltip

const wrapperRef = ref<HTMLElement | null>(null)
// 触发器是插槽内容，这里只负责从包裹元素里把它找出来，再交给 hook 挂事件。
const isTextTrigger = ref(false)
const showIndication = computed(() => props.hasHoverIndication === true || (props.hasHoverIndication === 'auto' && isTextTrigger.value))

function resolveTrigger(): HTMLElement | null {
  if (props.anchor) {
    isTextTrigger.value = false
    return props.anchor
  }
  const wrapper = wrapperRef.value
  if (!wrapper)
    return null
  if (props.anchorsOnSelf) {
    isTextTrigger.value = false
    return wrapper
  }
  const child = wrapper.firstElementChild as HTMLElement | null
  isTextTrigger.value = child == null && (wrapper.textContent ?? '').trim() !== ''
  if (child)
    return child
  if (isTextTrigger.value) {
    wrapper.tabIndex = 0
    return wrapper
  }
  return null
}

function findAnchorElement(vnode: VNode): HTMLElement | null {
  if (vnode.el instanceof HTMLElement)
    return vnode.el
  if (vnode.component)
    return findAnchorElement(vnode.component.subTree)
  if (vnode.type === Teleport || !Array.isArray(vnode.children))
    return null
  for (const child of vnode.children) {
    if (child == null || typeof child !== 'object')
      continue
    const element = findAnchorElement(child as VNode)
    if (element)
      return element
  }
  return null
}

function syncTrigger(): void {
  if (props.anchorsOnSelf && !props.anchor)
    wrapperRef.value = instance ? findAnchorElement(instance.subTree) : null
  triggerRef.value = resolveTrigger()
}

// 挂载后才拿到的模板 ref 是以 prop 变更的形式到达的，所以要在它变化时重新找触发器。
watch(() => props.anchor, () => {
  void nextTick(syncTrigger)
})

onMounted(syncTrigger)
onUpdated(syncTrigger)
</script>

<template>
  <span
    v-if="!anchorsOnSelf && !anchor"
    ref="wrapperRef"
    v-bind="attrs"
    class="astryx-tooltip-trigger"
    :class="{ 'astryx-tooltip-trigger--text': isTextTrigger, 'astryx-tooltip-trigger--indicated': showIndication }"
  >
    <slot />
  </span>
  <slot v-else />
  <TooltipSurface :tooltip="tooltip" :anchor="props.anchor ?? wrapperRef" :content="content">
    <slot name="content">
      {{ content }}
    </slot>
  </TooltipSurface>
</template>
