/**
 * Low-level text helpers shared by the page extractors: strip frontmatter and
 * docs-only components, collapse whitespace, decode entities, read headings.
 */

export function cleanMarkdown(markdown: string): string {
  const withoutMatter = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '')
  return tidy(mapOutsideFences(withoutMatter, (text) => {
    return text
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(?:DemoExample|ComponentAnatomy|ComponentAccessibility|ComponentsOverview)\b[\s\S]*?\/>/g, '')
  }))
}

export function frontmatterTitle(markdown: string): string {
  const matter = /^---\n([\s\S]*?)\n---/.exec(markdown)
  const titleLine = matter?.[1]?.split('\n').find(line => line.startsWith('title:'))
  const title = titleLine?.slice('title:'.length).trim() ?? ''
  return title.replace(/^['"]|['"]$/g, '')
}

export function headingLevel(line: string): { level: number, text: string } | null {
  let level = 0
  while (line[level] === '#')
    level++
  if (level === 0 || line[level] !== ' ')
    return null
  return { level, text: line.slice(level + 1).trim() }
}

export function decodeHtml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/** Applies `transform` to everything except fenced code blocks. */
export function mapOutsideFences(source: string, transform: (text: string) => string): string {
  return source.split(/(```[\s\S]*?```)/g).map((part, index) => index % 2 === 1 ? part : transform(part)).join('')
}

export function stripFenced(source: string): string {
  return source.replace(/```[\s\S]*?```/g, '')
}

export function tidy(value: string): string {
  return value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}
