<script setup lang="ts">
import type { TooltipProps } from './types.js'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, ref, useAttrs, useId, watch } from 'vue'
import { isFocusable } from '../layer/focus.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
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
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const attrs = useAttrs()
const instance = getCurrentInstance()
const HOVER_BRIDGE_DELAY = 100
const GAP = 4
const ACTION_TAGS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']

const tooltipId = `astryx-tooltip-${useId()}`
const wrapperRef = ref<HTMLElement | null>(null)
const bubbleRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isTextTrigger = ref(false)
const isControlled = computed(() => props.isOpen !== undefined)
const showIndication = computed(() => props.hasHoverIndication === true || (props.hasHoverIndication === 'auto' && isTextTrigger.value))

const { position, detach: detachPosition } = usePositionedLayer({
  anchor: triggerRef,
  layer: bubbleRef,
  isOpen: isVisible,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})
const bubbleStyle = computed(() => ({ top: `${position.value.top}px`, left: `${position.value.left}px` }))

let trigger: HTMLElement | null = null
let describedByBefore: string | null = null
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let isTouchPointer = false

function clearTimers(): void {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function applyVisible(next: boolean): boolean {
  if (isVisible.value === next)
    return false
  isVisible.value = next
  return true
}

function setOpen(next: boolean): void {
  if (applyVisible(next))
    emit('openChange', next)
}

function showNow(): void {
  clearTimers()
  if (!props.isEnabled || isControlled.value)
    return
  setOpen(true)
}

function hideNow(): void {
  clearTimers()
  if (isControlled.value)
    return
  setOpen(false)
}

function scheduleShow(): void {
  if (!props.isEnabled || isControlled.value)
    return
  clearTimers()
  showTimer = setTimeout(setOpen, props.delay, true)
}

function scheduleHide(): void {
  if (isControlled.value)
    return
  clearTimers()
  const wait = props.hideDelay > 0 ? props.hideDelay : HOVER_BRIDGE_DELAY
  hideTimer = setTimeout(setOpen, wait, false)
}

function cancelHide(): void {
  clearTimeout(hideTimer)
  hideTimer = undefined
}

function matchesFocusVisible(element: HTMLElement): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}

function onPointerEnter(event: PointerEvent): void {
  isTouchPointer = event.pointerType === 'touch'
}

function onMouseEnter(): void {
  if (isTouchPointer)
    return
  scheduleShow()
}

function onMouseLeave(): void {
  if (isTouchPointer)
    return
  scheduleHide()
}

function onTouchTap(): void {
  if (!props.isEnabled || isControlled.value || props.touchTrigger === 'none')
    return
  if (props.touchTrigger === 'auto' && trigger && ACTION_TAGS.includes(trigger.tagName))
    return
  if (isVisible.value)
    hideNow()
  else
    showNow()
}

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType === 'touch') {
    onTouchTap()
    return
  }
  if (isControlled.value)
    return
  hideNow()
}

function onFocusIn(event: FocusEvent): void {
  if (!props.isEnabled || isTouchPointer)
    return
  const target = event.target as HTMLElement
  if (!matchesFocusVisible(target))
    return
  showNow()
}

function onFocusOut(): void {
  scheduleHide()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape')
    return
  if (isControlled.value) {
    emit('openChange', false)
    return
  }
  clearTimers()
  setOpen(false)
}

function shouldListenFocus(element: HTMLElement): boolean {
  return props.focusTrigger === 'always' || (props.focusTrigger === 'auto' && isFocusable(element))
}

function resolveTrigger(): HTMLElement | null {
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

function bindTrigger(): void {
  if (props.anchorsOnSelf) {
    const el = instance?.vnode.el
    wrapperRef.value = el instanceof HTMLElement ? el : null
  }
  const next = resolveTrigger()
  if (next === trigger)
    return
  unbindTrigger()
  trigger = next
  triggerRef.value = next
  if (!next)
    return
  next.addEventListener('pointerenter', onPointerEnter as EventListener)
  next.addEventListener('mouseenter', onMouseEnter)
  next.addEventListener('mouseleave', onMouseLeave)
  next.addEventListener('pointerdown', onPointerDown as EventListener)
  if (shouldListenFocus(next)) {
    next.addEventListener('focusin', onFocusIn as EventListener)
    next.addEventListener('focusout', onFocusOut)
  }
  describedByBefore = next.getAttribute('aria-describedby')
  next.setAttribute('aria-describedby', [describedByBefore, tooltipId].filter(Boolean).join(' '))
}

function unbindTrigger(): void {
  if (!trigger)
    return
  trigger.removeEventListener('pointerenter', onPointerEnter as EventListener)
  trigger.removeEventListener('mouseenter', onMouseEnter)
  trigger.removeEventListener('mouseleave', onMouseLeave)
  trigger.removeEventListener('pointerdown', onPointerDown as EventListener)
  trigger.removeEventListener('focusin', onFocusIn as EventListener)
  trigger.removeEventListener('focusout', onFocusOut)
  if (describedByBefore)
    trigger.setAttribute('aria-describedby', describedByBefore)
  else
    trigger.removeAttribute('aria-describedby')
  trigger = null
  triggerRef.value = null
  describedByBefore = null
}

watch(isVisible, (visible) => {
  if (visible)
    document.addEventListener('keydown', onKeydown)
  else
    document.removeEventListener('keydown', onKeydown)
})

watch(() => props.isOpen, (open) => {
  clearTimers()
  if (open === undefined)
    return
  applyVisible(open)
})

watch(() => props.isEnabled, (enabled) => {
  if (!enabled)
    hideNow()
})

onMounted(() => {
  bindTrigger()
  if (props.isOpen !== undefined)
    applyVisible(props.isOpen)
  else if (props.isDefaultOpen)
    setOpen(true)
})

onUpdated(bindTrigger)

onBeforeUnmount(() => {
  clearTimers()
  unbindTrigger()
  detachPosition()
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <span
    v-if="!anchorsOnSelf"
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
      v-show="isVisible"
      :id="tooltipId"
      ref="bubbleRef"
      class="astryx-tooltip"
      role="tooltip"
      :data-placement="position.placement"
      :style="bubbleStyle"
      @mouseenter="cancelHide"
      @mouseleave="scheduleHide"
    >
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </Teleport>
</template>
