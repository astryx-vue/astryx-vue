import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { applyManagedBlock, removeManagedBlock } from './agents.ts'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'

async function project(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-remove-'))
  await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'demo' }))
  await mkdir(join(dir, 'src'), { recursive: true })
  return dir
}

describe('removeManagedBlock', () => {
  it('returns null when the text holds no block', () => {
    expect(removeManagedBlock('# Notes\n')).toBeNull()
  })

  it('keeps the text around the block and drops the blank line that set it apart', () => {
    const { content } = applyManagedBlock('# Notes\n\nMine.\n', 'inner')
    expect(removeManagedBlock(content)).toBe('# Notes\n\nMine.\n')
  })

  it('returns an empty string when the block was all the text', () => {
    expect(removeManagedBlock(applyManagedBlock(null, 'inner').content)).toBe('')
  })
})

describe('init --remove-agents', () => {
  it('takes the block out of a file with other text, from a subfolder', async () => {
    const cwd = await project()
    try {
      await writeFile(join(cwd, 'CLAUDE.md'), '# Mine\n\nKeep this.\n')
      await runCli(['init'], { cwd })
      expect(await readFile(join(cwd, 'CLAUDE.md'), 'utf8')).toContain('astryx-vue block end')

      const result = await runCli(['init', '--remove-agents', '--json'], { cwd: join(cwd, 'src') })
      expect(assertResponse(result.stdout, 'init.remove').data).toEqual({ files: [{ path: 'CLAUDE.md', action: 'removed' }] })
      expect(await readFile(join(cwd, 'CLAUDE.md'), 'utf8')).toBe('# Mine\n\nKeep this.\n')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('deletes a file the block was all of, and says so in text', async () => {
    const cwd = await project()
    try {
      await runCli(['init'], { cwd })
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(true)
      const result = await runCli(['init', '--remove-agents'], { cwd })
      expect(result.stdout).toContain('Deleted AGENTS.md')
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)

      const again = await runCli(['init', '--remove-agents'], { cwd })
      expect(again.exitCode).toBe(0)
      expect(again.stdout).toContain('nothing was removed')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('refuses to combine with --features or --agent', async () => {
    const cwd = await project()
    try {
      const result = await runCli(['init', '--remove-agents', '--agent', 'claude', '--json'], { cwd })
      expect(result.exitCode).toBe(2)
      expect(JSON.parse(result.stdout)).toMatchObject({ code: 'ERR_INVALID_ARGUMENT' })
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('names the removal in the block it writes', async () => {
    const cwd = await project()
    try {
      await runCli(['init'], { cwd })
      expect(await readFile(join(cwd, 'AGENTS.md'), 'utf8')).toContain('astryx-vue init --remove-agents')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
