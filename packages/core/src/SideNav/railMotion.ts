/**
 * @file railMotion.ts
 * @input 轨道（侧栏）的外层元素、布局动效模块的句柄、动效与两态边缘揭示（motion/layout）
 * @output `createRailLayout`、`snapshotRail`、`playRail` 和 `SideNavShell` 类型：
 *   侧栏收起、展开的动效
 * @position SideNav 内部；AppShell 的内容区通过 `sideNavShellKey` 跟着一起动
 *
 * 收起或展开侧栏只播一段动效，一条时钟：主题的移动曲线，由布局动效模块播放。
 * 轨道是模块边缘揭示的行内两态形式：布局一步落到最终宽度，没有任何东西动画宽度，
 * 模块把轨道的行内结束边从当前显示的宽度裁到新宽度。
 * - 收起：旧的展开态轨道作为一份临时副本留在原处，真正的收起态轨道抬到副本上方；
 * - 展开：真正的轨道在旧的收起态轨道之上揭开。
 * 在 AppShell 里，这条边逐帧骑在内容列的滑动上，两者不会分开；中途被打断也一样。
 * 起始裁剪在提交的同一帧、首帧绘制前套上。「减少动态效果」按上游规定：粗指针只做淡入淡出，
 * 精确指针直接切换。没有 Web Animations 时一步到位。
 *
 * 这个文件自己加的是轨道的淡入淡出，与揭示共用同一个进度：
 * - 收起：副本里的文字在前 40% 淡出，副本在后 30% 淡出，真正的收起态轨道（图标）在后 30% 淡入；
 * - 展开：真正的轨道里文字在后 60% 淡入，旧的收起态轨道在前 60% 淡出，所以第一帧就是点击前的那一帧；
 * - 动效进行中又变化：从轨道当前显示的宽度、文字透明度和图标透明度接着走。
 */
import type { AnimatedLayout, LayoutEdgeHold, LayoutSwap } from '../motion/layout/index.js'
import { createAnimatedLayout, holdLayoutEdge, playLayoutEdge } from '../motion/layout/index.js'

/** AppShell 借给里面 SideNav 的东西；不在 AppShell 里时没有。 */
export interface SideNavShell {
  /** AppShell 自己的句柄，它的区域同时装着轨道和内容。 */
  readonly animatedLayout: AnimatedLayout
  /** 轨道的外层元素，背景画在它上面。 */
  rail: () => HTMLElement | null
  /** 轨道旁边的内容列，它会滑动。 */
  column: () => HTMLElement | null
  /** DOM 变化之前：内容先量好自己。 */
  beforeRailChange: () => void
  /** DOM 变化之后、绘制之前：内容开始动；返回结束它的函数。 */
  afterRailChange: () => () => void
  /** 内容落到排版的位置，结束正在播放的滑动。 */
  landContent: () => void
}

/** 沿祖先往上找第一个真正有盒子的元素（跳过 `display: contents`）。 */
function boxedAncestor(element: HTMLElement | null): HTMLElement | null {
  let node = element?.parentElement ?? null
  while (node != null && getComputedStyle(node).display === 'contents')
    node = node.parentElement
  return node
}

/** AppShell 之外的 SideNav 自己持有一个句柄，区域是轨道所在的那一行。 */
export function createRailLayout(rail: () => HTMLElement | null): AnimatedLayout {
  return createAnimatedLayout(() => boxedAncestor(rail()))
}

/** 轨道显示的样子：静止时或动效进行中。 */
export interface RailShown {
  readonly width: number
  /** 文字的透明度。 */
  readonly labels: number
  /** 收起态轨道（图标）的透明度。 */
  readonly collapsed: number
}

export interface RailSnapshot {
  /** 旧轨道，交给模块的边缘揭示。 */
  readonly hold: LayoutEdgeHold
  /** 旧轨道的一份临时副本；留不下来时为 null。 */
  readonly swap: LayoutSwap | null
  /** 变化落地时轨道显示的样子。 */
  readonly shown: RailShown
}

/** 正在播放的轨道动效。 */
export interface RailMotion {
  /** 立刻结束（又一次变化、卸载）。 */
  end: () => void
  /** 轨道现在显示的样子；已经停稳则为 null。 */
  shown: () => RailShown | null
}

/** 变化提交之前：旧轨道在哪里、显示什么（来自进行中的动效或静止状态）。 */
export function snapshotRail(
  rail: HTMLElement | null,
  handle: AnimatedLayout,
  running: RailShown | null,
  isCollapsed: boolean,
): RailSnapshot | null {
  // 轨道的边是挨着内容的那条，行内结束边。
  const hold = holdLayoutEdge(handle, rail, { edge: 'inline-end', shown: running?.width ?? null })
  if (hold == null)
    return null
  return {
    hold,
    swap: hold.swap,
    shown: running ?? {
      width: hold.extent,
      labels: isCollapsed ? 0 : 1,
      collapsed: isCollapsed ? 1 : 0,
    },
  }
}

const clamp = (value: number): number => Math.min(1, Math.max(0, value))

/** 轨道自己的文字：直接装着一段文字的元素。 */
function textElements(rail: HTMLElement): Element[] {
  return Array.from(rail.querySelectorAll('*')).filter(element =>
    Array.from(element.childNodes).some(node => node.nodeType === 3 && node.textContent?.trim()),
  )
}

/**
 * 变化提交之后、绘制之前：从快照开始播轨道动效。有 `column`（在 AppShell 里）时，
 * 轨道的边骑在它的滑动上。
 */
export function playRail(
  snapshot: RailSnapshot,
  current: HTMLElement | null,
  handle: AnimatedLayout,
  column: HTMLElement | null = null,
): RailMotion {
  const { shown: from } = snapshot
  let isCollapse = false
  const labelsAt = (p: number): number => isCollapse
    ? from.labels * (1 - clamp(p / 0.4))
    : from.labels + (1 - from.labels) * clamp((p - 0.4) / 0.6)
  const collapsedAt = (p: number): number => isCollapse
    ? from.collapsed + (1 - from.collapsed) * clamp((p - 0.7) / 0.3)
    : from.collapsed * (1 - clamp(p / 0.6))
  const motion = playLayoutEdge(snapshot.hold, current, handle, {
    edge: 'inline-end',
    rideWith: column,
    parts: (isConceal, rail) => {
      isCollapse = isConceal
      return isConceal
        ? {
            copyOpacity: p => 1 - clamp((p - 0.7) / 0.3),
            copyText: labelsAt,
            incoming: [{ element: rail, frames: p => ({ opacity: collapsedAt(p) }) }],
          }
        : {
            copyOpacity: collapsedAt,
            incoming: textElements(rail).map(element => ({
              element,
              frames: (p: number) => ({ opacity: labelsAt(p) }),
            })),
          }
    },
  })
  return {
    end: motion.end,
    shown: () => {
      const now = motion.shown()
      return now == null
        ? null
        : { width: now.extent, labels: labelsAt(now.progress), collapsed: collapsedAt(now.progress) }
    },
  }
}
