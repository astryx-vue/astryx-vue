import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import ChatDictationButton from './ChatDictationButton.vue'
import { useChatDictation } from './useChatDictation.js'

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('chatDictationButton hydration', () => {
  it('matches the server markup in a browser with speech recognition, then shows the button', async () => {
    const Host = defineComponent({
      setup() {
        const dictation = useChatDictation()
        return () => h('div', [h(ChatDictationButton, { dictation })])
      },
    })
    const context: { teleports?: Record<string, string> } = {}
    const html = await renderToString(createSSRApp(Host), context)
    document.body.innerHTML = `${context.teleports?.body ?? ''}<div id="app">${html}</div>`
    expect(document.querySelector('.astryx-chat-dictation')).toBeNull()

    // Chromium 有 webkitSpeechRecognition，服务端没有。
    vi.stubGlobal('webkitSpeechRecognition', class {})
    const problems: unknown[] = []
    const app = createSSRApp(Host)
    app.config.warnHandler = message => problems.push(message)
    app.config.errorHandler = error => problems.push(error)
    app.mount('#app')
    await nextTick()

    expect(problems).toEqual([])
    expect(document.querySelector('.astryx-chat-dictation button')).not.toBeNull()
    app.unmount()
  })
})
