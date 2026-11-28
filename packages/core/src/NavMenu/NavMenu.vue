<script setup lang="ts">
import type { NavMenuEmits, NavMenuProps } from './types.js'
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import { useMenuPress } from '../composables/useMenuPress.js'
import { useOverflow } from '../composables/useOverflow.js'
import { navMenuKey } from './context.js'
import '../../styles/nav-menu.css'

defineOptions({ name: 'AstryxNavMenu' })

const props = withDefaults(defineProps<NavMenuProps>(), {
  focusRequest: null,
  size: 'md',
})

const emit = defineEmits<NavMenuEmits>()

const size = computed(() => props.size)
let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

const { listRef, handleKeyDown, focusItem } = useListFocus({
  itemSelector: '[role="menuitem"]',
  onEscape: () => emit('close'),
  orientation: 'vertical',
})

// 按住滑过各行，松开时执行松开处那一行，高亮跟着指针；鼠标在菜单外松开就关掉菜单。
const menuPress = useMenuPress({
  menuRef: listRef,
  onDismiss: () => emit('close'),
})
const hasOverflow = useOverflow(listRef, ref(true))

function menuItems(): HTMLElement[] {
  const root = listRef.value
  if (!root)
    return []
  return [...root.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(element =>
    element.getAttribute('aria-disabled') !== 'true' && !element.hasAttribute('disabled'),
  )
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
    typeahead += event.key.toLowerCase()
    clearTimeout(typeaheadTimer)
    typeaheadTimer = setTimeout(() => {
      typeahead = ''
    }, 500)
    const match = menuItems().findIndex(element =>
      (element.textContent ?? '').trim().toLowerCase().startsWith(typeahead),
    )
    if (match >= 0) {
      event.preventDefault()
      focusItem(match)
    }
    return
  }
  handleKeyDown(event)
}

function applyFocus(request: NavMenuProps['focusRequest']): void {
  if (request == null)
    return
  void nextTick(() => {
    const items = menuItems()
    if (items.length === 0)
      return
    focusItem(request === 'last' ? items.length - 1 : 0)
  })
}

onMounted(() => applyFocus(props.focusRequest))
watch(() => props.focusRequest, applyFocus)

provide(navMenuKey, {
  close: () => emit('close'),
  size,
})
</script>

<template>
  <div
    ref="listRef"
    class="astryx-nav-menu"
    :class="`astryx-nav-menu--${size}`"
    role="menu"
    tabindex="-1"
    :aria-label="label"
    :data-overflow="hasOverflow || undefined"
    v-bind="menuPress.menuProps"
    @keydown="onKeyDown"
  >
    <slot />
  </div>
</template>
