/**
 * @file resizablePane.ts
 * @input LayoutPanel 的根元素、它渲染的宽度和朝内容的那条边；motion/layout 的边缘揭示与松手滑动
 * @output LayoutPanel 借元素给 `useResizable` 区域的内部通道（`RegionPaneSlot`）、
 *   区域收起展开时面板的边缘揭示（`createPaneReveal`）、松手后的弹簧滑动（`slideNextOnRelease`）
 * @position Resizable 与 Layout 内部，不从包入口导出；导入时不碰 DOM
 *
 * 只有 `useResizable` 返回的 props 才登记了区域：手写的 props 对象没有区域，面板不滑动。
 * 面板在区域收起或展开前（DOM 变化之前）通知区域量好位置，渲染出新宽度后再播。
 */
import type { ResizableProps } from '../composables/useResizable.js'
import type { LayoutEdge } from '../motion/layout/index.js'
import {
  createAnimatedLayout,
  glideNextChange,
  glideOf,
  landLayoutGlide,
  reportLayoutEdge,
  springGlide,
} from '../motion/layout/index.js'
import { resolveMotion } from '../motion/resolveMotion.js'
import { springs } from '../motion/uikit/springs.js'
import { sharedWeakMap } from '../utils/sharedRealm.js'

export type { LayoutEdge }

/** 面板渲染的宽度：像素、CSS 长度，或没有。 */
export type RenderedPaneWidth = number | string | null | undefined

/** LayoutPanel 借给区域的东西。 */
export interface ResizablePane {
  readonly element: HTMLElement
  /** 面板最近一次渲染出来的宽度。 */
  renderedWidth: () => RenderedPaneWidth
  /** 面板朝内容的那条边，ResizeHandle 就在这一侧。 */
  contentFacingEdge: () => LayoutEdge
}

/** 区域从面板那里听到的事。 */
export interface PaneListener {
  /** 面板要渲染成宽度 0，或从 0 恢复，DOM 变化之前。 */
  beforeChange: (toCollapsed: boolean) => void
  /** 面板每次更新完 DOM 之后。 */
  committed: () => void
}

/**
 * `useResizable` 一个区域的面板插槽。拿到这个区域 props 的 LayoutPanel 挂载时把面板交进来；
 * 拿到 props 的 ResizeHandle 说明当前是不是指针在拖。
 */
export interface RegionPaneSlot {
  /** LayoutPanel 交来它的面板；卸载时传 null。 */
  attach: (pane: ResizablePane | null) => void
  pane: () => ResizablePane | null
  /** 区域订阅面板的变化；传 null 停止。 */
  listen: (listener: PaneListener | null) => void
  beforeChange: (toCollapsed: boolean) => void
  committed: () => void
  /** 指针拖动重新打开面板时跟手、不滑动；方向键的一步照样滑动。 */
  setPointerDragging: (isDragging: boolean) => void
  isPointerDragging: () => boolean
}

export function createRegionPaneSlot(onPaneChange: (pane: ResizablePane | null) => void): RegionPaneSlot {
  let current: ResizablePane | null = null
  let listener: PaneListener | null = null
  let isDragging = false
  return {
    attach(pane) {
      if (pane === current)
        return
      current = pane
      onPaneChange(pane)
    },
    pane: () => current,
    listen(next) {
      listener = next
    },
    beforeChange(toCollapsed) {
      listener?.beforeChange(toCollapsed)
    },
    committed() {
      listener?.committed()
    },
    setPointerDragging(next) {
      isDragging = next
    },
    isPointerDragging: () => isDragging,
  }
}

/** 和收起控制一样不放进导出的 `ResizableProps`：手写的对象没有区域，面板不滑动。 */
const propsRegions = sharedWeakMap<object, RegionPaneSlot>('resizable/resizable-pane/props-regions', 1)

/** `useResizable` 给它返回的每个 props 对象登记所属区域。 */
export function registerPropsRegion(props: ResizableProps, slot: RegionPaneSlot): void {
  propsRegions.set(props, slot)
}

/** `useResizable` 自己的 props 所属的区域；手写对象返回 undefined。 */
export function regionOfProps(props: object): RegionPaneSlot | undefined {
  return propsRegions.get(props)
}

/** 区域给面板播的边缘揭示：DOM 变化前量，面板渲染出新宽度的那次更新后播。 */
export interface PaneReveal {
  measure: (pane: ResizablePane) => void
  committed: (pane: ResizablePane) => void
  /** 量好的或正在播的揭示立刻落地。 */
  land: () => void
}

type EdgeReport = ReturnType<typeof reportLayoutEdge>

/** 在面板所在的那一行上用区域自己的布局动效句柄播，不留副本。 */
export function createPaneReveal(getRow: () => Element | null): PaneReveal {
  let pending: { report: EdgeReport, pane: ResizablePane, widthBefore: RenderedPaneWidth } | null = null
  let played: EdgeReport | null = null
  const layout = createAnimatedLayout(getRow)

  const land = (): void => {
    pending?.report.cancel()
    pending = null
    played?.cancel()
    played = null
    // 面板旁边正在滑的内容一起落地，新的排版上不再有残留动效。
    for (const child of getRow()?.children ?? [])
      landLayoutGlide(child)
  }

  return {
    measure(pane) {
      // 量过却没渲染出来的变化作废；正在播的那段从它显示的位置反向接着走。
      pending?.report.cancel()
      pending = null
      const element = pane.element
      const report = reportLayoutEdge(layout, () => element, { edge: pane.contentFacingEdge() })
      report.measureBefore()
      pending = { report, pane, widthBefore: pane.renderedWidth() }
    },
    committed(pane) {
      if (pending == null || pending.pane !== pane || pane.renderedWidth() === pending.widthBefore)
        return
      const { report } = pending
      pending = null
      played = report
      report.animate()
    },
    land,
  }
}

/**
 * `row` 里下一次滑动按主题节奏的 settle 弹簧走，而不是主题的曲线。
 * 从松手速度 `velocity`（朝终点的 px/s）出发，走 `distance` px。
 * 返回「按滑动开始后的毫秒数，还剩多少比例没走」；什么都不滑时返回 null。
 */
export function slideNextOnRelease(
  row: Element,
  velocity: number,
  distance: number,
): ((elapsedMs: number) => number) | null {
  if (!(distance > 0))
    return null
  const progress = springGlide(resolveMotion(row, springs.settle), velocity / distance)
  glideNextChange(row, progress)
  return elapsedMs => (elapsedMs >= progress.durationMs ? 0 : progress.remaining(elapsedMs))
}

function edgeGeometry(pane: ResizablePane): { isInline: boolean, isForward: boolean } {
  const element = pane.element
  const edge = pane.contentFacingEdge()
  const isInline = edge.startsWith('inline')
  const isRtl = isInline && element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
  return { isInline, isForward: isInline ? edge.endsWith('end') !== isRtl : edge.endsWith('end') }
}

/**
 * 从分隔条画出来的中线读面板的边此刻显示的尺寸，滑动也算在内。
 * 在面板显示 `size` 时量一次。
 */
export function shownSizeReader(pane: ResizablePane, handle: HTMLElement | null, size: number): (() => number) | null {
  if (handle == null)
    return null
  const { isInline, isForward } = edgeGeometry(pane)
  const rect = pane.element.getBoundingClientRect()
  const far = isInline ? (isForward ? rect.left : rect.right) : (isForward ? rect.top : rect.bottom)
  const sign = isForward ? 1 : -1
  const middle = (): number => {
    const box = handle.getBoundingClientRect()
    return isInline ? box.left + box.width / 2 : box.top + box.height / 2
  }
  // 分隔条的中线比面板显示的边多出这么一段。
  const offset = sign * (middle() - far) - size
  return () => Math.max(sign * (middle() - far) - offset, 0)
}

/** 脚本播的动效，不是 CSS 过渡或 CSS 动画。 */
export function isScriptMotion(motion: Animation): boolean {
  return !('transitionProperty' in motion) && !('animationName' in motion)
}

/** 面板此刻滑动的那些动效：旁边在滑的内容，和同一时钟上它自己那条边的动效。滑完后为空。 */
export function slideMotionsOf(pane: ResizablePane): Animation[] {
  const element = pane.element
  const beside = [...(element.parentElement?.children ?? [])]
    .filter(child => child !== element)
    .map(glideOf)
    .filter((motion): motion is Animation => motion != null)
  const durationOf = (motion: Animation): number => Number(motion.effect?.getComputedTiming().duration ?? 0)
  const durationMs = beside.length > 0 ? durationOf(beside[0]!) : null
  const own = typeof element.getAnimations === 'function'
    ? element.getAnimations().filter(motion =>
        isScriptMotion(motion) && (durationMs == null || Math.abs(durationOf(motion) - durationMs) < 1))
    : []
  return [...own, ...beside]
}

export function edgeAxis(pane: ResizablePane): { sign: number, axis: 'x' | 'y' } {
  const { isInline, isForward } = edgeGeometry(pane)
  return { sign: isForward ? 1 : -1, axis: isInline ? 'x' : 'y' }
}
