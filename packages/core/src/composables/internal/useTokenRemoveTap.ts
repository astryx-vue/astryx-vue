import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { getInteractionModality, trackInteractionModality } from './interactionModality.js'

/**
 * 手指点 Token 自带的删除按钮时，别把触屏键盘弹起来。
 *
 * 触屏浏览器在一次点按里聚焦输入框就会弹出键盘。标签输入框删掉一个标签后
 * 默认把焦点交回输入框，于是手指每删一个标签都要再收一次键盘。这里记下
 * 字段里最近一次按下：手指按在删除按钮上、而输入框当时没有焦点（键盘是收着的）
 * 时，删除后焦点留在原处，被按的删除按钮也不接焦点。鼠标、笔、按键删除，
 * 以及键盘已经弹起时的点按，都照旧把焦点交回输入框。
 */

/** Token 自带的删除按钮。自定义插槽画的删除控件不算。 */
const TOKEN_REMOVE_SELECTOR = '.astryx-token-remove'

function removeControlOf(target: EventTarget | null): Element | null {
  return target instanceof Element ? target.closest(TOKEN_REMOVE_SELECTOR) : null
}

interface PressRecord {
  inputHadFocus: boolean
  isFinger: boolean
  pressedRemove: Element | null
}

export interface UseTokenRemoveTapOptions {
  /** 字段外框，按下事件在这里按捕获阶段记录。 */
  root: Readonly<Ref<HTMLElement | null>>
  /** 字段的输入框。 */
  input: Readonly<Ref<HTMLElement | null>>
  /** 包住单个标签的元素选择器。焦点原本在被删标签里时，仍把焦点交回输入框。 */
  tokenSelector: string
}

export interface UseTokenRemoveTapReturn {
  /** 删除一个标签之后，该不该把焦点交回输入框。 */
  shouldFocusInputAfterRemove: () => boolean
}

export function useTokenRemoveTap(options: UseTokenRemoveTapOptions): UseTokenRemoveTapReturn {
  trackInteractionModality()
  let press: PressRecord | null = null
  let endTimer: ReturnType<typeof setTimeout> | undefined

  /** 键盘是收着的：最近一次是手指按下，当时输入框没有焦点，之后也没按过键。 */
  function wasKeyboardDown(): boolean {
    return press != null && press.isFinger && !press.inputHadFocus && getInteractionModality() === 'pointer'
  }

  function onPointerDown(event: PointerEvent): void {
    clearTimeout(endTimer)
    const input = options.input.value
    press = {
      inputHadFocus: input != null && input.ownerDocument.activeElement === input,
      isFinger: event.pointerType === 'touch',
      pressedRemove: removeControlOf(event.target),
    }
  }

  /** 手指点按后浏览器补发的 mousedown 会让按钮抢到焦点，键盘收着时取消它。 */
  function onMouseDown(event: MouseEvent): void {
    if (removeControlOf(event.target) != null && wasKeyboardDown())
      event.preventDefault()
  }

  /** 这次按下的记录随点按结束：click 所在的任务跑完，或者浏览器把按下接管成滚动。 */
  function onClick(): void {
    clearTimeout(endTimer)
    endTimer = setTimeout(() => {
      press = null
    })
  }

  function onPointerCancel(): void {
    press = null
  }

  const listeners: Array<[string, EventListener]> = [
    ['pointerdown', onPointerDown as EventListener],
    ['mousedown', onMouseDown as EventListener],
    ['click', onClick],
    ['pointercancel', onPointerCancel],
  ]

  let boundTo: HTMLElement | null = null

  function bindTo(element: HTMLElement | null): void {
    if (element === boundTo)
      return
    for (const [type, listener] of listeners) {
      boundTo?.removeEventListener(type, listener, true)
      element?.addEventListener(type, listener, true)
    }
    boundTo = element
  }

  onMounted(() => bindTo(options.root.value))
  watch(options.root, element => bindTo(element), { flush: 'post' })
  onBeforeUnmount(() => {
    clearTimeout(endTimer)
    bindTo(null)
  })

  function shouldFocusInputAfterRemove(): boolean {
    const pressed = wasKeyboardDown() ? press?.pressedRemove ?? null : null
    if (pressed == null)
      return true
    // 焦点原本就在被删的标签里（删除按钮或它的其他控件），标签一卸载焦点就掉到 body，所以仍交给输入框。
    const active = pressed.ownerDocument.activeElement
    const token = pressed.closest(options.tokenSelector) ?? pressed
    return active != null && token.contains(active)
  }

  return { shouldFocusInputAfterRemove }
}
