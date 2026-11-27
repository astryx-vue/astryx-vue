import type { ResizableProps, ResizableRegion } from '../useResizable.js'

export interface CollapseControls {
  collapse: () => void
  expand: () => void
  /** 带着松手速度（px/s，正负和拖动的位移一致）结束拖动。 */
  release?: (velocity: number) => void
}

/**
 * Enter 和双击要恢复折叠前的尺寸。这个能力不放进导出的 `ResizableProps`，
 * 手写的 props 没有登记，手柄就退回「收到最小值」。
 */
const collapseControls = new WeakMap<ResizableProps, CollapseControls>()

/** 没有配置上限时，分隔条要报的那个最大值。手写 props 不在这张表里。 */
const effectiveMaxima = new WeakMap<ResizableProps, number>()

export function registerResizableChannel(
  props: ResizableProps,
  controls: CollapseControls,
  effectiveMax: number | undefined,
): void {
  collapseControls.set(props, controls)
  if (effectiveMax != null && Number.isFinite(effectiveMax))
    effectiveMaxima.set(props, effectiveMax)
}

export function getCollapseControls(props: ResizableProps): CollapseControls | undefined {
  return collapseControls.get(props)
}

/** 带着松手速度结束 `props` 跟着的拖动；手写的 props 不带速度地结束。 */
export function endResizeAt(props: ResizableProps, velocity: number): void {
  const release = collapseControls.get(props)?.release
  if (release == null)
    props._onResizeEnd()
  else
    release(velocity)
}

export function getEffectiveMaxPx(props: ResizableProps): number | undefined {
  return effectiveMaxima.get(props)
}

/** `resizable` 传的是 `useResizable()` 的返回值（带着 `props`）还是它的 `props`，统一取出 `props`。 */
export function resizablePropsOf<T extends object>(value: ResizableRegion | T): ResizableProps | T {
  return isResizableRegion(value) ? value.props : value
}

function isResizableRegion(value: object): value is ResizableRegion {
  const region = value as Partial<ResizableRegion>
  return typeof region.collapse === 'function' && typeof region.expand === 'function' && region.props?._isResizableProps === true
}

/** 面板旁边紧挨着的那个分隔条：起始侧面板在它后面，结束侧面板在它前面。 */
export function resizeHandleBeside(panel: HTMLElement, area: 'start' | 'end' | null): HTMLElement | null {
  const sibling = area === 'end' ? panel.previousElementSibling : panel.nextElementSibling
  return sibling instanceof HTMLElement && sibling.getAttribute('role') === 'separator' ? sibling : null
}
