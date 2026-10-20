import { describe, expect, it } from 'vitest'
import { applyManagedBlock, existingAgentDocs, MANAGED_BLOCK_END, MANAGED_BLOCK_START, renderAgentBlock, resolveAgentTargets } from './agents.ts'
import { catalog } from './catalog.ts'

const INNER = 'Look up components with `astryx-vue component Button`.'
const NEXT = 'Look up components with `astryx-vue search`.'

describe('managed agent block', () => {
  it('creates a file that is only the managed block', () => {
    const result = applyManagedBlock(null, INNER)
    expect(result.action).toBe('created')
    expect(result.content.startsWith(`${MANAGED_BLOCK_START}\n`)).toBe(true)
    expect(result.content).toContain(INNER)
    expect(result.content.trimEnd().endsWith(MANAGED_BLOCK_END)).toBe(true)
    expect(result.content.endsWith('\n')).toBe(true)
  })

  it('refreshes an existing block and leaves the surrounding text alone', () => {
    const original = `# Project notes\n\nKeep this paragraph.\n\n${MANAGED_BLOCK_START}\nold instructions\n${MANAGED_BLOCK_END}\n\n## Local rules\n\nDo not touch this.\n`
    const updated = applyManagedBlock(original, NEXT)
    expect(updated.action).toBe('updated')
    expect(updated.content.startsWith('# Project notes\n\nKeep this paragraph.\n\n')).toBe(true)
    expect(updated.content).toContain(NEXT)
    expect(updated.content).not.toContain('old instructions')
    expect(updated.content.endsWith('## Local rules\n\nDo not touch this.\n')).toBe(true)
    expect(updated.content.match(new RegExp(MANAGED_BLOCK_START, 'g'))).toHaveLength(1)
  })

  it('appends a block when the markers are missing', () => {
    const original = '# Notes\n\nUser content.\n'
    const appended = applyManagedBlock(original, INNER)
    expect(appended.action).toBe('appended')
    expect(appended.content.startsWith('# Notes\n\nUser content.\n')).toBe(true)
    expect(appended.content).toContain(MANAGED_BLOCK_START)
    expect(appended.content).toContain(INNER)
  })

  it('rewrites the block on every call, including when the new text matches', () => {
    const created = applyManagedBlock(null, INNER)
    const again = applyManagedBlock(created.content, INNER)
    expect(again.action).toBe('updated')
    expect(again.content).toBe(created.content)

    const withNotes = `# Project notes\n\nKeep this paragraph.\n\n${MANAGED_BLOCK_START}\nstale instructions\n${MANAGED_BLOCK_END}\n\n## Local rules\n\nDo not touch this.\n`
    const first = applyManagedBlock(withNotes, INNER)
    const second = applyManagedBlock(first.content, NEXT)
    expect(first.action).toBe('updated')
    expect(second.action).toBe('updated')
    expect(second.content.startsWith('# Project notes\n\nKeep this paragraph.\n\n')).toBe(true)
    expect(second.content.endsWith('## Local rules\n\nDo not touch this.\n')).toBe(true)
    expect(second.content).toContain(NEXT)
    expect(second.content).not.toContain('stale instructions')
    expect(second.content).not.toContain(INNER)

    const third = applyManagedBlock(second.content, NEXT)
    expect(third.action).toBe('updated')
    expect(third.content).toBe(second.content)
  })
})

describe('agent block text', () => {
  it('names every lookup command and does not paste the catalog', () => {
    const english = renderAgentBlock(catalog, 'en', false)
    expect(english).toContain('astryx-vue component --list')
    expect(english).toContain('astryx-vue composable --list')
    expect(english).toContain('astryx-vue composable <Name>')
    expect(english).toContain('astryx-vue docs <topic>')
    expect(english).toContain('astryx-vue search <query>')
    expect(english).toContain('astryx-vue manifest --json')
    expect(english).not.toContain('CheckboxList')
    expect(english.split('\n').length).toBeLessThan(60)
  })

  it('uses the same commands in Simplified Chinese', () => {
    const chinese = renderAgentBlock(catalog, 'zh', false)
    expect(chinese).toContain('astryx-vue composable --list')
    expect(chinese).toContain('组合式函数')
    expect(chinese).toContain('astryx-vue docs')
    expect(chinese).toContain('astryx-vue search <query>')
  })

  it('teaches the three-step workflow and the corrected way to run the binary', () => {
    const english = renderAgentBlock(catalog, 'en', false)
    expect(english).toContain('## Workflow')
    expect(english).toContain('1. Start from a page. `astryx-vue build')
    expect(english).toContain('2. Copy it and make it yours. `astryx-vue template <slug>')
    expect(english).toContain('3. Look it up before writing.')
    expect(english).toContain('npx @astryx-vue/cli')
    expect(english).toContain('pnpm exec astryx-vue')
    expect(english).toContain('`"astryx-vue": "astryx-vue"`')
    expect(english).not.toContain('node node_modules')
    expect(english).not.toContain('path stays stable')

    const chinese = renderAgentBlock(catalog, 'zh', false)
    expect(chinese).toContain('## 工作流')
    expect(chinese).toContain('npx @astryx-vue/cli')
    expect(chinese).not.toContain('node node_modules')
  })

  it('drops the conventions in dense text but keeps the workflow', () => {
    const dense = renderAgentBlock(catalog, 'en', true)
    expect(dense).toContain('## Workflow')
    expect(dense).not.toContain('## Conventions')
    expect(dense.split('\n').length).toBeLessThan(renderAgentBlock(catalog, 'en', false).split('\n').length)
  })
})

describe('agent targets', () => {
  it('reuses what the project has, and falls back to AGENTS.md', () => {
    expect(resolveAgentTargets(null, [])).toEqual(['AGENTS.md'])
    expect(resolveAgentTargets(null, ['CLAUDE.md'])).toEqual(['CLAUDE.md'])
    expect(resolveAgentTargets(null, ['.cursorrules', 'AGENTS.md'])).toEqual(['AGENTS.md'])
    expect(resolveAgentTargets('claude', ['AGENTS.md'])).toEqual(['CLAUDE.md'])
    expect(resolveAgentTargets('hermes', [])).toEqual(['.hermes.md'])
    expect(resolveAgentTargets('hermes', ['HERMES.md'])).toEqual(['HERMES.md'])
  })

  it('writes every known file that exists for all, and one default when none do', () => {
    expect(resolveAgentTargets('all', [])).toEqual(['AGENTS.md'])
    expect(resolveAgentTargets('all', ['CLAUDE.md', '.hermes.md', 'package.json'])).toEqual(['CLAUDE.md', '.hermes.md'])
  })

  it('detects the known files in preference order', () => {
    const existing = new Set(['HERMES.md', 'CLAUDE.md'])
    expect(existingAgentDocs(file => existing.has(file))).toEqual(['CLAUDE.md', 'HERMES.md'])
  })
})
