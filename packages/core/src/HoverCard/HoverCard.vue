<script setup lang="ts">
import type { HoverCardEmits, HoverCardProps, HoverCardSlots } from './types.js'
import { computed, onMounted, onUpdated, ref } from 'vue'
import { useMergedRefs } from '../composables/useMergedRefs.js'
import { useHoverCard } from './useHoverCard.js'
import '../../styles/hover-card.css'

defineOptions({ name: 'AstryxHoverCard', inheritAttrs: false })

const props = withDefaults(defineProps<HoverCardProps>(), {
  content: '',
  placement: 'above',
  alignment: 'center',
  delay: 300,
  hideDelay: 200,
  focusTrigger: 'auto',
  touchTrigger: 'auto',
  isEnabled: true,
  label: undefined,
  hasHoverIndication: 'auto',
  isOpen: undefined,
  isDefaultOpen: false,
})

const emit = defineEmits<HoverCardEmits>()
defineSlots<HoverCardSlots>()

const hoverCard = useHoverCard({
  placement: () => props.placement,
  alignment: () => props.alignment,
  delay: () => props.delay,
  hideDelay: () => props.hideDelay,
  focusTrigger: () => props.focusTrigger,
  touchTrigger: () => props.touchTrigger,
  isEnabled: () => props.isEnabled,
  label: () => props.label,
  isOpen: () => props.isOpen,
  isDefaultOpen: props.isDefaultOpen,
  onShow: () => emit('openChange', true),
  onHide: () => emit('openChange', false),
})

const {
  triggerRef,
  contentRef: surfaceRef,
  isOpen: isVisible,
  contentStyle: surfaceStyle,
  resolvedPlacement,
  contentProps,
  show,
  hide,
} = hoverCard

// 浮层元素挂进 hook 的内容 ref，定位和指针桥接都靠它。
const setContentRef = useMergedRefs<HTMLElement>([surfaceRef])

const wrapperRef = ref<HTMLElement | null>(null)
// 触发器是插槽内容，这里只负责从包裹元素里把它找出来，再交给 hook 挂事件。
const isTextTrigger = ref(false)
const showIndication = computed(() => props.hasHoverIndication === true || (props.hasHoverIndication === 'auto' && isTextTrigger.value))
const element = computed(() => surfaceRef.value)

function resolveTrigger(): HTMLElement | null {
  const wrapper = wrapperRef.value
  if (!wrapper)
    return null
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
  triggerRef.value = resolveTrigger()
}

onMounted(syncTrigger)
onUpdated(syncTrigger)

defineExpose({ element, show, hide })
</script>

<template>
  <span
    ref="wrapperRef"
    v-bind="$attrs"
    class="astryx-hover-card__trigger"
    :class="{
      'astryx-hover-card__trigger--text': isTextTrigger,
      'astryx-hover-card__trigger--indicated': isTextTrigger && showIndication,
    }"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="astryx-hover-card">
      <!-- eslint-disable-next-line vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- The card's pointer handlers only keep it open while the pointer is inside it; opening and closing by keyboard are handled on the trigger and by Escape. -->
      <div
        v-show="isVisible"
        :ref="setContentRef"
        class="astryx-hover-card"
        :data-placement="resolvedPlacement"
        :style="surfaceStyle"
        v-bind="contentProps"
      >
        <div class="astryx-hover-card__content">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
