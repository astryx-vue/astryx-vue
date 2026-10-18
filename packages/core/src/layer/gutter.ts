/** 浮层离视口每条边至少留出的空隙，单位 px。 */
export interface LayerGutter {
  blockStart: number
  blockEnd: number
  inlineStart: number
  inlineEnd: number
}

/**
 * 基础空隙，等于间距刻度 `--astryx-spacing-4`（1rem，通常 16px）。
 * 原版文档里写的是「间距第 4 档和设备安全区取大」。
 */
export const LAYER_BASE_GUTTER = 16

export const ZERO_GUTTER: LayerGutter = {
  blockStart: 0,
  blockEnd: 0,
  inlineStart: 0,
  inlineEnd: 0,
}

let safeAreaCache: LayerGutter | undefined

/**
 * 算出每条边的空隙：基础空隙和安全区取大，再加上调用方给的额外偏移。
 * `inset` 的每一项会被加到对应那条边上。
 */
export function resolveLayerGutter(inset?: Partial<LayerGutter> | null): LayerGutter {
  const safeArea = measureSafeArea()
  return {
    blockStart: Math.max(LAYER_BASE_GUTTER, safeArea.blockStart) + (inset?.blockStart ?? 0),
    blockEnd: Math.max(LAYER_BASE_GUTTER, safeArea.blockEnd) + (inset?.blockEnd ?? 0),
    inlineStart: Math.max(LAYER_BASE_GUTTER, safeArea.inlineStart) + (inset?.inlineStart ?? 0),
    inlineEnd: Math.max(LAYER_BASE_GUTTER, safeArea.inlineEnd) + (inset?.inlineEnd ?? 0),
  }
}

/**
 * 把 CSS 长度写成 px。浏览器直接返回计算后的值；测试环境这类拿不到计算值的地方
 * 按单位粗略换算。
 */
export function measureLength(value: string): number {
  const trimmed = value.trim()
  if (trimmed === '')
    return 0

  if (typeof document !== 'undefined') {
    const probe = document.createElement('div')
    probe.style.cssText = `position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:${trimmed}`
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).paddingTop
    probe.remove()
    const measured = toPx(computed)
    if (measured !== 0)
      return measured
  }

  return toPx(trimmed)
}

function toPx(raw: string): number {
  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value))
    return 0
  const unit = raw.trim().replace(/^[-+0-9.]+/, '')
  if (unit === 'rem')
    return value * rootFontSize()
  if (unit === 'em')
    return value * 16
  return value
}

function rootFontSize(): number {
  if (typeof document === 'undefined')
    return 16
  const size = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  return Number.isFinite(size) && size > 0 ? size : 16
}

/**
 * 读设备安全区。给一个探针元素带上 `env(safe-area-inset-*)`，读回计算后的内边距。
 * 读不到（例如没有安全区的桌面浏览器）时全为 0。
 */
function measureSafeArea(): LayerGutter {
  if (safeAreaCache != null)
    return safeAreaCache
  if (typeof document === 'undefined')
    return ZERO_GUTTER

  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none'
  probe.style.paddingTop = 'env(safe-area-inset-top, 0px)'
  probe.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
  probe.style.paddingLeft = 'env(safe-area-inset-left, 0px)'
  probe.style.paddingRight = 'env(safe-area-inset-right, 0px)'
  document.body.appendChild(probe)
  const style = getComputedStyle(probe)
  const measured: LayerGutter = {
    blockStart: toPx(style.paddingTop),
    blockEnd: toPx(style.paddingBottom),
    inlineStart: toPx(style.paddingLeft),
    inlineEnd: toPx(style.paddingRight),
  }
  probe.remove()

  safeAreaCache = measured
  return measured
}

/** 清掉安全区缓存。屏幕旋转后调用一次。 */
export function resetLayerSafeArea(): void {
  safeAreaCache = undefined
}
