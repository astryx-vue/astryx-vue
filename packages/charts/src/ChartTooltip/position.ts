import type { ChartTooltipPlacement } from './types.js'

/** 卡片贴住视口边缘时至少留这么多像素。 */
export const CARD_GAP = 8

export interface CardPositionInput {
  /** 卡片左上角贴着悬停点时，在视口里的位置 */
  anchorLeft: number
  anchorTop: number
  /** 卡片自身的尺寸 */
  width: number
  height: number
  /** 视口尺寸 */
  viewportWidth: number
  viewportHeight: number
}

/**
 * 算提示卡片在视口里的坐标。`auto` 默认放右边，右边放不下就翻到左边；
 * 最后四边都夹进视口内，免得卡片被裁掉。
 */
export function computeCardPosition(
  input: CardPositionInput,
  placement: ChartTooltipPlacement,
): { x: number, y: number } {
  const { anchorLeft, anchorTop, width, height, viewportWidth, viewportHeight } = input

  let x: number
  let y = anchorTop
  switch (placement) {
    case 'left':
      x = anchorLeft - width - CARD_GAP
      break
    case 'right':
      x = anchorLeft + CARD_GAP
      break
    case 'top':
      x = anchorLeft - width / 2
      y = anchorTop - height - CARD_GAP
      break
    case 'auto':
    default: {
      const right = anchorLeft + CARD_GAP
      x = right + width > viewportWidth ? anchorLeft - width - CARD_GAP : right
    }
  }

  return {
    x: Math.max(CARD_GAP, Math.min(x, viewportWidth - width - CARD_GAP)),
    y: Math.max(CARD_GAP, Math.min(y, viewportHeight - height - CARD_GAP)),
  }
}
