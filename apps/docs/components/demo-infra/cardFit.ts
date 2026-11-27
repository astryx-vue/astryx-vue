import { fitDirective, visibleBounds } from './visibleBounds'

/** 缩得再小就看不清了，到这个比例为止。 */
const MIN_SCALE = 0.25
/** 卡片四周的留白，按缩小后的屏幕像素算。 */
const GUTTER = 16
const SCALE_VAR = '--component-card-scale'
const SHIFT_X_VAR = '--component-card-shift-x'
const SHIFT_Y_VAR = '--component-card-shift-y'
function setVars(frame: HTMLElement, scale: number, shiftX: number, shiftY: number): void {
  frame.style.setProperty(SCALE_VAR, String(scale))
  frame.style.setProperty(SHIFT_X_VAR, `${shiftX}px`)
  frame.style.setProperty(SHIFT_Y_VAR, `${shiftY}px`)
}

/**
 * 让卡片里看得见的部分完整显示、上下左右都居中，四周留出 GUTTER。
 * 示例的外层盒子常比画出来的东西大（占满宽度的列表、固定宽度的代码块、贴底的工具栏），
 * 所以按实际画出的范围算：放不下就把比例调小，偏了就整体平移。
 * 每次都从 CSS 的基准比例重新算，卡片变宽变窄（换断点）时会重新适配。
 */
function fit(frame: HTMLElement): void {
  const preview = frame.querySelector<HTMLElement>('.component-card__preview')
  if (preview?.firstElementChild == null)
    return
  frame.style.removeProperty(SCALE_VAR)
  frame.style.removeProperty(SHIFT_X_VAR)
  frame.style.removeProperty(SHIFT_Y_VAR)
  let scale = Number.parseFloat(getComputedStyle(frame).getPropertyValue(SCALE_VAR)) || 1
  let shiftX = 0
  let shiftY = 0
  for (let round = 0; round < 4; round++) {
    const area = frame.getBoundingClientRect()
    const bounds = visibleBounds(preview)
    if (bounds == null || area.width === 0)
      return
    const width = bounds.right - bounds.left
    const height = bounds.bottom - bounds.top
    const ratio = Math.min(1, (area.width - 2 * GUTTER) / width, (area.height - 2 * GUTTER) / height)
    const offsetX = (area.left + area.right) / 2 - (bounds.left + bounds.right) / 2
    const offsetY = (area.top + area.bottom) / 2 - (bounds.top + bounds.bottom) / 2
    if (ratio >= 0.995 && Math.abs(offsetX) < 1 && Math.abs(offsetY) < 1)
      return
    // 平移量写在画布坐标里，换算回去要除以当前比例。
    shiftX += offsetX / scale
    shiftY += offsetY / scale
    if (ratio < 0.995 && scale > MIN_SCALE) {
      scale = Math.max(MIN_SCALE, scale * ratio)
      // 比例变了，画布跟着变大，内容的位置会重新排，平移从头算。
      shiftX = 0
      shiftY = 0
    }
    setVars(frame, scale, shiftX, shiftY)
  }
}

/** 总览卡片的自适应：挂在 .component-card__frame 上。 */
export const vCardFit = fitDirective(frame => frame.querySelector('.component-card__preview')?.firstElementChild, fit)
