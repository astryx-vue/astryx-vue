/**
 * @file navigationFocus.ts
 * @input core 的焦点小工具（`@astryx-vue/core/internal/touch`），栈的登记表
 * @output createNavigationFocus：记住每次推入是哪个控件发起的，推入后把焦点交给新屏幕的标题，
 *   退出后还给发起推入的控件；标记「正在处理输入事件的任务」
 * @position NavigationStack 的焦点管理，只在 NavigationStack.vue 里用。
 */

import type { Ref } from 'vue'
import type { NavigationRegistry } from './navigationDriver'
import { focusForLastInput, isFocusLost } from '@astryx-vue/core/internal/touch'

/** 按在控件的文字或图标上时，焦点还给的那个控件。 */
const FOCUSABLE_CONTROL = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** 按节点类型判断元素：渲染到别的窗口（iframe、画中画）里的栈用不了本窗口的构造函数。 */
function isElement(value: unknown): value is Element {
  return typeof value === 'object' && value != null && (value as Partial<Node>).nodeType === 1
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return isElement(value) && value.namespaceURI === 'http://www.w3.org/1999/xhtml'
}

export interface NavigationFocusOptions {
  readonly container: Ref<HTMLElement | null>
  readonly cards: Ref<HTMLElement | null>
  readonly registry: NavigationRegistry
  /** 这一屏的大标题已经滚到栏下面。 */
  readonly isTitleCollapsed: (key: string) => boolean
}

/** 栈的焦点管理：记住推入的发起控件，转场后把焦点放到该去的地方。 */
export interface NavigationFocus {
  notePush: (source: Element | null | undefined) => void
  recordPush: (key: string) => void
  rememberActivation: (event: Event) => void
  focusAfter: (kind: 'push' | 'pop', key: string, revealed?: string) => void
  isInputTask: () => boolean
}

export function createNavigationFocus(options: NavigationFocusOptions): NavigationFocus {
  // 推入的发起控件，按屏幕 key 记（退出时焦点还到那里）。
  const sources = new Map<string, Element | null>()
  // 栈里最后被激活的控件：它发起的推入就是从它来的。
  let lastActivation: { target: Element, at: number } | null = null
  // push() 交来的发起控件，等新屏幕挂上后记到它名下。
  let pendingSource: Element | null | undefined
  let isInputTask = false

  /** 推入时决定发起控件：`options.source`，否则是 1 秒内最后被激活的控件。 */
  function notePush(source: Element | null | undefined): void {
    const last = lastActivation
    pendingSource = source !== undefined
      ? source
      : last != null && performance.now() - last.at < 1000 ? last.target : null
  }

  /** 推入转场开始时，把等着的发起控件记到新屏幕名下。 */
  function recordPush(key: string): void {
    if (pendingSource !== undefined) {
      sources.set(key, pendingSource)
      pendingSource = undefined
    }
  }

  /**
   * 栈自己的捕获阶段监听：最后一次点击或按键。按在控件的文字或图标上时记住控件本身。
   * 这次点击或按键发起的转场在它自己的任务里运行，下一个任务清掉标记。
   */
  function rememberActivation(event: Event): void {
    isInputTask = true
    options.container.value?.ownerDocument.defaultView?.setTimeout(() => {
      isInputTask = false
    }, 0)
    const { target } = event
    if (!isElement(target))
      return
    // 内容溢出时滚动区可以聚焦，但它不是控件：从它的普通内容推入的屏幕退出后聚焦标题。
    const control = target.closest(FOCUSABLE_CONTROL)
    const isScreenScroller = control?.parentElement?.hasAttribute('data-navigation-screen') === true
    lastActivation = {
      target: control != null && !isScreenScroller ? control : target,
      at: performance.now(),
    }
  }

  /**
   * 转场后移动焦点。只有焦点原本在栈里或者丢了时才动，绝不从页面别处抢；也不从现在在最上面的
   * 屏幕里抢（转场还没停时有人点进了它的输入框）。退出时还给发起控件，否则给最上面那屏看得见的
   * 标题：大标题显示时给大标题，不然给栏标题。焦点环按最后一次输入显示。
   */
  function focusAfter(kind: 'push' | 'pop', key: string, revealed?: string): void {
    const container = options.container.value
    if (container == null || !isFocusLost(container))
      return
    const target = revealed ?? key
    const active = container.ownerDocument.activeElement
    // 只看这个栈自己的卡片：嵌在屏幕里的栈也有卡片。
    const topCard = [...(options.cards.value?.children ?? [])].find(
      card => card.getAttribute('data-navigation-screen') === target,
    )
    if (topCard != null && active != null && topCard.contains(active))
      return
    const focus = (element: HTMLElement): void => focusForLastInput(element, { preventScroll: true })
    if (kind === 'pop') {
      const source = sources.get(key)
      sources.delete(key)
      if (isHTMLElement(source) && source.isConnected) {
        focus(source)
        // 不能再拿焦点的控件落到标题上。
        if (source.ownerDocument.activeElement === source)
          return
      }
    }
    const layers = options.registry.get(target)
    const large = layers?.largeTitleElement
    const title = large != null && large.isConnected && !options.isTitleCollapsed(target)
      ? large
      : layers?.titleElement
    if (title != null)
      focus(title)
  }

  return {
    notePush,
    recordPush,
    rememberActivation,
    focusAfter,
    isInputTask: () => isInputTask,
  }
}
