<script setup lang="ts">
import type { TooltipProps } from './types.js'
import { computed, getCurrentInstance, nextTick, onMounted, onUpdated, ref, useAttrs, watch } from 'vue'
import { useMergedRefs } from '../composables/useMergedRefs.js'
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

const {
  triggerRef,
  contentRef,
  isOpen,
  contentStyle: bubbleStyle,
  resolvedPlacement,
  contentProps,
} = tooltip

// 浮层元素挂进 hook 的内容 ref，定位与鼠标桥接都靠它。
const setContentRef = useMergedRefs<HTMLElement>([contentRef])

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

function syncTrigger(): void {
  if (props.anchorsOnSelf && !props.anchor) {
    const el = instance?.vnode.el
    wrapperRef.value = el instanceof HTMLElement ? el : null
  }
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
  <Teleport to="body">
    <!-- eslint-disable-next-line vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- 气泡上的鼠标事件仅用于指针移入气泡时保持显示；键盘焦点由触发元素的 focusin / focusout 处理。 -->
    <div
      v-show="isOpen"
      :ref="setContentRef"
      class="astryx-tooltip"
      :data-placement="resolvedPlacement"
      :style="bubbleStyle"
      v-bind="contentProps"
    >
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </Teleport>
</template>
