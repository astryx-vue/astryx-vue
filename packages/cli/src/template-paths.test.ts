import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
import { homeRelativePath, tempFolders } from './template-paths.ts'

async function run(argv: string[], cwd: string) {
  return runCli(argv, { cwd })
}

async function project(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-template-paths-'))
  await writeFile(join(dir, 'package.json'), `${JSON.stringify({ name: 'demo', dependencies: { vue: '^3.5.0' } }, null, 2)}\n`)
  return dir
}

describe('template paths', () => {
  it('writes an absolute path inside the project exactly as its relative path and says what was given', async () => {
    const cwd = await project()
    try {
      const absolute = join(cwd, 'src/pages/Sign.vue')
      const result = await run(['template', 'login-card', absolute, '--json'], cwd)
      const data = assertResponse(result.stdout, 'template.copy').data as { outputPath: string, givenPath?: string, scratch?: boolean }
      expect(data.outputPath).toBe('src/pages/Sign.vue')
      expect(data.givenPath).toBe(absolute)
      expect(data.scratch).toBeUndefined()
      expect(existsSync(absolute)).toBe(true)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes a scratch copy to an absolute path in the system temp folder', async () => {
    expect(tempFolders().length).toBeGreaterThan(0)
    const cwd = await project()
    const scratch = await mkdtemp(join(tmpdir(), 'astryx-vue-scratch-'))
    // The project is its own folder; the scratch folder is a sibling in the temp folder.
    const file = join(scratch, 'Copy.vue')
    try {
      const result = await run(['template', 'login-card', file, '--json'], cwd)
      expect(result.exitCode).toBe(0)
      const data = assertResponse(result.stdout, 'template.copy').data as { outputPath: string, scratch?: boolean }
      expect(data.scratch).toBe(true)
      expect(data.outputPath).toBe(file)
      expect((await readFile(file, 'utf8')).length).toBeGreaterThan(50)

      const again = await run(['template', 'login-card', file, '--json'], cwd)
      expect(again.exitCode).toBe(1)
      const envelope = parseResponse(again.stdout)
      expect(isError(envelope) && envelope.code).toBe('ERR_FILE_EXISTS')
      expect((await run(['template', 'login-card', file, '--overwrite'], cwd)).exitCode).toBe(0)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
      await rm(scratch, { recursive: true, force: true })
    }
  })

  it('does not take a scratch copy outside the temp folder, and says what does work', async () => {
    const cwd = await project()
    try {
      const result = await run(['template', 'login-card', '/etc/astryx-vue-nowhere/Login.vue', '--json'], cwd)
      expect(result.exitCode).toBe(2)
      const envelope = parseResponse(result.stdout)
      expect(isError(envelope)).toBe(true)
      if (isError(envelope)) {
        expect(envelope.code).toBe('ERR_PATH_TRAVERSAL')
        expect(envelope.error).toContain('outside the project root')
        const commands = (envelope.suggestions ?? []).map(item => item.name)
        expect(commands).toContain('astryx-vue template login-card src/pages/LoginCard.vue')
        expect(commands).toContain('astryx-vue template login-card')
      }
      expect(existsSync('/etc/astryx-vue-nowhere')).toBe(false)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('reads ~/ as the home folder, never as a folder named ~', async () => {
    expect(homeRelativePath('~/x/Page.vue', '/home/someone')).toBe(join('/home/someone', 'x/Page.vue'))
    expect(homeRelativePath('~', '/home/someone')).toBe('/home/someone')
    for (const other of ['src/pages', './~/x', '~other/x', 'a~/x'])
      expect(homeRelativePath(other, '/home/someone')).toBe(other)

    const cwd = await project()
    try {
      const result = await run(['template', 'login-card', '~/astryx-vue-nowhere/Login.vue', '--json'], cwd)
      expect(result.exitCode).toBe(2)
      expect(existsSync(join(cwd, '~'))).toBe(false)
      expect(existsSync(join(homedir(), 'astryx-vue-nowhere'))).toBe(false)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('names the next free file when the printed destination is taken', async () => {
    const cwd = await project()
    try {
      expect((await run(['template', 'login-card', 'src/pages/LoginCard.vue'], cwd)).exitCode).toBe(0)
      const result = await run(['template', 'login-card', '/etc/astryx-vue-nowhere/Login.vue', '--json'], cwd)
      const envelope = parseResponse(result.stdout)
      expect(isError(envelope) && (envelope.suggestions ?? []).map(item => item.name)).toContain('astryx-vue template login-card src/pages/LoginCard2.vue')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})

describe('one read of several components', () => {
  it('prints each record in turn, and JSON carries them together', async () => {
    const cwd = await project()
    const text = await run(['component', 'Badge', 'Card'], cwd)
    expect(text.exitCode).toBe(0)
    expect(text.stdout).toContain('# Badge')
    expect(text.stdout).toContain('# Card')
    const json = await run(['component', 'Badge', 'Card', '--json'], cwd)
    const data = assertResponse(json.stdout, 'component.details').data as { components: { name: string }[] }
    expect(data.components.map(item => item.name)).toEqual(['Badge', 'Card'])
    await rm(cwd, { recursive: true, force: true })
  })

  it('names a template\'s components in that form, after a copy and in the printed page', async () => {
    const cwd = await project()
    try {
      const copy = await run(['template', 'login-card', 'src/pages/Login.vue'], cwd)
      expect(copy.stdout).toMatch(/Read the components it uses in one call: astryx-vue component Button /)
      const shown = await run(['template', 'login-card', '--json'], cwd)
      const data = assertResponse(shown.stdout, 'template.show').data as { componentsToRead: string[] }
      expect(data.componentsToRead).toContain('Button')
      expect(data.componentsToRead).not.toContain('useToast')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
