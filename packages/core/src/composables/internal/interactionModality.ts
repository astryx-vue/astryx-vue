/**
 * 交互模态：用户上一次是用键盘还是用指针（鼠标、手指、笔）操作的。
 *
 * `:focus-visible` 仍然是画焦点环的条件，但它答不了「是不是键盘移过来的焦点」：
 * 鼠标点进文本框也会命中 `:focus-visible`，程序聚焦也会。只想在键盘操作后画环的组件，
 * 拿这里的答案和 `:focus-visible` 一起判断，不是替代它。
 *
 * 状态挂在 `document` 上（用全局 Symbol 作键），页面里就算打进了两份本库，
 * 也只有一份状态、一对监听。第一个用到的组件装上监听，之后一直留到页面结束，
 * 免得两个组件之间的空档里漏掉输入。模块加载时不碰 DOM，服务端答键盘（最安全的默认）。
 */

export type InteractionModality = 'keyboard' | 'pointer'

interface ModalityStore {
  modality: InteractionModality
  isListening: boolean
  onPointerDown: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

const STORE_KEY = Symbol.for('@astryx-vue/core/interaction-modality/v1')

type DocumentWithStore = Document & { [STORE_KEY]?: ModalityStore }

function getStore(doc: Document): ModalityStore {
  const host = doc as DocumentWithStore
  const existing = host[STORE_KEY]
  if (existing != null)
    return existing

  // 还没有任何输入时按键盘算：焦点是程序或浏览器还原来的，画出焦点环是安全的那一边。
  const store: ModalityStore = {
    modality: 'keyboard',
    isListening: false,
    onPointerDown: () => {
      store.modality = 'pointer'
    },
    onKeyDown: (event) => {
      // 只按着 ⌘ / Alt / Ctrl 不是导航：按住它们去点一下，那一下不能变成「键盘」。
      // Shift 不在此列，Shift+Tab 是实打实的键盘导航。
      if (event.metaKey || event.altKey || event.ctrlKey)
        return
      store.modality = 'keyboard'
    },
  }
  Object.defineProperty(host, STORE_KEY, { value: store })
  return store
}

/** 开始跟踪交互模态。可以反复调用，监听只装一次。服务端什么也不做。 */
export function trackInteractionModality(): void {
  if (typeof document === 'undefined')
    return
  const store = getStore(document)
  if (store.isListening)
    return
  store.isListening = true
  const options = { capture: true, passive: true } as const
  document.addEventListener('pointerdown', store.onPointerDown, options)
  document.addEventListener('keydown', store.onKeyDown, options)
}

/** 上一次的交互模态。没有 document 时答键盘。 */
export function getInteractionModality(): InteractionModality {
  return typeof document === 'undefined' ? 'keyboard' : getStore(document).modality
}

/** 上一次是不是键盘。顺手确保跟踪已经装上。 */
export function isKeyboardModality(): boolean {
  trackInteractionModality()
  return getInteractionModality() === 'keyboard'
}

/** 测试用：回到初始状态。 */
export function resetInteractionModalityForTest(): void {
  if (typeof document !== 'undefined')
    getStore(document).modality = 'keyboard'
}
