/**
 * @file useAppShellRail.ts
 * @input AppShell 的根元素、侧栏面板、主内容区和它的背景板
 * @output 借给里面 SideNav 的 `SideNavShell`：侧栏收起、展开时内容区跟着动
 * @position AppShell 内部；SideNav 通过 `sideNavShellKey` 读它（motion 见 SideNav/railMotion.ts）
 *
 * 内联侧栏收起或展开时，内容区持有自己的布局动效句柄：轨道旁边那一列从旧位置滑过来，
 * 内容把旧的那一层原地换成新的那一层，节奏和轨道在同一条时钟上。
 * - 只有「滑动」类动效会移动内容列；减少动态效果时，新旧两层在静止的底板上交叉淡入淡出；
 * - 展开时较窄的内容列从旧的起点滑进来，行尾会露出一条缝：内容的底板（抬起样式的背景板，
 *   或主内容区本身）随进度把这条缝盖住；
 * - 动效进行中又变化：交叉淡入淡出从内容此刻显示的透明度接着走。
 */
import type { Ref } from 'vue'
import type { LayoutChange, LayoutSwap } from '../motion/layout/index.js'
import type { SideNavShell } from '../SideNav/railMotion.js'
import {
  createAnimatedLayout,
  holdLayoutSwap,
  landLayoutGlide,
  layoutMotionFor,
  layoutStartFor,
  playLayoutFrames,
  playLayoutSwap,
  reportLayoutChange,
} from '../motion/layout/index.js'

interface PendingContent {
  /** 内容列的滑动，只在「滑动」类动效时才报告。 */
  change: LayoutChange | null
  swap: LayoutSwap | null
  before: DOMRect
  /** 被留下的旧层和进场的新层各自的起始透明度。 */
  held: number
  entering: number
}

export interface AppShellRailElements {
  root: Ref<HTMLElement | null>
  rail: Ref<HTMLElement | null>
  main: Ref<HTMLElement | null>
  backdrop: Ref<HTMLElement | null>
}

/** 主内容区旁边的那一列：它的祖先里，父元素同时装着轨道的那一个。滑动移动它，轨道的边骑在它上面。 */
function columnOf(main: HTMLElement, rail: HTMLElement | null): HTMLElement {
  let column = main
  while (column.parentElement != null && !column.parentElement.contains(rail))
    column = column.parentElement
  return column
}

export function useAppShellRail(elements: AppShellRailElements): SideNavShell {
  const contentLayout = createAnimatedLayout(() => elements.root.value)
  let pending: PendingContent | null = null
  // 正在播的交换：什么时候开始、两层各自的起始透明度，下一次变化好接着它的样子走。
  let lastSwap: { startedAt: number, held: number, entering: number } | null = null

  const shell: SideNavShell = {
    animatedLayout: contentLayout,
    rail: () => elements.rail.value,
    column: () => elements.main.value == null ? null : columnOf(elements.main.value, elements.rail.value),
    landContent() {
      if (elements.main.value != null)
        landLayoutGlide(columnOf(elements.main.value, elements.rail.value))
    },
    beforeRailChange() {
      const main = elements.main.value
      if (main == null)
        return
      const motion = layoutMotionFor(main)
      let change: LayoutChange | null = null
      if (motion.kind === 'glide') {
        change = reportLayoutChange(contentLayout, () => elements.rail.value)
        change.measureBefore()
      }
      // 静止时被留下的旧层从不透明开始、新层看不见；动效中间，DOM 里的层是上一次的新层，
      // 副本里的层是下一次的新层，各自从显示的透明度开始。
      let held = 1
      let entering = 0
      const last = lastSwap
      if (last != null && motion.kind === 'glide') {
        // 在这次变化自己的起点读：它接手的那段滑动从那里继续。
        const elapsed = Math.max(0, layoutStartFor(main.ownerDocument) - last.startedAt)
        if (elapsed < motion.progress.durationMs) {
          const p = 1 - motion.progress.remaining(elapsed)
          held = last.entering + (1 - last.entering) * p
          entering = last.held * (1 - p)
        }
      }
      lastSwap = null
      pending = {
        change,
        swap: holdLayoutSwap(contentLayout, main, { isVisiblePart: true }),
        before: main.getBoundingClientRect(),
        held,
        entering,
      }
    },
    afterRailChange() {
      const noted = pending
      pending = null
      const main = elements.main.value
      if (noted == null || main == null)
        return () => {}
      noted.change?.animate()
      // 滑动移动的是轨道旁边那一列：副本放在它旁边，骑在它的滑动上。
      const column = columnOf(main, elements.rail.value)
      const after = main.getBoundingClientRect()
      const isRtl = getComputedStyle(main).direction === 'rtl'
      const travel = isRtl ? noted.before.right - after.right : noted.before.left - after.left
      const cover: { element: Element, frames: (p: number) => Keyframe }[] = []
      const surface = elements.backdrop.value ?? main
      const color = getComputedStyle(surface).backgroundColor
      const isPainted = !/^rgba\(.*,\s*0\)$|^transparent$/.test(color)
      const glides = layoutMotionFor(main).kind === 'glide'
      if ((isRtl ? travel > 0 : travel < 0) && glides && isPainted) {
        cover.push({
          element: surface,
          frames: p => ({ boxShadow: `${-travel * (1 - p)}px 0px 0px 0px ${color}` }),
        })
      }
      if (noted.swap == null || column.parentElement == null)
        return playLayoutFrames(contentLayout, cover)
      // 减少动态效果时什么都不滑：旧层的副本带着它所在的底色一起淡出，不留一条光秃秃的空白。
      if (!glides && isPainted)
        noted.swap.copy.style.backgroundColor = color
      const { held, entering } = noted
      lastSwap = { startedAt: layoutStartFor(main.ownerDocument), held, entering }
      return playLayoutSwap(noted.swap, {
        host: column.parentElement,
        copy: p => ({ opacity: held * (1 - p) }),
        rideWith: { element: column, travel: { x: travel, y: 0 } },
        incoming: [
          ...Array.from(main.children, element => ({
            element,
            frames: (p: number) => ({ opacity: entering + (1 - entering) * p }),
          })),
          ...cover,
        ],
      })
    },
  }
  return shell
}
