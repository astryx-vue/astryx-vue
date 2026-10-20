import { headingLevel } from './text.ts'

/**
 * Cuts a docs page into h2/h3 sections and decides what each one is about
 * (usage, best practices, examples, an API table, or a free-form note).
 */

export type SectionKind = 'usage' | 'practices' | 'examples' | 'props' | 'slots' | 'events' | 'note'
export type ApiKind = 'props' | 'slots' | 'events'

export interface Section {
  heading: string
  kind: SectionKind
  /** Kind of the enclosing h2. h3 sections use this when their own heading is only a component name. */
  parentKind: SectionKind
  body: string
}

export function splitSections(markdown: string): Section[] {
  const sections: Section[] = []
  let heading = ''
  let kind: SectionKind = 'note'
  let parentKind: SectionKind = 'note'
  let h2Kind: SectionKind = 'note'
  let body: string[] = []
  let fence = false
  const push = (): void => {
    sections.push({ heading, kind, parentKind, body: body.join('\n') })
  }
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```'))
      fence = !fence
    const match = !fence ? headingLevel(line) : null
    if (match && match.level >= 2 && match.level <= 3) {
      push()
      heading = match.text
      const own = classify(heading)
      if (match.level === 2) {
        kind = own
        h2Kind = own
        parentKind = 'note'
      }
      else {
        kind = own
        parentKind = h2Kind
      }
      body = []
    }
    else {
      body.push(line)
    }
  }
  push()
  return sections
}

export function isApiKind(kind: SectionKind): kind is ApiKind {
  return kind === 'props' || kind === 'slots' || kind === 'events'
}

export function classify(heading: string): SectionKind {
  const title = heading.trim().toLowerCase()
  if (title === 'usage' || title === '使用方法' || title === '使用')
    return 'usage'
  if (title === 'examples' || title === 'example' || title === '示例')
    return 'examples'
  if (title === 'best practices' || title === '最佳实践' || title === '使用建议')
    return 'practices'
  if (/slots?|插槽/.test(title))
    return 'slots'
  if (/\bevents?\b|\bemits?\b|事件/.test(title))
    return 'events'
  if (/\bprops?\b|\bproperties\b|属性/.test(title))
    return 'props'
  return 'note'
}
