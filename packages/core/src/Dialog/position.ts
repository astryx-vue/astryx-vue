import type { DialogPosition } from './types.js'

function formatPosition(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 把 {@link DialogPosition} 映射为 CSS 偏移。未设置的偏移回退为 `auto`。
 */
export function resolveDialogPositionOffsets(position: DialogPosition): {
  top: string
  bottom: string
  insetInlineStart: string
  insetInlineEnd: string
} {
  const { top, bottom, start, end } = position
  return {
    top: top !== undefined ? formatPosition(top) : 'auto',
    bottom: bottom !== undefined ? formatPosition(bottom) : 'auto',
    insetInlineStart: start !== undefined ? formatPosition(start) : 'auto',
    insetInlineEnd: end !== undefined ? formatPosition(end) : 'auto',
  }
}

export function formatDialogSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}
