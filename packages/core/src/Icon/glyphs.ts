import type { IconName, NamespacedIconName } from './types.js'

/**
 * A name that resolves to built-in artwork: one of the semantic names the
 * components use, or a namespaced key such as `owner:key` that a component
 * owns.
 */
export type IconGlyphName = IconName | NamespacedIconName

/**
 * The artwork kept for the components' own chrome. Applications bring their own
 * icons; this list only has to cover what astryx-vue draws itself.
 *
 * The shared names come first. Namespaced keys after them belong to one
 * component each; a theme overrides them by key through `defineTheme({ icons })`.
 */
export const ICON_GLYPHS = [
  'close',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'chevronsLeft',
  'chevronsRight',
  'check',
  'success',
  'error',
  'warning',
  'info',
  'calendar',
  'clock',
  'externalLink',
  'menu',
  'moreHorizontal',
  'search',
  'upload',
  'arrowUp',
  'arrowDown',
  'arrowsUpDown',
  'funnel',
  'eyeSlash',
  'viewColumns',
  'copy',
  'checkDouble',
  'wrench',
  'stop',
  'microphone',
  'image',
  'numberInput:stepperDown',
] as const satisfies readonly IconGlyphName[]

export function isIconGlyph(value: string): value is IconGlyphName {
  return (ICON_GLYPHS as readonly string[]).includes(value)
}

/** The CSS-safe form of a name, used as the `astryx-icon--<slug>` class. */
export function iconGlyphSlug(name: IconGlyphName): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/:/g, '-')
    .toLowerCase()
}
