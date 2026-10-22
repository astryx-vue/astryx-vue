const BACKSTOP_BUFFER_MS = 50

function parseTransitionTime(value: string): number | null {
  const normalized = value.trim()
  if (!/^-?(?:\d+|\d*\.\d+)(?:ms|s)$/.test(normalized))
    return null
  const time = Number.parseFloat(normalized)
  return normalized.endsWith('ms') ? time : time * 1000
}

/** Longest transition duration + delay that applies to `property`, in ms. */
function transitionMsFor(element: HTMLElement, property: string): number {
  const style = getComputedStyle(element)
  const properties = (style.transitionProperty || '').split(',').map(value => value.trim())
  const durations = (style.transitionDuration || '').split(',').map(parseTransitionTime)
  const delays = (style.transitionDelay || '').split(',').map(value => parseTransitionTime(value) ?? 0)
  return properties.reduce((longest, name, index) => {
    if (name !== property && name !== 'all')
      return longest
    const duration = durations[index % durations.length]
    if (duration == null)
      return longest
    return Math.max(longest, duration + (delays[index % delays.length] ?? 0))
  }, 0)
}

/**
 * Calls `complete` when `element` finishes transitioning `property`: on the
 * matching `transitionend`/`transitioncancel`, or on a timer backstop so a
 * missed event can never strand the caller. Without a resolved duration — the
 * case in a stylesheet-free test environment — it completes immediately.
 */
export function waitForTransition(element: HTMLElement | null, property: 'transform' | 'opacity', complete: () => void): () => void {
  if (element == null) {
    complete()
    return () => {}
  }

  let done = false
  let timer: ReturnType<typeof setTimeout> | null = null
  let onTransitionEnd: (event: TransitionEvent) => void = () => {}
  const finish = (): void => {
    if (done)
      return
    done = true
    if (timer != null)
      clearTimeout(timer)
    element.removeEventListener('transitionend', onTransitionEnd)
    element.removeEventListener('transitioncancel', onTransitionEnd)
    complete()
  }
  onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === element && event.propertyName === property)
      finish()
  }

  const duration = transitionMsFor(element, property)
  if (duration <= 0) {
    finish()
    return () => {}
  }

  element.addEventListener('transitionend', onTransitionEnd)
  element.addEventListener('transitioncancel', onTransitionEnd)
  timer = setTimeout(finish, duration + BACKSTOP_BUFFER_MS)
  return () => {
    if (timer != null)
      clearTimeout(timer)
    element.removeEventListener('transitionend', onTransitionEnd)
    element.removeEventListener('transitioncancel', onTransitionEnd)
  }
}
