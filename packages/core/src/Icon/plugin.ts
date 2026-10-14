import type { IconifyCollection, IconifyIcon } from './registry.js'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { ASTRYX_ICON_QUEUE, parseIconName, resolveCollectionIcon } from './registry.js'

const VIRTUAL = 'virtual:astryx-icon/'
const ICON_PART = '[a-z0-9]+(?:[-_][a-z0-9]+)*'

export interface AstryxIconsOptions {
  /**
   * Collection prefixes to read, such as `['carbon']`.
   *
   * When omitted, every `@iconify-json/*` dependency of the project is used.
   */
  collections?: readonly string[]
  /**
   * Read a collection by prefix. The default reads
   * `@iconify-json/<prefix>/icons.json` from the project.
   */
  loadCollection?: (prefix: string, root: string) => IconifyCollection | undefined
}

interface AstryxIconsPlugin {
  name: 'astryx-icons'
  enforce: 'pre'
  configResolved: (config: { root: string }) => void
  resolveId: (id: string) => string | undefined
  load: (id: string) => string | undefined
  transform: (code: string, id: string) => { code: string, map: null } | undefined
}

/**
 * Vite plugin that bundles only the icons a project names in source.
 *
 * A static `name="carbon:settings"` becomes an import of that one icon. The
 * collection JSON stays on disk; the client bundle receives the used bodies.
 * Names built at runtime are invisible here — register those with
 * `addCollection`.
 */
export function astryxIcons(options: AstryxIconsOptions = {}): AstryxIconsPlugin {
  const cache = new Map<string, IconifyCollection | undefined>()
  let root = process.cwd()
  let prefixes: string[] | undefined
  const warned = new Set<string>()

  function load(prefix: string): IconifyCollection | undefined {
    const key = prefix.toLowerCase()
    if (cache.has(key))
      return cache.get(key)
    const loaded = (options.loadCollection ?? readInstalledCollection)(key, root)
    cache.set(key, loaded)
    return loaded
  }

  function availablePrefixes(): string[] {
    prefixes ??= (options.collections ?? discoverPrefixes(root)).map(prefix => prefix.toLowerCase())
    return prefixes
  }

  function resolveSpecifier(raw: string): { prefix: string, name: string } | undefined {
    const parsed = parseIconName(raw, availablePrefixes())
    if (parsed == null || !availablePrefixes().includes(parsed.prefix))
      return undefined
    const collection = load(parsed.prefix)
    if (collection == null) {
      warnMissing(`${parsed.prefix}:${parsed.name}`, `Install @iconify-json/${parsed.prefix}.`)
      return undefined
    }
    if (resolveCollectionIcon(collection, parsed.name) == null) {
      warnMissing(`${parsed.prefix}:${parsed.name}`, 'The collection has no icon by that name.')
      return undefined
    }
    return parsed
  }

  function warnMissing(name: string, detail: string): void {
    if (warned.has(name))
      return
    warned.add(name)
    console.warn(`[astryx-vue] Icon "${name}" was not bundled. ${detail}`)
  }

  return {
    name: 'astryx-icons',
    enforce: 'pre' as const,
    configResolved(config: { root: string }) {
      root = findPackageRoot(config.root)
      cache.clear()
      prefixes = undefined
    },
    resolveId(id: string) {
      if (id.startsWith(VIRTUAL))
        return `\0${id}`
      return undefined
    },
    load(id: string) {
      if (!id.startsWith(`\0${VIRTUAL}`))
        return undefined
      const spec = id.slice(`\0${VIRTUAL}`.length)
      const slash = spec.indexOf('/')
      if (slash <= 0)
        return 'export {}'
      const prefix = spec.slice(0, slash)
      const name = spec.slice(slash + 1)
      const data = resolveCollectionIcon(load(prefix), name)
      if (data == null)
        return 'export {}'
      const payload = iconPayload(data)
      // Queue on globalThis. Importing addIcon here let the bundler run the
      // call before the registry module had initialized.
      const key = JSON.stringify(ASTRYX_ICON_QUEUE)
      return `const queue = (globalThis[${key}] ??= [])\nqueue.push([${JSON.stringify(`${prefix}:${name}`)}, ${JSON.stringify(payload)}])\n`
    },
    transform(code: string, id: string) {
      if (!shouldScan(id))
        return undefined
      const specs = new Map<string, { prefix: string, name: string }>()
      for (const raw of extractIconCandidates(code)) {
        const resolved = resolveSpecifier(raw)
        if (resolved == null)
          continue
        specs.set(`${resolved.prefix}/${resolved.name}`, resolved)
      }
      if (specs.size === 0)
        return undefined
      const lines = [...specs.values()].map((spec) => {
        return `import '${VIRTUAL}${spec.prefix}/${spec.name}'`
      })
      const block = lines.join('\n')
      const filename = id.split('?', 1)[0] ?? id
      const next = filename.endsWith('.vue') ? injectVue(code, block) : injectModule(code, block)
      if (next === code)
        return undefined
      return { code: next, map: null }
    },
  }
}

function iconPayload(data: IconifyIcon): IconifyIcon {
  const payload: IconifyIcon = { body: data.body }
  if (data.width != null)
    payload.width = data.width
  if (data.height != null)
    payload.height = data.height
  if (data.left != null)
    payload.left = data.left
  if (data.top != null)
    payload.top = data.top
  if (data.rotate != null)
    payload.rotate = data.rotate
  if (data.hFlip != null)
    payload.hFlip = data.hFlip
  if (data.vFlip != null)
    payload.vFlip = data.vFlip
  return payload
}

function shouldScan(id: string): boolean {
  if (id.includes('\0') || id.includes('node_modules') || id.includes(VIRTUAL))
    return false
  const [filename, query] = id.split('?', 2)
  // Vue re-requests the script block as `file.vue?vue&type=script`. That block
  // is already plain script; wrapping it again breaks the script transform.
  if (query?.includes('raw') || query?.includes('type='))
    return false
  return /\.(?:vue|[cm]?[jt]sx?)$/.test(filename ?? '')
}

function unwrapLiteral(value: string): string {
  const trimmed = value.trim()
  const quoted = /^(["'`])([\s\S]*)\1$/.exec(trimmed)
  return (quoted?.[2] ?? trimmed).trim()
}

/** Static icon names written as `collection:icon`, or as a `name` binding. */
export function extractIconCandidates(code: string): string[] {
  const found = new Set<string>()
  const colonLiteral = new RegExp(`(["'\`])(${ICON_PART}:${ICON_PART})\\1`, 'gi')
  const nameBinding = /(?:^|[\s<(]):?name\s*=\s*(["'])([\s\S]*?)\1/g
  const nameProperty = /(?:^|[{,\s])name\s*:\s*(["'`])([\s\S]*?)\1/g
  for (const match of code.matchAll(colonLiteral)) {
    if (match[2])
      found.add(match[2])
  }
  for (const pattern of [nameBinding, nameProperty]) {
    for (const match of code.matchAll(pattern)) {
      if (match[2])
        found.add(unwrapLiteral(match[2]))
    }
  }
  return [...found]
}

/**
 * VitePress sets the Vite root to `docs/`, which has no package.json.
 * Walk up to the package that actually depends on `@iconify-json/*`.
 */
export function findPackageRoot(start: string): string {
  let dir = start
  while (true) {
    try {
      readFileSync(join(dir, 'package.json'))
      return dir
    }
    catch {
      const parent = dirname(dir)
      if (parent === dir)
        return start
      dir = parent
    }
  }
}

function discoverPrefixes(root: string): string[] {
  try {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      optionalDependencies?: Record<string, string>
    }
    const names = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
    ]
    return names
      .filter(name => name.startsWith('@iconify-json/'))
      .map(name => name.slice('@iconify-json/'.length))
  }
  catch {
    return []
  }
}

function readInstalledCollection(prefix: string, root: string): IconifyCollection | undefined {
  try {
    const require = createRequire(join(root, 'package.json'))
    const jsonPath = require.resolve(`@iconify-json/${prefix}/icons.json`)
    return JSON.parse(readFileSync(jsonPath, 'utf8')) as IconifyCollection
  }
  catch {
    return undefined
  }
}

function injectVue(code: string, block: string): string {
  if (code.includes(block))
    return code
  const tags = [...code.matchAll(/<script\b[^>]*>/gi)]
  const setup = tags.find(tag => tag[0].includes('setup'))
  const target = setup ?? tags[0]
  if (target?.index != null) {
    const at = target.index + target[0].length
    return `${code.slice(0, at)}\n${block}\n${code.slice(at)}`
  }
  return `<script setup>\n${block}\n</script>\n${code}`
}

function injectModule(code: string, block: string): string {
  if (code.includes(block))
    return code
  return `${block}\n${code}`
}
