/**
 * Iconify icon data, the shape published by `@iconify-json/*`.
 *
 * Only the fields the renderer uses are kept. A collection JSON satisfies this
 * interface, so `addCollection` can take the file as it is.
 */
export interface IconifyIcon {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
  rotate?: number
  hFlip?: boolean
  vFlip?: boolean
}

export interface IconifyAlias {
  parent: string
  width?: number
  height?: number
  left?: number
  top?: number
  rotate?: number
  hFlip?: boolean
  vFlip?: boolean
}

export interface IconifyCollection {
  prefix: string
  icons: Record<string, IconifyIcon>
  aliases?: Record<string, IconifyAlias>
  width?: number
  height?: number
}

const ICON_PART = '[a-z0-9]+(?:[-_][a-z0-9]+)*'
const COLON_NAME = new RegExp(`^(${ICON_PART}):(${ICON_PART})$`, 'i')

/**
 * The Vite plugin pushes `[name, data]` pairs here instead of importing
 * `addIcon`. Importing it made the registration call run before this module
 * had finished initializing.
 */
export const ASTRYX_ICON_QUEUE = '__astryxVueIcons' as const

interface IconQueueHost {
  [ASTRYX_ICON_QUEUE]?: Array<[string, IconifyIcon]>
}

const icons = new Map<string, IconifyIcon>()
const collections = new Map<string, IconifyCollection>()
const prefixes = new Set<string>()
const missingWarnings = new Set<string>()

export function knownPrefixes(): string[] {
  return [...prefixes]
}

/**
 * Split an Iconify name.
 *
 * `carbon:settings` is the canonical form. `carbon-settings` is accepted when
 * `carbon` is a known collection prefix. The longest prefix wins, so
 * `material-symbols-home` stays on the `material-symbols` collection instead of
 * being read as `material`.
 */
export function parseIconName(input: string, known: readonly string[] = knownPrefixes()): { prefix: string, name: string } | undefined {
  const value = input.trim()
  const colon = COLON_NAME.exec(value)
  if (colon?.[1] && colon[2])
    return { prefix: colon[1].toLowerCase(), name: colon[2].toLowerCase() }

  const lower = value.toLowerCase()
  const ordered = [...known].sort((a, b) => b.length - a.length)
  for (const prefix of ordered) {
    const normalized = prefix.toLowerCase()
    const head = `${normalized}-`
    if (!lower.startsWith(head) || lower.length === head.length)
      continue
    const name = lower.slice(head.length)
    if (new RegExp(`^${ICON_PART}$`, 'i').test(name))
      return { prefix: normalized, name }
  }
  return undefined
}

function mergeAlias(parent: IconifyIcon, alias: IconifyAlias): IconifyIcon {
  let rotate = ((parent.rotate ?? 0) + (alias.rotate ?? 0)) % 4
  let hFlip = parent.hFlip === true
  let vFlip = parent.vFlip === true
  if (alias.hFlip)
    hFlip = !hFlip
  if (alias.vFlip)
    vFlip = !vFlip
  if (hFlip && vFlip) {
    rotate = (rotate + 2) % 4
    hFlip = false
    vFlip = false
  }
  if (rotate < 0)
    rotate = (rotate % 4 + 4) % 4

  return {
    body: parent.body,
    width: alias.width ?? parent.width,
    height: alias.height ?? parent.height,
    left: alias.left ?? parent.left,
    top: alias.top ?? parent.top,
    rotate: rotate === 0 ? undefined : rotate,
    hFlip: hFlip || undefined,
    vFlip: vFlip || undefined,
  }
}

/**
 * Resolve one icon out of a collection, following aliases.
 *
 * Width and height fall back to the collection defaults, which is how Iconify
 * stores a shared canvas size.
 */
export function resolveCollectionIcon(collection: IconifyCollection | undefined, name: string, seen = new Set<string>()): IconifyIcon | undefined {
  if (collection == null || seen.has(name))
    return undefined
  seen.add(name)

  const direct = collection.icons[name]
  if (direct?.body) {
    return {
      ...direct,
      width: direct.width ?? collection.width,
      height: direct.height ?? collection.height,
    }
  }

  const alias = collection.aliases?.[name]
  if (alias?.parent == null)
    return undefined
  const parent = resolveCollectionIcon(collection, alias.parent, seen)
  if (parent == null)
    return undefined
  return mergeAlias(parent, alias)
}

function remember(prefix: string): void {
  prefixes.add(prefix.toLowerCase())
}

/**
 * Register one icon under its `collection:name` id.
 *
 * Later lookups accept that id and, once the collection prefix is known, the
 * `collection-name` form as well.
 */
export function addIcon(name: string, data: IconifyIcon): void {
  const parsed = parseIconName(name, [])
  if (parsed == null)
    return
  icons.set(`${parsed.prefix}:${parsed.name}`, data)
  remember(parsed.prefix)
}

/** Register every icon in an `@iconify-json` collection. */
export function addCollection(collection: IconifyCollection): void {
  const prefix = collection.prefix.toLowerCase()
  collections.set(prefix, { ...collection, prefix })
  remember(prefix)
}

/** Warn once per name when a rendered icon was never registered. */
export function warnMissingIcon(name: string): void {
  if (missingWarnings.has(name))
    return
  missingWarnings.add(name)
  console.warn(`[astryx-vue] Icon "${name}" is not registered. Install the matching @iconify-json collection and add astryxIcons() to Vite, or call addIcon() / addCollection().`)
}

function drainIconQueue(): void {
  const host = globalThis as IconQueueHost
  const queue = host[ASTRYX_ICON_QUEUE]
  if (queue == null || queue.length === 0)
    return
  host[ASTRYX_ICON_QUEUE] = []
  for (const [name, data] of queue)
    addIcon(name, data)
}

/** The icon data for a name, or `undefined` when nothing has registered it. */
export function getIcon(name: string): IconifyIcon | undefined {
  drainIconQueue()
  const parsed = parseIconName(name)
  if (parsed == null)
    return undefined
  const key = `${parsed.prefix}:${parsed.name}`
  return icons.get(key) ?? resolveCollectionIcon(collections.get(parsed.prefix), parsed.name)
}

/** Drop every registered icon. Tests use this to isolate cases. */
export function resetIcons(): void {
  icons.clear()
  collections.clear()
  prefixes.clear()
  missingWarnings.clear()
  delete (globalThis as IconQueueHost)[ASTRYX_ICON_QUEUE]
}
