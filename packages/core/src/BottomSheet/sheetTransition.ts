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

/** Whether a CSS transition of `property` still runs on `element`. */
function hasRunningTransition(element: HTMLElement, property: string): boolean {
  return (element.getAnimations?.() ?? []).some(
    animation => (animation as Animation & { transitionProperty?: string }).transitionProperty === property
      && (animation.playState === 'running' || animation.playState === 'paused'),
  )
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
  let backstopMs = 0
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
    if (event.target !== element || event.propertyName !== property)
      return
    // 引擎会取消终点在途中改变的过渡：百分比 transform 遇到收尾那一帧让高度差零点几像素就是这样。
    // 接替它的过渡会从当前位置接着滑，那是同一段运动没结束，不是被取消。
    if (event.type === 'transitioncancel' && hasRunningTransition(element, property)) {
      if (timer != null) {
        clearTimeout(timer)
        timer = setTimeout(finish, backstopMs)
      }
      return
    }
    finish()
  }

  const duration = transitionMsFor(element, property)
  if (duration <= 0) {
    finish()
    return () => {}
  }

  element.addEventListener('transitionend', onTransitionEnd)
  element.addEventListener('transitioncancel', onTransitionEnd)
  backstopMs = duration + BACKSTOP_BUFFER_MS
  timer = setTimeout(finish, backstopMs)
  return () => {
    if (timer != null)
      clearTimeout(timer)
    element.removeEventListener('transitionend', onTransitionEnd)
    element.removeEventListener('transitioncancel', onTransitionEnd)
  }
}
