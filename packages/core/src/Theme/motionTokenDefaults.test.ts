import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { durationDefaults, easeDefaults } from './motionTokenDefaults.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'

const baseCss = readFileSync(join(process.cwd(), 'packages/themes/neutral/base.css'), 'utf8')

function declared(name: string): string | undefined {
  const match = new RegExp(`${name}:\\s*([^;]+);`).exec(baseCss)
  return match?.[1]?.trim()
}

describe('motionTokenDefaults', () => {
  it.each(Object.entries({ ...durationDefaults, ...easeDefaults }))('%s is what the neutral stylesheet declares', (name, value) => {
    expect(declared(normalizeTokenName(name))).toBe(prefixTokenReferences(value))
  })
})
