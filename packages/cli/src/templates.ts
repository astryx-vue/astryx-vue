import type { TemplateKind, TemplateRecord } from './catalog-types.ts'
import type { Suggestion } from './error.ts'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { catalog, text } from './catalog.ts'
import { CliError } from './error.ts'
import { pascalCase } from './generate/markdown.ts'
import { assertWithinProject, toPosix } from './paths.ts'
import { suggestByNames } from './query.ts'
import { BINARY } from './spec.ts'

/**
 * A neutral grey rectangle, fully percent-encoded so it stays valid inside a
 * single-quoted, double-quoted, or template string. The playground serves its
 * demo photos from `/template-assets/`, a path that only exists on the docs
 * site; a page copied into a project must not point at it.
 */
export const MEDIA_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%229%22%3E%3Crect width=%2216%22 height=%229%22 fill=%22%23d4d4d4%22/%3E%3C/svg%3E'

const DEMO_MEDIA = /\/template-assets\/[^'"`\s)]+/g

/** The `--type` values the template command accepts. Blocks are reserved for later. */
const TEMPLATE_KINDS: readonly TemplateKind[] = ['page', 'block']

export function templateKinds(type: string): TemplateKind {
  const kind = TEMPLATE_KINDS.find(item => item === type)
  if (!kind)
    throw new CliError(`--type must be one of ${TEMPLATE_KINDS.join(', ')}.`, 'ERR_INVALID_ARGUMENT', 2)
  return kind
}

export function listTemplates(kind?: TemplateKind): TemplateRecord[] {
  return kind ? catalog.templates.filter(template => template.kind === kind) : catalog.templates
}

export function resolveTemplate(query: string, kind?: TemplateKind): TemplateRecord {
  const pool = listTemplates(kind)
  const key = normalize(query)
  if (!key)
    throw new CliError('Pass a template slug, or use --list.', 'ERR_MISSING_ARGUMENT', 2)
  const exact = pool.find(template => template.slug === key)
  if (exact)
    return exact
  const partial = pool.filter(template => template.slug.startsWith(key) || template.slug.includes(key))
  const only = partial.length === 1 ? partial[0] : undefined
  if (only)
    return only
  const scope = kind ? `${kind} ` : ''
  throw new CliError(
    partial.length > 1
      ? `More than one ${scope}template matches "${query}".`
      : `No ${scope}template named "${query}".`,
    partial.length > 1 ? 'ERR_AMBIGUOUS_TEMPLATE' : 'ERR_UNKNOWN_TEMPLATE',
    1,
    partial.length > 1
      ? partial.slice(0, 8).map(template => ({ name: template.slug, reason: 'similar name' }))
      : suggestTemplates(query, pool),
  )
}

export function suggestTemplates(query: string, pool: readonly TemplateRecord[] = catalog.templates): Suggestion[] {
  return suggestByNames(query, pool, template => [template.slug, template.title.en], template => template.slug)
}

/** The source a caller may paste, with the docs site's demo photos swapped for a placeholder. */
export function templateSource(template: TemplateRecord): { source: string, demoMediaReplaced: number } {
  let replaced = 0
  const source = template.source.replace(DEMO_MEDIA, () => {
    replaced += 1
    return MEDIA_PLACEHOLDER
  })
  return { source, demoMediaReplaced: replaced }
}

/**
 * What a project needs before the copied file compiles: the packages its imports
 * name, minus the ones the project already lists. Reads `package.json` from the
 * project root and nowhere else; a missing manifest means the check did not run.
 */
export function analyzeTemplateNeeds(source: string, cwd: string): {
  missingPackages: string[]
  installCommand: string | null
  notes: string[]
  notesZh: string[]
} {
  const packages = importedPackages(source)
  const manifest = readProjectManifest(cwd)
  if (!manifest) {
    return {
      missingPackages: [],
      installCommand: null,
      notes: ['No package.json in this directory, so the package check did not run.'],
      notesZh: ['当前目录没有 package.json，所以没有检查依赖。'],
    }
  }
  const missing = packages.filter(name => !manifest.has(name))
  return {
    missingPackages: missing,
    installCommand: missing.length > 0 ? `${packageManager(cwd)} add ${missing.join(' ')}` : null,
    notes: [],
    notesZh: [],
  }
}

export function importedPackages(source: string): string[] {
  const names = new Set<string>()
  for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    const specifier = match[1] ?? ''
    if (specifier.startsWith('.') || specifier.startsWith('node:'))
      continue
    names.add(packageRoot(specifier))
  }
  return [...names].sort()
}

function packageRoot(specifier: string): string {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : (parts[0] ?? specifier)
}

function readProjectManifest(cwd: string): Set<string> | null {
  const path = join(cwd, 'package.json')
  if (!existsSync(path))
    return null
  let parsed: { dependencies?: Record<string, string>, devDependencies?: Record<string, string>, peerDependencies?: Record<string, string> }
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8')) as typeof parsed
  }
  catch {
    return null
  }
  return new Set([
    ...Object.keys(parsed.dependencies ?? {}),
    ...Object.keys(parsed.devDependencies ?? {}),
    ...Object.keys(parsed.peerDependencies ?? {}),
  ])
}

function packageManager(cwd: string): string {
  if (existsSync(join(cwd, 'pnpm-lock.yaml')))
    return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock')))
    return 'yarn'
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock')))
    return 'bun'
  return 'npm'
}

export interface CopyReceipt {
  template: string
  /** Path relative to the project root, using forward slashes. */
  outputPath: string
  fileName: string
  filesCopied: number
  demoMediaReplaced: number
  notes: string[]
  missingPackages: string[]
  installCommand: string | null
}

/**
 * Writes one template into the project. Refuses a template that imports a
 * package the reader cannot install, refuses to clobber an existing file without
 * `overwrite`, and refuses any path outside the project root.
 */
export function copyTemplate(template: TemplateRecord, options: { cwd: string, targetPath: string, overwrite: boolean, locale: 'en' | 'zh' }): CopyReceipt {
  if (!template.isReady) {
    const reason = template.notReadyReason ? text(template.notReadyReason, options.locale) : ''
    throw new CliError(
      options.locale === 'zh'
        ? `模板 ${template.slug} 还不能直接落地：${reason} 用 \`${BINARY} template ${template.slug}\` 看源码。`
        : `Template ${template.slug} is not ready to copy: ${reason} Read the source with \`${BINARY} template ${template.slug}\`.`,
      'ERR_TEMPLATE_NOT_READY',
      1,
    )
  }
  const outputFile = targetFileFor(options.targetPath, options.cwd, template.slug)
  assertWithinProject(outputFile, options.cwd)
  if (!options.overwrite && existsSync(outputFile)) {
    const shown = toPosix(relative(options.cwd, outputFile))
    throw new CliError(
      options.locale === 'zh'
        ? `${shown} 已存在。加 --overwrite（或 -f）才会覆盖。`
        : `${shown} already exists. Re-run with --overwrite (or -f) to replace it.`,
      'ERR_FILE_EXISTS',
      1,
    )
  }
  const { source, demoMediaReplaced } = templateSource(template)
  mkdirSync(dirname(outputFile), { recursive: true })
  try {
    writeFileSync(outputFile, source)
  }
  catch (error) {
    throw new CliError(
      `Could not write ${toPosix(relative(options.cwd, outputFile))}: ${error instanceof Error ? error.message : 'unknown error'}`,
      'ERR_WRITE_FAILED',
      1,
    )
  }
  const needs = analyzeTemplateNeeds(source, options.cwd)
  const locale = options.locale
  return {
    template: template.slug,
    outputPath: toPosix(relative(options.cwd, outputFile)),
    fileName: basename(outputFile),
    filesCopied: 1,
    demoMediaReplaced,
    notes: locale === 'zh' ? needs.notesZh : needs.notes,
    missingPackages: needs.missingPackages,
    installCommand: needs.installCommand,
  }
}

/**
 * Where a copy lands. A path that ends in a file extension, or that already
 * names a file, is the file itself; anything else is a directory that receives
 * `<PascalCaseSlug>.vue`.
 */
export function targetFileFor(input: string, cwd: string, slug: string): string {
  if (!input.trim())
    throw new CliError('Pass a file or directory to write the template into.', 'ERR_MISSING_ARGUMENT', 2)
  const resolved = resolve(cwd, input)
  const directoryLike = input.endsWith('/') || input.endsWith('\\') || (existsSync(resolved) && statSync(resolved).isDirectory())
  if (directoryLike)
    return join(resolved, `${pascalCase(slug)}.vue`)
  const fileName = basename(resolved)
  if (existsSync(resolved) && statSync(resolved).isFile())
    return resolved
  if (/\.[A-Z0-9]+$/i.test(fileName))
    return resolved
  return join(resolved, `${pascalCase(slug)}.vue`)
}

/**
 * Guards every argument that looks like a path before a template lookup runs, so
 * `template ../../etc` reports the traversal instead of an unknown slug.
 */
export function guardPathArguments(positionals: readonly string[], cwd: string): void {
  for (const value of positionals) {
    if (!looksLikePath(value))
      continue
    assertWithinProject(resolve(cwd, value), cwd)
  }
}

function looksLikePath(value: string): boolean {
  return value.includes('/') || value.includes('\\') || value === '.' || value === '..' || value.startsWith('..')
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-')
}

/** Opening tags the skeleton drops everything else from. */
const SKELETON_ATTRS = new Set([
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'contentPadding',
  'columns',
  'width',
  'maxWidth',
  'height',
  'minHeight',
  'axis',
  'justify',
  'align',
  'density',
  'variant',
  'hasDivider',
])

/** How many lines a skeleton may take before it stops being a quick read. */
const SKELETON_LINES = 160

interface TagToken {
  name: string
  closing: boolean
  selfClosing: boolean
  attrs: string
}

/**
 * A layout skeleton: every component tag in the page, nested the way the page
 * nests them, with only layout attributes and no text, bindings, or event
 * handlers. Native HTML wrappers are dropped, so a page that positions things
 * with plain `<div style>` reads flatter than it renders; the tag order and the
 * component nesting still describe the page.
 */
export function renderSkeleton(source: string): string {
  const tokens = tokenizeTemplate(templateBlock(source))
  const lines: string[] = []
  const stack: string[] = []
  let depth = 0
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]!
    if (token.closing) {
      if (stack[stack.length - 1] === token.name) {
        stack.pop()
        depth = Math.max(0, depth - 1)
        lines.push(`${'  '.repeat(depth)}</${token.name}>`)
      }
      continue
    }
    if (!isComponentTag(token.name))
      continue
    const kept = attributes(token.attrs)
    const suffix = kept.length > 0 ? ` ${kept.join(' ')}` : ''
    const closeIndex = matchingClose(tokens, index)
    const childComponents = closeIndex === -1
      ? []
      : tokens.slice(index + 1, closeIndex).filter(child => !child.closing && isComponentTag(child.name))
    if (token.selfClosing || closeIndex === -1 || childComponents.length === 0) {
      lines.push(`${'  '.repeat(depth)}<${token.name}${suffix} />`)
      if (closeIndex !== -1)
        index = closeIndex
      continue
    }
    lines.push(`${'  '.repeat(depth)}<${token.name}${suffix}>`)
    stack.push(token.name)
    depth += 1
  }
  if (lines.length > SKELETON_LINES) {
    lines.length = SKELETON_LINES
    lines.push(`${'  '.repeat(depth)}...`)
  }
  return lines.join('\n')
}

function templateBlock(source: string): string {
  const open = /<template(?:\s[^>]*)?>/.exec(source)
  const close = source.lastIndexOf('</template>')
  if (!open || close <= open.index)
    return ''
  return source.slice(open.index + open[0].length, close)
}

/**
 * Reads the tags out of a template block by hand rather than with one large
 * regular expression: an attribute value can be a quoted string containing `>`,
 * so the end of a tag is the first `>` outside quotes.
 */
function tokenizeTemplate(markup: string): TagToken[] {
  const tokens: TagToken[] = []
  const source = markup.replace(/<!--[\s\S]*?-->/g, '')
  let index = 0
  while (index < source.length) {
    const open = source.indexOf('<', index)
    if (open === -1)
      break
    let cursor = open + 1
    const closing = source[cursor] === '/'
    if (closing)
      cursor += 1
    const nameStart = cursor
    while (cursor < source.length && /[\w.:-]/.test(source[cursor] ?? ''))
      cursor += 1
    const name = source.slice(nameStart, cursor)
    if (!/^[A-Z]/i.test(name)) {
      index = open + 1
      continue
    }
    const attrsStart = cursor
    let quote: string | null = null
    while (cursor < source.length) {
      const character = source[cursor] ?? ''
      if (quote) {
        if (character === quote)
          quote = null
      }
      else if (character === '"' || character === '\'') {
        quote = character
      }
      else if (character === '>') {
        break
      }
      cursor += 1
    }
    if (cursor >= source.length)
      break
    const inner = source.slice(attrsStart, cursor)
    const selfClosing = inner.trimEnd().endsWith('/')
    tokens.push({
      closing,
      name,
      attrs: selfClosing ? inner.trimEnd().slice(0, -1) : inner,
      selfClosing,
    })
    index = cursor + 1
  }
  return tokens
}

function isComponentTag(name: string): boolean {
  return /^[A-Z]/.test(name) && name !== 'Template'
}

/** Index of the token that closes the tag opened at `open`, or -1 when it never closes. */
function matchingClose(tokens: readonly TagToken[], open: number): number {
  const token = tokens[open]
  if (!token || token.selfClosing)
    return -1
  let depth = 0
  for (let index = open + 1; index < tokens.length; index++) {
    const other = tokens[index]!
    if (other.name !== token.name)
      continue
    if (other.closing) {
      if (depth === 0)
        return index
      depth -= 1
      continue
    }
    if (!other.selfClosing)
      depth += 1
  }
  return -1
}

/**
 * Layout attributes, copied verbatim. Bindings keep their `:` prefix so
 * `:gap="4"` stays valid Vue; `v-if`, handlers, strings, and text are dropped
 * because they describe behaviour, not shape.
 */
function attributes(text: string): string[] {
  const kept: string[] = []
  for (const match of text.matchAll(/(:?[A-Z][\w-]*)(?:\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?/gi)) {
    const raw = match[0].trim()
    const name = (match[1] ?? '').replace(/^v-bind:/, '').replace(/^:/, '')
    if (!SKELETON_ATTRS.has(name))
      continue
    kept.push(raw)
  }
  return kept
}
