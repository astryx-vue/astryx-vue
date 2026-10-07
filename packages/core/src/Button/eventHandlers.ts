export type NativeEventHandler<Event extends globalThis.Event> = (event: Event) => unknown

export function invokeNativeEventHandler<Event extends globalThis.Event>(
  handler: unknown,
  event: Event,
): void {
  if (Array.isArray(handler)) {
    for (const item of handler)
      invokeNativeEventHandler(item, event)

    return
  }

  if (typeof handler === 'function')
    (handler as NativeEventHandler<Event>)(event)
}
