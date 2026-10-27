/**
 * Theme properties that a component reads through its own variables.
 *
 * A theme writes ordinary CSS, such as `card: { base: { borderRadius: '20px' } }`.
 * Some components paint that property on more than one element, so the root
 * alone is not enough: the card's header corners follow `--_card-radius`.
 * Each entry here says which variable carries the authored value as well.
 *
 * `expand: 'container'` turns padding into the component's published
 * container padding variables (`--astryx-card-padding-inline-start` and so on).
 * Edge-bleeding children such as Divider and Table read those, so a themed
 * padding moves them too. The padding property itself is not written.
 *
 * Only components whose stylesheet reads the listed variables appear here.
 * `derivedVars.test.ts` checks every name against `packages/core/styles`.
 */
export interface DerivedVarEntry {
  /** The camelCase property a theme author writes. */
  property: string
  /** Variables that receive the same value. */
  vars?: readonly string[]
  /** `container` expands padding into the published container variables. */
  expand?: 'container'
}

export const DERIVED_VARS: Readonly<Record<string, readonly DerivedVarEntry[]>> = {
  'bottom-sheet': [{ property: 'padding', expand: 'container' }],
  'card': [
    { property: 'borderRadius', vars: ['--_card-radius'] },
    { property: 'padding', expand: 'container' },
  ],
  'chat': [
    { property: 'borderRadius', vars: ['--_chat-composer-radius'] },
    { property: 'padding', vars: ['--_chat-composer-padding'] },
  ],
  'context-menu': [
    { property: 'borderRadius', vars: ['--_context-menu-radius'] },
    { property: 'padding', vars: ['--_context-menu-padding'] },
  ],
  'dialog': [
    { property: 'borderRadius', vars: ['--_dialog-radius'] },
    { property: 'padding', expand: 'container' },
  ],
  'dropdown-menu': [
    { property: 'borderRadius', vars: ['--_dropdown-menu-radius'] },
    { property: 'padding', vars: ['--_dropdown-menu-padding'] },
  ],
  'progress-bar-mark': [
    { property: 'width', vars: ['--_progressbar-mark-width'] },
    { property: 'height', vars: ['--_progressbar-mark-height'] },
  ],
  'segmented-control': [
    { property: 'borderRadius', vars: ['--_segmented-control-radius'] },
    { property: 'padding', vars: ['--_segmented-control-padding'] },
  ],
}

const PADDING_PROPS = new Set([
  'padding',
  'paddingBlock',
  'paddingInline',
  'paddingBlockStart',
  'paddingBlockEnd',
  'paddingInlineStart',
  'paddingInlineEnd',
])

/**
 * Physical block longhands and the logical longhand each one is in every
 * horizontal writing mode. `paddingLeft` and `paddingRight` are not mapped:
 * which edge they mean flips in right-to-left text.
 */
const PHYSICAL_BLOCK_PADDING: Record<string, string> = {
  paddingTop: 'paddingBlockStart',
  paddingBottom: 'paddingBlockEnd',
}

interface ParsedPadding {
  blockStart?: string
  blockEnd?: string
  inline?: string
  inlineStart?: string
  inlineEnd?: string
}

function words(value: string): string[] {
  return value.trim().split(/\s+/)
}

function parsePadding(entries: readonly (readonly [string, string])[]): ParsedPadding {
  const parsed: ParsedPadding = {}
  for (const [raw, value] of entries) {
    const prop = PHYSICAL_BLOCK_PADDING[raw] ?? raw
    const parts = words(value)
    if (prop === 'padding') {
      parsed.blockStart = parts[0]
      parsed.inline = parts[1] ?? parts[0]
      parsed.blockEnd = parts[2] ?? parts[0]
    }
    else if (prop === 'paddingBlock') {
      parsed.blockStart = parts[0]
      parsed.blockEnd = parts[1] ?? parts[0]
    }
    else if (prop === 'paddingInline') {
      if (parts.length === 1) {
        parsed.inline = parts[0]
      }
      else {
        parsed.inlineStart = parts[0]
        parsed.inlineEnd = parts[1]
      }
    }
    else if (prop === 'paddingBlockStart') {
      parsed.blockStart = value
    }
    else if (prop === 'paddingBlockEnd') {
      parsed.blockEnd = value
    }
    else if (prop === 'paddingInlineStart') {
      parsed.inlineStart = value
    }
    else if (prop === 'paddingInlineEnd') {
      parsed.inlineEnd = value
    }
  }
  return parsed
}

/** Published container padding variables for one component. */
function containerPadding(component: string, parsed: ParsedPadding): [string, string][] {
  const prefix = `--astryx-${component}-padding`
  const start = parsed.inlineStart ?? parsed.inline
  const end = parsed.inlineEnd ?? parsed.inline
  if (start != null && start === end && start === parsed.blockStart && start === parsed.blockEnd)
    return [[prefix, start]]

  const out: [string, string][] = []
  if (parsed.inlineStart != null || parsed.inlineEnd != null) {
    if (start != null)
      out.push([`${prefix}-inline-start`, start])
    if (end != null)
      out.push([`${prefix}-inline-end`, end])
  }
  else if (parsed.inline != null) {
    out.push([`${prefix}-inline`, parsed.inline])
  }
  if (parsed.blockStart != null)
    out.push([`${prefix}-block-start`, parsed.blockStart])
  if (parsed.blockEnd != null)
    out.push([`${prefix}-block-end`, parsed.blockEnd])
  return out
}

function entriesFor(component: string, property: string): readonly DerivedVarEntry[] {
  const entries = DERIVED_VARS[component] ?? []
  const lookup = PADDING_PROPS.has(property) || property in PHYSICAL_BLOCK_PADDING ? 'padding' : property
  return entries.filter(entry => entry.property === property || entry.property === lookup)
}

/**
 * Lower one rule's declarations through the component's derived variables.
 *
 * Input and output are `[camelCase or custom property, value]` pairs. A
 * container-expanded padding replaces the padding properties; every other
 * derived variable is written next to the property it mirrors.
 */
export function applyDerivedVars(
  component: string,
  declarations: readonly (readonly [string, string])[],
): [string, string][] {
  const derived: [string, string][] = []
  const padding: (readonly [string, string])[] = []
  for (const [property, value] of declarations) {
    for (const entry of entriesFor(component, property)) {
      if (entry.expand === 'container')
        padding.push([property, value])
      for (const name of entry.vars ?? [])
        derived.push([name, value])
    }
  }
  if (padding.length === 0)
    return [...declarations.map(([p, v]) => [p, v] as [string, string]), ...derived]

  const expanded = new Set(padding.map(([property]) => property))
  return [
    ...declarations.filter(([property]) => !expanded.has(property)).map(([p, v]) => [p, v] as [string, string]),
    ...containerPadding(component, parsePadding(padding)),
    ...derived,
  ]
}
