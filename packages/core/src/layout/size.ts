import type { SpacingStep } from '../Stack/types.js'

/** 间距刻度对应的 CSS 变量。数字是没有主题时的回退像素。 */
export const SPACING_VARIABLES: Record<SpacingStep, string> = {
  0: 'var(--astryx-spacing-0, 0px)',
  0.5: 'var(--astryx-spacing-0-5, 2px)',
  1: 'var(--astryx-spacing-1, 4px)',
  1.5: 'var(--astryx-spacing-1-5, 6px)',
  2: 'var(--astryx-spacing-2, 8px)',
  3: 'var(--astryx-spacing-3, 12px)',
  4: 'var(--astryx-spacing-4, 16px)',
  5: 'var(--astryx-spacing-5, 20px)',
  6: 'var(--astryx-spacing-6, 24px)',
  8: 'var(--astryx-spacing-8, 32px)',
  10: 'var(--astryx-spacing-10, 40px)',
}

export type SizeValue = number | string

export interface PaddingInput {
  padding?: SpacingStep
  paddingInline?: SpacingStep
  paddingInlineStart?: SpacingStep
  paddingInlineEnd?: SpacingStep
  paddingBlock?: SpacingStep
  paddingBlockStart?: SpacingStep
  paddingBlockEnd?: SpacingStep
}

export interface ResolvedPadding {
  inlineStart: SpacingStep
  inlineEnd: SpacingStep
  blockStart: SpacingStep
  blockEnd: SpacingStep
}

export function formatSize(value: SizeValue | null | undefined): string | undefined {
  if (value == null)
    return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export function spacingVariable(step: SpacingStep | null | undefined): string | undefined {
  return step == null ? undefined : SPACING_VARIABLES[step]
}

/**
 * 把统一内边距和各边覆盖收成四条边。
 * 什么都没传时返回 null，调用方继续用主题默认值。
 */
export function resolvePadding(input: PaddingInput, fallback?: SpacingStep): ResolvedPadding | null {
  const base = input.padding ?? fallback
  if (
    base == null
    && input.paddingInline == null
    && input.paddingInlineStart == null
    && input.paddingInlineEnd == null
    && input.paddingBlock == null
    && input.paddingBlockStart == null
    && input.paddingBlockEnd == null
  ) {
    return null
  }

  const inline = input.paddingInline ?? base
  const block = input.paddingBlock ?? base
  return {
    inlineStart: input.paddingInlineStart ?? inline ?? 0,
    inlineEnd: input.paddingInlineEnd ?? inline ?? 0,
    blockStart: input.paddingBlockStart ?? block ?? 0,
    blockEnd: input.paddingBlockEnd ?? block ?? 0,
  }
}

export function paddingVariables(padding: ResolvedPadding): Record<string, string> {
  return {
    '--_pad-inline-start': SPACING_VARIABLES[padding.inlineStart],
    '--_pad-inline-end': SPACING_VARIABLES[padding.inlineEnd],
    '--_pad-block-start': SPACING_VARIABLES[padding.blockStart],
    '--_pad-block-end': SPACING_VARIABLES[padding.blockEnd],
  }
}

/**
 * 只写出被覆盖的边。没写的边继续用样式表里的默认值。
 * 优先级和原版一样：单边 > 轴向 > 统一 padding。
 */
export function spacingEdgeVars(prefix: string, input: PaddingInput): Record<string, string> {
  const style: Record<string, string> = {}
  const set = (edge: string, step: SpacingStep | undefined) => {
    if (step != null)
      style[`${prefix}-${edge}`] = SPACING_VARIABLES[step]
  }
  if (input.padding != null) {
    set('inline-start', input.padding)
    set('inline-end', input.padding)
    set('block-start', input.padding)
    set('block-end', input.padding)
  }
  if (input.paddingInline != null) {
    set('inline-start', input.paddingInline)
    set('inline-end', input.paddingInline)
  }
  if (input.paddingBlock != null) {
    set('block-start', input.paddingBlock)
    set('block-end', input.paddingBlock)
  }
  set('inline-start', input.paddingInlineStart)
  set('inline-end', input.paddingInlineEnd)
  set('block-start', input.paddingBlockStart)
  set('block-end', input.paddingBlockEnd)
  return style
}

/**
 * 百分比和内在宽度没法参与 contentWidth 的居中减法，走约束宽度那条路。
 * 裸的 var() 也走这条路，因为解析结果可能不是长度。
 */
export function supportsInternalContentWidth(width: SizeValue | undefined): boolean {
  if (width == null || typeof width === 'number')
    return true

  const value = width.trim().toLowerCase()
  if (value.includes('%'))
    return false
  return value === '0'
    || /^-?(?:\d+(?:\.\d+)?|\.\d+)[a-z]+$/.test(value)
    || /^(?:calc|min|max|clamp)\(/.test(value)
}
