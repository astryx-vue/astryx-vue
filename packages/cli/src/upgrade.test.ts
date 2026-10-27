import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'

interface UpgradeData {
  status: string
  package: string
  current: string | null
  latest: string
  guideUrl: string
  changelogUrl: string
  sections: { title: string, body: string }[]
  renames: { from: string, to: string }[]
  hits: { file: string, line: number, text: string, from: string, to: string }[]
  truncated: boolean
  notes: string[]
}

async function project(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-upgrade-'))
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(dir, path, '..'), { recursive: true })
    await writeFile(join(dir, path), content)
  }
  return dir
}

async function report(cwd: string, extra: string[] = []): Promise<UpgradeData> {
  return assertResponse((await runCli(['upgrade', '--json', ...extra], { cwd })).stdout, 'upgrade.report').data as UpgradeData
}

const OUTDATED_SOURCE = [
  'import { TextInput } from \'@astryx-vue/core/TextInput\'',
  '<TextInput label="Name" labelHidden />',
  'const theme = defineTheme({ components: { progressbar: { base: {} }, textarea: { base: {} } } })',
  '<textarea></textarea>',
  'useDismiss({ enableEscape: true })',
  '',
].join('\n')

describe('upgrade', () => {
  it('reads the installed version and compares it with the catalog', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': '^0.3.0' } }),
      'src/App.vue': OUTDATED_SOURCE,
    })
    try {
      const data = await report(cwd)
      expect(data.status).toBe('outdated')
      expect(data.package).toBe('@astryx-vue/core')
      expect(data.current).toBe('0.3.0')
      expect(data.latest).toBe(catalog.packages.find(pkg => pkg.name === '@astryx-vue/core')?.version)
      // The changes come from the upgrade guide, not from a second write-up.
      expect(data.sections).toEqual(catalog.upgrade.sections.en)
      expect(data.sections.some(section => section.title.includes('labelHidden'))).toBe(true)
      expect(data.guideUrl).toBe(catalog.upgrade.guideUrl.en)
      expect(data.changelogUrl).toBe(catalog.upgrade.changelogUrl.en)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('lists the lines that still use an old name, and only those lines', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': '0.3.0' } }),
      'src/App.vue': OUTDATED_SOURCE,
      'src/ok.vue': '<template><Button label="fine" /></template>\n',
      'node_modules/@astryx-vue/core/index.js': 'labelHidden\n',
    })
    try {
      const data = await report(cwd)
      const found = data.hits.map(hit => `${hit.file}:${hit.line}:${hit.from}`)
      expect(found).toContain('src/App.vue:2:labelHidden')
      expect(found).toContain('src/App.vue:3:progressbar')
      expect(found).toContain('src/App.vue:3:textarea')
      expect(found).toContain('src/App.vue:5:enableEscape')
      // An HTML tag is not a theme target key, and installed packages are not
      // the reader's code.
      expect(data.hits.some(hit => hit.line === 4)).toBe(false)
      expect(data.hits.every(hit => !hit.file.startsWith('node_modules'))).toBe(true)
      expect(data.hits.every(hit => hit.from !== hit.to)).toBe(true)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('says nothing is needed when the project is current', async () => {
    const latest = catalog.packages.find(pkg => pkg.name === '@astryx-vue/core')?.version ?? '0.0.0'
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': `^${latest}` } }) })
    try {
      const data = await report(cwd)
      expect(data.status).toBe('up-to-date')
      expect(data.sections).toEqual([])
      expect(data.hits).toEqual([])
      const text = await runCli(['upgrade'], { cwd })
      expect(text.stdout).toContain('Nothing to upgrade.')
      expect(text.stdout).toContain(data.changelogUrl)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('points at the install command when core is not a dependency', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo' }), 'pnpm-lock.yaml': '' })
    try {
      const data = await report(cwd)
      expect(data.status).toBe('not-installed')
      expect(data.notes).toEqual(['pnpm add @astryx-vue/core'])
      const text = await runCli(['upgrade'], { cwd })
      expect(text.stdout).toContain('pnpm add @astryx-vue/core')
      expect(text.stdout).toContain(data.guideUrl)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('does not pretend to know a version it cannot read', async () => {
    const cwd = await project({ 'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': 'workspace:*' } }) })
    try {
      const data = await report(cwd)
      expect(data.status).toBe('unknown')
      expect(data.current).toBeNull()
      expect(data.sections).toEqual([])
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('prints the guide sections and the hits as text, and speaks Chinese with --zh', async () => {
    const cwd = await project({
      'package.json': JSON.stringify({ name: 'demo', dependencies: { '@astryx-vue/core': '0.3.0' } }),
      'src/App.vue': OUTDATED_SOURCE,
    })
    try {
      const full = await runCli(['upgrade'], { cwd })
      expect(full.stdout).toContain('@astryx-vue/core 0.3.0 → ')
      expect(full.stdout).toContain('What changed:')
      expect(full.stdout).toContain('src/App.vue:2')
      expect(full.stdout).toContain('Read only: upgrade changes no file.')

      const dense = await runCli(['upgrade', '--dense'], { cwd })
      expect(dense.stdout.length).toBeLessThan(full.stdout.length)
      expect(dense.stdout).not.toContain('What changed:')

      const chinese = await runCli(['upgrade', '--zh'], { cwd })
      expect(chinese.stdout).toContain('升级指南')
      expect(chinese.stdout).toContain('只读：upgrade 不改任何文件。')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
