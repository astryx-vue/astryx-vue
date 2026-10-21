import type { AvatarSize, AvatarStatusDotVariant, AvatarStatusDotVariantName } from './types.js'

const INITIAL_CHARACTER = /[\p{L}\p{N}\p{Extended_Pictographic}\p{Regional_Indicator}]/u

const characterSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null

/** 用户眼里的第一个字，避免把表情切成半个。 */
function firstCharacter(value: string): string {
  if (characterSegmenter != null) {
    const first = characterSegmenter.segment(value)[Symbol.iterator]().next()
    return first.done ? '' : first.value.segment
  }
  const codePoint = value.codePointAt(0)
  return codePoint == null ? '' : String.fromCodePoint(codePoint)
}

/** 跳过词首的标点，取第一个能代表这个词的字母、数字或表情。 */
function initialCharacter(word: string): string {
  const index = word.search(INITIAL_CHARACTER)
  return index === -1 ? '' : firstCharacter(word.slice(index))
}

/**
 * 用名字生成首字母：取第一个词和最后一个词里能站出来的那个字。
 * 纯标点的词跳过。没有任何可用字符时返回空字符串，调用方改画默认图标。
 */
export function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .map(initialCharacter)
    .filter(initial => initial !== '')

  if (initials.length === 0)
    return ''
  if (initials.length === 1)
    return initials[0]!.toUpperCase()
  return `${initials[0]!.toUpperCase()}${initials[initials.length - 1]!.toUpperCase()}`
}

export function resolveSize(size: AvatarSize): number {
  if (typeof size === 'number') {
    return size
  }
  switch (size) {
    case 'xsm':
      return 20
    case 'sm':
      return 24
    case 'md':
      return 36
    case 'lg':
      return 48
    case 'xl':
      return 128
  }
}

/** 状态点在头像尺寸上分三档，档位决定点的大小、描边粗细和图标尺寸。 */
export interface AvatarStatusDotMetrics {
  /** 圆点连边框在内的直径。 */
  size: number
  /** 圆点边框粗细，也是白圈（或页面底色圈）的宽度。 */
  borderWidth: number
  /** 中间图标的最大边长。0 表示这一档画不出图标。 */
  iconSize: number
  /** 边框里面那块能画形状的净空，等于 `size - borderWidth * 2`。 */
  field: number
  /** 自带形状（空心环、减号）的线宽。 */
  stroke: number
}

/**
 * 按头像尺寸给出圆点尺寸。
 *
 * 用固定档位而不是等比缩放，是为了让每一档都落在整数像素上、看起来是刻意画的：
 *
 *   | 头像尺寸 | 圆点 | 边框 | 图标 | 线条 |
 *   |----------|------|------|------|------|
 *   | ≤ 36px   | 10px | 1px  | —    | 1px  |
 *   | 37–72px  | 20px | 2px  | 12px | 1.5px|
 *   | ≥ 73px   | 32px | 4px  | 18px | 2px  |
 *
 * 最小一档不画图标：10px 里塞图标看不清。自带的形状照画，所以任何尺寸下状态
 * 都能不靠颜色分辨。
 */
export function resolveStatusDotMetrics(avatarSize: number): AvatarStatusDotMetrics {
  const metrics = (size: number, borderWidth: number, iconSize: number, stroke: number): AvatarStatusDotMetrics => ({
    size,
    borderWidth,
    iconSize,
    field: size - borderWidth * 2,
    stroke,
  })

  if (avatarSize <= 36) {
    return metrics(10, 1, 0, 1)
  }
  if (avatarSize <= 72) {
    return metrics(20, 2, 12, 1.5)
  }
  return metrics(32, 4, 18, 2)
}

/** 把 `info` / `warning` 这类旧名字换成现在的语义变体。 */
export function resolveStatusDotVariant(variant: AvatarStatusDotVariant): AvatarStatusDotVariantName {
  switch (variant) {
    case 'info':
      return 'success'
    case 'warning':
      return 'error'
    default:
      return variant
  }
}

/**
 * 拼出头像的无障碍名称：名字和状态都有时按语言包的拼接文案拼
 * （英文「Jane Doe, Online」，中文「Jane Doe，在线」），否则取有的那一个。
 */
export function composeAccessibleName(
  name: string | undefined,
  status: string | undefined,
  join: (name: string, status: string) => string,
): string | undefined {
  if (name && status) {
    return join(name, status)
  }
  return name ?? status
}
