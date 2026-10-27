import type { ResizableProps } from '../useResizable.js'

export interface CollapseControls {
  collapse: () => void
  expand: () => void
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

export function getEffectiveMaxPx(props: ResizableProps): number | undefined {
  return effectiveMaxima.get(props)
}
