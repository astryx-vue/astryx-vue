import type { ScrimFade } from '../sheetDragExit.js'
import type { BottomSheetStackView } from './stackState.js'

/**
 * 宿主按叠放视图写到对话框上的东西：`data-sheet-stack` 属性、后退的类名、遮罩透明度。
 * 独立面板和切换器的每一步共用。
 */

/** 宿主的 `data-sheet-stack` 值：只在叠放时才有。 */
export function stackStateAttribute(
  view: BottomSheetStackView,
  isOpen: boolean,
): 'top' | 'covered' | 'exiting' | 'replaced' | undefined {
  if (!view.isStacked)
    return undefined
  if (!isOpen)
    return view.replacedMotion != null ? 'replaced' : 'exiting'
  return view.isTop ? 'top' : 'covered'
}

/** 叠放后退用的类名：叠放期间一直挂着过渡，回来时也有动画。 */
export function stackRecedeClasses(view: BottomSheetStackView): Record<string, boolean> {
  return {
    'astryx-bottom-sheet-stack-motion': view.isStacked,
    'astryx-bottom-sheet-stack-receded-1': view.depth === 1,
    'astryx-bottom-sheet-stack-receded-2': view.depth >= 2,
  }
}

/** 打开的模态面板的遮罩透明度：一叠只有一层可见的遮罩。 */
export function scrimOpacityForView(view: BottomSheetStackView): '0' | '1' {
  return view.isStacked && !view.ownsScrim ? '0' : '1'
}

/**
 * 把手指拖动关闭时遮罩跟着走的淡出写到对话框上，`fade` 为 `null` 时清掉。`written` 记着自己写的时长，
 * 清的时候只清自己那份：叠放交接写的 `0s` 要留着。
 */
export function writeScrimFade(
  dialog: HTMLDialogElement | null,
  fade: ScrimFade | null,
  written: { current: string | null },
): void {
  if (dialog == null)
    return
  const current = dialog.style.getPropertyValue('--_sheet-scrim-duration')
  if (fade == null) {
    if (written.current != null && current === written.current) {
      dialog.style.removeProperty('--_sheet-scrim-duration')
      dialog.style.removeProperty('--_sheet-scrim-easing')
    }
    written.current = null
    return
  }
  if (current === '0s')
    return
  written.current = `${fade.durationMs}ms`
  dialog.style.setProperty('--_sheet-scrim-duration', written.current)
  dialog.style.setProperty('--_sheet-scrim-easing', fade.easing)
}
