/**
 * 读屏播报的通道：每块播报区域各有一条，状态跟着区域元素走。
 *
 * 同一帧里写进来的消息按顺序连在一起念，一条都不丢；一模一样的重复只算一条；
 * 空消息连同还没念出去的排队消息一起清掉。每条消息记着有几个播报者在等它，
 * 其中一个收回自己的那份（比如忙碌开始被它自己的结果抢先）不影响别人的。
 */

export type AnnouncePoliteness = 'polite' | 'assertive'

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

interface PendingMessage {
  text: string
  /** 等着这条消息被念出来的播报者数量。 */
  holders: number
}

interface Channel {
  region: HTMLElement
  frame: number | null
  pending: PendingMessage[]
  clearTimer: ReturnType<typeof setTimeout> | null
}

/** 一次播报留下的收据。收回自己那份时，消息还在排队才有效，已经念出去的收不回来。 */
export interface AnnounceReceipt {
  withdraw: () => void
}

const channels = new WeakMap<HTMLElement, Channel>()
const liveChannels = new Set<Channel>()
let bodyRegions: Record<AnnouncePoliteness, HTMLElement> | null = null

function channelOf(region: HTMLElement): Channel {
  let channel = channels.get(region)
  if (channel == null) {
    channel = { region, frame: null, pending: [], clearTimer: null }
    channels.set(region, channel)
    liveChannels.add(channel)
  }
  return channel
}

function createRegion(politeness: AnnouncePoliteness, parent: HTMLElement): HTMLElement {
  const el = parent.ownerDocument.createElement('div')
  el.setAttribute(CONTAINER_ATTR, politeness)
  el.setAttribute('aria-live', politeness)
  el.setAttribute('aria-atomic', 'true')
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status')
  el.style.cssText = VISUALLY_HIDDEN_CSS
  parent.appendChild(el)
  return el
}

function getBodyRegion(politeness: AnnouncePoliteness): HTMLElement | null {
  if (typeof document === 'undefined')
    return null
  bodyRegions ??= {
    polite: createRegion('polite', document.body),
    assertive: createRegion('assertive', document.body),
  }
  const region = bodyRegions[politeness]
  if (!region.isConnected)
    document.body.appendChild(region)
  return region
}

function isOpenModal(dialog: HTMLDialogElement): boolean {
  if (!dialog.open)
    return false
  try {
    return dialog.matches(':modal')
  }
  catch {
    return false
  }
}

/** 离开 `within` 最近的、正开着的原生模态对话框；没有传 `within` 时取文档里最后开的那个。 */
function findOpenModal(within: Element | null | undefined): HTMLDialogElement | null {
  if (within != null) {
    const dialog = within.closest('dialog')
    return dialog != null && isOpenModal(dialog) ? dialog : null
  }
  if (typeof document === 'undefined')
    return null
  const open = Array.from(document.querySelectorAll('dialog')).filter(isOpenModal)
  return open[open.length - 1] ?? null
}

/**
 * 播报该写进哪块区域。原生模态对话框打开时，挂在 body 上的区域被挡在外面，读屏念不到，
 * 所以改用对话框里一块常驻的区域：先空着插进去，下一帧再写字。
 */
function resolveRegion(politeness: AnnouncePoliteness, within: Element | null | undefined): HTMLElement | null {
  const dialog = findOpenModal(within)
  if (dialog == null)
    return getBodyRegion(politeness)
  const selector = `:scope > [${CONTAINER_ATTR}="${politeness}"]`
  return dialog.querySelector<HTMLElement>(selector) ?? createRegion(politeness, dialog)
}

function cancelFrame(channel: Channel): void {
  if (channel.frame != null && typeof cancelAnimationFrame === 'function')
    cancelAnimationFrame(channel.frame)
  channel.frame = null
}

function cancelClear(channel: Channel): void {
  if (channel.clearTimer != null)
    clearTimeout(channel.clearTimer)
  channel.clearTimer = null
}

function scheduleClear(channel: Channel): void {
  cancelClear(channel)
  channel.clearTimer = setTimeout(() => {
    channel.clearTimer = null
    channel.region.textContent = ''
  }, CLEAR_DELAY_MS)
}

function flush(channel: Channel): void {
  channel.frame = null
  channel.region.textContent = channel.pending.map(message => message.text).join(' ')
  channel.pending = []
}

function receiptFor(channel: Channel, message: PendingMessage): AnnounceReceipt {
  let isTaken = false
  return {
    withdraw: () => {
      if (isTaken)
        return
      isTaken = true
      const at = channel.pending.indexOf(message)
      if (at < 0)
        return
      message.holders -= 1
      if (message.holders > 0)
        return
      channel.pending.splice(at, 1)
      if (channel.pending.length === 0)
        cancelFrame(channel)
    },
  }
}

export interface AnnounceTarget {
  /** 调用方所在的元素：在原生模态对话框里时，播报写进那个对话框。 */
  within?: Element | null
}

/** 写一条播报。返回的收据用来收回还没念出去的这一份。 */
export function writeAnnouncement(message: string, politeness: AnnouncePoliteness, target: AnnounceTarget = {}): AnnounceReceipt | null {
  const region = resolveRegion(politeness, target.within)
  if (region == null)
    return null
  const channel = channelOf(region)
  const repeat = channel.pending.find(pending => pending.text === message)
  if (repeat != null) {
    repeat.holders += 1
    return receiptFor(channel, repeat)
  }
  const pending: PendingMessage = { text: message, holders: 1 }
  const isFirst = channel.pending.length === 0
  channel.pending.push(pending)
  if (typeof requestAnimationFrame !== 'function') {
    // 没有帧可等：直接写。同一轮里写进来的消息仍然连在一起。
    channel.region.textContent = channel.pending.map(entry => entry.text).join(' ')
    channel.pending = []
  }
  else if (isFirst || channel.frame == null) {
    // 先清空，同样的文字再写一次也会被读屏当成新内容。
    region.textContent = ''
    cancelFrame(channel)
    channel.frame = requestAnimationFrame(() => flush(channel))
  }
  scheduleClear(channel)
  return receiptFor(channel, pending)
}

/** 清掉一种紧迫度的播报，包括排队还没念的。传了 `within` 时清那个对话框里的。 */
export function clearAnnouncements(politeness: AnnouncePoliteness, target: AnnounceTarget = {}): void {
  const region = resolveRegion(politeness, target.within)
  if (region == null)
    return
  const channel = channelOf(region)
  cancelFrame(channel)
  cancelClear(channel)
  channel.pending = []
  region.textContent = ''
}

/** 测试用：拆掉所有播报区域和排队的写入，避免用例之间串味。不从包入口导出。 */
export function resetLiveRegionsForTest(): void {
  for (const channel of liveChannels) {
    cancelFrame(channel)
    cancelClear(channel)
    channel.pending = []
    channel.region.textContent = ''
    channel.region.remove()
  }
  liveChannels.clear()
  bodyRegions?.polite.remove()
  bodyRegions?.assertive.remove()
  bodyRegions = null
}
