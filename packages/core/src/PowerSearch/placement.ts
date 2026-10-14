export const EDITOR_MIN_WIDTH = 400
export const EDITOR_MAX_WIDTH = 720

export interface EditorBox {
  left: number
  right: number
  width: number
}

export interface EditorPlacementInput {
  outer: EditorBox
  control: EditorBox
  viewportWidth: number
  direction: 'ltr' | 'rtl'
  /** 视口左右各留出的安全距离。 */
  viewportInset?: number
}

export interface EditorPlacement {
  width: number
  /** 编辑器比外层窄，需要对齐到打开它的控件靠近的那一侧。 */
  capped: boolean
  edge: 'left' | 'right'
  top: number
  left: number
}

/**
 * 编辑器宽度取外层宽度，再夹在 400 到 720 之间。
 * 视口放不下 400 时，下限让给视口。只有被 720 压窄时，才改贴打开控件更近的外缘。
 */
export function resolveEditorPlacement(input: EditorPlacementInput & { anchorTop: number, anchorBottom: number, viewportHeight: number }): EditorPlacement {
  const inset = input.viewportInset ?? 8
  const available = Math.max(0, input.viewportWidth - inset * 2)
  const floor = Math.min(EDITOR_MIN_WIDTH, available)
  const ceiling = Math.min(EDITOR_MAX_WIDTH, available)
  let width = input.outer.width
  if (width < floor)
    width = floor
  if (width > ceiling)
    width = ceiling

  const capped = width + 0.5 < input.outer.width
  let edge: 'left' | 'right'
  if (!capped) {
    edge = input.direction === 'rtl' ? 'right' : 'left'
  }
  else {
    const gapLeft = input.control.left - input.outer.left
    const gapRight = input.outer.right - input.control.right
    if (gapLeft < gapRight)
      edge = 'left'
    else if (gapRight < gapLeft)
      edge = 'right'
    else
      edge = input.direction === 'rtl' ? 'right' : 'left'
  }

  let left = edge === 'left' ? input.outer.left : input.outer.right - width
  const maxLeft = input.viewportWidth - inset - width
  if (left < inset)
    left = inset
  if (left > maxLeft)
    left = Math.max(inset, maxLeft)

  const gap = 4
  const estimatedHeight = 280
  let top = input.anchorBottom + gap
  if (top + estimatedHeight > input.viewportHeight - inset && input.anchorTop - gap - estimatedHeight > inset)
    top = input.anchorTop - gap - estimatedHeight

  return { width, capped, edge, top, left }
}
