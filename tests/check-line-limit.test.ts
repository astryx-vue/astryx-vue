import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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
import { ALLOWLIST_FILE } from '../scripts/guardrails/line-limit.config.mjs'

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

async function putAllowlist(allowlist: Record<string, number>) {
  await mkdir(dirname(join(rootDir, ALLOWLIST_FILE)), { recursive: true })
  await writeFile(join(rootDir, ALLOWLIST_FILE), `${JSON.stringify(allowlist, null, 2)}\n`)
}

async function readAllowlistFile() {
  return JSON.parse(await readFile(join(rootDir, ALLOWLIST_FILE), 'utf8'))
}

function check(update = false) {
  return runLineLimitCheck({ rootDir, update, listFiles: () => files })
}

beforeEach(async () => {
  rootDir = await mkdtemp(join(tmpdir(), 'line-limit-'))
  files = []
  await putAllowlist({})
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
    expect(result.hints).toEqual([])
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

  it('fails an allowlisted file that grew', async () => {
    await put('src/old.ts', 610)
    await putAllowlist({ 'src/old.ts': 600 })
    const result = check()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('src/old.ts')
    expect(result.errors[0]).toContain('610 行')
    expect(result.errors[0]).toContain('600 行')
  })

  it('hints when an allowlisted file shrank but is still over the limit', async () => {
    await put('src/old.ts', 590)
    await putAllowlist({ 'src/old.ts': 600 })
    const result = check()
    expect(result.errors).toEqual([])
    expect(result.hints).toHaveLength(1)
    expect(result.hints[0]).toContain('可以收紧白名单')
  })

  it('fails an allowlisted file that dropped to the limit and asks to remove the entry', async () => {
    await put('src/old.ts', 500)
    await putAllowlist({ 'src/old.ts': 600 })
    const result = check()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('src/old.ts')
    expect(result.errors[0]).toContain('删掉这一条')
  })

  it('fails an allowlist entry whose file no longer exists', async () => {
    await putAllowlist({ 'src/gone.ts': 600 })
    const result = check()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('src/gone.ts')
    expect(result.errors[0]).toContain('不存在')
  })

  it('fails an allowlist entry whose file is now excluded', async () => {
    await put('src/old.test.ts', 600)
    await putAllowlist({ 'src/old.test.ts': 600 })
    const result = check()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('不在统计范围内')
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

  it('--update only tightens: lowers counts and drops stale entries, never adds or raises', async () => {
    await put('src/shrunk.ts', 590)
    await put('src/grown.ts', 620)
    await put('src/fixed.ts', 400)
    await put('src/new.ts', 700)
    await putAllowlist({
      'src/fixed.ts': 600,
      'src/gone.ts': 600,
      'src/grown.ts': 600,
      'src/shrunk.ts': 600,
    })

    const result = check(true)

    expect(result.updated).toBe(true)
    expect(await readAllowlistFile()).toEqual({
      'src/grown.ts': 600,
      'src/shrunk.ts': 590,
    })
    expect(result.errors).toHaveLength(2)
    expect(result.errors.join('\n')).toContain('src/new.ts')
    expect(result.errors.join('\n')).toContain('src/grown.ts')
  })

  it('evaluateLineLimit works on a fake file list without touching the disk', () => {
    const result = evaluateLineLimit({
      lineCounts: new Map([['a.ts', 501], ['b.ts', 700]]),
      allowlist: { 'b.ts': 700 },
      exists: () => true,
      limit: 500,
    })
    expect(result.errors).toHaveLength(1)
    expect(result.tightened).toEqual({ 'b.ts': 700 })
  })
})
