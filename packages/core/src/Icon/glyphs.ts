import type { IconName } from './types.js'

/**
 * A name that resolves to built-in artwork: one of the semantic names the
 * components use, or a namespaced key such as `owner:key` that a component
 * owns.
 */
export type IconGlyphName = IconName | `${string}:${string}`

/**
 * The artwork kept for the components' own chrome. Applications bring their own
 * icons; this list only has to cover what astryx-vue draws itself.
 */
export const ICON_GLYPHS = [
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'check',
  'moreHorizontal',
  'copy',
  'calendar',
  'clock',
  'upload',
  'arrowUp',
  'arrowDown',
  'close',
  'funnel',
  'image',
  'search',
  'warning',
  'error',
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
