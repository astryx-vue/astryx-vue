import { decodeHtml } from './text.ts'

/**
 * Lists the `<DemoExample>` blocks on a page and traces each `:demo` binding
 * back to the `components/demos/<folder>` import it came from.
 */

export interface PageExample {
  title: string
  description: string
  /** Binding passed to `<DemoExample :demo="...">`, resolved to a Vue file while building the catalog. */
  demo: string | null
  /** `demos/<folder>` the page imports that binding from. Null when the page does not import it. */
  folder: string | null
  /** Export name inside that folder. Differs from `demo` only when the page aliases the import. */
  exportName: string | null
  code: string
}

export function extractExamples(markdown: string): PageExample[] {
  const bindings = demoBindings(markdown)
  const examples: PageExample[] = []
  for (const match of markdown.matchAll(/<DemoExample\b([\s\S]*?)\/>/g)) {
    const attrs = match[1] ?? ''
    const title = readAttr(attrs, 'title')
    const description = decodeHtml(readAttr(attrs, 'description'))
    const demo = readDemo(attrs)
    if (!title && !description && !demo)
      continue
    const binding = demo ? bindings.get(demo) : undefined
    examples.push({
      title,
      description,
      demo,
      folder: binding?.folder ?? null,
      exportName: binding?.exportName ?? demo,
      code: '',
    })
  }
  return examples
}

function demoBindings(markdown: string): Map<string, { folder: string, exportName: string }> {
  const bindings = new Map<string, { folder: string, exportName: string }>()
  for (const match of markdown.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"][^'"]*components\/demos\/([^/'"]+)/g)) {
    const folder = match[2]
    if (!folder)
      continue
    for (const part of (match[1] ?? '').split(',')) {
      const trimmed = part.trim().replace(/^type\s+/, '')
      if (!trimmed)
        continue
      const [exported, alias] = trimmed.split(/\s+as\s+/)
      const exportName = exported?.trim()
      const binding = (alias ?? exported)?.trim()
      if (binding && exportName)
        bindings.set(binding, { folder, exportName })
    }
  }
  return bindings
}

function readAttr(source: string, name: string): string {
  const match = source.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]*)"`))
  return match?.[1]?.trim() ?? ''
}

function readDemo(source: string): string | null {
  const match = source.match(/:demo\s*=\s*"([^"]+)"/) ?? source.match(/(?:^|\s)demo\s*=\s*"([^"]+)"/)
  const value = match?.[1]?.trim() ?? ''
  if (!/^[a-z_$][\w$]*$/i.test(value))
    return null
  return value
}
