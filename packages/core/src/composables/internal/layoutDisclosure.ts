/**
 * @file layoutDisclosure.ts
 * @position 组件内部的组合式函数：带 `animatedLayout` 句柄的展开收起组件（Collapsible、
 *   TreeList 的分支）靠它把开合接到布局动效上。
 *
 * 一次开合分三步：
 * 1. DOM 变化之前（`flush: 'pre'` 的侦听器）量好旧位置，箭头换上和滑动一样的过渡；
 * 2. DOM 变化之后（`flush: 'post'`）让后面的内容从旧位置滑过来，展开的内容播放入场；
 * 3. 收起时内容先留在页面上播放退场（变成 inert、让出空间），播完再真正隐藏。
 *
 * 不管开合是谁触发的（点击、外部绑定的状态、分组的值），都会先量再变。服务端渲染时
 * 侦听器不运行，不碰 DOM。
 */
import type { Ref } from 'vue'
import type { AnimatedLayout, LayoutChange } from '../../motion/layout/index.js'
import { onMounted, ref, watch } from 'vue'
import {
  applyLayoutChangeTransition,
  holdLayoutExit,
  playLayoutChange,
  releaseLayoutExit,
  reportLayoutChange,
} from '../../motion/layout/index.js'

export interface LayoutDisclosureOptions {
  /** 组件收到的句柄；没有时开合照旧，不做布局动效。 */
  animatedLayout: () => AnimatedLayout | null | undefined
  /** 当前是否展开。 */
  isOpen: () => boolean
  /** 开合时出现、消失的内容元素。 */
  content: () => HTMLElement | null
  /** 跟着开合转动的箭头；没有时传回 null。 */
  chevron: () => HTMLElement | SVGElement | null
  /** DOM 变化之前、量位置的同一时刻调用，参数是变化前的展开状态。 */
  onBeforeChange?: (wasOpen: boolean) => void
}

export interface LayoutDisclosure {
  /** 收起后内容还在播放退场：这段时间内容要继续渲染。 */
  isExiting: Ref<boolean>
}

export function useLayoutDisclosure(options: LayoutDisclosureOptions): LayoutDisclosure {
  const isExiting = ref(false)
  let pending: LayoutChange | null = null

  function endExit(): void {
    isExiting.value = false
  }

  watch(options.isOpen, (isOpen, wasOpen) => {
    options.onBeforeChange?.(wasOpen)
    const handle = options.animatedLayout()
    if (handle != null) {
      applyLayoutChangeTransition(handle, options.chevron())
      pending = reportLayoutChange(handle, options.content)
      pending.measureBefore()
    }
    isExiting.value = !isOpen && handle != null
  }, { flush: 'pre' })

  watch(options.isOpen, (isOpen) => {
    const change = pending
    pending = null
    const content = options.content()
    if (content == null)
      return
    // 没量过的变化（没有句柄）一步到位，入场、退场都不播，内容和后面的元素保持同步。
    const isMeasured = change?.animate() ?? false
    const handle = options.animatedLayout()
    if (isOpen) {
      // 退场途中又展开：内容回到正常排版的位置。
      releaseLayoutExit(content)
      if (isMeasured)
        playLayoutChange(handle, content)
      return
    }
    const isHeld = isExiting.value && isMeasured && holdLayoutExit(handle, content, endExit)
    // 没被接住的退场（不在可见区域、减少动态效果配精确指针、没有空间可让）当帧隐藏。
    if (isExiting.value && !isHeld)
      endExit()
  }, { flush: 'post' })

  watch(() => !options.isOpen() && !isExiting.value, (isHidden) => {
    const content = options.content()
    // 退场播完、已经隐藏：清掉退场留下的行内样式。
    if (isHidden && content != null)
      releaseLayoutExit(content)
  }, { flush: 'post' })

  // 没有句柄时箭头用主题自己的过渡：句柄设过的行内值只在传着句柄时保留。
  function clearChevronWithoutHandle(): void {
    if (options.animatedLayout() == null)
      applyLayoutChangeTransition(null, options.chevron())
  }
  onMounted(clearChevronWithoutHandle)
  watch(options.animatedLayout, clearChevronWithoutHandle, { flush: 'post' })

  return { isExiting }
}
