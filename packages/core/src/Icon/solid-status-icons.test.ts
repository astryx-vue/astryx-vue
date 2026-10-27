import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/icon.css'), 'utf8')

function artwork(slug: string): string {
  const match = css.match(new RegExp(`\\.astryx-icon--${slug} \\{\\n\\s+--astryx-icon-artwork: ([^\\n]*)`))
  expect(match, `rule for ${slug}`).not.toBeNull()
  return decodeURIComponent(match![1]!).replaceAll('%27', '\'')
}

// Path data copied from upstream Icon/defaultIcons.tsx (v0.7.1).
const solid: Record<string, string> = {
  success: 'M12 3a9 9 0 100 18 9 9 0 000-18zm4.06 6.56a.75.75 0 00-1.12-1l-3.94 4.4-1.94-1.94a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.09-.03l4.47-5z',
  error: 'M12 3a9 9 0 100 18 9 9 0 000-18zm-2.47 5.47a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94l-2.47-2.47z',
  warning: 'M10.29 3.86L2.07 19.05A2 2 0 003.78 22h16.44a2 2 0 001.71-2.95L13.71 3.86a2 2 0 00-3.42 0zM12 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 9zm0 9a1 1 0 100-2 1 1 0 000 2z',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a1 1 0 100 2 1 1 0 000-2zm-.75 3.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5z',
}

describe('solid status icons', () => {
  for (const [slug, d] of Object.entries(solid)) {
    it(`${slug} uses the upstream filled path with even-odd fill`, () => {
      const art = artwork(slug)
      expect(art).toContain(`d='${d}'`)
      expect(art).toContain('fill=\'black\'')
      expect(art).toContain('fill-rule=\'evenodd\'')
      expect(art).toContain('clip-rule=\'evenodd\'')
      expect(art).not.toContain('stroke')
    })
  }

  it('stop is a filled rounded square', () => {
    const art = artwork('stop')
    expect(art).toContain('<rect x=\'6\' y=\'6\' width=\'12\' height=\'12\' rx=\'2\'/>')
    expect(art).not.toContain('stroke')
  })

  it('declares each status rule once', () => {
    for (const slug of ['success', 'error', 'warning', 'info'])
      expect(css.split(`.astryx-icon--${slug} {`).length - 1).toBe(1)
  })
})
