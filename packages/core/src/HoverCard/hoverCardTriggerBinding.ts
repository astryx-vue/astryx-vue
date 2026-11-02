/**
 * @file hoverCardTriggerBinding.ts
 * @input 触发元素、打开状态、浮层 ID，以及悬停与焦点处理函数
 * @output 在触发元素上挂载事件和 ARIA 关系的 bind / unbind
 * @position useHoverCard 的 DOM 绑定部分
 */

import type { ComputedRef, Ref } from 'vue'
import { mergeIds } from './hoverCardTrigger.js'

export interface HoverCardTriggerHandlers {
  onPointerEnter: (event: PointerEvent) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onPointerDown: (event: PointerEvent) => void
  onFocusIn: () => void
  onFocusOut: (event: FocusEvent) => void
}

export interface HoverCardTriggerBindingOptions {
  triggerRef: Ref<HTMLElement | null>
  isOpen: Ref<boolean>
  isDialog: ComputedRef<boolean>
  layerId: string
  supportsExpanded: (element: HTMLElement) => boolean
  shouldListenFocus: (element: HTMLElement) => boolean
  handlers: HoverCardTriggerHandlers
}

export interface HoverCardTriggerBinding {
  bind: (element: HTMLElement) => void
  unbind: () => void
  applyTriggerAttributes: () => void
}

export function useHoverCardTriggerBinding(options: HoverCardTriggerBindingOptions): HoverCardTriggerBinding {
  let bound: HTMLElement | null = null
  let describedByBefore: string | null = null
  let haspopupBefore: string | null = null
  let controlsBefore: string | null = null
  let expandedBefore: string | null = null
  let canExpand = false

  function applyTriggerAttributes(): void {
    const active = options.triggerRef.value
    if (!active)
      return

    if (options.isDialog.value) {
      active.setAttribute('aria-haspopup', 'dialog')
      if (options.isOpen.value)
        active.setAttribute('aria-controls', mergeIds(controlsBefore, options.layerId) ?? '')
      else if (controlsBefore)
        active.setAttribute('aria-controls', controlsBefore)
      else
        active.removeAttribute('aria-controls')

      if (canExpand)
        active.setAttribute('aria-expanded', String(options.isOpen.value))
      else if (expandedBefore)
        active.setAttribute('aria-expanded', expandedBefore)
      else
        active.removeAttribute('aria-expanded')
      return
    }

    active.setAttribute('aria-describedby', mergeIds(describedByBefore, options.layerId) ?? '')
  }

  function restoreTriggerAttributes(): void {
    const active = bound
    if (!active)
      return

    if (describedByBefore)
      active.setAttribute('aria-describedby', describedByBefore)
    else
      active.removeAttribute('aria-describedby')

    for (const [name, before] of [['aria-haspopup', haspopupBefore], ['aria-controls', controlsBefore], ['aria-expanded', expandedBefore]] as const) {
      if (before)
        active.setAttribute(name, before)
      else
        active.removeAttribute(name)
    }
  }

  function bind(element: HTMLElement): void {
    if (bound === element)
      return
    unbind()
    bound = element

    describedByBefore = element.getAttribute('aria-describedby')
    haspopupBefore = element.getAttribute('aria-haspopup')
    controlsBefore = element.getAttribute('aria-controls')
    expandedBefore = element.getAttribute('aria-expanded')
    canExpand = options.supportsExpanded(element)

    element.addEventListener('pointerenter', options.handlers.onPointerEnter as EventListener)
    element.addEventListener('mouseenter', options.handlers.onMouseEnter)
    element.addEventListener('mouseleave', options.handlers.onMouseLeave)
    element.addEventListener('pointerdown', options.handlers.onPointerDown as EventListener)
    if (options.shouldListenFocus(element)) {
      element.addEventListener('focusin', options.handlers.onFocusIn)
      element.addEventListener('focusout', options.handlers.onFocusOut)
    }
    applyTriggerAttributes()
  }

  function unbind(): void {
    if (bound == null)
      return
    bound.removeEventListener('pointerenter', options.handlers.onPointerEnter as EventListener)
    bound.removeEventListener('mouseenter', options.handlers.onMouseEnter)
    bound.removeEventListener('mouseleave', options.handlers.onMouseLeave)
    bound.removeEventListener('pointerdown', options.handlers.onPointerDown as EventListener)
    bound.removeEventListener('focusin', options.handlers.onFocusIn)
    bound.removeEventListener('focusout', options.handlers.onFocusOut)
    restoreTriggerAttributes()
    bound = null
    describedByBefore = null
    haspopupBefore = null
    controlsBefore = null
    expandedBefore = null
    canExpand = false
  }

  return { bind, unbind, applyTriggerAttributes }
}
