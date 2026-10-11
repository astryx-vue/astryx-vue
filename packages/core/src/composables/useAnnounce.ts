/**
 * How urgently a screen reader should speak.
 *
 * `polite` waits until the reader is idle. `assertive` interrupts, and is
 * reserved for errors and other time-sensitive alerts.
 */
export type AnnouncePoliteness = 'polite' | 'assertive'

/** Speaks `message` through a persistently mounted live region. */
export type AnnounceFn = (message: string, politeness?: AnnouncePoliteness) => void

const CONTAINER_ATTR = 'data-astryx-live-region'
const CLEAR_DELAY_MS = 2000

const VISUALLY_HIDDEN_CSS = [
  'position:absolute',
  'width:1px',
  'height:1px',
  'margin:-1px',
  'padding:0',
  'overflow:hidden',
  'clip:rect(0,0,0,0)',
  'white-space:nowrap',
  'border:0',
  'inset-block-start:0',
  'inset-inline-start:0',
  'pointer-events:none',
  'user-select:none',
].join(';')

interface LiveRegions {
  polite: HTMLElement
  assertive: HTMLElement
}

const clearTimers: Record<AnnouncePoliteness, ReturnType<typeof setTimeout> | null> = {
  polite: null,
  assertive: null,
}

let regions: LiveRegions | null = null

function cancelScheduledClear(politeness: AnnouncePoliteness): void {
  const timer = clearTimers[politeness]
  if (timer != null) {
    clearTimeout(timer)
    clearTimers[politeness] = null
  }
}

function scheduleClear(politeness: AnnouncePoliteness, target: HTMLElement): void {
  cancelScheduledClear(politeness)
  clearTimers[politeness] = setTimeout(() => {
    clearTimers[politeness] = null
    target.textContent = ''
  }, CLEAR_DELAY_MS)
}

function createRegion(politeness: AnnouncePoliteness): HTMLElement {
  const el = document.createElement('div')
  el.setAttribute(CONTAINER_ATTR, politeness)
  el.setAttribute('aria-live', politeness)
  el.setAttribute('aria-atomic', 'true')
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status')
  el.style.cssText = VISUALLY_HIDDEN_CSS
  document.body.appendChild(el)
  return el
}

function getRegions(): LiveRegions | null {
  if (typeof document === 'undefined')
    return null

  if (regions) {
    if (!regions.polite.isConnected)
      document.body.appendChild(regions.polite)
    if (!regions.assertive.isConnected)
      document.body.appendChild(regions.assertive)
    return regions
  }

  regions = {
    polite: createRegion('polite'),
    assertive: createRegion('assertive'),
  }
  return regions
}

function clearRegion(politeness: AnnouncePoliteness): void {
  cancelScheduledClear(politeness)
  if (!regions)
    return
  const target = politeness === 'assertive' ? regions.assertive : regions.polite
  target.textContent = ''
}

function announceMessage(message: string, politeness: AnnouncePoliteness): void {
  const liveRegions = getRegions()
  if (!liveRegions)
    return

  const target = politeness === 'assertive' ? liveRegions.assertive : liveRegions.polite
  // Clearing first makes an identical message a real mutation. Some assistive
  // tech ignores a live region whose text did not change.
  target.textContent = ''
  requestAnimationFrame(() => {
    target.textContent = message
  })
  scheduleClear(politeness, target)
}

/**
 * Returns a stable `announce(message, politeness?)` function.
 *
 * The polite and assertive regions are created once, empty, and kept mounted.
 * A region that is born already containing its message is often skipped by
 * screen readers; mutating a region that already exists is announced reliably.
 * Each message is cleared after a couple of seconds so stale status text does
 * not linger in the accessibility tree.
 */
export function useAnnounce(): AnnounceFn {
  return (message: string, politeness: AnnouncePoliteness = 'polite') => {
    if (!message) {
      clearRegion(politeness)
      return
    }
    announceMessage(message, politeness)
  }
}

/**
 * Removes the singleton live regions so each test starts from an empty document.
 *
 * @internal
 */
export function __resetLiveRegionsForTest(): void {
  cancelScheduledClear('polite')
  cancelScheduledClear('assertive')
  if (regions) {
    regions.polite.remove()
    regions.assertive.remove()
    regions = null
  }
}
