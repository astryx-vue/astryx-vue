import type { Ref } from 'vue'
import { nextTick, onScopeDispose, watch } from 'vue'
import { focusElement } from '../layer/focus.js'
import { isImeKeyEvent } from '../utils/ime.js'

/** 弹出层关掉后，焦点回到触发按钮，而不是掉到 body。 */
export function focusSelectorTrigger(field: HTMLElement | null): void {
  const trigger = field?.querySelector<HTMLElement>('.astryx-selector-trigger')
  if (trigger)
    void nextTick(() => focusElement(trigger))
}

function focusInside(layer: HTMLElement | null): boolean {
  const active = document.activeElement
  return layer != null && active instanceof Node && layer.contains(active)
}

/**
 * 搜索框已经处理过的 Escape 会带 preventDefault，这里接选项和操作按钮。
 * 焦点在弹出层里才送回触发器，免得抢走外面已经拿到焦点的控件。
 */
export function onSelectorListboxEscape(event: KeyboardEvent, options: {
  isOpen: boolean
  layer: HTMLElement | null
  close: () => void
  focusTrigger: () => void
}): void {
  if (event.key !== 'Escape' || event.defaultPrevented || isImeKeyEvent(event) || !options.isOpen)
    return
  if (!focusInside(options.layer))
    return
  event.preventDefault()
  options.close()
  options.focusTrigger()
}

/** 文档级 Escape。焦点还在层里才送回触发器，点外面关掉时不动焦点。 */
export function dismissSelectorEscape(layer: HTMLElement | null, close: () => void, focusTrigger: () => void): void {
  const inside = focusInside(layer)
  close()
  if (inside)
    focusTrigger()
}

export function bindListboxEscape(layer: Ref<HTMLElement | null>, onKeyDown: (event: KeyboardEvent) => void): void {
  watch(layer, (el, prev) => {
    prev?.removeEventListener('keydown', onKeyDown)
    el?.addEventListener('keydown', onKeyDown)
  }, { flush: 'sync' })
  onScopeDispose(() => layer.value?.removeEventListener('keydown', onKeyDown))
}
