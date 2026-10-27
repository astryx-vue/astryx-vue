/**
 * 锁滚动时给滚动条留住位置，页面不左右跳。
 *
 * 锁滚动会把文档的滚动条藏起来。如果那是占地方的经典滚动条（Windows、Linux 桌面，
 * 以及 macOS 设成「始终显示滚动条」），藏掉之后布局视口变宽一个滚动条，整页在浮层后面往右跳。
 *
 * 办法是给根元素加 `scrollbar-gutter: stable`：滚动条没了，它的位置还留着。这是真的布局变化，
 * 所以 `position: fixed` 的东西（吸顶栏、Toast 区）也一起稳住，padding 做不到这点。
 * padding 只当兜底，给不支持 `scrollbar-gutter` 的引擎；而且是量过元素真的变宽了才补。
 */

export interface ScrollbarGutterHold {
  /** 锁滚动的样式加上之后立刻调：量一下元素是不是还是变宽了，只有变宽了才用 padding 补回去。 */
  settle: () => void
  /** 解锁时调：把这里改过的都还原。 */
  release: () => void
}

const NOOP: ScrollbarGutterHold = {
  settle() {},
  release() {},
}

/**
 * 让 `element` 的内容宽度在接下来的锁滚动期间保持现在的样子。
 *
 * 在加锁样式**之前**调，加完之后马上 `settle()`，解锁时 `release()`。
 * 悬浮滚动条（手机、macOS 默认）不占地方，什么都不用留，也什么都不碰。
 */
export function holdScrollbarGutter(element: HTMLElement): ScrollbarGutterHold {
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return NOOP

  const root = document.documentElement
  const viewportWidth = root.clientWidth
  // 0 表示没有布局可量（测试环境、非视觉环境），不是「滚动条和窗口一样宽」。
  if (viewportWidth === 0)
    return NOOP

  const previousGutter = root.style.scrollbarGutter
  const previousPadding = element.style.paddingRight
  const widthBefore = element.getBoundingClientRect().width

  let heldGutter = false
  let padded = false
  let settled = false

  // 只在真有一条占地方的滚动条时才留。页面本来没有滚动条却硬留，会凭空挖出 15px，同样是跳，只是方向反了。
  if (window.innerWidth > viewportWidth) {
    root.style.scrollbarGutter = 'stable'
    heldGutter = true
  }

  return {
    settle() {
      if (settled)
        return
      settled = true
      // 量锁滚动实际对元素做了什么，不靠猜。gutter 生效的引擎上、或者页面自己已经设了 stable，这里是 0。
      const grew = element.getBoundingClientRect().width - widthBefore
      if (grew <= 0)
        return
      const existing = Number.parseFloat(window.getComputedStyle(element).paddingRight) || 0
      element.style.paddingRight = `${existing + grew}px`
      padded = true
    },
    release() {
      if (padded) {
        element.style.paddingRight = previousPadding
        padded = false
      }
      if (heldGutter) {
        root.style.scrollbarGutter = previousGutter
        heldGutter = false
      }
    },
  }
}
