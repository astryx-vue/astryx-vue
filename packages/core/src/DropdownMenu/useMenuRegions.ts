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

function radioGroupKey(element: HTMLElement): string | null {
  if (!(element instanceof HTMLInputElement) || element.getAttribute('type') !== 'radio' || element.name === '')
    return null
  return `${element.form?.id ?? ''}\u0000${element.name}`
}

/**
 * A named radio group is one Tab stop: the focused radio, else the checked
 * one, else the first radio going forward or the last going backward.
 */
function collapseRadioGroups(elements: HTMLElement[], active: Element | null, isBackward: boolean): HTMLElement[] {
  const groups = new Map<string, HTMLInputElement[]>()
  for (const element of elements) {
    const key = radioGroupKey(element)
    if (key == null)
      continue
    const members = groups.get(key) ?? []
    members.push(element as HTMLInputElement)
    groups.set(key, members)
  }

  const placed = new Set<string>()
  const result: HTMLElement[] = []
  for (const element of elements) {
    const key = radioGroupKey(element)
    if (key == null) {
      result.push(element)
      continue
    }
    if (placed.has(key))
      continue
    placed.add(key)
    const members = groups.get(key) ?? []
    const stop = members.find(radio => radio === active)
      ?? members.find(radio => radio.checked)
      ?? (isBackward ? members[members.length - 1] : members[0])
    if (stop != null)
      result.push(stop)
  }
  return result
}

export interface UseMenuRegionsOptions {
  header: Ref<HTMLElement | null>
  footer: Ref<HTMLElement | null>
  menu: Ref<HTMLElement | null>
  hasRegions: ComputedRef<boolean>
  closeMenu: () => void
}

export interface MenuRegions {
  /**
   * Tab and Shift+Tab cycle the header, the menu as one stop, and the footer.
   * `isFromFlyout` is set when a submenu has just closed itself for this key.
   */
  moveDialogTab: (event: KeyboardEvent, isFromFlyout?: boolean) => void
  /** Tab on a header or footer control stays inside the dialog. */
  onRegionKeydown: (event: KeyboardEvent) => void
  /** Move focus into the header or footer. Closes the menu when nothing is there. */
  focusRegion: (direction: 'previous' | 'next') => boolean
}

/**
 * Keyboard between a menu and the header and footer beside it.
 *
 * With either region the popover is a dialog: Tab cycles the header, the menu
 * as one stop, and the footer, and wraps at both ends. A row counts as the
 * menu's stop, so Shift+Tab from a row lands on the header.
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

  function moveDialogTab(event: KeyboardEvent, isFromFlyout = false): void {
    const menu = options.menu.value
    if (menu == null || !options.hasRegions.value)
      return

    event.preventDefault()
    event.stopPropagation()
    const active = menu.ownerDocument.activeElement
    const cycle = collapseRadioGroups(
      [...tabbablesIn(options.header.value), menu, ...tabbablesIn(options.footer.value)],
      active,
      event.shiftKey,
    )
    if (cycle.length <= 1) {
      if (isFromFlyout)
        menu.focus()
      return
    }

    const menuIndex = cycle.indexOf(menu)
    const contained = active instanceof Node && menu.contains(active)
    let index = contained ? menuIndex : cycle.findIndex(element => element === active || element.contains(active))
    if (index < 0)
      index = menuIndex
    const step = event.shiftKey ? -1 : 1
    const next = cycle[(index + step + cycle.length) % cycle.length]
    if (!focusControl(next))
      menu.focus()
  }

  function onRegionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab')
      moveDialogTab(event)
  }

  return { focusRegion, moveDialogTab, onRegionKeydown }
}
