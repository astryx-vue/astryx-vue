import type { Component, ComputedRef, Ref } from 'vue'
import { computed, defineComponent, h, onBeforeUnmount, ref, toValue } from 'vue'
import KeyboardHintView from './KeyboardHint.vue'

export type KeyboardHintOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseKeyboardHintOptions {
  /** 提示里画哪些方向键。 */
  orientation?: KeyboardHintOrientation
  /** 出现之后多久自己消失，单位毫秒。 */
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
 * 按过方向键、超时或焦点离开之后不再出现。
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
    timer = setTimeout(() => {
      dismissed = true
      hide()
    }, options.dismissAfterMs ?? 3000)
  }

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
    hide()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!ARROW_KEYS.has(event.key))
      return
    dismissed = true
    hide()
  }

  onBeforeUnmount(() => {
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
