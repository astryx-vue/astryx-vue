import type { Ref } from 'vue'
import type { OverlayContainerProps, OverlayScrimProps, UseOverlayOptions, UseOverlayResult } from './types.js'
import { computed, getCurrentScope, onScopeDispose, ref, toValue } from 'vue'

const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[data-pressable-container]',
].join(',')

/**
 * 点击落在容器里的交互元素上时，这一次点击属于那个元素，不属于容器。
 */
function hasInteractiveAncestor(target: Element, root: Element): boolean {
  let current: Element | null = target
  while (current != null && current !== root && current !== document.body) {
    if (current.matches(INTERACTIVE_SELECTOR) && current.getAttribute('aria-readonly') !== 'true')
      return true
    current = current.parentElement
  }
  return false
}

/** 结束一段文字选择的点击不是一次点按，不应触发切换。 */
function hasTextSelection(node: Element): boolean {
  if (typeof document === 'undefined' || typeof document.getSelection !== 'function')
    return false
  const selection = document.getSelection()
  if (selection == null || selection.isCollapsed)
    return false
  return node.contains(selection.anchorNode)
}

function useHoverNone(): Ref<boolean> {
  const isTouchDevice = ref(false)
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return isTouchDevice

  const query = window.matchMedia('(hover: none)')
  isTouchDevice.value = query.matches
  const onChange = (): void => {
    isTouchDevice.value = query.matches
  }
  query.addEventListener('change', onChange)
  if (getCurrentScope())
    onScopeDispose(() => query.removeEventListener('change', onChange))
  return isTouchDevice
}

/**
 * 给任意容器加上浮层遮罩的行为：返回要挂在容器上的属性，
 * 以及要渲染在容器内部的遮罩属性。
 */
export function useOverlay(options: UseOverlayOptions = {}): UseOverlayResult {
  const containerRef = ref<HTMLElement | null>(null)
  const isTouchDevice = useHoverNone()
  const isToggledOpen = ref(false)

  const isHoverMode = computed(() => {
    const showOn = toValue(options.showOn)
    return showOn === 'hover' || showOn === 'hover-or-focus'
  })

  const hasTouchToggle = computed(() => isTouchDevice.value && isHoverMode.value)

  const isOpen = computed<boolean | undefined>(() => {
    const controlled = toValue(options.isOpen)
    if (controlled !== undefined)
      return controlled
    return hasTouchToggle.value ? isToggledOpen.value : undefined
  })

  function toggle(): void {
    isToggledOpen.value = !isToggledOpen.value
  }

  function onClick(event: MouseEvent): void {
    if (!hasTouchToggle.value)
      return
    const container = containerRef.value
    const target = event.target
    if (!container || !(target instanceof Element))
      return
    if (hasTextSelection(container))
      return
    if (target !== event.currentTarget && hasInteractiveAncestor(target, container))
      return
    toggle()
  }

  const containerProps = computed<OverlayContainerProps>(() => ({
    'class': 'astryx-overlay-scope',
    'data-pressable-container': 'true',
    'onClick': hasTouchToggle.value ? onClick : undefined,
  }))

  const scrimProps = computed<OverlayScrimProps>(() => ({
    scrim: toValue(options.scrim),
    position: toValue(options.position),
    align: toValue(options.align),
    showOn: toValue(options.showOn),
    isOpen: isOpen.value,
  }))

  return {
    containerRef,
    containerProps,
    scrimProps,
    isOpen,
    hasTouchToggle,
    toggle,
  }
}
