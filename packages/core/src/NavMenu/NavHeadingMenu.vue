<script setup lang="ts">
import type { NavHeadingMenuEmits, NavHeadingMenuProps } from './types.js'
import { computed, inject, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import { useTypeahead } from '../composables/useTypeahead.js'
import { navMenuCloseKey, navMenuFocusKey, navMenuKey } from './context.js'
import '../../styles/nav-menu.css'

defineOptions({ name: 'AstryxNavHeadingMenu' })

const props = withDefaults(defineProps<NavHeadingMenuProps>(), {
  focusRequest: null,
  size: 'md',
})

const emit = defineEmits<NavHeadingMenuEmits>()

const closeMenu = inject(navMenuCloseKey, undefined)
const injectedFocus = inject(navMenuFocusKey, ref(null))
const size = computed(() => props.size)
const requestedFocus = computed(() => props.focusRequest ?? injectedFocus.value)

const { listRef, handleKeyDown, focusItem } = useListFocus({
  itemSelector: '[role="menuitem"]:not([aria-disabled="true"])',
  onEscape: () => {
    closeMenu?.()
    emit('close')
  },
  orientation: 'vertical',
})

function menuItems(): HTMLElement[] {
  const root = listRef.value
  if (!root)
    return []
  return [...root.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')]
}

const typeahead = useTypeahead({
  getItemLabels: () => menuItems().map(element => element.textContent),
  onMatch: focusItem,
  getCurrentIndex: () => menuItems().findIndex(element =>
    element === document.activeElement || element.contains(document.activeElement),
  ),
})

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    const focused = document.activeElement
    if (focused instanceof HTMLElement && focused.getAttribute('role') === 'menuitem') {
      event.preventDefault()
      focused.click()
      return
    }
  }
  if (typeahead.onKeyDown(event)) {
    event.preventDefault()
    return
  }
  handleKeyDown(event)
}

function applyFocus(request: NavHeadingMenuProps['focusRequest']): void {
  if (request == null)
    return
  void nextTick(() => {
    const items = menuItems()
    if (items.length === 0)
      return
    focusItem(request === 'last' ? items.length - 1 : 0)
  })
}

onMounted(() => applyFocus(requestedFocus.value))
watch(requestedFocus, applyFocus)

const minWidthStyle = computed(() => {
  if (props.minWidth == null)
    return undefined
  return { minWidth: typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth }
})

provide(navMenuKey, {
  close: () => {
    closeMenu?.()
    emit('close')
  },
  size,
})
</script>

<template>
  <div
    ref="listRef"
    class="astryx-nav-heading-menu astryx-nav-menu"
    :class="`astryx-nav-menu--${size}`"
    role="menu"
    tabindex="-1"
    :aria-label="label"
    :style="minWidthStyle"
    @keydown="onKeyDown"
  >
    <slot />
  </div>
</template>
