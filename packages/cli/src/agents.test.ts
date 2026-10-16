import { describe, expect, it } from 'vitest'
import { applyManagedBlock, MANAGED_BLOCK_END, MANAGED_BLOCK_START } from './agents.ts'

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

  it('is idempotent when the block is already current', () => {
    const created = applyManagedBlock(null, INNER)
    const again = applyManagedBlock(created.content, INNER)
    expect(again.action).toBe('unchanged')
    expect(again.content).toBe(created.content)

    const withNotes = applyManagedBlock(`before\n\n${created.content}after\n`, INNER)
    const twice = applyManagedBlock(withNotes.content, INNER)
    expect(twice.action).toBe('unchanged')
    expect(twice.content).toBe(withNotes.content)
    expect(twice.content.startsWith('before\n\n')).toBe(true)
    expect(twice.content.endsWith('after\n')).toBe(true)
  })
})
