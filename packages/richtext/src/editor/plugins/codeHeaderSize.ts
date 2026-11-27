/** 代码块的主题类用它给标题栏留出画出来的高度。 */
export const HEADER_BLOCK_SIZE = '--_richtext-code-header-block-size'
/** 代码块的主题类用它定最小宽度：至少和标题栏自己一样宽，core 的外框也是长到装得下标题栏。 */
export const HEADER_INLINE_SIZE = '--_richtext-code-header-inline-size'

/** 画出来的语言标题栏和它的标签。 */
export interface HeaderParts {
  header: HTMLElement
  title: HTMLElement
}

export interface CanvasHolder {
  current: CanvasRenderingContext2D | null | undefined
}

/**
 * 标题栏里标签排成一行时的宽度：两侧内边距、控件间的间隙、标签旁的控件，加上标签那一行的宽度。
 */
function naturalWidth({ header, title }: HeaderParts, label: number): number {
  const style = getComputedStyle(header)
  // 控件的提示层、标记和对话框在标题栏里和控件并排，却不占这一行的位置。
  const others = [...header.children].filter(
    child => child !== title && !child.matches('[popover], template, dialog'),
  )
  const gap = Number.parseFloat(style.columnGap) || 0
  return (
    (Number.parseFloat(style.paddingInlineStart) || 0)
    + (Number.parseFloat(style.paddingInlineEnd) || 0)
    + others.reduce((sum, child) => sum + (child as HTMLElement).offsetWidth, 0)
    + gap * others.length
    + label
  )
}

/**
 * 标签文字排成一行的宽度（按它自己的字体），没有画布能量文字时（没有排版的 DOM）返回 null。
 * 字体由各个长手写属性拼出来：Chromium 在文字继承了 font-variant、font-feature-settings
 * 或字距时会把 `font` 简写返回成空串。字母间距按字符数另加。
 */
function oneLineWidth(title: HTMLElement, canvas: CanvasHolder): number | null {
  if (canvas.current === undefined)
    canvas.current = document.createElement('canvas').getContext('2d')
  const context = canvas.current
  if (context == null)
    return null
  const style = getComputedStyle(title)
  if (style.fontSize === '' || style.fontFamily === '')
    return null
  context.font = [style.fontStyle, style.fontWeight, style.fontSize]
    .filter(part => part !== '')
    .concat(style.fontFamily)
    .join(' ')
  const text = title.textContent ?? ''
  const spacing = style.letterSpacing === 'normal' ? 0 : Number.parseFloat(style.letterSpacing) || 0
  return context.measureText(text).width + spacing * text.length
}

/**
 * 把标题栏画出来的高度和标签排成一行时的宽度（含代码块边框）写到代码块上：
 * 代码块的上内边距按高度给标题栏留位置，最小宽度取标题栏自己的宽度。
 */
export function writeHeaderSize(block: HTMLElement, parts: HeaderParts, canvas: CanvasHolder): void {
  const height = `${parts.header.offsetHeight}px`
  if (block.style.getPropertyValue(HEADER_BLOCK_SIZE) !== height)
    block.style.setProperty(HEADER_BLOCK_SIZE, height)
  const label = oneLineWidth(parts.title, canvas)
  if (label === null)
    return
  const border = block.offsetWidth - block.clientWidth
  const width = `${Math.ceil(naturalWidth(parts, label) + border)}px`
  if (block.style.getPropertyValue(HEADER_INLINE_SIZE) !== width)
    block.style.setProperty(HEADER_INLINE_SIZE, width)
}

export function clearHeaderSize(block: HTMLElement | null): void {
  block?.style.removeProperty(HEADER_BLOCK_SIZE)
  block?.style.removeProperty(HEADER_INLINE_SIZE)
}
