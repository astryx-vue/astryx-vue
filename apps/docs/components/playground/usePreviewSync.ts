import type { Ref } from 'vue'
import type { PlaygroundFrameMessage, PlaygroundHostMessage, PlaygroundLocale } from './protocol'
import type { ThemeState } from './theme'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isFrameMessage, PLAYGROUND_CHANNEL } from './protocol'
import { fontStylesheetHref, previewCss } from './theme'

export interface PreviewSyncOptions {
  iframe: Ref<HTMLIFrameElement | null>
  locale: PlaygroundLocale
  theme: ThemeState
  code: Ref<string>
  mountId: Ref<number>
  hydrated: Ref<boolean>
  /** 把当前代码和主题写进地址栏，供分享和刷新后恢复。 */
  persist: () => Promise<unknown>
}

export interface PreviewSync {
  /** iframe 至少回报过一次渲染结果（成功或失败）。 */
  sawPreview: Ref<boolean>
  errorText: Ref<string>
  onFrameLoad: () => void
}

/**
 * 让预览 iframe 跟上编辑器：代码、主题、重载次数一变就去抖后发消息过去，
 * 同时接收 iframe 回报的就绪和报错，并定时把状态写回地址栏。
 */
export function usePreviewSync(options: PreviewSyncOptions): PreviewSync {
  const { iframe, locale, theme, code, mountId, hydrated, persist } = options

  const frameReady = ref(false)
  const sawPreview = ref(false)
  const errorText = ref('')
  const styleText = computed(() => previewCss(theme))
  const fontHref = computed(() => fontStylesheetHref(theme))
  let pushTimer = 0
  let persistTimer = 0
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

  watch(mountId, () => {
    codeChanged = true
    schedulePush(0)
  })

  watch(hydrated, (ready) => {
    if (ready)
      push('render')
  })

  onMounted(() => {
    window.addEventListener('message', onFrameMessage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('message', onFrameMessage)
    window.clearTimeout(pushTimer)
    window.clearTimeout(persistTimer)
  })

  function onFrameLoad(): void {
    frameReady.value = true
    push('render')
  }

  function onFrameMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin || event.source !== iframe.value?.contentWindow)
      return
    if (!isFrameMessage(event.data))
      return
    const message: PlaygroundFrameMessage = event.data
    if (message.type === 'ready') {
      frameReady.value = true
      push('render')
      return
    }
    if (message.type === 'error') {
      errorText.value = message.message ?? ''
      sawPreview.value = true
      return
    }
    errorText.value = ''
    sawPreview.value = true
  }

  /** 只改了主题时发 `theme`，iframe 换样式不重新挂载；改了代码才发 `render`。 */
  function schedulePush(delay: number): void {
    if (!hydrated.value || !frameReady.value)
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
      css: styleText.value,
      colorMode: theme.dark ? 'dark' : 'light',
      fontHref: fontHref.value,
      locale,
      code: code.value,
      mountId: mountId.value,
    }
    target.postMessage(message, window.location.origin)
  }

  return { sawPreview, errorText, onFrameLoad }
}
