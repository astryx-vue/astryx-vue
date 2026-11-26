/**
 * 悬停卡片触发器上哪些角色能写 aria-expanded，以及触发器的 id 合并。
 */

const EXPANDABLE_ROLES = new Set([
  'application',
  'button',
  'checkbox',
  'columnheader',
  'combobox',
  'gridcell',
  'link',
  'listbox',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'row',
  'rowheader',
  'switch',
  'tab',
  'treeitem',
])

const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image'])

/**
 * aria-expanded 只在一部分 role 上合法。没有 role 的触发器只靠 aria-haspopup
 * 和 aria-controls 宣告弹层。写在不合法的地方就是 aria-allowed-attr 缺陷。
 */
export function supportsAriaExpanded(element: HTMLElement): boolean {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0]
  if (explicit)
    return EXPANDABLE_ROLES.has(explicit)

  switch (element.tagName) {
    case 'BUTTON':
    case 'SUMMARY':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    case 'INPUT':
      return BUTTON_INPUT_TYPES.has((element as HTMLInputElement).type?.toLowerCase())
    case 'SELECT':
      return true
    default:
      return false
  }
}

export function mergeIds(...ids: (string | null | undefined)[]): string | undefined {
  const kept = ids.filter(Boolean)
  return kept.length > 0 ? kept.join(' ') : undefined
}
