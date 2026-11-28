import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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
  agentDocsStatus: string | null
  guide: {
    packageManager: string | null
    packageManagerSource: string | null
    lockfile: string | null
    packages: { name: string, version: string, canary: boolean, published: boolean, specifier: string | null, install: string[] }[]
    steps: { id: string, title: string, text?: string, code?: string, commands?: string[] }[]
  }
}

describe('init guide', () => {
  it('writes agent docs at the project root when run from a subfolder', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo' }), 'src/pages/.keep': '' })
    try {
      const data = assertResponse((await run(['init', '--features', 'agents', '--json'], join(cwd, 'src/pages'))).stdout, 'init.run').data as InitData
      expect(data.files.map(file => file.path)).toEqual(['AGENTS.md'])
      expect(await readFile(join(cwd, 'AGENTS.md'), 'utf8')).toContain('astryx')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

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

  it('names every package, and only prints an install command for one npm serves', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo"}', 'pnpm-lock.yaml': '' })
    try {
      const data = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      expect(data.guide.packages.map(pkg => pkg.name)).toEqual(catalog.packages.map(pkg => pkg.name))
      const core = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/core')
      expect(core).toMatchObject({ canary: false, published: true, specifier: '@astryx-vue/core', install: ['pnpm add @astryx-vue/core'] })
      const richtext = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/richtext')
      expect(richtext).toMatchObject({ canary: false, published: true, specifier: '@astryx-vue/richtext', install: ['pnpm add @astryx-vue/richtext'] })
      const charts = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/charts')
      expect(charts).toMatchObject({ canary: false, published: true, specifier: '@astryx-vue/charts', install: ['pnpm add @astryx-vue/charts'] })
      const lab = data.guide.packages.find(pkg => pkg.name === '@astryx-vue/lab')
      expect(lab).toMatchObject({ canary: true, published: true, specifier: '@astryx-vue/lab@canary', install: ['pnpm add @astryx-vue/lab@canary'] })
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('uses the canary tag for canary-only packages', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo","packageManager":"pnpm@9.0.0"}' })
    try {
      const result = await run(['init'], cwd)
      expect(catalog.packages.every(pkg => pkg.published)).toBe(true)
      expect(result.stdout).toContain('pnpm add @astryx-vue/lab@canary')

      const block = await readFile(join(cwd, 'AGENTS.md'), 'utf8')
      expect(block).toContain('`@astryx-vue/lab@canary`')
      expect(block).toContain('canary only')
      expect(block).not.toContain('not on npm yet')
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
      expect(result.stdout).toContain('npm install @astryx-vue/richtext')
      expect(result.stdout).toContain('npm install @astryx-vue/charts')
      expect(result.stdout).toContain('npm install @astryx-vue/lab@canary')
      expect(result.stdout).not.toContain('Not on npm yet, so there is nothing to install:')

      const block = await readFile(join(cwd, 'AGENTS.md'), 'utf8')
      expect(block).toContain('## Packages')
      expect(block).toContain('`@astryx-vue/richtext`')
      expect(block).toContain('`@astryx-vue/charts`')
      expect(block).toContain('`@astryx-vue/lab@canary`')
      expect(block).not.toContain('not on npm yet')

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
      expect(block).toContain('`@astryx-vue/lab@canary`')
      expect(block).not.toContain('还没发布到 npm')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('names only the starter packages the project lacks, themes at its Core release', async () => {
    const ranged = await project({ 'package.json': JSON.stringify({ name: 'demo', packageManager: 'pnpm@9.0.0', dependencies: { '@astryx-vue/core': '^0.8.0' } }) })
    const pinned = await project({ 'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': '0.8.0' } }), 'package-lock.json': '{}' })
    const cloned = await project({ 'package.json': JSON.stringify({ name: 'demo', packageManager: 'pnpm@9.0.0', dependencies: { '@astryx-vue/core': '0.8.0', '@astryx-vue/themes': '0.8.0' } }) })
    const ready = await project({
      'package.json': JSON.stringify({ name: 'demo', packageManager: 'pnpm@9.0.0', dependencies: { '@astryx-vue/core': '0.8.0', '@astryx-vue/themes': '0.8.0' } }),
      'node_modules/@astryx-vue/core/package.json': '{}',
      'node_modules/@astryx-vue/themes/package.json': '{}',
    })
    const installStep = async (cwd: string) => (assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData).guide.steps.find(step => step.id === 'install')
    try {
      const fromRange = await installStep(ranged)
      expect(fromRange?.commands).toEqual(['pnpm add @astryx-vue/themes@0.8.0'])
      expect(fromRange?.text).toContain('already lists @astryx-vue/core')
      expect((await installStep(pinned))?.commands).toEqual(['npm install -E @astryx-vue/themes@0.8.0'])
      expect((await installStep(cloned))?.commands).toEqual(['pnpm install'])
      const done = await installStep(ready)
      expect(done?.commands).toEqual([])
      expect(done?.text).toContain('nothing to install')
    }
    finally {
      for (const dir of [ranged, pinned, cloned, ready])
        await rm(dir, { recursive: true, force: true })
    }
  })

  it('says what it did to each agent file, and prints the lookups once the project is set up', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo', packageManager: 'pnpm@9.0.0' }) })
    try {
      const first = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      expect(first).toMatchObject({ agentDocsStatus: 'missing', files: [{ path: 'AGENTS.md', action: 'created' }] })

      const again = await run(['init'], cwd)
      expect(again.stdout).toContain('this project is already set up')
      expect(again.stdout).toContain('astryx-vue build "<one sentence>"')
      expect(again.stdout).toContain('astryx-vue search <query>')
      expect(again.stdout).toContain('AGENTS.md already current, nothing changed')
      expect(again.stdout).not.toContain('Install the packages')
      const againJson = assertResponse((await run(['init', '--json'], cwd)).stdout, 'init.run').data as InitData
      expect(againJson).toMatchObject({ agentDocsStatus: 'current', files: [{ path: 'AGENTS.md', action: 'unchanged' }] })
      expect(againJson.guide.steps.map(step => step.id)).toEqual(['install', 'theme', 'locale', 'verify', 'lookup'])

      const zh = await run(['init', '--zh'], cwd)
      expect(zh.stdout).toContain('已更新受管理区块于 AGENTS.md')
      expect((await run(['init', '--zh'], cwd)).stdout).toContain('AGENTS.md 已是最新，没有改动')

      const file = join(cwd, 'AGENTS.md')
      await writeFile(file, (await readFile(file, 'utf8')).replace('怎么查', '过期的说明'))
      const stale = await run(['init', '--zh', '--json'], cwd)
      expect(assertResponse(stale.stdout, 'init.run').data).toMatchObject({ agentDocsStatus: 'stale', files: [{ action: 'updated' }] })
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it.skipIf(process.getuid?.() === 0)('leaves a current file unwritten, and names the reason and the fix when it cannot write', async () => {
    const cwd = await project({ 'package.json': '{"name":"demo"}' })
    const file = join(cwd, 'AGENTS.md')
    try {
      await run(['init'], cwd)
      await chmod(file, 0o444)
      const current = await run(['init', '--json'], cwd)
      expect(current.exitCode).toBe(0)
      expect(assertResponse(current.stdout, 'init.run').data).toMatchObject({ files: [{ action: 'unchanged' }] })

      const failed = await run(['init', '--zh', '--json'], cwd)
      expect(failed.exitCode).toBe(1)
      const error = JSON.parse(failed.stdout) as { code: string, error: string }
      expect(error.code).toBe('ERR_WRITE_FAILED')
      expect(error.error).toContain('Could not write AGENTS.md: permission denied (EACCES)')
      expect(error.error).toContain('--agent-docs-path')
    }
    finally {
      await chmod(file, 0o644).catch(() => {})
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
