/**
 * `docs --depth <n>` keeps a topic down to the heading level the reader asked
 * for: level 2 shows the topic's own title and its `##` sections and drops every
 * deeper subsection with its body. Code fences are skipped, so a `#` comment
 * inside a shell snippet is never mistaken for a heading.
 */

export interface DepthLimitedBody {
  body: string
  /** The topic's headings that survived, in their original order. */
  headings: string[]
}

export function limitBodyDepth(body: string, depth: number, headings: readonly string[]): DepthLimitedBody {
  const kept: string[] = []
  const seen: string[] = []
  let fence = false
  let dropping = false
  for (const line of body.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      fence = !fence
      if (!dropping)
        kept.push(line)
      continue
    }
    const heading = fence ? null : /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      const level = heading[1]!.length
      dropping = level > depth
      if (dropping)
        continue
      seen.push(heading[2]!.trim())
      kept.push(line)
      continue
    }
    if (!dropping)
      kept.push(line)
  }
  const present = new Set(seen)
  return { body: kept.join('\n'), headings: headings.filter(heading => present.has(heading)) }
}

/** The level a `--depth` value asks for: a positive whole number, and nothing else. */
export function parseDepth(value: string | boolean | undefined): number | null {
  if (value === undefined)
    return null
  const depth = Number(value)
  return Number.isInteger(depth) && depth >= 1 ? depth : Number.NaN
}
