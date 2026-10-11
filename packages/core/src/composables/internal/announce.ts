/**
 * 对应原版 Astryx 的 `hooks/useAnnounce`。
 *
 * 读屏播报。polite / assertive 两块区域在第一次使用时创建，之后一直留在文档里，
 * 只改文字。区域如果和文字一起出生，很多读屏软件不会念。
 */

export type AnnouncePoliteness = 'polite' | 'assertive'

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
  if (regions != null) {
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

function announceMessage(message: string, politeness: AnnouncePoliteness): void {
  const live = getRegions()
  if (live == null)
    return
  const target = politeness === 'assertive' ? live.assertive : live.polite
  // 先清空，同样的文字再写一次也会被读屏当成新内容。
  target.textContent = ''
  const write = (): void => {
    target.textContent = message
  }
  if (typeof requestAnimationFrame === 'function')
    requestAnimationFrame(write)
  else
    write()
  scheduleClear(politeness, target)
}

function clearRegion(politeness: AnnouncePoliteness): void {
  cancelScheduledClear(politeness)
  if (regions == null)
    return
  const target = politeness === 'assertive' ? regions.assertive : regions.polite
  target.textContent = ''
}

export function useAnnounce(): AnnounceFn {
  return (message: string, politeness: AnnouncePoliteness = 'polite') => {
    if (message === '') {
      clearRegion(politeness)
      return
    }
    announceMessage(message, politeness)
  }
}

/** 测试用：拆掉单例区域，避免用例之间串味。不从包入口导出。 */
export function resetLiveRegionsForTest(): void {
  cancelScheduledClear('polite')
  cancelScheduledClear('assertive')
  if (regions != null) {
    regions.polite.remove()
    regions.assertive.remove()
    regions = null
  }
}
