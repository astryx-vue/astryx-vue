import type { UseTouchTriggerOptions, UseTouchTriggerReturn } from '../useTouchTrigger.js'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { isTextEntryControl } from '../../utils/controlKind.js'
import { isTextEntrySincePointer, trackInteractionModality } from './interactionModality.js'
import { createTapRecognizer, TOUCH_POINTER_TYPES } from './tapRecognizer.js'
import { isActionTrigger, tapLandsOnDisabledControl } from './touchTriggerRules.js'

/** 组件内部用的额外能力，不从包里导出。 */
export interface UseTouchTriggerInternalReturn extends UseTouchTriggerReturn {
  /**
   * 按处理一次轻点的规则，回应一次在浮层挂载之前就已经完成的轻点
   * （截断文字的提示在第一次轻点时才挂载）。
   */
  answerTap: (tapEvent: Event | null) => void
}

export interface UseTouchTriggerInternalOptions {
  /**
   * 轻点落在触发器里的可输入控件上时只让它获得焦点，不开也不关浮层，
   * 免得浮层盖住正要输入的文字。只有 Tooltip 传。
   */
  isTextEntryTapIgnored?: boolean
  /** 外面的这一下按压归别人（例如上面还有别的浮层），不当作点外面关闭。 */
  isOutsidePressIgnored?: () => boolean
}

/** `useTouchTrigger` 加上组件内部用的 `answerTap`。 */
export function useTouchTriggerInternal(
  options: UseTouchTriggerOptions,
  internal: UseTouchTriggerInternalOptions = {},
): UseTouchTriggerInternalReturn {
  trackInteractionModality()
  // 触发器在 iframe 里时，那个窗口的输入只到它自己的 document，在那里也跟踪一份。
  watch(options.triggerRef, (trigger) => {
    if (trigger != null)
      trackInteractionModality(trigger.ownerDocument)
  }, { immediate: true, flush: 'sync' })

  const isTouchPointer = ref(false)
  // 按下时同步读打开状态，读 ref 之外的值会拿到上一帧的。
  let isOpenNow = toValue(options.isOpen)
  /**
   * 这一层是不是被「点一下」打开的。只有点开的浮层才欠用户一次「点外面关闭」：
   * 悬停打开的自己会随指针离开关掉，受控打开的不是我们该关的。
   */
  let isTapOpen = false
  let outsideListener: ((event: PointerEvent) => void) | null = null
  /** 点外面关闭监听所在的 document：页面的，和触发器在 iframe 里时它自己的。 */
  let outsideDocs: Document[] = []
  const tapRecognizer = createTapRecognizer()

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
    for (const doc of outsideDocs) {
      doc.removeEventListener('pointerup', outsideListener, true)
      doc.removeEventListener('pointercancel', outsideListener, true)
    }
    outsideListener = null
    outsideDocs = []
  }

  /**
   * 装「点外面关闭」。用捕获阶段，触发器自己 stopPropagation 也拦不住，
   * 免得留一个关不掉的浮层。它由打开那次轻点的 click 装上，那次轻点的 pointerup
   * 已经过去了，所以看不到打开它的那一下。外面的轻点在抬起（`pointerup`）时算；
   * 外面开始的滚动或缩放在浏览器接走它（`pointercancel`）时就算。
   */
  function armOutsideDismiss(): void {
    isTapOpen = true
    if (outsideListener != null || typeof document === 'undefined')
      return

    const own = options.triggerRef.value?.ownerDocument ?? document
    const docs = own === document ? [document] : [document, own]
    outsideListener = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target != null) {
        // 在触发器上轻点由触发器自己开关；从触发器上开始的滚动仍是外面的滚动，照样关。
        if (event.type === 'pointerup' && options.triggerRef.value?.contains(target) === true)
          return
        // 浮层内容是可以点的，点在里面不算点外面。
        const layerId = toValue(options.layerId)
        if (docs.some(doc => doc.getElementById(layerId)?.contains(target) === true))
          return
      }
      if (internal.isOutsidePressIgnored?.() === true)
        return
      disarmOutsideDismiss()
      options.hide()
    }
    outsideDocs = docs
    for (const doc of docs) {
      doc.addEventListener('pointerup', outsideListener, true)
      doc.addEventListener('pointercancel', outsideListener, true)
    }
  }

  onScopeDispose(() => {
    tapRecognizer.forget()
    disarmOutsideDismiss()
  })

  function isEnabledNow(): boolean {
    return toValue(options.isEnabled) ?? true
  }

  function isControlledNow(): boolean {
    return toValue(options.isControlled) === true
  }

  function isTouchInteraction(): boolean {
    return isTouchPointer.value && isTextEntrySincePointer(options.triggerRef.value?.ownerDocument)
  }

  function handlePointerEnter(event: PointerEvent): void {
    // 到达时只有手指是没有悬停的。笔在感应范围内会像鼠标一样悬停，
    // 把它的到达当成触屏会让用笔的人彻底看不到提示；落笔时再看指针类型。
    isTouchPointer.value = event.pointerType === 'touch'
  }

  /** 轻点落在触发器里一个可输入的控件上（触发器本身不是它，它也没禁用）。 */
  function isTextEntryTap(tapped: Element | null, trigger: HTMLElement | null): boolean {
    if (!internal.isTextEntryTapIgnored || tapped == null || trigger == null)
      return false
    for (let node: Element | null = tapped; node != null && node !== trigger; node = node.parentElement) {
      if (isTextEntryControl(node))
        return trigger.contains(node) && !tapLandsOnDisabledControl(tapped)
    }
    return false
  }

  function answerTap(tapEvent: Event | null): void {
    const trigger = options.triggerRef.value
    const tapped = tapEvent?.target instanceof Element ? tapEvent.target : null
    if (isTextEntryTap(tapped, trigger))
      return
    // 落在禁用控件上的轻点归那个控件：打开它的禁用原因。其它轻点由触发器决定。
    const touchTrigger = toValue(options.touchTrigger)
    const mode = touchTrigger !== 'auto'
      ? touchTrigger
      : tapped != null && tapLandsOnDisabledControl(tapped)
        ? 'tap'
        : trigger != null && isActionTrigger(trigger) ? 'none' : 'tap'

    if (mode === 'none' || !isEnabledNow()) {
      // 上一次点开留下的浮层不能被这一次点走掉之后还开着。
      disarmOutsideDismiss()
      options.hide()
      return
    }

    // 延迟挂载的浮层要晚一帧才报打开，所以用这里的记账判断「第二次点是关闭」。
    if (isOpenNow || isTapOpen) {
      disarmOutsideDismiss()
      options.hide()
      return
    }

    armOutsideDismiss()
    options.show()
  }

  function handlePointerDown(event: PointerEvent): boolean {
    const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType)
    isTouchPointer.value = isTouch
    if (!isTouch || isControlledNow()) {
      tapRecognizer.forget()
      return false
    }
    const trigger = event.currentTarget instanceof Element ? event.currentTarget : options.triggerRef.value
    tapRecognizer.press(trigger, answerTap)
    return true
  }

  return {
    isTouchPointer,
    isTouchInteraction,
    handlePointerEnter,
    handlePointerDown,
    clearTapOpen: disarmOutsideDismiss,
    answerTap,
  }
}
