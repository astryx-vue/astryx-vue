/** 结果数的显示文字：数字走本地化的“N 个结果”，字符串原样，没给就空。 */
export function resultCountText(count: number | string | undefined | null, format: (count: number) => string): string {
  if (count == null)
    return ''
  return typeof count === 'number' ? format(count) : count
}

/** 菜单宽度固定时，宽度、最小宽度和最大宽度都锁在同一个值上，且不超过视口上限。 */
export function menuStyleWithWidth<T extends object>(base: T, menuWidth: number | undefined | null): T | (T & Record<'width' | 'minWidth' | 'maxWidth', string>) {
  if (menuWidth == null)
    return base
  const width = `min(${menuWidth}px, var(--astryx-layer-max-inline-size, calc(100vw - 32px)))`
  return { ...base, width, minWidth: width, maxWidth: width }
}
