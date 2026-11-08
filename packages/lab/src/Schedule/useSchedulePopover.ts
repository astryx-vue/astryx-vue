import type { ComputedRef, CSSProperties, Ref } from 'vue'
import { usePopover } from '@astryx-vue/core'
import { nextTick, onBeforeUpdate, onMounted, onScopeDispose, onUpdated, shallowRef, watch } from 'vue'

const TRIGGER = 'data-schedule-popover-trigger'
const FALLBACK_CLOSE = '.astryx-popover__close'
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface SchedulePopover {
  openKey: Ref<string | null>
  isOpen: Ref<boolean>
  id: string
  contentRef: Ref<HTMLElement | null>
  contentStyle: ComputedRef<CSSProperties>
  surfaceProps: ComputedRef<Record<string, unknown>>
  containerProps: {
    onKeydownCapture: () => void
  }
  getTriggerProps: (key: string, ownsOpenKey?: (openKey: string) => boolean) => Record<string, unknown>
  switchTo: (key: string) => void
  hide: () => void
  bindContent: (element: unknown) => void
}

/**
 * 一个视图只有一个浮层。按下另一个触发块时先关掉，随后的 click 再打开它；
 * 再按当前触发块则保持关闭。键盘打开不受这一下按压的影响。
 */
export function useSchedulePopover(
  dialogLabelFor: (key: string | null) => string,
  onTriggerLost?: (key: string) => void,
): SchedulePopover {
  const openKey = shallowRef<string | null>(null)
  let openKeyAtPress: string | null = null
  let lastTrigger: HTMLButtonElement | null = null
  let restoreFocus = true
  let painted = new Set<string>()
  const focusSwitched = shallowRef(false)

  const popover = usePopover({
    dialogLabel: () => dialogLabelFor(openKey.value),
    placement: 'below',
    alignment: 'start',
    hasAutoFocus: true,
    closeButtonSelector: FALLBACK_CLOSE,
    onHide: () => {
      const key = openKey.value
      openKey.value = null
      const content = popover.contentRef.value
      const active = document.activeElement
      const hadFocus = active == null || active === document.body || (content?.contains(active) ?? false)
      if (hadFocus && restoreFocus && lastTrigger != null)
        void nextTick(() => lastTrigger?.focus())
      void key
    },
  })

  function onDocumentPointerDown(event: Event): void {
    const target = event.target instanceof Element ? event.target : null
    const pressed = target?.closest(`[${TRIGGER}]`)?.getAttribute(TRIGGER) ?? null
    const current = openKey.value
    openKeyAtPress = pressed == null ? null : current
    restoreFocus = pressed == null
    if (pressed != null && current != null && pressed !== current && popover.isOpen.value)
      popover.hide()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
  })
  onScopeDispose(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  })

  function toggle(key: string, button: HTMLButtonElement): void {
    const openAtPress = openKeyAtPress
    openKeyAtPress = null
    if (openAtPress === key || (openKey.value === key && popover.isOpen.value)) {
      if (popover.isOpen.value)
        popover.hide()
      return
    }
    lastTrigger = button
    popover.anchorRef.value = button
    openKey.value = key
    popover.show()
  }

  function switchTo(key: string): void {
    if (!popover.isOpen.value)
      return
    focusSwitched.value = true
    openKey.value = key
  }

  watch(openKey, () => {
    if (!focusSwitched.value)
      return
    focusSwitched.value = false
    void nextTick(() => {
      const content = popover.contentRef.value
      if (content == null)
        return
      const first = [...content.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .find(element => element.closest(FALLBACK_CLOSE) == null)
      ;(first ?? content).focus()
    })
  })

  onBeforeUpdate(() => {
    painted = new Set()
  })
  onUpdated(() => {
    const key = openKey.value
    if (key == null || painted.has(key))
      return
    const content = popover.contentRef.value
    const active = document.activeElement
    const hadFocus = active == null || active === document.body || (content?.contains(active) ?? false)
    restoreFocus = false
    popover.hide()
    if (hadFocus)
      onTriggerLost?.(key)
  })

  return {
    openKey,
    isOpen: popover.isOpen,
    id: popover.id,
    contentRef: popover.contentRef,
    contentStyle: popover.contentStyle,
    surfaceProps: popover.surfaceProps,
    containerProps: {
      onKeydownCapture: () => {
        openKeyAtPress = null
      },
    },
    getTriggerProps(key, ownsOpenKey) {
      painted.add(key)
      const current = openKey.value
      const ownsOpen = current != null && current !== key && (ownsOpenKey?.(current) ?? false)
      if (ownsOpen && current != null)
        painted.add(current)
      const expanded = popover.isOpen.value && (current === key || ownsOpen)
      return {
        'aria-haspopup': 'dialog',
        'aria-expanded': expanded,
        'aria-controls': popover.id,
        [TRIGGER]: key,
        'onClick': (event: MouseEvent) => {
          if (event.currentTarget instanceof HTMLButtonElement)
            toggle(key, event.currentTarget)
        },
      }
    },
    switchTo,
    hide: () => popover.hide(),
    bindContent(element: unknown) {
      popover.contentRef.value = element instanceof HTMLElement ? element : null
    },
  }
}
