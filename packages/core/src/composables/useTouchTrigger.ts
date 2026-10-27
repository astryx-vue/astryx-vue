import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { getInteractionModality, trackInteractionModality } from './internal/interactionModality.js'

/**
 * 悬停类浮层在触屏上怎么响应。
 *
 * - `auto`：点一下打开，除非触发器本身是个会做事的东西（按钮、链接、表单控件）。
 * - `tap`：总是点一下打开，哪怕触发器自己也有动作。
 * - `none`：触屏上从不打开。
 */
export type LayerTouchTrigger = 'auto' | 'tap' | 'none'

/**
 * 「按下去」算作点击的指针类型。笔也在里面，但它只在落笔时算：
 * 笔悬停在屏幕上方时是悬停，和鼠标一样。
 */
const TOUCH_POINTER_TYPES = new Set(['touch', 'pen'])

/**
 * 表示「激活它会做事」的 ARIA role。显式 role 优先于标签名：
 * `<button role="presentation">` 只是布景，`<span role="button">` 才是真控件。
 */
const ACTION_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
])

/**
 * 激活这个元素是不是「做了别的事」，而不是「显示浮层」。
 *
 * 比「可聚焦」窄是有意的：纯文字 Tooltip 的触发器带 `tabindex=0`，
 * 键盘用户要能聚焦它读提示，但它本身没有动作。
 *
 * 返回 true 只决定「浮层不开」，那一下点击本身不会被吞掉：这里不调
 * `preventDefault`，也不调 `stopPropagation`。
 */
export function isActionTrigger(element: HTMLElement): boolean {
  const role = element.getAttribute('role')
  if (role != null && role !== '')
    return ACTION_ROLES.has(role)

  switch (element.tagName) {
    case 'BUTTON':
    case 'INPUT':
    case 'LABEL':
    case 'SELECT':
    case 'SUMMARY':
    case 'TEXTAREA':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    default:
      return isEditable(element)
  }
}

function isEditable(element: HTMLElement): boolean {
  if (element.isContentEditable === true)
    return true
  const attribute = element.getAttribute('contenteditable')
  return attribute != null && attribute !== 'false'
}

export interface UseTouchTriggerOptions {
  /** 触屏上的触发方式。 */
  touchTrigger: MaybeRefOrGetter<LayerTouchTrigger>
  /** 触发器是不是还能用。 @default true */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** 打开状态是不是由外面控制。受控的浮层不会被点击开关。 @default false */
  isControlled?: MaybeRefOrGetter<boolean>
  /** 浮层现在是否打开。 */
  isOpen: MaybeRefOrGetter<boolean>
  /** 浮层元素的 id，用来判断「点在浮层里面」。 */
  layerId: MaybeRefOrGetter<string>
  /** 触发器元素。 */
  triggerRef: Ref<HTMLElement | null>
  /** 立刻打开，不等悬停延时。 */
  show: () => void
  /** 立刻关闭。 */
  hide: () => void
}

export interface UseTouchTriggerReturn {
  /**
   * 当前这次交互是不是没有悬停能力的指针（手指，或者已经落下的笔）。
   * 悬停在屏幕上的笔是 false，因为它确实在悬停。
   */
  isTouchPointer: Ref<boolean>
  /**
   * 这一次交互是不是触屏。和上一条不同的是，用户一碰键盘它就变回 false，
   * 这样点过一次之后焦点驱动的浮层还能用。
   */
  isTouchInteraction: () => boolean
  /** 绑到触发器的 pointerenter 上：在合成的悬停事件之前记下指针类型。 */
  handlePointerEnter: (event: PointerEvent) => void
  /**
   * 绑到触发器的 pointerdown 上。返回 true 表示这次按压是触屏、
   * 并且已经由这里处理掉了，调用方自己的按下逻辑不要重复执行。
   */
  handlePointerDown: (event: PointerEvent) => boolean
  /** 忘掉「是点开的」这件事。其它关闭路径（Escape、受控关闭）都要调。 */
  clearTapOpen: () => void
}

/**
 * 悬停类浮层（Tooltip、HoverCard）共用的触屏行为。
 *
 * 触屏上表达不了「悬停」：点一下会合成 `mouseenter`，不处理的悬停浮层要么
 * 每次点都弹出来、又没有东西能关掉它，要么把用户点控件的这一下吃掉。
 */
export function useTouchTrigger(options: UseTouchTriggerOptions): UseTouchTriggerReturn {
  trackInteractionModality()

  const isTouchPointer = ref(false)
  // 按下时同步读打开状态，读 ref 之外的值会拿到上一帧的。
  let isOpenNow = toValue(options.isOpen)
  /**
   * 这一层是不是被「点一下」打开的。只有点开的浮层才欠用户一次「点外面关闭」：
   * 悬停打开的自己会随指针离开关掉，受控打开的不是我们该关的。
   */
  let isTapOpen = false
  let outsideListener: ((event: PointerEvent) => void) | null = null

  watch(() => toValue(options.isOpen), (open) => {
    // 别的路径关掉了这一层（Escape、组件自己、浏览器），这里就没有欠下的关闭了。
    // 只有真的从开到关才算：延迟挂载的浮层在点完那一帧之后才报打开，
    // 把它当成关闭会把刚装好的监听摘掉。
    if (isOpenNow && !open)
      disarmOutsideDismiss()
    isOpenNow = open
  }, { flush: 'sync' })

  function disarmOutsideDismiss(): void {
    isTapOpen = false
    if (outsideListener == null)
      return
    document.removeEventListener('pointerdown', outsideListener, true)
    outsideListener = null
  }

  /**
   * 装「点外面关闭」。用捕获阶段，触发器自己 stopPropagation 也拦不住，
   * 免得留一个关不掉的浮层。打开它的那一次按压在 document 捕获阶段已经走过了，
   * 所以这个监听看不到它。
   */
  function armOutsideDismiss(): void {
    isTapOpen = true
    if (outsideListener != null)
      return

    outsideListener = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target != null) {
        // 触发器自己的处理器负责开关。
        if (options.triggerRef.value?.contains(target) === true)
          return
        // 浮层内容是可以点的，点在里面不算点外面。
        if (document.getElementById(toValue(options.layerId))?.contains(target) === true)
          return
      }
      disarmOutsideDismiss()
      options.hide()
    }
    document.addEventListener('pointerdown', outsideListener, true)
  }

  onScopeDispose(disarmOutsideDismiss)

  function isEnabledNow(): boolean {
    return toValue(options.isEnabled) ?? true
  }

  function isControlledNow(): boolean {
    return toValue(options.isControlled) === true
  }

  function isTouchInteraction(): boolean {
    return isTouchPointer.value && getInteractionModality() === 'pointer'
  }

  function handlePointerEnter(event: PointerEvent): void {
    // 到达时只有手指是没有悬停的。笔在感应范围内会像鼠标一样悬停，
    // 把它的到达当成触屏会让用笔的人彻底看不到提示；落笔时再看指针类型。
    isTouchPointer.value = event.pointerType === 'touch'
  }

  function handlePointerDown(event: PointerEvent): boolean {
    const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType)
    isTouchPointer.value = isTouch

    if (!isTouch || isControlledNow())
      return false

    const trigger = options.triggerRef.value
    const touchTrigger = toValue(options.touchTrigger)
    const mode = touchTrigger === 'auto'
      ? (trigger != null && isActionTrigger(trigger) ? 'none' : 'tap')
      : touchTrigger

    if (mode === 'none' || !isEnabledNow()) {
      // 上一次点开留下的浮层不能被这一次点走掉之后还开着。
      disarmOutsideDismiss()
      options.hide()
      return true
    }

    // 延迟挂载的浮层要晚一帧才报打开，所以用这里的记账判断「第二次点是关闭」。
    if (isOpenNow || isTapOpen) {
      disarmOutsideDismiss()
      options.hide()
      return true
    }

    armOutsideDismiss()
    options.show()
    return true
  }

  return {
    isTouchPointer,
    isTouchInteraction,
    handlePointerEnter,
    handlePointerDown,
    clearTapOpen: disarmOutsideDismiss,
  }
}
