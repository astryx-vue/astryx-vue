import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'

async function run(argv: string[], cwd?: string) {
  return runCli(argv, cwd ? { cwd } : {})
}

/** A project directory with the files that decide the package manager. */
async function project(files: Record<string, string> = {}): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-init-'))
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(dir, path, '..'), { recursive: true })
    await writeFile(join(dir, path), content)
  }
  return dir
}

interface InitData {
  features: string[]
  files: { path: string, action: string }[]
  guide: {
    packageManager: string | null
    packageManagerSource: string | null
    lockfile: string | null
    packages: { name: string, version: string, canary: boolean, specifier: string, install: string[] }[]
    steps: { id: string, title: string, text?: string, code?: string, commands?: string[] }[]
  }
}

describe('init guide', () => {
  it('reads the package manager from the packageManager field', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo', packageManager: 'pnpm@9.12.0' }) })
    try {
      const data = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      expect(data.guide.packageManager).toBe('pnpm')
      expect(data.guide.packageManagerSource).toBe('packageManager')
      const install = data.guide.steps.find(step => step.id === 'install')
      // The install command in the docs is rewritten for the project's manager.
      expect(install?.commands).toEqual(['pnpm add @astryx-vue/core @astryx-vue/themes'])
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('falls back to the lockfile, then lists every form', async () => {
    const yarn = await project({ 'package.json': '{"name":"demo"}', 'yarn.lock': '' })
    const bun = await project({ 'package.json': '{"name":"demo"}', 'bun.lockb': '' })
    const nothing = await project({ 'package.json': '{"name":"demo"}' })
    try {
      const fromLock = assertResponse((await run(['init', '--json'], yarn)).stdout, 'init.run').data as InitData
      expect(fromLock.guide).toMatchObject({ packageManager: 'yarn', packageManagerSource: 'lockfile', lockfile: 'yarn.lock' })
      expect(fromLock.guide.steps[0]?.commands).toEqual(['yarn add @astryx-vue/core @astryx-vue/themes'])

      const fromBun = assertResponse((await run(['init', '--json'], bun)).stdout, 'init.run').data as InitData
      expect(fromBun.guide.packageManager).toBe('bun')

      const unknown = assertResponse((await run(['init', '--json'], nothing)).stdout, 'init.run').data as InitData
      expect(unknown.guide.packageManager).toBeNull()
      expect(unknown.guide.steps[0]?.commands).toEqual([
        'pnpm add @astryx-vue/core @astryx-vue/themes',
        'npm install @astryx-vue/core @astryx-vue/themes',
        'yarn add @astryx-vue/core @astryx-vue/themes',
        'bun add @astryx-vue/core @astryx-vue/themes',
      ])
    }
    finally {
      await rm(yarn, { recursive: true, force: true })
      await rm(bun, { recursive: true, force: true })
      await rm(nothing, { recursive: true, force: true })
    }
  })

  it('names every package, and installs a canary package with the tag', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo"}', 'pnpm-lock.yaml': '' })
    try {
      const data = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      expect(data.guide.packages.map(pkg => pkg.name)).toEqual(catalog.packages.map(pkg => pkg.name))
      const charts = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/charts')
      expect(charts).toMatchObject({ canary: true, specifier: '@astryx-vue/charts@canary', install: ['pnpm add @astryx-vue/charts@canary'] })
      const richtext = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/richtext')
      expect(richtext).toMatchObject({ canary: false, specifier: '@astryx-vue/richtext' })
      // A released package is introduced as-is; a canary one says so.
      expect(richtext?.install).toEqual(['pnpm add @astryx-vue/richtext'])
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('takes the theme import and locale snippet from the docs pages', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo"}' })
    try {
      const data = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      const theme = data.guide.steps.find(step => step.id === 'theme')
      const locale = data.guide.steps.find(step => step.id === 'locale')
      expect(theme?.code).toBe(catalog.setup.themeImport.en)
      expect(theme?.code).toContain('@astryx-vue/themes/neutral.css')
      expect(locale?.code).toBe(catalog.setup.localeCode.en)
      expect(locale?.code).toContain('provideAstryxLocale')
      expect(data.guide.steps.map(step => step.id)).toEqual(['install', 'theme', 'locale', 'verify', 'lookup'])
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('prints the guide as text and still writes the managed block', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo', packageManager: 'npm@10.0.0' }) })
    try {
      const result = await run(['init'], cwd)
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('astryx-vue init')
      expect(result.stdout).toContain('Package manager: npm')
      expect(result.stdout).toContain('npm install @astryx-vue/core @astryx-vue/themes')
      expect(result.stdout).toContain('import \'@astryx-vue/themes/neutral.css\'')
      expect(result.stdout).toContain('Created AGENTS.md')
      expect(result.stdout).toContain('@astryx-vue/charts@canary')

      const block = await readFile(join(cwd, 'AGENTS.md'), 'utf8')
      expect(block).toContain('## Packages')
      expect(block).toContain('`@astryx-vue/richtext`')
      expect(block).toContain('canary only')
      expect(block).toContain('`@astryx-vue/lab@canary`')

      const dense = await run(['init', '--dense'], cwd)
      expect(dense.stdout.length).toBeLessThan(result.stdout.length)
      expect(dense.stdout).not.toContain('Packages this catalog covers')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes the block in Chinese with --zh', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo","packageManager":"pnpm@9.0.0"}' })
    try {
      const result = await run(['init', '--zh'], cwd)
      expect(result.stdout).toContain('包管理器：pnpm')
      expect(result.stdout).toContain('已创建 AGENTS.md')
      const block = await readFile(join(cwd, 'AGENTS.md'), 'utf8')
      expect(block).toContain('## 包')
      expect(block).toContain('canary 预览')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
