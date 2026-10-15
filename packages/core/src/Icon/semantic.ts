import type { IconName } from './types.js'

/**
 * Semantic name to Iconify id.
 *
 * The names describe the job (close, search, check). The id is the drawing.
 * Lucide matches the upstream themes. A theme replaces any of these, or adds
 * its own keys, through `defineTheme({ icons })`.
 *
 * The drawing is used only after that collection is registered. Until then
 * the built-in glyph stays, so a missing collection does not blank the icon.
 */
export const defaultSemanticIcons = {
  close: 'lucide:x',
  chevronDown: 'lucide:chevron-down',
  chevronLeft: 'lucide:chevron-left',
  chevronRight: 'lucide:chevron-right',
  chevronsLeft: 'lucide:chevrons-left',
  chevronsRight: 'lucide:chevrons-right',
  check: 'lucide:check',
  success: 'lucide:circle-check',
  error: 'lucide:circle-x',
  warning: 'lucide:triangle-alert',
  info: 'lucide:info',
  calendar: 'lucide:calendar',
  clock: 'lucide:clock',
  externalLink: 'lucide:external-link',
  menu: 'lucide:menu',
  moreHorizontal: 'lucide:ellipsis',
  search: 'lucide:search',
  upload: 'lucide:upload',
  arrowUp: 'lucide:arrow-up',
  arrowDown: 'lucide:arrow-down',
  arrowsUpDown: 'lucide:arrow-up-down',
  funnel: 'lucide:funnel',
  eyeSlash: 'lucide:eye-off',
  viewColumns: 'lucide:columns-3',
  copy: 'lucide:copy',
  checkDouble: 'lucide:check-check',
  wrench: 'lucide:wrench',
  stop: 'lucide:square',
  microphone: 'lucide:mic',
  image: 'lucide:image',
} as const satisfies Record<IconName, string>

export type SemanticIconMap = Readonly<Record<string, string>>

/**
 * The Iconify id for a semantic name.
 *
 * Theme entries win, including keys the package does not ship. An unknown
 * name with no theme entry returns undefined, so a CSS class can still pass
 * through `icon`.
 */
export function resolveSemanticIcon(name: string | undefined, icons?: SemanticIconMap): string | undefined {
  if (name == null || name === '')
    return undefined
  const override = icons?.[name]
  if (override)
    return override
  return defaultSemanticIcons[name as IconName]
}
