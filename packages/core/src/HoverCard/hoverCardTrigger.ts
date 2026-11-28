/**
 * 悬停卡片触发器上哪些角色能写 aria-haspopup 和 aria-expanded，以及触发器的 id 合并。
 */

/** ARIA 1.2 里支持 aria-haspopup 的角色（含继承它的子角色）。 */
const HASPOPUP_ROLES = new Set([
  'application',
  'button',
  'combobox',
  'gridcell',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'searchbox',
  'slider',
  'tab',
  'textbox',
  'treeitem',
])

const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'tel', 'url'])

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

/**
 * aria-haspopup 同样只在一部分 role 上合法。没有 role 的触发器（`span`、`time`）不写它，
 * 只在卡片打开时用 aria-controls 指向卡片。
 */
export function supportsAriaHaspopup(element: HTMLElement): boolean {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0]
  if (explicit)
    return HASPOPUP_ROLES.has(explicit)

  switch (element.tagName) {
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    case 'INPUT': {
      const type = (element as HTMLInputElement).type?.toLowerCase() ?? 'text'
      return BUTTON_INPUT_TYPES.has(type) || TEXT_INPUT_TYPES.has(type)
    }
    default:
      return false
  }
}

export function mergeIds(...ids: (string | null | undefined)[]): string | undefined {
  const kept = ids.filter(Boolean)
  return kept.length > 0 ? kept.join(' ') : undefined
}
