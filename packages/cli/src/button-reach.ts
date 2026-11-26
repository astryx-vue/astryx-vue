import type { SourceFile } from './project.ts'
import type { TemplateElement } from './vue-template.ts'
import { posix } from 'node:path'
import { attrKind, coreImports, isTestPath, kebab, scriptsOf, trustedAround } from './button-context.ts'
import { isElement, parseTemplate, templateBlock } from './vue-template.ts'

/**
 * Where the app's components are rendered from, so a button is judged only when
 * nothing around it, in this file or in any place that renders the file, can act
 * on a press. Anything the scan cannot follow counts as something that might.
 */
export interface Reach {
  /** `file:line` of a press listener the app adds through the DOM; then no button is judged. */
  domListener?: string
  /** The app routes by the URL hash, so `href="#"` opens its first page. */
  hashRouting: boolean
  /** A module a computed `import()`, `import.meta.glob` or `require.context` may load. */
  isUnreachable: (path: string) => boolean
  /** True when every place that renders the component holds it in elements that take no press. */
  nothingAround: (path: string) => boolean
}

/** DOM events a press fires. */
const PRESS_EVENTS = new Set(['click', 'dblclick', 'auxclick', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'])

/** File types a glob can load that hold no component. */
const DATA_GLOB = /\.(?:json|md|txt|ya?ml|css|scss|png|jpe?g|gif|svg|webp|avif)['"`]/

export function createReach(files: readonly SourceFile[]): Reach {
  const appFiles = files.filter(file => !isTestPath(file.path))
  const scripts = new Map(files.map(file => [file.path, scriptsOf(file)]))
  const unreachable = loadedByPathPrefixes(appFiles, scripts)
  const verdicts = new Map<string, boolean>()

  const isUnreachable = (path: string): boolean => unreachable.some(prefix => prefix === '' || path.startsWith(`${prefix}/`))

  const nothingAround = (path: string, seen: ReadonlySet<string> = new Set()): boolean => {
    const known = verdicts.get(path)
    if (known !== undefined)
      return known
    if (seen.has(path) || isUnreachable(path))
      return false
    const next = new Set([...seen, path])
    const stem = posix.basename(path).replace(/\.vue$/, '')
    let verdict = true
    for (const file of files) {
      if (file.path === path || !file.text.includes(stem))
        continue
      if (!renderedInPlace(file, path, stem, scripts.get(file.path) ?? '', parent => nothingAround(parent, next))) {
        verdict = false
        break
      }
    }
    verdicts.set(path, verdict)
    return verdict
  }

  return {
    domListener: findDomListener(appFiles, scripts),
    hashRouting: appFiles.some(file => /createWebHashHistory|['"`]hashchange['"`]/.test(scripts.get(file.path) ?? '')),
    isUnreachable,
    nothingAround: path => nothingAround(path),
  }
}

/**
 * True when a file that mentions the component only renders it, each time in
 * elements that take no press, with no listener or spread on the tag, and the
 * file itself is rendered the same way. A module that mounts it as the app root
 * (`createApp(App)`) holds nothing around it. Any other mention, such as a route
 * table, a re-export, a lazy load or an import the scan cannot resolve, is a
 * place the scan cannot follow.
 */
function renderedInPlace(file: SourceFile, target: string, stem: string, script: string, parentClear: (path: string) => boolean): boolean {
  const locals: string[] = []
  const imports = [...script.matchAll(/import\s+([\w$]+)\s+from\s*['"]([^'"]+)['"]/g)]
  for (const match of imports) {
    const specifier = match[2]!
    if (posix.basename(specifier).replace(/\.vue$/, '') !== stem)
      continue
    if (!specifier.startsWith('.') || posix.join(posix.dirname(file.path), specifier).replace(/(?<!\.vue)$/, '.vue') !== target)
      return false
    locals.push(match[1]!)
  }
  if (locals.length === 0) {
    // A path string that names the file (a lazy load, a re-export), or a tag
    // that renders it with no import (a global or auto-imported component).
    if (new RegExp(`['"\`][^'"\`]*\\b${stem}(?:\\.vue)?['"\`]`).test(script))
      return false
    return !(file.path.endsWith('.vue') && new RegExp(`<(?:${stem}|${kebab(stem)})[\\s/>]`).test(templateBlock(file.text)?.content ?? ''))
  }
  // Each local name may appear in the script only where it is imported, or where it mounts the app root.
  for (const local of locals) {
    const uses = script.split('\n').filter(line => new RegExp(`(?<![\\w$.])${local.replace('$', '\\$')}(?![\\w$])`).test(line) && !/^\s*import\s/.test(line))
    if (uses.some(line => !new RegExp(`createApp\\(\\s*${local}\\s*[,)]`).test(line)))
      return false
  }
  if (!file.path.endsWith('.vue'))
    return true

  const block = templateBlock(file.text)
  if (!block)
    return false
  const root = parseTemplate(block.content, block.line)
  const tags = new Set(locals.flatMap(local => [local, kebab(local)]))
  const usages: TemplateElement[] = []
  collect(root, element => tags.has(element.tag), usages)
  if (usages.length === 0)
    return false
  const fileImports = coreImports(script)
  for (const usage of usages) {
    if (usage.attrs.some((attr) => {
      const kind = attrKind(attr)
      return kind.type === 'spread' || kind.type === 'event' || kind.type === 'directive' || (kind.type === 'prop' && /^on[A-Z]/.test(kind.name))
    })) {
      return false
    }
    if (!trustedAround(usage.parent, fileImports))
      return false
  }
  return parentClear(file.path)
}

function collect(element: TemplateElement, matches: (element: TemplateElement) => boolean, into: TemplateElement[]): void {
  for (const child of element.children) {
    if (!isElement(child))
      continue
    if (matches(child))
      into.push(child)
    collect(child, matches, into)
  }
}

/**
 * The folders whose modules may load by a path the scan cannot read: a glob, a
 * `require.context`, or an `import()` whose path is computed. `''` stands for
 * every module, as for a path that starts with an alias.
 */
function loadedByPathPrefixes(files: readonly SourceFile[], scripts: ReadonlyMap<string, string>): string[] {
  const prefixes: string[] = []
  for (const file of files) {
    const script = scripts.get(file.path) ?? ''
    const dir = posix.dirname(file.path) === '.' ? '' : posix.dirname(file.path)
    for (const match of script.matchAll(/(?:import\.meta\.glob(?:Eager)?|require\.context)\s*\(\s*(?:\[\s*)?(['"`])([^'"`]*)\1/g)) {
      if (DATA_GLOB.test(`${match[2]}${match[1]}`))
        continue
      prefixes.push(prefixOf(match[2]!, dir))
    }
    for (const match of script.matchAll(/\bimport\s*\(([^)]*)\)/g)) {
      const argument = match[1]!.trim()
      if (/^(['"])[^'"]*\1$/.test(argument) || (/^`[^`$]*`$/.test(argument)))
        continue
      const literal = /^['"`]([^'"`$]*)/.exec(argument)?.[1] ?? ''
      prefixes.push(prefixOf(literal, dir))
    }
  }
  return prefixes
}

/** The folder a path pattern starts in, relative to the project; `''` when it could be anywhere. */
function prefixOf(pattern: string, dir: string): string {
  const literal = pattern.split(/[*{[]/)[0] ?? ''
  const folder = literal.endsWith('/') ? literal.slice(0, -1) : posix.dirname(literal)
  if (literal.startsWith('/'))
    return folder.replace(/^\/+/, '')
  if (!literal.startsWith('.'))
    return literal === '' ? dir : ''
  const joined = posix.join(dir, folder)
  return joined === '.' ? '' : joined
}

/**
 * The first place the app's own code listens for a press through the DOM: an
 * `addEventListener` or `useEventListener` for a press or for an event a
 * variable names, a library's `.on()` for a press, or an `onclick`-style
 * property. A script may then act on any button, so none is judged.
 */
function findDomListener(files: readonly SourceFile[], scripts: ReadonlyMap<string, string>): string | undefined {
  for (const file of files) {
    const script = scripts.get(file.path) ?? ''
    if (!/addEventListener|useEventListener|\.on\s*\(|\.on(?:click|pointerdown|mousedown|touchstart)\s*=/.test(script))
      continue
    const lines = file.text.split('\n')
    for (const [index, line] of lines.entries()) {
      if (listensForPress(line))
        return `${file.path}:${index + 1}`
    }
  }
  return undefined
}

function listensForPress(line: string): boolean {
  if (/\.on(?:click|dblclick|pointerdown|pointerup|mousedown|mouseup|touchstart|touchend)\s*=/.test(line))
    return true
  const on = /\.on\s*\(\s*(['"])(\w+)\1/.exec(line)
  if (on && PRESS_EVENTS.has(on[2]!))
    return true
  for (const match of line.matchAll(/\b(addEventListener|useEventListener)\s*\(([^)]*)/g)) {
    const args = match[2]!
    const literals = [...args.matchAll(/(['"`])(\w+)\1/g)].map(literal => literal[2]!)
    if (literals.length === 0 || literals.some(event => PRESS_EVENTS.has(event)))
      return true
  }
  return false
}
