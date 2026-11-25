// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const styleDirs = [resolve(here, '../../styles'), resolve(here, '../../../lab/styles')]
const VARIABLE = '--_astryx-text-overflow-wrap'

function read(dir: string, file: string): string {
  return readFileSync(join(dir, file), 'utf8')
}

/** 每条声明块（不含嵌套）的正文。 */
function blocks(css: string): string[] {
  return [...css.matchAll(/\{([^{}]*)\}/g)].map(match => match[1]!)
}

describe('text overflow-wrap', () => {
  it('text and Heading wrap a long token unless a container passes its own wrap', () => {
    for (const file of ['text.css', 'heading.css'])
      expect(read(styleDirs[0]!, file)).toContain(`overflow-wrap: var(${VARIABLE}, break-word);`)
  })

  it('every style that wraps with anywhere passes it to the Text inside', () => {
    const missing: string[] = []
    for (const dir of styleDirs) {
      for (const file of readdirSync(dir).filter(name => name.endsWith('.css'))) {
        for (const block of blocks(read(dir, file))) {
          if (/(?:^|[;\s])overflow-wrap:\s*anywhere\s*;/.test(block) && !block.includes(`${VARIABLE}: anywhere;`))
            missing.push(`${file}: ${block.trim().split('\n')[0]}`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('a layer stops the variable, so Text in a popover keeps break-word', () => {
    expect(read(styleDirs[0]!, 'layer.css')).toContain(`${VARIABLE}: initial;`)
  })
})
