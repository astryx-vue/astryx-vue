import type { PlaygroundFrameMessage, PlaygroundHostMessage } from './protocol'
import { isFrameMessage, isHostMessage } from './protocol'

/**
 * 预览通道的信任边界。
 *
 * 父页面和预览 iframe 是同源的，光看 `origin` 分不出「我自己装的这个 iframe」
 * 和「预览代码后来跳过去的另一个同源页面」。所以每次装载 iframe 都随机生成一个
 * 标记（nonce），只放在这次导航的 `#` 里：iframe 里的文档能从自己的地址读到它，
 * 后来被换上去的文档读不到（它拿到的是自己那份地址）。两边每条消息都带上标记，
 * 标记对不上的一律丢掉。
 */

const NONCE_PARAM = 'nonce'

/** 一次装载用的随机标记。 */
export function createPreviewNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

/** 带标记的 iframe 地址。标记放在 `#` 里，不会进服务器日志和缓存键。 */
export function previewFrameSrc(path: string, nonce: string): string {
  return `${path}#${NONCE_PARAM}=${encodeURIComponent(nonce)}`
}

/** iframe 侧：从自己的地址里读回标记，没有就是 null（例如被直接打开）。 */
export function readPreviewNonce(hash: string): string | null {
  return new URLSearchParams(hash.replace(/^#/, '')).get(NONCE_PARAM)
}

interface PreviewMessageEvent {
  data: unknown
  origin: string
  source: MessageEventSource | null
}

export interface ChannelTrust {
  /** 对端窗口：父页面看 `iframe.contentWindow`，iframe 看 `window.parent`。 */
  peer: MessageEventSource | null | undefined
  /** 本页面的 origin。 */
  origin: string
  /** 本次装载的标记，null 表示还没开始装载。 */
  nonce: string | null
}

function trustedPeer(event: PreviewMessageEvent, trust: ChannelTrust): boolean {
  if (trust.nonce == null || event.origin !== trust.origin)
    return false
  if (trust.peer == null || event.source == null || event.source !== trust.peer)
    return false
  const data = event.data as { nonce?: unknown } | null
  return typeof data === 'object' && data != null && data.nonce === trust.nonce
}

/** 父页面：只认本次装载的 iframe 发来的、带对了标记的消息。 */
export function acceptFrameMessage(event: PreviewMessageEvent, trust: ChannelTrust): PlaygroundFrameMessage | null {
  if (!trustedPeer(event, trust))
    return null
  return isFrameMessage(event.data) ? event.data : null
}

/** iframe：只认自己父窗口发来的、带对了标记的消息。 */
export function acceptHostMessage(event: PreviewMessageEvent, trust: ChannelTrust): PlaygroundHostMessage | null {
  if (!trustedPeer(event, trust))
    return null
  return isHostMessage(event.data) ? event.data : null
}
