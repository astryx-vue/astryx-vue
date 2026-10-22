export interface SheetPointerHandlers {
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: (event: PointerEvent) => void
  onTouchStart: (event: TouchEvent) => void
  onTouchMove: (event: TouchEvent) => void
  onTouchEnd: (event: TouchEvent) => void
  onWindowBlur: () => void
}

export interface SheetPointerSession {
  attach: () => void
  detach: () => void
  setBody: (element: HTMLElement | null) => void
  destroy: () => void
}

/** Window pointer listeners plus the body's non-passive touch listeners. */
export function createSheetPointerSession(handlers: SheetPointerHandlers): SheetPointerSession {
  let body: HTMLElement | null = null
  let listening = false

  function attach(): void {
    if (listening || typeof window === 'undefined')
      return
    listening = true
    window.addEventListener('pointermove', handlers.onPointerMove)
    window.addEventListener('pointerup', handlers.onPointerUp)
    window.addEventListener('pointercancel', handlers.onPointerCancel)
  }

  function detach(): void {
    if (!listening || typeof window === 'undefined')
      return
    listening = false
    window.removeEventListener('pointermove', handlers.onPointerMove)
    window.removeEventListener('pointerup', handlers.onPointerUp)
    window.removeEventListener('pointercancel', handlers.onPointerCancel)
  }

  function unbind(element: HTMLElement): void {
    element.removeEventListener('touchstart', handlers.onTouchStart)
    element.removeEventListener('touchmove', handlers.onTouchMove)
    element.removeEventListener('touchend', handlers.onTouchEnd)
    element.removeEventListener('touchcancel', handlers.onTouchEnd)
  }

  function setBody(element: HTMLElement | null): void {
    if (body != null)
      unbind(body)
    body = element
    if (element == null)
      return
    element.addEventListener('touchstart', handlers.onTouchStart, { passive: true })
    element.addEventListener('touchmove', handlers.onTouchMove, { passive: false })
    element.addEventListener('touchend', handlers.onTouchEnd)
    element.addEventListener('touchcancel', handlers.onTouchEnd)
  }

  function destroy(): void {
    detach()
    setBody(null)
    if (typeof window !== 'undefined')
      window.removeEventListener('blur', handlers.onWindowBlur)
  }

  if (typeof window !== 'undefined')
    window.addEventListener('blur', handlers.onWindowBlur)

  return { attach, detach, setBody, destroy }
}
