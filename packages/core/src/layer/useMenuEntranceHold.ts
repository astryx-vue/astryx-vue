/**
 * @file useMenuEntranceHold.ts
 * @input 菜单浮层元素、浮层是否显示着
 * @output useMenuEntranceHold：手机和平板上，菜单进场期间手指的点按和拖动被忽略
 * @position DropdownMenu 和 MoreMenu 锚定浮层的进场暂挡（对应上游 DropdownMenu 的
 *   holdEntrance，上游 MoreMenu 包着 DropdownMenu 所以同样有），建在 `holdEntranceInput.ts` 上
 */

import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, watch } from 'vue'
import { holdEntranceInput } from './holdEntranceInput.js'

/**
 * 浮层一显示就开始暂挡，直到它的 CSS 进场播完，和 UIMenu 一样：这期间落下的手指
 * 关不掉菜单、滚不动页面、也挪不走焦点。键盘和辅助技术照常。只在主指针是粗略
 * 指针时挡；打开菜单的那根手指照样能选中一行（按压模型的命中测试看穿挡板）。
 */
export function useMenuEntranceHold(layer: Readonly<Ref<HTMLElement | null>>, isShown: Readonly<Ref<boolean>>): void {
  let release: (() => void) | null = null
  let isUnmounted = false
  const stop = (): void => {
    release?.()
    release = null
  }

  watch([isShown, layer], ([shown, element], [wasShown, previous]) => {
    if (!shown) {
      stop()
      return
    }
    if (element == null || (wasShown && element === previous))
      return
    stop()
    // 浮层的显示（v-show）可能在这一轮更新里才生效：等它显示出来，进场动画才列得出来。
    void nextTick(() => {
      if (!isUnmounted && release == null && isShown.value && layer.value === element)
        release = holdEntranceInput(element)
    })
  }, { flush: 'post' })

  onBeforeUnmount(() => {
    isUnmounted = true
    stop()
  })
}
