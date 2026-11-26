<script setup lang="ts">
import type { NavHeadingMenuEmits, NavHeadingMenuProps } from './types.js'
import { computed, inject, nextTick, onMounted, provide, ref, useAttrs, watch } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import { useMenuPress } from '../composables/useMenuPress.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useTypeahead } from '../composables/useTypeahead.js'
import { navMenuCloseKey, navMenuFocusKey, navMenuKey } from './context.js'
import '../../styles/nav-menu.css'

defineOptions({ name: 'AstryxNavHeadingMenu', inheritAttrs: false })

const props = withDefaults(defineProps<NavHeadingMenuProps>(), {
  focusRequest: null,
  size: 'md',
})

const emit = defineEmits<NavHeadingMenuEmits>()

const closeMenu = inject(navMenuCloseKey, undefined)
const injectedFocus = inject(navMenuFocusKey, ref(null))
const size = computed(() => props.size)
const requestedFocus = computed(() => props.focusRequest ?? injectedFocus.value)

const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])'

const { listRef, handleKeyDown, focusItem } = useListFocus({
  itemSelector: ENABLED_ITEM_SELECTOR,
  onEscape: () => {
    closeMenu?.()
    emit('close')
  },
  orientation: 'vertical',
})

// 按住滑过各行，松开时执行松开处那一行，高亮跟着指针；鼠标在菜单外松开就关掉菜单。
const menuPress = useMenuPress({
  menuRef: listRef,
  itemSelector: ENABLED_ITEM_SELECTOR,
  onDismiss: () => {
    closeMenu?.()
    emit('close')
  },
})
const hasOverflow = useOverflow(listRef, ref(true))

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

type KeyHandler = ((event: KeyboardEvent) => void) | Array<(event: KeyboardEvent) => void> | undefined

const attrs = useAttrs()
/** 调用者挂在菜单上的 keydown 监听，先于菜单自己的键盘处理执行。 */
const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'onKeydown' && key !== 'onKeydownCapture' && key !== 'onPointerdown'),
))
/** 捕获阶段就已经被取消的按键。这些按键不是菜单项取消的，菜单要照这个取消结果不再导航。 */
const cancelledBeforeItems = new WeakSet<Event>()

function callHandlers(handler: KeyHandler, event: KeyboardEvent): void {
  for (const fn of Array.isArray(handler) ? handler : [handler])
    fn?.(event)
}

function onPointerDown(event: PointerEvent): void {
  const handler = attrs.onPointerdown as ((event: PointerEvent) => void) | Array<(event: PointerEvent) => void> | undefined
  for (const fn of Array.isArray(handler) ? handler : [handler])
    fn?.(event)
  menuPress.onPointerDown(event)
}

function onKeyDownCapture(event: KeyboardEvent): void {
  callHandlers(attrs.onKeydownCapture as KeyHandler, event)
  if (event.defaultPrevented)
    cancelledBeforeItems.add(event)
}

/**
 * 菜单项自己的处理函数取消了按键（比如 preventDefault）时，方向键导航照常工作；
 * 调用者在菜单上取消，才会让菜单不再导航。
 */
function onKeyDown(event: KeyboardEvent): void {
  const cancelledByItem = event.defaultPrevented && !cancelledBeforeItems.has(event)
  callHandlers(attrs.onKeydown as KeyHandler, event)
  if (cancelledByItem || !event.defaultPrevented)
    navigate(event)
}

function navigate(event: KeyboardEvent): void {
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
    v-bind="forwardedAttrs"
    class="astryx-nav-heading-menu astryx-nav-menu"
    :class="`astryx-nav-menu--${size}`"
    role="menu"
    tabindex="-1"
    :aria-label="label"
    :data-overflow="hasOverflow || undefined"
    :style="minWidthStyle"
    data-astryx-menu-press=""
    @pointerdown="onPointerDown"
    @keydown.capture="onKeyDownCapture"
    @keydown="onKeyDown"
  >
    <slot />
  </div>
</template>
