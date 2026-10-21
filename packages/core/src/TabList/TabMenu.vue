<script setup lang="ts">
import type { TabMenuProps } from './types.js'
import { computed, inject, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { useListFocus } from '../composables/useListFocus.js'
import Icon from '../Icon/Icon.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { tabListContextKey } from './context.js'
import '../../styles/tab-list.css'
import '../../styles/tab-menu.css'

defineOptions({ name: 'AstryxTabMenu' })
const props = defineProps<TabMenuProps>()

const context = inject(tabListContextKey)
const uid = useId()
const stopValue = `tab-menu:${uid}`
const menuId = `astryx-tab-menu-${uid}`

const anchorRef = ref<HTMLButtonElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const placement = computed(() => 'below' as const)
const alignment = computed(() => 'start' as const)

const selectedOption = computed(() => props.options.find(option => option.value === context?.value.value))
const triggerLabel = computed(() => selectedOption.value?.label ?? props.label)
const hasSelectedOption = computed(() => selectedOption.value != null)
const sizeClass = computed(() => `astryx-tab--size-${context?.size.value ?? 'md'}`)

const { position, teleportTarget, detach } = usePositionedLayer({
  alignment,
  anchor: anchorRef,
  gap: 4,
  isOpen,
  layer: surfaceRef,
  placement,
})

const listFocus = useListFocus({
  hasRovingTabIndex: true,
  itemSelector: '[role="menuitemradio"]',
  onEscape: () => {
    isOpen.value = false
  },
})

useDismiss({
  container: surfaceRef,
  isEnabled: isOpen,
  onDismiss: () => {
    isOpen.value = false
  },
  trigger: anchorRef,
})

function register(): void {
  if (!context || anchorRef.value == null)
    return
  context.registerTab({
    disabled: false,
    el: anchorRef.value,
    selectsOnFocus: false,
    value: stopValue,
  })
}

function toggle(): void {
  isOpen.value = !isOpen.value
}

function select(value: string): void {
  context?.selectTab(value)
  isOpen.value = false
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!context || isOpen.value)
    return
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      context.moveFocus('next', stopValue)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      context.moveFocus('prev', stopValue)
      break
    case 'Home':
      event.preventDefault()
      context.moveFocus('first', stopValue)
      break
    case 'End':
      event.preventDefault()
      context.moveFocus('last', stopValue)
      break
  }
}

function onMenuKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Tab') {
    isOpen.value = false
    return
  }
  listFocus.handleKeyDown(event)
}

function onItemKeyDown(event: KeyboardEvent, value: string): void {
  if (event.key !== 'Enter' && event.key !== ' ')
    return
  event.preventDefault()
  select(value)
}

watch(surfaceRef, (element) => {
  listFocus.listRef.value = element
}, { immediate: true })

watch(isOpen, async (open) => {
  if (!open) {
    const shouldRestore = surfaceRef.value?.contains(document.activeElement) ?? false
    await nextTick()
    if (shouldRestore)
      anchorRef.value?.focus()
    return
  }
  await nextTick()
  listFocus.focusFirst()
})

onMounted(register)
onUnmounted(() => {
  context?.unregisterTab(stopValue)
  detach()
})
</script>

<template>
  <button
    :id="`astryx-tab-menu-trigger-${uid}`"
    ref="anchorRef"
    type="button"
    class="astryx-tab astryx-tab-menu"
    :class="[sizeClass, hasSelectedOption && 'astryx-tab--selected']"
    data-tab-menu=""
    :aria-controls="menuId"
    :aria-current="!context?.isTabsPattern.value && hasSelectedOption ? 'true' : undefined"
    :aria-selected="context?.isTabsPattern.value ? hasSelectedOption : undefined"
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    :role="context?.isTabsPattern.value ? 'tab' : undefined"
    :tabindex="hasSelectedOption ? 0 : -1"
    @click="toggle"
    @keydown="onTriggerKeyDown"
  >
    <span class="astryx-tab__label">{{ triggerLabel }}</span>
    <Icon
      class="astryx-tab-menu-chevron"
      :data-state="isOpen ? 'expanded' : 'collapsed'"
      color="inherit"
      icon="chevronDown"
      size="sm"
    />
  </button>
  <Teleport :to="teleportTarget">
    <div
      v-if="isOpen"
      :id="menuId"
      ref="surfaceRef"
      class="astryx-tab-menu-dropdown"
      role="menu"
      tabindex="-1"
      :aria-label="label"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @keydown="onMenuKeyDown"
      @focusin="listFocus.handleFocus"
    >
      <span class="astryx-tab-menu-heading" role="presentation">{{ label }}</span>
      <div
        v-for="option in options"
        :key="option.value"
        class="astryx-tab-menu-item"
        :data-selected="option.value === context?.value.value || undefined"
        role="menuitemradio"
        :aria-checked="option.value === context?.value.value"
        tabindex="-1"
        @click="select(option.value)"
        @keydown="onItemKeyDown($event, option.value)"
      >
        <span class="astryx-tab-menu-item-label">
          <span v-if="option.iconClass" class="astryx-tab-menu-icon" :class="option.iconClass" />
          {{ option.label }}
        </span>
        <Icon v-if="option.value === context?.value.value" color="accent" icon="check" size="sm" />
      </div>
    </div>
  </Teleport>
</template>
