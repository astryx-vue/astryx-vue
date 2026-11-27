/**
 * Theme fonts ship with the packages. A theme stylesheet never fetches a font
 * from a font service: every face comes from an `@fontsource` package the
 * themes package depends on, so a page loads its fonts from its own origin.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(process.cwd(), 'packages/themes')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { dependencies: Record<string, string> }

const sheets = [
  ...readdirSync(root).filter(name => name.endsWith('.css')),
  ...readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
    .flatMap(entry => readdirSync(join(root, entry.name))
      .filter(name => name.endsWith('.css'))
      .map(name => `${entry.name}/${name}`)),
]

describe('theme fonts are bundled', () => {
  it.each(sheets)('%s loads no font from a font service', (sheet) => {
    const css = readFileSync(join(root, sheet), 'utf8')
    expect(css).not.toMatch(/fonts\.(googleapis|gstatic)\.com/)
    expect(css).not.toMatch(/@import\s+url\(\s*['"]?https?:/)
  })

  it.each(sheets)('%s imports only fonts the package depends on', (sheet) => {
    const css = readFileSync(join(root, sheet), 'utf8')
    for (const match of css.matchAll(/@import\s+'((@fontsource(?:-variable)?\/[^/']+)\/[^']+)';/g)) {
      const [, specifier, packageName] = match
      expect(manifest.dependencies, specifier).toHaveProperty([packageName!])
      expect(existsSync(join(root, 'node_modules', specifier!)), specifier).toBe(true)
    }
  })

  it('each theme font family is imported by its theme', () => {
    const families: Record<string, string[]> = {
      butter: ['outfit', 'sarina'],
      chocolate: ['albert-sans', 'fraunces'],
      gothic: ['fustat', 'manufacturing-consent', 'unifrakturmaguntia'],
      matcha: ['dm-sans', 'playwrite-us-trad'],
      stone: ['montserrat'],
      y2k: ['crimson-text', 'poppins'],
    }
    for (const [theme, names] of Object.entries(families)) {
      const css = readFileSync(join(root, theme, 'base.css'), 'utf8')
      for (const name of names)
        expect(css, `${theme} imports ${name}`).toContain(`/${name}/`)
    }
  })
})
