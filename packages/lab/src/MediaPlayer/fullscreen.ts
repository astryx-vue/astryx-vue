// 全屏的平台差异：标准 Fullscreen API、旧版 WebKit 前缀，以及 iPhone 上只有视频自己能进的系统全屏。

interface WebKitDocument extends Document {
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
  webkitExitFullscreen?: () => void
}

interface WebKitElement extends HTMLElement {
  webkitRequestFullscreen?: () => void
}

interface WebKitVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

function webkitDocument(): WebKitDocument | null {
  return typeof document === 'undefined' ? null : document as WebKitDocument
}

function isElementFullscreenEnabled(doc: WebKitDocument): boolean {
  return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled)
}

/** 播放器容器正在全屏，或者视频正在系统播放器里全屏。 */
export function readFullscreen(container: HTMLElement | null, media: HTMLMediaElement | null): boolean {
  const doc = webkitDocument()
  if (doc == null)
    return false
  const element = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
  if (element != null && container != null && element === container)
    return true
  return Boolean((media as WebKitVideoElement | null)?.webkitDisplayingFullscreen)
}

/** 容器能进元素全屏，或者视频能进系统全屏（iPhone 没有元素全屏）。 */
export function readCanFullscreen(container: HTMLElement | null, media: HTMLMediaElement | null): boolean {
  const doc = webkitDocument()
  if (doc == null)
    return false
  const element = container as WebKitElement | null
  const canContainer = element != null
    && isElementFullscreenEnabled(doc)
    && (typeof element.requestFullscreen === 'function' || typeof element.webkitRequestFullscreen === 'function')
  const canVideo = typeof (media as WebKitVideoElement | null)?.webkitEnterFullscreen === 'function'
  return canContainer || canVideo
}

export function enterFullscreen(container: HTMLElement | null, media: HTMLMediaElement | null): void {
  const doc = webkitDocument()
  if (doc == null)
    return
  const element = container as WebKitElement | null
  const isEnabled = isElementFullscreenEnabled(doc)
  if (element != null && isEnabled && typeof element.requestFullscreen === 'function')
    void element.requestFullscreen().catch(() => {})
  else if (element != null && isEnabled && element.webkitRequestFullscreen)
    element.webkitRequestFullscreen()
  else
    (media as WebKitVideoElement | null)?.webkitEnterFullscreen?.()
}

export function exitFullscreen(media: HTMLMediaElement | null): void {
  const doc = webkitDocument()
  if (doc == null)
    return
  if (doc.fullscreenElement != null)
    void doc.exitFullscreen?.().catch(() => {})
  else if (doc.webkitFullscreenElement != null)
    doc.webkitExitFullscreen?.()
  else
    (media as WebKitVideoElement | null)?.webkitExitFullscreen?.()
}
