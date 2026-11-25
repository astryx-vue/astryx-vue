import type { IconVariant, ThemeIconSource } from './themeIcons.js'
import type { IconName, IconSize } from './types.js'
import { devWarn } from '../composables/useDevWarning.js'
import { defaultSemanticIcons } from './semantic.js'

/**
 * The themeable icons components own, by slot. A slot names why an icon is
 * in one component (`<component-kebab>-<role>`), not its artwork. A theme
 * maps a slot to a shared icon name through `defineTheme({ componentIcons })`.
 *
 * The value is `true` for a stateless slot, or the state the component
 * passes to a theme's slot function. A package adds its own slots by
 * augmenting this interface.
 */
export interface ComponentIconSlotMap {
  /** CodeBlock's copy button. `copied` is true while the copied feedback shows. */
  'code-block-copy': { readonly copied: boolean }
  /** A Timestamp hover card row's copy button. */
  'timestamp-copy': { readonly copied: boolean }
  /** A sortable Table column's sort indicator, by the column's sort direction. */
  'table-sort-indicator': { readonly direction: 'ascending' | 'descending' | 'none' }
  /** A Table row's expansion toggle, by whether the row is expanded. */
  'table-row-expand': { readonly expanded: boolean }
}

/** A slot name from the augmentable {@link ComponentIconSlotMap}. */
export type ComponentIconSlotName = keyof ComponentIconSlotMap & string

/**
 * A partial request for a slot's icon. A field left out keeps what the
 * component would draw. `icon: null` hides the icon. `size` changes only the
 * icon, never the control around it.
 */
export interface ComponentIconRequest<Variant extends string = IconVariant> {
  readonly icon?: IconName | null
  readonly variant?: Variant
  readonly size?: IconSize
}

/**
 * A theme's value for a slot: a shared icon name, `null` to hide the icon, a
 * partial request, or, for a slot with state, a pure synchronous function of
 * that state. A function that returns `null` hides the icon; one that
 * returns `undefined` changes nothing.
 */
export type ComponentIconValue<State, Variant extends string = IconVariant>
  = | IconName
    | null
    | ComponentIconRequest<Variant>
    | ((state: Readonly<State>) => ComponentIconRequest<Variant> | null | undefined)

/** A theme's `componentIcons`, keyed by slot. */
export type ComponentIconMap<Variant extends string = IconVariant> = {
  [Slot in ComponentIconSlotName]?: ComponentIconSlotMap[Slot] extends true
    ? IconName | null | ComponentIconRequest<Variant>
    : ComponentIconValue<ComponentIconSlotMap[Slot], Variant>
}

/** The static view of `componentIcons`: names, `null`, and requests. Function slots are left out. */
export type ComponentIconStaticMap = Partial<Record<ComponentIconSlotName, IconName | null | ComponentIconRequest<string>>>

/** A stored slot value, function included. */
export type StoredComponentIconValue
  = | IconName
    | null
    | ComponentIconRequest<string>
    | ((state: never) => ComponentIconRequest<string> | null | undefined)

/** The state a slot's component passes. */
export type ComponentIconSlotState<Slot extends ComponentIconSlotName>
  = ComponentIconSlotMap[Slot] extends true ? undefined : Readonly<ComponentIconSlotMap[Slot]>

/** What a component draws for a slot when the theme maps nothing. */
export interface ResolvedComponentIcon {
  readonly icon: IconName | null
  readonly variant?: string
  readonly size?: IconSize
}

/** The parts of a theme slot resolution reads. */
export interface ComponentIconSource extends Pick<ThemeIconSource, 'iconVariants'> {
  componentIcons?: Readonly<Record<string, unknown>>
  componentIconValues?: Readonly<Record<string, StoredComponentIconValue | undefined>>
}

const ICON_SIZES: ReadonlySet<unknown> = new Set(['xsm', 'sm', 'md', 'lg'])

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && Object.hasOwn(defaultSemanticIcons, value)
}

function isDevBuild(): boolean {
  return (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
}

const warned = new Set<string>()

/**
 * One development warning per slot and problem. Formatting a value that
 * cannot be serialized never throws, and production builds skip it.
 */
function warnMalformed(slot: string, prefix: string, value: unknown, suffix = ''): void {
  if (!isDevBuild())
    return
  let formatted: string
  try {
    formatted = JSON.stringify(value) ?? String(value)
  }
  catch {
    formatted = '[unserializable value]'
  }
  const problem = `${prefix} ${formatted}${suffix}`
  const key = `${slot}:${problem}`
  if (warned.has(key))
    return
  warned.add(key)
  devWarn('Icon', `componentIcons["${slot}"] ${problem}. The component keeps its own value for that field.`)
}

function applyRequest(
  slot: string,
  fallback: ResolvedComponentIcon,
  request: unknown,
  theme: ComponentIconSource | null | undefined,
): ResolvedComponentIcon {
  if (request === undefined)
    return fallback
  if (request === null)
    return { ...fallback, icon: null }
  if (typeof request !== 'object' || Array.isArray(request)) {
    warnMalformed(slot, 'returned', request, ', which is not a request')
    return fallback
  }
  const { icon, variant, size } = request as Record<string, unknown>
  let resolved = fallback
  if (icon === null || isIconName(icon))
    resolved = { ...resolved, icon }
  else if (icon !== undefined)
    warnMalformed(slot, 'requests the unknown icon', icon)
  if (typeof variant === 'string' && theme?.iconVariants?.includes(variant))
    resolved = { ...resolved, variant }
  else if (variant !== undefined)
    warnMalformed(slot, 'requests the variant', variant, ', which the theme does not list')
  if (ICON_SIZES.has(size))
    resolved = { ...resolved, size: size as IconSize }
  else if (size !== undefined)
    warnMalformed(slot, 'requests the unsupported size', size)
  return resolved
}

/**
 * Resolve a component's icon slot: the theme's `componentIcons[slot]`
 * applied to the component's own fallback, field by field.
 *
 * A shared icon name replaces the fallback icon, `null` hides it, and a
 * request applies field by field. A slot function receives the state; its
 * `null` hides the icon and its `undefined` changes nothing. A malformed
 * field is ignored with one development warning and the valid fields beside
 * it still apply.
 */
export function resolveComponentIcon(
  slot: string,
  state: unknown,
  fallback: ResolvedComponentIcon,
  theme: ComponentIconSource | null | undefined,
): ResolvedComponentIcon {
  const values = theme?.componentIconValues ?? theme?.componentIcons
  const value = values?.[slot]
  if (value === undefined)
    return fallback
  if (typeof value === 'function') {
    const result: unknown = (value as (state: unknown) => unknown)(state)
    if (typeof result === 'string') {
      warnMalformed(slot, 'returned', result, ', which is not a request')
      return fallback
    }
    return applyRequest(slot, fallback, result, theme)
  }
  if (typeof value === 'string')
    return applyRequest(slot, fallback, { icon: value }, theme)
  return applyRequest(slot, fallback, value, theme)
}

/**
 * A theme's slot values: the base's, then its own, by slot. An own entry
 * replaces the inherited one whole; an `undefined` entry keeps it.
 */
export function mergeComponentIcons(
  inherited: Readonly<Record<string, StoredComponentIconValue | undefined>> | undefined,
  own: object | undefined,
): Record<string, StoredComponentIconValue | undefined> | undefined {
  if (own == null)
    return inherited
  const merged: Record<string, StoredComponentIconValue | undefined> = { ...inherited }
  for (const [slot, value] of Object.entries(own)) {
    if (value !== undefined)
      merged[slot] = value as StoredComponentIconValue
  }
  return merged
}

/** The static view of slot values, without slot functions. */
export function staticComponentIcons(
  values: Readonly<Record<string, StoredComponentIconValue | undefined>> | undefined,
): ComponentIconStaticMap | undefined {
  if (values == null)
    return undefined
  const view: Record<string, unknown> = {}
  for (const [slot, value] of Object.entries(values)) {
    if (typeof value !== 'function' && value !== undefined)
      view[slot] = value
  }
  return view as ComponentIconStaticMap
}
