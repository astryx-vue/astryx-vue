import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'
import { currentGesture } from '../composables/internal/gestureCounter.js'
import { noteOutsideDismissal } from '../layer/dismissStack.js'

export interface CalendarDismissOptions {
  /** 日历是否开着。只在开着时监听。 */
  isOpen: Readonly<Ref<boolean>>
  /** 整个字段：输入框、日历按钮、清除按钮都在里面。 */
  field: () => HTMLElement | null
  /** 字段自己的输入框。指向它的 label 也算在字段里。 */
  input: () => HTMLInputElement | null
  /** 弹层里的任意元素，用来找到整个弹层。 */
  popup: () => HTMLElement | null
  close: () => void
}

function isLabelFor(target: EventTarget, input: HTMLInputElement | null): boolean {
  return input != null
    && target instanceof Element
    && target.localName === 'label'
    && (target as HTMLLabelElement).control === input
}

/**
 * 鼠标下的日历弹层什么时候关。
 *
 * 文本输入框不是弹层的触发按钮，交给弹层的「点外面就关」会把按在输入框上的那一下当成外面，
 * 日历关了又被同一下打开。所以这里自己判断：按在字段里（输入框、清除按钮、日历按钮）、
 * 指向输入框的 label 上、或者日历里，日历都保持打开；按在别处才关。
 * 焦点从字段里移到字段和日历之外的地方时也关，下一个字段的日历就不会和它并排开着。
 * 焦点哪儿也没去（切走窗口）时不关。
 * 日历在模态框里被这样关掉时，会登记到手势上，让同一下遮罩按压只关日历、不关模态框。
 */
export function useCalendarDismiss(options: CalendarDismissOptions): { onFieldFocusOut: (event: FocusEvent) => void } {
  function popupSurface(): HTMLElement | null {
    const popup = options.popup()
    return popup?.closest<HTMLElement>('.astryx-popover') ?? popup
  }

  function isInside(target: EventTarget | null): boolean {
    if (!(target instanceof Node))
      return false
    return Boolean(options.field()?.contains(target) || popupSurface()?.contains(target))
  }

  function onPointerDown(event: PointerEvent): void {
    const path = event.composedPath()
    const input = options.input()
    if (path.some(target => isInside(target) || isLabelFor(target, input)))
      return
    noteOutsideDismissal()
    options.close()
  }

  let listening = false

  function stop(): void {
    if (!listening)
      return
    document.removeEventListener('pointerdown', onPointerDown, true)
    listening = false
  }

  watch(options.isOpen, (open) => {
    if (typeof document === 'undefined')
      return
    if (open && !listening) {
      // 手势计数器要排在本监听之前，同一下按压里读到的才是同一个编号。
      currentGesture()
      document.addEventListener('pointerdown', onPointerDown, true)
      listening = true
    }
    else if (!open) {
      stop()
    }
  }, { immediate: true })

  onScopeDispose(stop)

  function onFieldFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget
    if (!options.isOpen.value || next == null || isInside(next))
      return
    // 鼠标按在模态框遮罩上时，字段的失焦先于遮罩的 click，同样算这一下按压关掉的。
    noteOutsideDismissal()
    options.close()
  }

  return { onFieldFocusOut }
}
