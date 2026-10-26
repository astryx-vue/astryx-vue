import type { Ref } from 'vue'
import type { PlaygroundHostMessage, PlaygroundLocale } from './protocol'
import type { ThemeState } from './theme'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { acceptFrameMessage, createPreviewNonce, previewFrameSrc } from './previewChannel'
import { PLAYGROUND_CHANNEL } from './protocol'
import { fontStylesheetHref, previewCss } from './theme'

/** 原版给预览文档和编译器各 30 秒；我们两者在同一个页面里，一个 30 秒够了。 */
const FRAME_STARTUP_TIMEOUT_MS = 30_000

export interface PreviewSyncOptions {
  iframe: Ref<HTMLIFrameElement | null>
  /** 预览页面的路径，已带 base。 */
  framePath: string
  locale: PlaygroundLocale
  theme: ThemeState
  code: Ref<string>
  mountId: Ref<number>
  hydrated: Ref<boolean>
  /** 预览迟迟没回报时给用户看的话。 */
  startupFailedText: string
  /** 把当前代码和主题写进地址栏，供分享和刷新后恢复。 */
  persist: () => Promise<unknown>
}

export interface PreviewSync {
  /** 预览 iframe 至少回报过一次渲染结果（成功或失败）。 */
  sawPreview: Ref<boolean>
  errorText: Ref<string>
  /** 当前 iframe 的地址和 key；key 变了就是一个新的 iframe 元素。 */
  frameSrc: Ref<string>
  frameKey: Ref<string>
  onFrameLoad: () => void
}

/**
 * 让预览 iframe 跟上编辑器：代码、主题、重载次数一变就去抖后发消息过去，
 * 同时接收 iframe 回报的就绪和报错，并定时把状态写回地址栏。
 *
 * iframe 每次装载都带一个新的标记（见 previewChannel.ts）。装载完成后 iframe
 * 再发 `load`，说明预览代码把文档换掉了：换一个新的 iframe 元素重新握手，
 * 把代码和主题重新推过去。
 */
export function usePreviewSync(options: PreviewSyncOptions): PreviewSync {
  const { iframe, framePath, locale, theme, code, mountId, hydrated, startupFailedText, persist } = options

  const sawPreview = ref(false)
  const errorText = ref('')
  const nonce = ref(createPreviewNonce())
  const frameSrc = ref(previewFrameSrc(framePath, nonce.value))
  const frameKey = ref('frame-0')
  const styleText = computed(() => previewCss(theme))
  const fontHref = computed(() => fontStylesheetHref(theme))
  let generation = 0
  let frameLoads = 0
  let frameReady = false
  let pushTimer = 0
  let persistTimer = 0
  let startupTimer = 0
  let codeChanged = false

  watch(code, () => {
    codeChanged = true
    schedulePush(200)
    schedulePersist()
  })

  watch([styleText, fontHref, () => theme.dark], () => {
    schedulePush(codeChanged ? 200 : 40)
    schedulePersist()
  })

  watch(mountId, () => restartFrame())

  watch(hydrated, (ready) => {
    if (ready)
      push('render')
  })

  onMounted(() => {
    window.addEventListener('message', onFrameMessage)
    armStartupTimer()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('message', onFrameMessage)
    window.clearTimeout(pushTimer)
    window.clearTimeout(persistTimer)
    window.clearTimeout(startupTimer)
  })

  function onFrameLoad(): void {
    frameLoads += 1
    // 第一次 load 是本次导航的文档本身；再来一次说明它被换掉了。
    if (frameLoads === 1)
      return
    restartFrame()
  }

  /** 丢弃当前 iframe，换一个新元素重新走一遍握手。 */
  function restartFrame(): void {
    generation += 1
    frameLoads = 0
    frameReady = false
    nonce.value = createPreviewNonce()
    frameSrc.value = previewFrameSrc(framePath, nonce.value)
    frameKey.value = `frame-${generation}`
    sawPreview.value = false
    errorText.value = ''
    armStartupTimer()
  }

  function armStartupTimer(): void {
    window.clearTimeout(startupTimer)
    startupTimer = window.setTimeout(() => {
      if (!frameReady)
        errorText.value = startupFailedText
    }, FRAME_STARTUP_TIMEOUT_MS)
  }

  function settle(): void {
    window.clearTimeout(startupTimer)
  }

  function onFrameMessage(event: MessageEvent): void {
    const message = acceptFrameMessage(event, {
      peer: iframe.value?.contentWindow ?? null,
      origin: window.location.origin,
      nonce: nonce.value,
    })
    if (!message)
      return
    if (message.type === 'ready') {
      frameReady = true
      settle()
      push('render')
      return
    }
    sawPreview.value = true
    settle()
    errorText.value = message.type === 'error' ? message.message ?? '' : ''
  }

  /** 只改了主题时发 `theme`，iframe 换样式不重新挂载；改了代码才发 `render`。 */
  function schedulePush(delay: number): void {
    if (!hydrated.value || !frameReady)
      return
    window.clearTimeout(pushTimer)
    pushTimer = window.setTimeout(() => {
      const type = codeChanged ? 'render' : 'theme'
      codeChanged = false
      push(type)
    }, delay)
  }

  function schedulePersist(): void {
    if (!hydrated.value)
      return
    window.clearTimeout(persistTimer)
    persistTimer = window.setTimeout(() => {
      void persist()
    }, 400)
  }

  function push(type: PlaygroundHostMessage['type']): void {
    const target = iframe.value?.contentWindow
    if (!target || !hydrated.value)
      return
    const message: PlaygroundHostMessage = {
      channel: PLAYGROUND_CHANNEL,
      type,
      nonce: nonce.value,
      css: styleText.value,
      colorMode: theme.dark ? 'dark' : 'light',
      fontHref: fontHref.value,
      locale,
      code: code.value,
      mountId: mountId.value,
    }
    target.postMessage(message, window.location.origin)
  }

  return { sawPreview, errorText, frameSrc, frameKey, onFrameLoad }
}
