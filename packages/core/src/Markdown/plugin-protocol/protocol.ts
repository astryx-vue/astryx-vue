import type { MarkdownAstDataValue, MarkdownAstExtensionNode, MarkdownAstRoot } from '../canonicalAst.js'

export type MarkdownPluginData = MarkdownAstDataValue

export type MarkdownExtensionNode<
  PluginName extends string = string,
  NodeName extends string = string,
  Data extends MarkdownPluginData = MarkdownPluginData,
  Display extends 'inline' | 'block' = 'inline' | 'block',
> = MarkdownAstExtensionNode<PluginName, NodeName, Data, Display>

export function isMarkdownExtensionNode<Node extends MarkdownExtensionNode>(
  node: { readonly type: string },
  plugin: Node['plugin'],
  name: Node['name'],
): node is Node {
  return node.type === 'extension'
    && (node as MarkdownExtensionNode).plugin === plugin
    && (node as MarkdownExtensionNode).name === name
}

export interface MarkdownTokenizerInput {
  readonly source: string
  readonly offset: number
  readonly end: number
  readonly isFinal: boolean
  readonly context: 'inline' | 'block'
  readonly lineStart: number
  readonly column: number
}

export type MarkdownTokenizeResult<Node extends MarkdownExtensionNode>
  = | { readonly status: 'no-match' }
    | { readonly status: 'defer' }
    | {
      readonly status: 'match'
      readonly end: number
      readonly node: Omit<Node, 'source' | 'position'>
    }

export interface MarkdownSyntaxContribution<
  Node extends MarkdownExtensionNode = MarkdownExtensionNode,
> {
  readonly startsWith: readonly [string, ...string[]]
  readonly maxSpan: number
  tokenize: (input: MarkdownTokenizerInput) => MarkdownTokenizeResult<Node>
}

export interface MarkdownSyntaxCapability<
  Node extends MarkdownExtensionNode = MarkdownExtensionNode,
> {
  readonly inline?: readonly MarkdownSyntaxContribution<Node>[]
  readonly block?: readonly MarkdownSyntaxContribution<Node>[]
}

export interface MarkdownTransformContext {
  readonly source: string
  readonly isFinal: boolean
  readonly display: 'inline' | 'block'
  report: (message: string) => void
}

declare const markdownTransformNode: unique symbol

export interface MarkdownTransform<Node extends MarkdownExtensionNode = never> {
  (
    document: MarkdownAstRoot<MarkdownExtensionNode>,
    context: MarkdownTransformContext,
  ): MarkdownAstRoot<MarkdownExtensionNode>
  readonly [markdownTransformNode]?: Node
}

export interface MarkdownExtensionRenderer<Node extends MarkdownExtensionNode> {
  readonly render: (props: { node: Node }) => unknown
  readonly toText: (node: Node) => string
}

export type MarkdownExtensionRenderers<Node extends MarkdownExtensionNode> = Readonly<{
  [NodeName in Node['name']]: MarkdownExtensionRenderer<Extract<Node, { name: NodeName }>>
}>

interface MarkdownPluginDefinitionBase<Name extends string> {
  readonly name: Name
  readonly apiVersion: 1
}

export interface MarkdownSyntaxPluginDefinition<
  Name extends string,
  Node extends MarkdownExtensionNode<Name>,
> extends MarkdownPluginDefinitionBase<Name> {
  readonly parseKey: string
  readonly syntax: MarkdownSyntaxCapability<Node>
  readonly transform?: MarkdownTransform<Node>
  readonly renderers: MarkdownExtensionRenderers<Node>
}

export type MarkdownTransformPluginDefinition<
  Name extends string,
  Node extends MarkdownExtensionNode<Name> = never,
> = MarkdownPluginDefinitionBase<Name> & {
  readonly transform: MarkdownTransform<Node>
  readonly parseKey?: never
  readonly syntax?: never
  readonly renderers?: MarkdownExtensionRenderers<Node>
}

export type MarkdownPluginDefinition<
  Name extends string,
  Node extends MarkdownExtensionNode<Name> = never,
>
  = | MarkdownSyntaxPluginDefinition<Name, Node>
    | MarkdownTransformPluginDefinition<Name, Node>

declare const markdownPluginNode: unique symbol

export interface MarkdownPluginEntry<
  Node extends MarkdownExtensionNode = MarkdownExtensionNode,
> {
  readonly name: string
  readonly apiVersion: 1
  readonly [markdownPluginNode]: Node
}

export type MarkdownNodeOf<Entry> = Entry extends MarkdownPluginEntry<infer Node> ? Node : never

export type MarkdownExtensionsOf<
  Plugins extends readonly MarkdownPluginEntry[],
> = MarkdownNodeOf<Plugins[number]>

export interface MarkdownPluginCapabilities {
  readonly syntax: boolean
  readonly transform: boolean
}

const MARKDOWN_PLUGIN_BRAND = '@astryx-vue/core/MarkdownPluginEntry'
const markdownPluginDefinition = Symbol.for(MARKDOWN_PLUGIN_BRAND)

interface MarkdownPluginBrand {
  readonly kind: typeof MARKDOWN_PLUGIN_BRAND
  readonly apiVersion: 1
  readonly definition: MarkdownPluginDefinition<string, MarkdownExtensionNode>
}

interface InternalMarkdownPluginEntry extends MarkdownPluginEntry {
  readonly [markdownPluginDefinition]: MarkdownPluginBrand
}

function fail(message: string): never {
  throw new Error(`Markdown plugin: ${message}`)
}

export function isMarkdownPluginData(
  value: unknown,
  seen: Set<object> = new Set(),
): value is MarkdownPluginData {
  if (value == null || typeof value === 'boolean' || typeof value === 'string')
    return true
  if (typeof value === 'number')
    return Number.isFinite(value)
  if (typeof value !== 'object' || seen.has(value))
    return false
  seen.add(value)
  const valid = Array.isArray(value)
    ? value.every(item => isMarkdownPluginData(item, seen))
    : Object.getPrototypeOf(value) === Object.prototype
      && Object.values(value).every(item => isMarkdownPluginData(item, seen))
  seen.delete(value)
  return valid
}

export function freezeMarkdownPluginData<T extends MarkdownPluginData>(value: T): T {
  if (value != null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const nested of Object.values(value))
      freezeMarkdownPluginData(nested as MarkdownPluginData)
    Object.freeze(value)
  }
  return value
}

function deepFreeze<T>(value: T, seen: Set<object> = new Set()): T {
  if (value != null && typeof value === 'object' && !seen.has(value)) {
    seen.add(value)
    for (const key of Reflect.ownKeys(value))
      deepFreeze((value as Record<PropertyKey, unknown>)[key], seen)
    Object.freeze(value)
  }
  return value
}

function validateSyntax(pluginName: string, syntax: MarkdownSyntaxCapability): void {
  const contributions = [...(syntax.inline ?? []), ...(syntax.block ?? [])]
  if (contributions.length === 0)
    fail(`"${pluginName}" syntax must declare an inline or block contribution`)
  for (const contribution of contributions) {
    if (!Number.isFinite(contribution.maxSpan) || contribution.maxSpan <= 0)
      fail(`"${pluginName}" syntax maxSpan must be positive and finite`)
    for (const prefix of contribution.startsWith) {
      if (prefix === '' || prefix.length > contribution.maxSpan)
        fail(`"${pluginName}" syntax prefixes must be non-empty and bounded`)
    }
  }
}

export function getMarkdownPluginDefinition(
  publicEntry: MarkdownPluginEntry,
): MarkdownPluginDefinition<string, MarkdownExtensionNode> {
  if (
    publicEntry == null
    || typeof publicEntry !== 'object'
    || Object.getPrototypeOf(publicEntry) !== Object.prototype
  ) {
    fail('entries must come from a compatible createMarkdownPlugin()')
  }
  const entry = publicEntry as Partial<InternalMarkdownPluginEntry>
  const brand = entry[markdownPluginDefinition]
  const definition = brand?.definition
  if (
    Reflect.ownKeys(entry).length !== 3
    || typeof entry.name !== 'string'
    || entry.apiVersion !== 1
    || !Object.isFrozen(entry)
    || brand == null
    || typeof brand !== 'object'
    || Object.getPrototypeOf(brand) !== Object.prototype
    || Reflect.ownKeys(brand).length !== 3
    || !Object.isFrozen(brand)
    || brand.kind !== MARKDOWN_PLUGIN_BRAND
    || brand.apiVersion !== 1
    || definition == null
    || typeof definition !== 'object'
    || !Object.isFrozen(definition)
    || definition.name !== entry.name
    || definition.apiVersion !== entry.apiVersion
  ) {
    fail('entries must come from a compatible createMarkdownPlugin()')
  }
  return definition
}

export function getMarkdownPluginCapabilities(
  plugin: MarkdownPluginEntry,
): MarkdownPluginCapabilities {
  const definition = getMarkdownPluginDefinition(plugin)
  return Object.freeze({
    syntax: 'syntax' in definition && definition.syntax != null,
    transform: definition.transform != null,
  })
}

export function createMarkdownPlugin<
  const Name extends string,
  const Node extends MarkdownExtensionNode<Name>,
>(
  definition: MarkdownSyntaxPluginDefinition<Name, Node>,
): MarkdownPluginEntry<Node>
export function createMarkdownPlugin<const Name extends string>(
  definition: MarkdownTransformPluginDefinition<Name, never>,
): MarkdownPluginEntry<never>
export function createMarkdownPlugin<
  const Name extends string,
  const Node extends MarkdownExtensionNode<Name>,
>(
  definition: MarkdownTransformPluginDefinition<Name, Node>,
): MarkdownPluginEntry<Node>
export function createMarkdownPlugin(
  definition: MarkdownPluginDefinition<string, MarkdownExtensionNode> | MarkdownTransformPluginDefinition<string, never>,
): MarkdownPluginEntry {
  if (definition.name.trim() === '')
    fail('name must be a non-empty string')
  if (definition.apiVersion !== 1)
    fail(`"${definition.name}" uses unsupported apiVersion`)
  if (typeof definition.transform !== 'undefined' && typeof definition.transform !== 'function')
    fail(`"${definition.name}" transform must be a function`)
  if ('syntax' in definition && definition.syntax != null) {
    if (definition.parseKey.trim() === '')
      fail(`"${definition.name}" parseKey must be non-empty`)
    validateSyntax(definition.name, definition.syntax)
    if (Object.keys(definition.renderers).length === 0)
      fail(`"${definition.name}" syntax must provide renderers`)
  }
  else if (definition.transform == null) {
    fail(`"${definition.name}" must declare syntax or transform`)
  }

  const frozenDefinition = deepFreeze(definition)
  const brand = Object.freeze({
    kind: MARKDOWN_PLUGIN_BRAND,
    apiVersion: 1 as const,
    definition: frozenDefinition,
  })
  return Object.freeze({
    name: frozenDefinition.name,
    apiVersion: 1 as const,
    [markdownPluginDefinition]: brand,
  }) as unknown as MarkdownPluginEntry
}

export function isMarkdownPluginEntry(value: unknown): value is MarkdownPluginEntry {
  return value != null
    && typeof value === 'object'
    && (value as { apiVersion?: unknown }).apiVersion === 1
    && typeof (value as { name?: unknown }).name === 'string'
    && markdownPluginDefinition in value
}

const markdownSourceLinesDefinition = Symbol('MarkdownSourceLines')

export function createMarkdownSourceLinesEntry(name: string): MarkdownPluginEntry<never> {
  const transform: MarkdownTransform<never> = document => document
  const definition = {
    name,
    apiVersion: 1 as const,
    transform,
    [markdownSourceLinesDefinition]: true as const,
  }
  return createMarkdownPlugin(definition as MarkdownTransformPluginDefinition<string, never>) as MarkdownPluginEntry<never>
}

export function isMarkdownSourceLinesPlugin(plugin: MarkdownPluginEntry): boolean {
  try {
    const definition = getMarkdownPluginDefinition(plugin) as { readonly [markdownSourceLinesDefinition]?: boolean }
    return definition[markdownSourceLinesDefinition] === true
  }
  catch {
    return false
  }
}

export function collectProtocolRenderers(
  plugins: readonly MarkdownPluginEntry[],
): Map<string, MarkdownExtensionRenderer<MarkdownExtensionNode>> {
  const renderers = new Map<string, MarkdownExtensionRenderer<MarkdownExtensionNode>>()
  for (const plugin of plugins) {
    let definition: MarkdownPluginDefinition<string, MarkdownExtensionNode>
    try {
      definition = getMarkdownPluginDefinition(plugin)
    }
    catch {
      continue
    }
    if (!('renderers' in definition) || definition.renderers == null)
      continue
    for (const [name, renderer] of Object.entries(definition.renderers))
      renderers.set(`${definition.name}\0${name}`, renderer)
  }
  return renderers
}
