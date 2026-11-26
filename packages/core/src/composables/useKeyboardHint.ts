import type { Component, ComputedRef, Ref } from 'vue'
import { computed, defineComponent, h, onBeforeUnmount, ref, toValue, watch } from 'vue'
import { pushLayer } from '../layer/dismissStack.js'
import KeyboardHintView from './KeyboardHint.vue'

export type KeyboardHintOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseKeyboardHintOptions {
  /** 提示里画哪些方向键。 */
  orientation?: KeyboardHintOrientation
  /**
   * 出现之后多久自己消失，单位毫秒。不传就没有时限：提示停留到按下方向键、Escape 或焦点离开这一组。
   * 时限可能让人没读完就看不到了（WCAG 1.4.13），所以默认不设。
   */
  dismissAfterMs?: number
  /** 为 false 时这个实例不再提示。 */
  isEnabled?: boolean
}

const ARROW_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'])

export interface UseKeyboardHint {
  visible: Ref<boolean>
  anchor: Ref<HTMLElement | null>
  orientation: ComputedRef<KeyboardHintOrientation>
  onFocus: (event: FocusEvent) => void
  onBlur: (event: FocusEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
  Hint: Component
}

/**
 * 一组方向键控件第一次被键盘点进来时，在当前项旁边短暂提示「用方向键移动」。
 * 提示显示期间登记在共用的关闭栈里，Escape 只关它，焦点不动。
 * 按过方向键、Escape、焦点离开（或设了时限且超时）之后不再出现。
 */
export function useKeyboardHint(options: UseKeyboardHintOptions = {}): UseKeyboardHint {
  const visible = ref(false)
  const anchor = ref<HTMLElement | null>(null)
  const orientation = computed(() => options.orientation ?? 'horizontal')
  let dismissed = false
  let timer: ReturnType<typeof setTimeout> | undefined

  function hide(): void {
    visible.value = false
    if (timer != null) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function show(target: HTMLElement): void {
    if (dismissed || options.isEnabled === false)
      return
    anchor.value = target
    visible.value = true
    if (timer != null)
      clearTimeout(timer)
    timer = undefined
    if (options.dismissAfterMs != null) {
      timer = setTimeout(() => {
        dismissed = true
        hide()
      }, options.dismissAfterMs)
    }
  }

  // 只在提示显示、锚点已定时登记，层的身份就落在锚点所在的 document 里。
  const token = {}
  let unregister: (() => void) | null = null
  function release(): void {
    unregister?.()
    unregister = null
  }
  watch(visible, (shown) => {
    release()
    if (!shown)
      return
    unregister = pushLayer({
      token,
      getTrigger: () => anchor.value,
      dismissOnPointerOutside: false,
      dismissOnEscape: 'close',
      onDismiss() {
        dismissed = true
        hide()
      },
    })
  }, { flush: 'post' })

  function onFocus(event: FocusEvent): void {
    if (dismissed || options.isEnabled === false)
      return
    const target = event.target
    const current = event.currentTarget
    if (!(target instanceof HTMLElement) || !(current instanceof HTMLElement))
      return
    if (event.relatedTarget instanceof Node && current.contains(event.relatedTarget)) {
      if (visible.value)
        anchor.value = target
      return
    }
    if (!target.matches(':focus-visible'))
      return
    show(target)
  }

  function onBlur(event: FocusEvent): void {
    const current = event.currentTarget
    if (!(current instanceof HTMLElement))
      return
    if (event.relatedTarget instanceof Node && current.contains(event.relatedTarget))
      return
    // 焦点离开这一组也算这次提示用完了，不再为同一个实例重放。
    dismissed = true
    hide()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!ARROW_KEYS.has(event.key))
      return
    dismissed = true
    hide()
  }

  onBeforeUnmount(() => {
    release()
    if (timer != null)
      clearTimeout(timer)
  })

  const Hint = defineComponent({
    name: 'AstryxKeyboardHint',
    setup() {
      return () => h(KeyboardHintView, {
        visible: visible.value,
        anchor: anchor.value,
        orientation: toValue(orientation),
      })
    },
  })

  return {
    visible,
    anchor,
    orientation,
    onFocus,
    onBlur,
    onKeyDown,
    Hint: Hint as Component,
  }
}
