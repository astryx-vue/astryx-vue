import type { MoreMenuDivider, MoreMenuItem, MoreMenuOption, MoreMenuSection } from './types.js'

/** Whether an option is a hairline between groups of rows. */
export function isDividerOption(option: MoreMenuOption): option is MoreMenuDivider {
  return 'type' in option && option.type === 'divider'
}

/** Whether an option is a titled group of rows. */
export function isSectionOption(option: MoreMenuOption): option is MoreMenuSection {
  return 'type' in option && option.type === 'section'
}

/** Whether a row reveals a flyout of its own instead of acting. */
export function isSubmenuItem(item: MoreMenuItem): boolean {
  return item.items != null && item.items.length > 0
}
