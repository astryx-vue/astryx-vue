import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, parseResponse } from './envelope.ts'

interface DoctorData {
  status: string
  checks: { id: string, status: string, detail: string, docsUrl?: string, commands?: string[] }[]
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

/** The `node_modules` folders an install leaves, so doctor finds the packages on disk. */
function installed(...names: string[]): Record<string, string> {
  return Object.fromEntries(names.map(name => [`node_modules/${name}/package.json`, JSON.stringify({ name })]))
}

const STARTERS = ['@astryx-vue/core', '@astryx-vue/themes', 'vue'] as const

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
      ...installed(...STARTERS),
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
        'button-actions:ok',
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
      ...installed(...STARTERS),
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
      ...installed(...STARTERS),
    })
    const custom = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
      'src/main.ts': 'import \'@astryx-vue/themes/my-own.css\'\n',
      ...installed(...STARTERS),
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

  it('tells a fresh clone to install its dependencies instead of adding the packages again', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({
        name: 'demo',
        packageManager: 'pnpm@9.12.0',
        dependencies: { '@astryx-vue/core': CORE_VERSION, '@astryx-vue/themes': CORE_VERSION, 'vue': '^3.5.0' },
      }),
      'src/main.ts': 'import \'@astryx-vue/themes/neutral.css\'\n',
    })
    const pnp = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': CORE_VERSION, '@astryx-vue/themes': CORE_VERSION, 'vue': '^3.5.0' } }),
      '.pnp.cjs': '',
    })
    try {
      const { data, exitCode } = await report(cwd)
      expect(exitCode).toBe(1)
      for (const id of ['core-version', 'themes-installed']) {
        const check = data.checks.find(candidate => candidate.id === id)
        expect(check?.status).toBe('fail')
        expect(check?.detail).toContain('not installed yet')
        expect(check?.commands).toEqual(['pnpm install'])
      }
      const text = await runCli(['doctor'], { cwd })
      expect(text.stdout).toContain('Run:\n        pnpm install')

      // Plug'n'Play keeps no node_modules folder, so nothing on disk says the install is missing.
      const underPnp = await report(pnp)
      expect(underPnp.data.checks.find(check => check.id === 'core-version')?.status).toBe('ok')
      expect(underPnp.data.checks.find(check => check.id === 'themes-installed')?.status).toBe('ok')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
      await rm(pnp, { recursive: true, force: true })
    }
  })

  it('finds packages a workspace installs in a folder above the app', async () => {
    const root = await project({
      ...installed(...STARTERS),
      'apps/web/package.json': JSON.stringify({ name: 'web', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
    })
    try {
      const { data } = await report(join(root, 'apps/web'))
      expect(data.checks.find(check => check.id === 'core-version')?.status).toBe('ok')
      expect(data.checks.find(check => check.id === 'themes-installed')?.status).toBe('ok')
    }
    finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('names the missing themes install in the project\'s manager, at its Core release, pinned like Core', async () => {
    const pinned = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': '0.8.0', 'vue': '^3.5.0' } }),
      'package-lock.json': '{}',
      ...installed('@astryx-vue/core', 'vue'),
    })
    const ranged = await project({
      'package.json': JSON.stringify({ name: 'demo', packageManager: 'yarn@4.0.0', dependencies: { '@astryx-vue/core': '^0.8.0', 'vue': '^3.5.0' } }),
      ...installed('@astryx-vue/core', 'vue'),
    })
    const empty = await project({ 'package.json': JSON.stringify({ name: 'demo' }), 'bun.lock': '' })
    try {
      const exact = await report(pinned)
      expect(exact.data.checks.find(check => check.id === 'themes-installed')?.commands).toEqual(['npm install -E @astryx-vue/themes@0.8.0'])

      const range = await report(ranged)
      expect(range.data.checks.find(check => check.id === 'themes-installed')?.commands).toEqual(['yarn add @astryx-vue/themes@0.8.0'])

      const nothing = await report(empty)
      expect(nothing.data.checks.find(check => check.id === 'core-version')?.commands).toEqual(['bun add @astryx-vue/core'])
      expect(nothing.data.checks.find(check => check.id === 'themes-installed')?.commands).toEqual(['bun add @astryx-vue/themes'])
    }
    finally {
      await rm(pinned, { recursive: true, force: true })
      await rm(ranged, { recursive: true, force: true })
      await rm(empty, { recursive: true, force: true })
    }
  })

  it('counts a theme set through Core\'s Theme or the dataset as wired', async () => {
    const base = {
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
      'src/main.ts': 'import \'@astryx-vue/themes/neutral.css\'\n',
      ...installed(...STARTERS),
    }
    const provider = await project({
      ...base,
      'src/App.vue': '<script setup lang="ts">\nimport { Theme } from \'@astryx-vue/core/Theme\'\nimport { brand } from \'./brand\'\n</script>\n\n<template>\n  <Theme :theme="brand">\n    <RouterView />\n  </Theme>\n</template>\n',
    })
    const dataset = await project({
      ...base,
      'src/theme.ts': 'export function setTheme(name: string) {\n  document.documentElement.dataset.astryxTheme = name\n}\n',
    })
    const unrelated = await project({
      ...base,
      'src/App.vue': '<script setup lang="ts">\nimport Theme from \'./MyTheme.vue\'\n</script>\n\n<template>\n  <Theme />\n</template>\n',
    })
    try {
      const wired = (await report(provider)).data.checks.find(check => check.id === 'theme-attribute')
      expect(wired?.status).toBe('ok')
      expect(wired?.detail).toContain('src/App.vue:7')

      const fromScript = (await report(dataset)).data.checks.find(check => check.id === 'theme-attribute')
      expect(fromScript?.status).toBe('ok')
      expect(fromScript?.detail).toContain('src/theme.ts:2')

      expect((await report(unrelated)).data.checks.find(check => check.id === 'theme-attribute')?.status).toBe('warn')
    }
    finally {
      await rm(provider, { recursive: true, force: true })
      await rm(dataset, { recursive: true, force: true })
      await rm(unrelated, { recursive: true, force: true })
    }
  })

  it('warns about a Core button that does nothing when pressed, without failing', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${CORE_VERSION}`, '@astryx-vue/themes': `^${CORE_VERSION}`, 'vue': '^3.5.0' } }),
      'src/main.ts': 'import \'@astryx-vue/themes/neutral.css\'\n',
      'index.html': '<html data-astryx-theme="neutral"></html>\n',
      'src/App.vue': '<script setup lang="ts">\nimport { Button } from \'@astryx-vue/core/Button\'\n</script>\n\n<template>\n  <Button label="Save" />\n  <Button label="Undo" @click="() => {}" />\n  <Button label="Open" @click="open" />\n</template>\n',
      ...installed(...STARTERS),
    })
    try {
      const { data, exitCode } = await report(cwd)
      expect(exitCode).toBe(0)
      const check = data.checks.find(candidate => candidate.id === 'button-actions') as { status: string, detail: string, fix?: string } | undefined
      expect(check?.status).toBe('warn')
      expect(check?.detail).toBe('2 buttons do nothing when pressed: src/App.vue:6 "Save", src/App.vue:7 "Undo" (empty handler).')
      expect(check?.fix).toContain('is-disabled')

      const text = await runCli(['doctor', '--zh'], { cwd })
      expect(text.stdout).toContain('2 个按钮按下后什么都不做：src/App.vue:6 "Save"，src/App.vue:7 "Undo"（处理函数是空的）')
      expect(text.stdout).toContain('怎么改:')

      await writeFile(join(cwd, 'src/keys.ts'), 'window.addEventListener(\'click\', track)\n')
      const skipped = (await report(cwd)).data.checks.find(candidate => candidate.id === 'button-actions')
      expect(skipped).toMatchObject({ status: 'info' })
      expect(skipped?.detail).toContain('src/keys.ts:1')
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
