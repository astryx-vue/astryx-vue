<script setup lang="ts">
import type { NavMenuFocusRequest } from './context.js'
import type { NavDisclosureProps, NavDisclosureSlots } from './types.js'
import { computed, nextTick, provide, ref, useId, watch } from 'vue'
import { MENU_HOVER_CLICK_GUARD_MS, MENU_HOVER_REOPEN_SUPPRESS_MS } from '../composables/internal/useMenuHover.js'
import { useDismiss } from '../composables/useDismiss.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { navMenuCloseKey, navMenuFocusKey } from './context.js'
import '../../styles/nav-menu.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxNavDisclosure' })

const props = withDefaults(defineProps<NavDisclosureProps>(), {
  alignment: 'start',
  hideDelay: 200,
  hover: false,
  placement: 'below',
  showDelay: 150,
})

const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
defineSlots<NavDisclosureSlots>()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const anchorRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const focusRequest = ref<NavMenuFocusRequest>(null)
const panelId = `astryx-nav-panel-${useId()}`
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let hoverOpenedAt = 0
let closedAt = 0

const placement = computed(() => props.placement)
const alignment = computed(() => props.alignment)
const dismissEnabled = computed(() => isOpen.value)

const { position } = usePositionedLayer({
  alignment,
  anchor: anchorRef,
  gap: 4,
  isOpen,
  layer: surfaceRef,
  placement,
})

const panelStyle = computed(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
}))

function clearTimers(): void {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function focusTrigger(): void {
  const trigger = anchorRef.value?.querySelector<HTMLElement>('button, a, [tabindex]')
  trigger?.focus()
}

function close(restoreFocus = false): void {
  clearTimers()
  hoverOpenedAt = 0
  closedAt = Date.now()
  const shouldRestore = restoreFocus || (surfaceRef.value?.contains(document.activeElement) ?? false)
  focusRequest.value = null
  if (!isOpen.value)
    return
  isOpen.value = false
  if (shouldRestore)
    void nextTick(focusTrigger)
}

function open(focus: NavMenuFocusRequest): void {
  clearTimers()
  focusRequest.value = focus
  isOpen.value = true
}

function onTriggerClick(event: MouseEvent): void {
  const target = event.target
  if (target instanceof Element && target.closest('a'))
    return
  clearTimers()
  // 键盘产生的 click 没有 detail。悬停刚打开时，鼠标的第一下是确认，菜单钉住。
  if (event.detail === 0) {
    hoverOpenedAt = 0
    if (isOpen.value)
      close(true)
    else
      open('first')
    return
  }
  if (!isOpen.value) {
    hoverOpenedAt = 0
    open(null)
    return
  }
  if (hoverOpenedAt > 0 && Date.now() - hoverOpenedAt < MENU_HOVER_CLICK_GUARD_MS) {
    hoverOpenedAt = 0
    return
  }
  close(false)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.target instanceof Element && event.target.closest('a, input, textarea, select'))
    return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    event.stopPropagation()
    open('first')
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    open('last')
  }
  else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    close(true)
  }
}

function onPointerEnter(): void {
  if (!props.hover)
    return
  if (closedAt > 0 && Date.now() - closedAt < MENU_HOVER_REOPEN_SUPPRESS_MS)
    return
  clearTimeout(hideTimer)
  hideTimer = undefined
  if (isOpen.value)
    return
  clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    hoverOpenedAt = Date.now()
    open(null)
  }, props.showDelay)
}

function onPointerLeave(): void {
  if (!props.hover)
    return
  clearTimeout(showTimer)
  showTimer = undefined
  if (!isOpen.value)
    return
  clearTimeout(hideTimer)
  hideTimer = setTimeout(close, props.hideDelay, false)
}

useDismiss({
  container: surfaceRef,
  isEnabled: dismissEnabled,
  onDismiss: () => close(true),
  trigger: anchorRef,
})

provide(navMenuCloseKey, () => close(true))
provide(navMenuFocusKey, focusRequest)

watch(isOpen, (open) => {
  emit('openChange', open)
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 真正的控件在 trigger 插槽里；这一层只转发冒泡上来的点击和方向键。 -->
  <span
    ref="anchorRef"
    class="astryx-nav-disclosure"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <slot name="trigger" :is-open="isOpen" :panel-id="panelId" />
  </span>
  <Teleport to="body">
    <div
      v-if="isOpen"
      :id="panelId"
      ref="surfaceRef"
      class="astryx-nav-disclosure__panel astryx-layer"
      :class="panelClass"
      :style="panelStyle"
      :data-placement="position.placement"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <slot :close="() => close(true)" :focus-request="focusRequest" />
    </div>
  </Teleport>
</template>
