import { isTextEntryControl } from '../../utils/controlKind.js'

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
  /**
   * 上一次指针按下之后，每一次按键是不是都在往文本框里打字。
   * 触屏上的软键盘每打一个字都发 keydown，模态因此变成键盘；
   * 触屏判断读这一项，不把打字当成「换成键盘操作了」。旧版本建的存储里没有它。
   */
  isTextEntrySincePointer?: boolean
  /** 上一次指针按下是什么设备：mouse、touch、pen。 */
  lastPointerType?: string
  isListening: boolean
  onPointerDown: (event: PointerEvent) => void
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
    isTextEntrySincePointer: false,
    isListening: false,
    onPointerDown: (event) => {
      store.modality = 'pointer'
      store.lastPointerType = event.pointerType
      store.isTextEntrySincePointer = true
    },
    onKeyDown: (event) => {
      // 只按着 ⌘ / Alt / Ctrl 不是导航：按住它们去点一下，那一下不能变成「键盘」。
      // Shift 不在此列，Shift+Tab 是实打实的键盘导航。
      if (event.metaKey || event.altKey || event.ctrlKey)
        return
      store.modality = 'keyboard'
      if (!isTextEntryKey(event))
        store.isTextEntrySincePointer = false
    },
  }
  Object.defineProperty(host, STORE_KEY, { value: store })
  return store
}

/**
 * 软键盘对很多键发 `Unidentified` 或 `Process`，`Enter` 是它的「前往」键；
 * `Shift`、`CapsLock`、`Dead` 只影响下一个字。其它有名字的键移动焦点或光标，算键盘导航。
 */
const TEXT_ENTRY_NAMED_KEYS = new Set(['Backspace', 'CapsLock', 'Dead', 'Delete', 'Enter', 'Process', 'Shift', 'Unidentified'])

function isTextEntryKey(event: KeyboardEvent): boolean {
  const target = typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target
  if (!isTextEntryControl(target instanceof Element ? target : null))
    return false
  const key = typeof event.key === 'string' ? event.key : ''
  return event.isComposing === true || [...key].length === 1 || TEXT_ENTRY_NAMED_KEYS.has(key)
}

/**
 * 开始跟踪交互模态。不传 `doc` 就跟踪页面自己的 document；组件渲染进 iframe、
 * 画中画窗口时传它所在的 document，那个窗口的输入只到那里。
 * 可以反复调用，监听只装一次。服务端什么也不做。
 */
export function trackInteractionModality(doc?: Document): void {
  const target = doc ?? (typeof document === 'undefined' ? null : document)
  if (target == null)
    return
  const store = getStore(target)
  if (store.isListening)
    return
  store.isListening = true
  const options = { capture: true, passive: true } as const
  target.addEventListener('pointerdown', store.onPointerDown, options)
  target.addEventListener('keydown', store.onKeyDown, options)
}

/** 上一次的交互模态。不传 `doc` 就读页面自己的 document；没有 document 时答键盘。 */
export function getInteractionModality(doc?: Document): InteractionModality {
  const target = doc ?? (typeof document === 'undefined' ? null : document)
  return target == null ? 'keyboard' : getStore(target).modality
}

/** 上一次指针按下的设备类型（mouse、touch、pen）；还没有指针输入时为 undefined。 */
export function getLastPointerType(): string | undefined {
  return typeof document === 'undefined' ? undefined : getStore(document).lastPointerType
}

/** 上一次是不是键盘。顺手确保跟踪已经装上。 */
export function isKeyboardModality(): boolean {
  trackInteractionModality()
  return getInteractionModality() === 'keyboard'
}

/**
 * 上一次指针按下之后，是不是只往文本框里打过字（软键盘打字不算换成键盘操作）。
 * 没有 document 时答 false。
 */
export function isTextEntrySincePointer(doc?: Document): boolean {
  const target = doc ?? (typeof document === 'undefined' ? null : document)
  return target != null && getStore(target).isTextEntrySincePointer === true
}

/** 测试用：回到初始状态。 */
export function resetInteractionModalityForTest(): void {
  if (typeof document === 'undefined')
    return
  const store = getStore(document)
  store.modality = 'keyboard'
  store.isTextEntrySincePointer = false
}
