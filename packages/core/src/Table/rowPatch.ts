import type { TablePlugin, TableRowListeners, TableRowMenuItem, TableRowPatch } from './types.js'

/**
 * 把多个插件的行事件合成一个处理器，按插件顺序依次调用。
 * 每个事件单独合并，插件只给其中一个事件时其余事件不受影响。
 */
function mergeListeners(sources: readonly TableRowListeners[]): TableRowListeners | undefined {
  if (sources.length === 0)
    return undefined

  const enters = sources.map(source => source.onMouseenter).filter(handler => handler != null)
  const leaves = sources.map(source => source.onMouseleave).filter(handler => handler != null)
  const focuses = sources.map(source => source.onFocus).filter(handler => handler != null)
  const blurs = sources.map(source => source.onBlur).filter(handler => handler != null)

  const merged: TableRowListeners = {}
  if (enters.length > 0)
    merged.onMouseenter = (event) => { for (const handler of enters) handler(event) }
  if (leaves.length > 0)
    merged.onMouseleave = (event) => { for (const handler of leaves) handler(event) }
  if (focuses.length > 0)
    merged.onFocus = (event) => { for (const handler of focuses) handler(event) }
  if (blurs.length > 0)
    merged.onBlur = (event) => { for (const handler of blurs) handler(event) }
  return merged
}

/**
 * 收集所有插件对这一行的贡献。分组头、展开面板、是否参与选择这类二选一的字段以第一个给出
 * 结果的插件为准，类名、属性、事件、行元素回调、右键菜单则依次叠加。
 */
export function mergeRowPatches<T extends Record<string, unknown>>(
  plugins: readonly TablePlugin<T>[],
  row: T,
  index: number,
  columnCount: number,
): TableRowPatch {
  const classes: string[] = []
  const clicks: Array<(event: MouseEvent) => void> = []
  const refs: Array<(element: HTMLTableRowElement | null) => void> = []
  const menus: TableRowMenuItem[] = []
  const listeners: TableRowListeners[] = []
  const merged: TableRowPatch = {}

  for (const plugin of plugins) {
    const patch = plugin.rowPatch?.(row, index, columnCount)
    if (patch == null)
      continue
    if (patch.group && merged.group == null)
      merged.group = patch.group
    if (patch.panel && merged.panel == null)
      merged.panel = patch.panel
    if (patch.suppressSelection)
      merged.suppressSelection = true
    if (patch.skipRowIndex)
      merged.skipRowIndex = true
    if (patch.class)
      classes.push(patch.class)
    if (patch.attrs)
      merged.attrs = { ...merged.attrs, ...patch.attrs }
    if (patch.onClick)
      clicks.push(patch.onClick)
    if (patch.ref)
      refs.push(patch.ref)
    if (patch.listeners)
      listeners.push(patch.listeners)
    if (patch.menu)
      menus.push(...patch.menu)
  }

  merged.class = classes.join(' ') || undefined
  merged.menu = menus
  merged.listeners = mergeListeners(listeners)

  if (clicks.length > 0) {
    merged.onClick = (event) => {
      for (const click of clicks)
        click(event)
    }
  }
  if (refs.length > 0) {
    merged.ref = (element) => {
      for (const callback of refs)
        callback(element)
    }
  }
  return merged
}
