import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, parseResponse } from './envelope.ts'

interface DoctorData {
  status: string
  checks: { id: string, status: string, detail: string, docsUrl?: string }[]
}

async function project(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-doctor-'))
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(dir, path, '..'), { recursive: true })
    await writeFile(join(dir, path), content)
  }
  return dir
}

const CORE_VERSION = catalog.packages.find(pkg => pkg.name === '@astryx-vue/core')?.version ?? '0.0.0'

async function report(cwd: string, extra: string[] = []): Promise<{ data: DoctorData, exitCode: number }> {
  const result = await runCli(['doctor', '--json', ...extra], { cwd })
  return { data: assertResponse(result.stdout, 'doctor.report').data as DoctorData, exitCode: result.exitCode }
}

describe('doctor', () => {
  it('passes a project that installs the packages, loads a theme, and sets one', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({
        name: 'demo',
        dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' },
      }),
      'src/main.ts': 'import \'@astryx-vue/themes/neutral.css\'\n',
      'index.html': '<html data-astryx-theme="neutral"></html>\n',
    })
    try {
      const { data, exitCode } = await report(cwd)
      expect(exitCode).toBe(0)
      expect(data.status).toBe('ok')
      expect(data.checks.map(check => `${check.id}:${check.status}`)).toEqual([
        'core-version:ok',
        'themes-installed:ok',
        'vue-version:ok',
        'theme-stylesheet:ok',
        'theme-attribute:ok',
      ])
      expect(data.checks.every(check => check.detail.length > 0)).toBe(true)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('fails when nothing is installed, and exits 1 without a crash', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo' }) })
    try {
      const json = await report(cwd)
      expect(json.exitCode).toBe(1)
      expect(json.data.status).toBe('fail')
      expect(json.data.checks.find(check => check.id === 'core-version')?.status).toBe('fail')

      const text = await runCli(['doctor'], { cwd })
      expect(text.exitCode).toBe(1)
      expect(text.stdout).toContain('astryx-vue doctor')
      expect(text.stderr).toBe('')
      expect(text.stdout).toContain('doctor does not change anything for you.')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('warns about an older core and a missing theme attribute', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({
        name: 'demo',
        dependencies: { '@astryx-vue/core': '0.0.1', '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' },
      }),
      'src/main.ts': 'import \'@astryx-vue/themes/butter.css\'\n',
    })
    try {
      const { data, exitCode } = await report(cwd)
      expect(exitCode).toBe(0)
      expect(data.status).toBe('warn')
      const core = data.checks.find(check => check.id === 'core-version')
      expect(core?.status).toBe('warn')
      expect(core?.detail).toContain('astryx-vue upgrade')
      expect(core?.docsUrl).toContain('/en/guide/installation')
      expect(data.checks.find(check => check.id === 'theme-attribute')?.status).toBe('warn')
      expect(data.checks.find(check => check.id === 'theme-stylesheet')?.detail).toContain('butter.css')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('fails when no theme stylesheet is imported, and warns about an unknown file name', async () => {
    const bare = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
      'src/App.vue': '<template><Button label="hi" /></template>\n',
    })
    const custom = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
      'src/main.ts': 'import \'@astryx-vue/themes/my-own.css\'\n',
    })
    try {
      const missing = await report(bare)
      expect(missing.data.checks.find(check => check.id === 'theme-stylesheet')?.status).toBe('fail')
      expect(missing.exitCode).toBe(1)

      const unknown = await report(custom)
      expect(unknown.data.checks.find(check => check.id === 'theme-stylesheet')?.status).toBe('warn')
      expect(unknown.data.status).toBe('warn')
    }
    finally {
      await rm(bare, { recursive: true, force: true })
      await rm(custom, { recursive: true, force: true })
    }
  })

  it('never sends the reader to a package npm cannot serve', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo' }) })
    try {
      const unpublished = catalog.packages.filter(pkg => !pkg.published).map(pkg => pkg.name)
      expect(unpublished.length).toBeGreaterThan(0)
      const result = await runCli(['doctor'], { cwd })
      for (const name of unpublished)
        expect(result.stdout).not.toContain(name)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('speaks Chinese with --zh and refuses a positional argument', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo' }) })
    try {
      const chinese = await runCli(['doctor', '--zh'], { cwd })
      expect(chinese.stdout).toContain('只报告，不改文件')
      expect(chinese.stdout).toContain('没有安装')
      const extra = await runCli(['doctor', 'extra', '--json'], { cwd })
      expect(extra.exitCode).toBe(2)
      expect(parseResponse(extra.stdout)).toMatchObject({ code: 'ERR_INVALID_ARGUMENT' })
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
