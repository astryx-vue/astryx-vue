import type { ComputedRef, Ref } from 'vue'
import { getFocusables } from '../layer/focus.js'

/**
 * Controls Tab can land on inside a header or footer, in DOM order.
 *
 * Hidden, `display: none`, and `aria-hidden` controls are skipped, so a field
 * that the layout has put away is not a stop.
 */
export function tabbablesIn(region: HTMLElement | null): HTMLElement[] {
  if (region == null)
    return []

  return getFocusables(region).filter((element) => {
    if (element.tabIndex < 0)
      return false
    let node: HTMLElement | null = element
    while (node != null && node !== region.parentElement) {
      if (node.hidden || node.getAttribute('aria-hidden') === 'true')
        return false
      if (typeof window !== 'undefined' && window.getComputedStyle(node).display === 'none')
        return false
      node = node.parentElement
    }
    return true
  })
}

function focusControl(element: HTMLElement | undefined): boolean {
  if (element == null)
    return false
  element.focus()
  return element.ownerDocument.activeElement === element
}

export interface UseMenuRegionsOptions {
  header: Ref<HTMLElement | null>
  footer: Ref<HTMLElement | null>
  menu: Ref<HTMLElement | null>
  hasRegions: ComputedRef<boolean>
  closeMenu: () => void
}

export interface MenuRegions {
  /** Handle Tab on the menu. Returns whether this level owned the key. */
  onMenuTab: (event: KeyboardEvent) => boolean
  /** Tab leaving a region closes the menu; Tab between regions stays. */
  onRegionKeydown: (event: KeyboardEvent) => void
  /** Move focus into the header or footer. Closes the menu when nothing is there. */
  focusRegion: (direction: 'previous' | 'next') => boolean
}

/**
 * Keyboard between a menu and the header and footer beside it.
 *
 * The menu is one Tab stop. Shift+Tab from a row skips that stop and lands on
 * the header, because the menu element would otherwise catch the key first.
 */
export function useMenuRegions(options: UseMenuRegionsOptions): MenuRegions {
  function focusRegion(direction: 'previous' | 'next'): boolean {
    const region = direction === 'previous' ? options.header.value : options.footer.value
    const tabbables = tabbablesIn(region)
    const target = direction === 'previous' ? tabbables[tabbables.length - 1] : tabbables[0]
    if (!focusControl(target)) {
      options.closeMenu()
      return false
    }
    return true
  }

  function onMenuTab(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab' || !options.hasRegions.value)
      return false

    const region = event.shiftKey ? options.header.value : options.footer.value
    const tabbables = tabbablesIn(region)
    if (tabbables.length === 0) {
      options.closeMenu()
      return true
    }

    // From a row, Shift+Tab would stop on the menu element itself.
    if (event.shiftKey && event.target !== options.menu.value) {
      event.preventDefault()
      event.stopPropagation()
      if (!focusControl(tabbables[tabbables.length - 1]))
        options.closeMenu()
    }
    return true
  }

  function onRegionKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab')
      return

    const region = event.currentTarget
    if (!(region instanceof HTMLElement))
      return

    const tabbables = tabbablesIn(region)
    const isHeader = region === options.header.value
    const exit = isHeader
      ? (event.shiftKey ? tabbables[0] : undefined)
      : (event.shiftKey ? undefined : tabbables[tabbables.length - 1])

    if (exit != null && exit === region.ownerDocument.activeElement)
      options.closeMenu()
  }

  return { focusRegion, onMenuTab, onRegionKeydown }
}
