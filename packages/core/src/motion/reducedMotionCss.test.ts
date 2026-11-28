/**
 * @file reducedMotionCss.test.ts
 * @input reducedMotionCss.ts, styles/motion.css and core's component styles
 * @output motion.css declares the cross-fade with reducedMotionFadeConsts'
 *   values, and every Reduce Motion fade arm in a component stylesheet that
 *   spells the fade's duration or curve as a literal spells those values
 * @position Unit test beside reducedMotion.test.ts: the plain-CSS side of the
 *   Reduced Motion policy keeps one definition of the fade
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { reducedMotionFadeConsts, reducedMotionKeys } from './reducedMotionCss'

const CORE = resolve(__dirname, '../..')

/** Every `.vue` and `.css` file under `dir`. */
function stylesheets(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '__tests__')
        files.push(...stylesheets(path))
    }
    else if (/\.(?:vue|css)$/.test(entry.name)) {
      files.push(path)
    }
  }
  return files
}

/** The body of each block opened by `query`, braces balanced. */
function blocksUnder(source: string, query: string): string[] {
  const blocks: string[] = []
  for (let at = source.indexOf(query); at >= 0; at = source.indexOf(query, at + 1)) {
    const open = source.indexOf('{', at)
    let depth = 0
    for (let i = open; i < source.length; i++) {
      if (source[i] === '{') {
        depth++
      }
      else if (source[i] === '}' && --depth === 0) {
        blocks.push(source.slice(open + 1, i))
        break
      }
    }
  }
  return blocks
}

describe('the plain-CSS side of the Reduced Motion policy', () => {
  it('motion.css declares the fade with the constants\' values', () => {
    const css = readFileSync(join(CORE, 'styles/motion.css'), 'utf8')
    expect(css).toContain(`--_astryx-reduced-motion-fade-duration: ${reducedMotionFadeConsts.duration};`)
    expect(css).toContain(`--_astryx-reduced-motion-fade-easing: ${reducedMotionFadeConsts.easing};`)
  })

  it('every fade arm that spells the fade\'s duration or curve spells the constants', () => {
    const offenders: string[] = []
    for (const path of [...stylesheets(join(CORE, 'src')), ...stylesheets(join(CORE, 'styles'))]) {
      for (const block of blocksUnder(readFileSync(path, 'utf8'), reducedMotionKeys.fade)) {
        for (const match of block.matchAll(/(?:transition|animation)-duration:\s*([\d.]+m?s)/g)) {
          // A zero duration applies a change at once; it is not a fade.
          if (Number.parseFloat(match[1]) !== 0 && match[1] !== reducedMotionFadeConsts.duration)
            offenders.push(`${path.slice(CORE.length)}: ${match[0]}`)
        }
        for (const match of block.matchAll(/cubic-bezier\([^)]*\)/g)) {
          if (match[0] !== reducedMotionFadeConsts.easing)
            offenders.push(`${path.slice(CORE.length)}: ${match[0]}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
