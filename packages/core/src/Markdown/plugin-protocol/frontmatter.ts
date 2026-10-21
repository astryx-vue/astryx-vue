import type { MarkdownAstDataValue, MarkdownAstRoot } from '../canonicalAst.js'
import type { MarkdownExtensionNode, MarkdownPluginData, MarkdownPluginEntry } from './protocol.js'
import {
  createMarkdownPlugin,
  freezeMarkdownPluginData,
  isMarkdownPluginData,
} from './protocol.js'

const ENVELOPE_KEY = 'astryx:frontmatter'
const ENVELOPE_BRAND = 'astryx.markdown.frontmatter'
const ENVELOPE_VERSION = 1

type FieldMap = Readonly<Record<string, string>>

interface Envelope {
  readonly brand: typeof ENVELOPE_BRAND
  readonly version: typeof ENVELOPE_VERSION
  readonly values: Readonly<Record<string, MarkdownPluginData>>
}

export interface MarkdownFrontmatterOptions<Metadata extends MarkdownPluginData> {
  /** Stable plugin and metadata namespace. */
  readonly name: string
  /** Converts validated key/value fields into typed document metadata. */
  readonly parse: (fields: FieldMap) => Metadata
}

export type MarkdownFrontmatterParseResult<Metadata extends MarkdownPluginData>
  = | { readonly status: 'none' }
    | { readonly status: 'defer' }
    | { readonly status: 'match', readonly contentStart: number, readonly metadata: Metadata }

export interface MarkdownFrontmatter<Metadata extends MarkdownPluginData> {
  readonly plugin: MarkdownPluginEntry<never>
  parse: (source: string, isFinal?: boolean) => MarkdownFrontmatterParseResult<Metadata>
  getMetadata: (document: MarkdownAstRoot<MarkdownExtensionNode>) => Metadata | undefined
}

function asRecord(value: MarkdownPluginData | undefined): Readonly<Record<string, MarkdownPluginData>> {
  if (value == null || typeof value !== 'object' || Array.isArray(value))
    return {}
  return value as Readonly<Record<string, MarkdownPluginData>>
}

function readEnvelope(value: unknown): Envelope | undefined {
  if (value == null || typeof value !== 'object' || Array.isArray(value))
    return undefined
  const candidate = value as Partial<Envelope>
  if (candidate.brand !== ENVELOPE_BRAND || candidate.version !== ENVELOPE_VERSION)
    return undefined
  if (candidate.values == null || typeof candidate.values !== 'object' || Array.isArray(candidate.values))
    return undefined
  return candidate as Envelope
}

/**
 * A leading `---` fence. Duplicate keys, an empty key, or a missing colon
 * reject the block. An unclosed fence defers until the source is final.
 */
function readFields(source: string):
  | { status: 'none' }
  | { status: 'defer' }
  | { status: 'match', end: number, fields: FieldMap } {
  const openingLength = source.startsWith('---\r\n') ? 5 : source.startsWith('---\n') ? 4 : 0
  if (openingLength === 0)
    return { status: 'none' }
  const body = source.slice(openingLength)
  const close = /(?:^|\r?\n)---(?=\r?\n|$)/.exec(body)
  if (close == null)
    return { status: 'defer' }

  const fields: Record<string, string> = Object.create(null)
  for (const line of body.slice(0, close.index).split(/\r?\n/)) {
    if (line.trim() === '')
      continue
    const separator = line.indexOf(':')
    const key = separator < 0 ? '' : line.slice(0, separator).trim()
    if (separator <= 0 || key === '' || Object.hasOwn(fields, key))
      return { status: 'none' }
    fields[key] = line.slice(separator + 1).trim()
  }

  let end = openingLength + close.index + close[0].length
  if (source.startsWith('\r\n', end))
    end += 2
  else if (source[end] === '\n')
    end += 1
  return { status: 'match', end, fields: Object.freeze(fields) }
}

export function createMarkdownFrontmatter<Metadata extends MarkdownPluginData>(
  options: MarkdownFrontmatterOptions<Metadata>,
): MarkdownFrontmatter<Metadata> {
  if (options.name.trim() === '')
    throw new TypeError('Markdown frontmatter name must be non-empty')
  const name = options.name

  const parse = (source: string, isFinal = true): MarkdownFrontmatterParseResult<Metadata> => {
    const parsed = readFields(source)
    if (parsed.status === 'defer')
      return isFinal ? { status: 'none' } : parsed
    if (parsed.status === 'none')
      return parsed
    const metadata = options.parse(parsed.fields)
    if (!isMarkdownPluginData(metadata))
      throw new TypeError('Markdown frontmatter metadata must be finite JSON-like data')
    return {
      status: 'match',
      contentStart: parsed.end,
      metadata: freezeMarkdownPluginData(metadata),
    }
  }

  const plugin = createMarkdownPlugin({
    name,
    apiVersion: 1,
    transform(document, context) {
      const parsed = parse(context.source, context.isFinal)
      if (parsed.status === 'none')
        return document
      if (parsed.status === 'defer')
        return { ...document, children: [] }
      const priorData = asRecord(document.data)
      const prior = readEnvelope(priorData[ENVELOPE_KEY])
      const envelope: Envelope = Object.freeze({
        brand: ENVELOPE_BRAND,
        version: ENVELOPE_VERSION,
        values: Object.freeze({
          ...prior?.values,
          [name]: parsed.metadata,
        }),
      })
      return {
        ...document,
        data: Object.freeze({ ...priorData, [ENVELOPE_KEY]: envelope }) as unknown as MarkdownAstDataValue,
        children: document.children.filter(
          node => (node.position?.end.offset ?? Number.POSITIVE_INFINITY) > parsed.contentStart,
        ),
      }
    },
  }) as MarkdownPluginEntry<never>

  return Object.freeze({
    plugin,
    parse,
    getMetadata(document: MarkdownAstRoot<MarkdownExtensionNode>) {
      const data = asRecord(document.data)
      return readEnvelope(data[ENVELOPE_KEY])?.values[name] as Metadata | undefined
    },
  })
}
