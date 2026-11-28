import { fitDirective, visibleBounds } from './visibleBounds'

const SHIFT_X_VAR = '--component-stage-shift-x'
const SHIFT_Y_VAR = '--component-stage-shift-y'

/**
 * 示例的外层盒子常比画出来的东西大（固定宽度的列表里左对齐的菜单），
 * 盒子居中了，看到的内容仍偏在一边。按实际画出的范围把它平移到画布正中。
 * 某个方向上内容比画布还大（要滚动、要缩放）时，这个方向不动。
 */
function center(stage: HTMLElement): void {
  stage.style.removeProperty(SHIFT_X_VAR)
  stage.style.removeProperty(SHIFT_Y_VAR)
  stage.style.removeProperty('overflow-x')
  stage.style.removeProperty('overflow-y')
  const bounds = visibleBounds(stage)
  if (bounds == null)
    return
  const area = stage.getBoundingClientRect()
  const fitsX = bounds.right - bounds.left <= stage.clientWidth
  const fitsY = bounds.bottom - bounds.top <= stage.clientHeight
  const shiftX = fitsX ? (area.left + area.right) / 2 - (bounds.left + bounds.right) / 2 : 0
  const shiftY = fitsY ? (area.top + area.bottom) / 2 - (bounds.top + bounds.bottom) / 2 : 0
  // 平移后的外壳会被算进窄屏画布的滚动范围，平白多出滚动条；内容放得下的方向不需要滚动，直接裁掉。
  if (Math.abs(shiftX) >= 1) {
    stage.style.setProperty(SHIFT_X_VAR, `${shiftX}px`)
    stage.style.setProperty('overflow-x', 'hidden')
  }
  if (Math.abs(shiftY) >= 1) {
    stage.style.setProperty(SHIFT_Y_VAR, `${shiftY}px`)
    stage.style.setProperty('overflow-y', 'hidden')
  }
}

/** 组件详情页顶部画布的视觉居中：挂在 .component-detail__stage 上。 */
export const vStageCenter = fitDirective(stage => stage.querySelector('.astryx-demo'), center)
