import type { Suggestion } from './error.ts'
import { catalog, componentNames } from './catalog.ts'
import { keywordOwners } from './query-keywords.ts'
import { BINARY } from './spec.ts'

/** The lookup commands that read one kind of entry each. */
export type LookupCommand = 'component' | 'composable' | 'docs' | 'template'

interface NamedEntry {
  command: LookupCommand
  /** What follows the command name: a component name, a topic id, a template slug. */
  id: string
  /** Every spelling that opens the entry. */
  names: string[]
}

const MAX_HINTS = 3

function lower(value: string): string {
  return value.trim().toLowerCase()
}

/** A name without case, spaces, hyphens, and underscores: `drop-down menu` and `DropDownMenu` fold alike. */
function folded(value: string): string {
  return lower(value).replace(/[\s_-]+/g, '')
}

function entries(): NamedEntry[] {
  return [
    ...catalog.components.map<NamedEntry>(component => ({
      command: component.kind === 'composable' ? 'composable' : 'component',
      id: component.kind === 'composable' ? component.title.en : component.name,
      names: componentNames(component),
    })),
    ...catalog.topics.map<NamedEntry>(topic => ({
      command: 'docs',
      id: topic.id,
      names: [topic.id, topic.id.slice(topic.id.indexOf('/') + 1), topic.title.en],
    })),
    ...catalog.templates.map<NamedEntry>(template => ({
      command: 'template',
      id: template.slug,
      names: [template.slug, template.title.en],
    })),
  ]
}

/** `component` also opens a composable, so a composable name is never "another command's" for it. */
function readsEntry(from: LookupCommand, entry: NamedEntry): boolean {
  return from === entry.command || (from === 'component' && entry.command === 'composable')
}

/**
 * Commands that would answer the typed name, for a lookup that found nothing.
 * One rule serves every lookup command: a name another command reads, spelled
 * exactly (in any case) or folded (without spaces, hyphens, and, for a
 * composable, the `use` prefix). An exact spelling comes before a folded one.
 */
export function otherCommandHints(query: string, from: LookupCommand): Suggestion[] {
  const exact = lower(query)
  const fold = folded(query)
  if (!fold)
    return []
  const exactHits: Suggestion[] = []
  const foldedHits: Suggestion[] = []
  for (const entry of entries()) {
    if (readsEntry(from, entry))
      continue
    const hint = { name: `${BINARY} ${entry.command} ${entry.id}`, reason: 'do this instead' }
    if (entry.names.some(name => lower(name) === exact))
      exactHits.push(hint)
    else if (entry.names.some(name => folded(name) === fold || (entry.command === 'composable' && folded(name).replace(/^use/, '') === fold.replace(/^use/, ''))))
      foldedHits.push(hint)
  }
  return [...exactHits, ...foldedHits].slice(0, MAX_HINTS)
}

/**
 * Components whose keywords are the typed name. A keyword is a word to find a
 * component by, never another name that opens it, so these only ever appear
 * as suggestions after the not-found error.
 */
export function keywordSuggestions(query: string, kind: 'component' | 'composable'): Suggestion[] {
  const owners = keywordOwners(query)
  return catalog.components
    .filter(component => owners.includes(component.slug) && (kind === 'component' || component.kind === 'composable'))
    .map(component => ({ name: component.kind === 'composable' ? component.title.en : component.name, reason: 'keyword' }))
}
