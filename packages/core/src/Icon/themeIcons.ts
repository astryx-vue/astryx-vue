import type { IconSize } from './types.js'

/**
 * Icon variant names an application uses. Astryx defines none: a theme lists
 * the names it supports in `defineTheme({ iconVariants })`, and an
 * application augments this map with the names it requests.
 *
 * @example
 * ```ts
 * declare module '@astryx-vue/core/Icon' {
 *   interface IconVariantMap {
 *     outline: true
 *     filled: true
 *   }
 * }
 * ```
 */
export interface IconVariantMap {}

/** A variant name from the augmentable {@link IconVariantMap}. */
export type IconVariant = keyof IconVariantMap & string

/**
 * What `Icon` asks a function entry for: the size it renders at (explicit
 * `size`, then the owning component's default, then `md`) and a variant the
 * entry can receive, or none.
 */
export interface IconRequest<Variant extends string = IconVariant> {
  readonly size: IconSize
  readonly variant?: Variant
}

/**
 * A theme's icon entry: an Iconify id, or a pure synchronous function of the
 * {@link IconRequest} that returns one.
 *
 * A function reads only the request: no composables, DOM measurement,
 * browser globals, or mutable state. Its result is final: `null`,
 * `undefined`, or an empty string draws no glyph instead of falling back to
 * the built-in id.
 */
export type ThemeIconEntry<Variant extends string = IconVariant>
  = | string
    | ((request: IconRequest<Variant>) => string | null | undefined)

/** A theme's icon entries by semantic name or namespaced key. */
export type ThemeIconEntries<Variant extends string = IconVariant> = Readonly<Record<string, ThemeIconEntry<Variant>>>

/** How resolution holds any entry, whatever variant names it was typed for. */
export type StoredIconEntry = ThemeIconEntry<never>

/** The size every one-argument read uses: `useSemanticIcon`, `theme.icons`. */
export const PUBLIC_ICON_REQUEST: IconRequest<never> = { size: 'md' }

/** The parts of a theme that icon resolution reads. */
export interface ThemeIconSource {
  icons?: Readonly<Record<string, string>>
  iconEntries?: Readonly<Record<string, StoredIconEntry>>
  iconVariants?: readonly string[]
  iconEntryVariants?: Readonly<Record<string, readonly string[] | undefined>>
}

/**
 * The Iconify id a theme maps a name to for one request.
 *
 * - `undefined`: the theme does not map the name, so the built-in id stays.
 * - `null`: a function entry answered with nothing, which is final.
 * - a string: the id to draw.
 *
 * A function entry receives `variant` only when the active theme lists it
 * and, for an inherited entry, the theme that defined the entry lists it too.
 */
export function resolveThemeIcon(
  name: string,
  theme: ThemeIconSource | null | undefined,
  request: IconRequest<string>,
): string | null | undefined {
  const entry = theme?.iconEntries?.[name] ?? theme?.icons?.[name]
  if (entry == null || entry === '')
    return undefined
  if (typeof entry === 'string')
    return entry
  const active = theme?.iconVariants
  const owners = theme?.iconEntryVariants
  const defining = owners != null && Object.hasOwn(owners, name) ? owners[name] : active
  const { size, variant } = request
  const receivable = variant !== undefined
    && active?.includes(variant) === true
    && defining?.includes(variant) === true
  const result = entry((receivable ? { size, variant } : { size }) as IconRequest<never>)
  return typeof result === 'string' && result !== '' ? result : null
}

/**
 * The id view of a theme's entries: each function read at `md`. An entry
 * that answers nothing at `md` is left out. Entries without a function come
 * back as the same object.
 */
export function readThemeIconIds(
  entries: Readonly<Record<string, StoredIconEntry>> | undefined,
): Readonly<Record<string, string>> | undefined {
  if (entries == null || !Object.values(entries).some(entry => typeof entry === 'function'))
    return entries as Readonly<Record<string, string>> | undefined
  const ids: Record<string, string> = {}
  for (const [name, entry] of Object.entries(entries)) {
    const id = typeof entry === 'function' ? entry(PUBLIC_ICON_REQUEST) : entry
    if (typeof id === 'string' && id !== '')
      ids[name] = id
  }
  return ids
}

/**
 * For each function entry a theme inherits, the variant list of the theme
 * that defined it, where that list is not the theme's own. Entries the theme
 * defines itself use its own list and need no record.
 */
export function resolveIconEntryVariants(
  entries: Readonly<Record<string, StoredIconEntry>> | undefined,
  ownEntries: Readonly<Record<string, unknown>> | undefined,
  base: ThemeIconSource | undefined,
  iconVariants: readonly string[] | undefined,
): Record<string, readonly string[] | undefined> | undefined {
  if (entries == null || base == null)
    return undefined
  const baseRecord = base.iconEntryVariants
  let record: Record<string, readonly string[] | undefined> | undefined
  for (const [name, entry] of Object.entries(entries)) {
    if (typeof entry !== 'function' || (ownEntries != null && Object.hasOwn(ownEntries, name)))
      continue
    const defining = baseRecord != null && Object.hasOwn(baseRecord, name)
      ? baseRecord[name]
      : base.iconVariants
    if (defining !== iconVariants) {
      record ??= {}
      record[name] = defining
    }
  }
  return record
}
