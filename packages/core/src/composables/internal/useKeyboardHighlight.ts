import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { isKeyboardModality } from './interactionModality.js'

export interface KeyboardHighlight {
  /** 上一次高亮移动是键盘引起的。 */
  isKeyboardHighlight: Ref<boolean>
  /** 指针悬停挪动了高亮：鼠标没动就没有这个调用，键盘滚动让行冒出来的不算。下一次高亮变化按指针算。 */
  notePointerMove: () => void
}

/**
 * 高亮既能被按键移动，也能被指针移动，但只给键盘看的绘制（焦点环）只在键盘引起的移动后画。
 * 每次高亮变化时读一次共用的交互模态；指针悬停另外用 `notePointerMove` 标出来，
 * 因为键盘用过之后模态还停在「键盘」，光读模态分不出这次是悬停。
 */
export function useKeyboardHighlight(activeIndex: Ref<number>): KeyboardHighlight {
  const isKeyboardHighlight = ref(isKeyboardModality())
  let isPointerMove = false

  watch(activeIndex, () => {
    isKeyboardHighlight.value = !isPointerMove && isKeyboardModality()
    isPointerMove = false
  }, { flush: 'sync' })

  return {
    isKeyboardHighlight,
    notePointerMove: () => {
      isPointerMove = true
    },
  }
}
