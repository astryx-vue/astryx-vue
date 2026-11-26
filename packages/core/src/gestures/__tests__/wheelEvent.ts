/**
 * @file wheelEvent.ts
 * @input A wheel event's init
 * @output wheelEvent: a WheelEvent that carries a mouse event's fields
 * @position Test helper for the wheel tests: happy-dom's WheelEvent extends
 *   UIEvent, so its point and modifier keys would read undefined, where a
 *   browser's (a MouseEvent) carries them
 */

const MOUSE_FIELDS = ['clientX', 'clientY', 'screenX', 'screenY', 'ctrlKey', 'shiftKey', 'altKey', 'metaKey', 'button', 'buttons'] as const

const MOUSE_DEFAULTS: Record<(typeof MOUSE_FIELDS)[number], number | boolean> = {
  clientX: 0,
  clientY: 0,
  screenX: 0,
  screenY: 0,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  button: 0,
  buttons: 0,
}

/** A WheelEvent with its mouse event fields, as a browser builds one. */
export function wheelEvent(type: string, init: WheelEventInit = {}): WheelEvent {
  const event = new WheelEvent(type, init)
  for (const field of MOUSE_FIELDS) {
    if ((event as unknown as Record<string, unknown>)[field] === undefined) {
      Object.defineProperty(event, field, { configurable: true, value: init[field] ?? MOUSE_DEFAULTS[field] })
    }
  }
  return event
}
