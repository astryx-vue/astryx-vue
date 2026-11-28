import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  countLines,
  evaluateLineLimit,
  findExclude,
  runLineLimitCheck,
  selectSourceFiles,
} from '../scripts/check-line-limit.mjs'

let rootDir: string
let files: string[]

function lines(count: number) {
  return 'x\n'.repeat(count)
}

async function put(file: string, count: number) {
  await mkdir(dirname(join(rootDir, file)), { recursive: true })
  await writeFile(join(rootDir, file), lines(count))
  files.push(file)
}

function check() {
  return runLineLimitCheck({ rootDir, listFiles: () => files })
}

beforeEach(async () => {
  rootDir = await mkdtemp(join(tmpdir(), 'line-limit-'))
  files = []
})

afterEach(async () => {
  await rm(rootDir, { recursive: true, force: true })
})

describe('countLines', () => {
  it('counts newlines the way wc -l does', () => {
    expect(countLines('')).toBe(0)
    expect(countLines('a')).toBe(0)
    expect(countLines('a\n')).toBe(1)
    expect(countLines('a\nb')).toBe(1)
    expect(countLines('a\nb\n')).toBe(2)
  })
})

describe('check-line-limit', () => {
  it('passes when every file is within the limit', async () => {
    await put('src/a.ts', 500)
    const result = check()
    expect(result.errors).toEqual([])
  })

  it('fails a new file over the limit, with file, count, limit and advice', async () => {
    await put('src/big.vue', 501)
    const result = check()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('src/big.vue')
    expect(result.errors[0]).toContain('501 行')
    expect(result.errors[0]).toContain('500 行')
    expect(result.errors[0]).toContain('拆成职责单一的小模块')
  })

  it('skips excluded files and non-source extensions', async () => {
    const skipped = [
      'packages/core/src/Button/Button.test.ts',
      'packages/core/src/Button/Button.spec.ts',
      'tests/anything.ts',
      'packages/core/src/index.ts',
      'packages/core/src/composables/index.ts',
      'packages/core/src/locale/messages.ts',
      'packages/cli/src/generated/catalog.ts',
      'packages/core/dist/index.js',
      'apps/docs/public/vendor/lib.js',
      'docs/zh/guide.md',
      'packages/core/styles/button.css',
    ]
    for (const file of skipped)
      await put(file, 900)
    expect(check().errors).toEqual([])
    expect(selectSourceFiles(skipped)).toEqual([])
  })

  it('records a reason for every exclude rule', () => {
    const rule = findExclude('packages/core/src/index.ts')
    expect(rule?.reason).toBeTruthy()
    expect(findExclude('packages/core/src/Button/Button.vue')).toBeUndefined()
  })

  it('counts every supported source extension', () => {
    const all = ['a.ts', 'a.tsx', 'a.mts', 'a.js', 'a.mjs', 'a.cjs', 'a.vue', 'a.py', 'a.json']
    expect(selectSourceFiles(all)).toEqual(['a.cjs', 'a.js', 'a.mjs', 'a.mts', 'a.ts', 'a.tsx', 'a.vue'])
  })

  it('evaluateLineLimit works on a fake file list without touching the disk', () => {
    const result = evaluateLineLimit({
      lineCounts: new Map([['a.ts', 501], ['b.ts', 700], ['c.ts', 500]]),
      limit: 500,
    })
    expect(result.errors).toHaveLength(2)
    expect(result.errors.join('\n')).toContain('a.ts')
    expect(result.errors.join('\n')).toContain('b.ts')
  })
})
