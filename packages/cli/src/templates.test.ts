import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PLAYGROUND_TEMPLATE_SLUGS } from '../../../apps/docs/components/playground/templateManifest.ts'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
import { MEDIA_PLACEHOLDER, renderSkeleton } from './templates.ts'

async function run(argv: string[], cwd?: string) {
  return runCli(argv, cwd ? { cwd } : {})
}

async function project(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-template-'))
  await writeFile(join(dir, 'package.json'), `${JSON.stringify({ name: 'demo', dependencies: { vue: '^3.5.0' } }, null, 2)}\n`)
  return dir
}

describe('template catalog', () => {
  it('has one record per playground page and nothing else', () => {
    const slugs = catalog.templates.map(template => template.slug)
    expect(slugs).toEqual([...PLAYGROUND_TEMPLATE_SLUGS])
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const template of catalog.templates) {
      expect(template.description.en.length).toBeGreaterThan(20)
      expect(template.description.zh.length).toBeGreaterThan(5)
      expect(template.keywords.en.length).toBeGreaterThan(2)
      expect(template.keywords.zh.length).toBeGreaterThan(1)
      expect(template.componentsUsed.length).toBeGreaterThan(0)
      expect(template.source.length).toBeGreaterThan(50)
      expect(template.kind).toBe('page')
      expect(template.category.en).not.toBe('')
    }
  })

  it('extracts the components from the core imports and flags what a project cannot install', () => {
    const login = catalog.templates.find(template => template.slug === 'login-card')
    expect(login?.isReady).toBe(true)
    expect(login?.componentsUsed).toEqual(['Button', 'Card', 'Center', 'Divider', 'Heading', 'Icon', 'Link', 'Text', 'TextInput', 'VStack'])
    // `pixel` and `proportional` are helpers, and `TableColumn` is a type.
    const dashboard = catalog.templates.find(template => template.slug === 'dashboard')
    expect(dashboard?.componentsUsed).toContain('Table')
    expect(dashboard?.componentsUsed).not.toContain('pixel')
    expect(dashboard?.componentsUsed).not.toContain('TableColumn')

    const charts = catalog.templates.find(template => template.slug === 'dashboard-alert-rail')
    expect(charts?.isReady).toBe(false)
    expect(charts?.notReadyReason?.en).toContain('@astryx-vue/playground-charts')
    // `documentation-technical` prints `@astryxdesign/core` inside code samples
    // it shows the reader. That is page content, not an import, so the page is
    // still copyable.
    const mention = catalog.templates.find(template => template.slug === 'documentation-technical')
    expect(mention?.source).toContain('@astryxdesign/core')
    expect(mention?.isReady).toBe(true)
    // 5 个引用了演练场图表包，3 个是原版自己标为未完成的页面。
    const unready = catalog.templates.filter(template => !template.isReady)
    expect(unready.filter(template => template.notReadyReason?.en.includes('playground-charts'))).toHaveLength(5)
    expect(unready.filter(template => template.notReadyReason?.en.includes('work in progress')).map(template => template.slug).sort())
      .toEqual(['incident-console', 'messaging-shell', 'table'])
    expect(unready).toHaveLength(8)
  })
})

describe('template --list', () => {
  it('lists every template, marks the unready ones, and localizes', async () => {
    const result = await run(['template', '--list'])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('login-card')
    expect(result.stdout).toContain('A sign-in card')
    expect(result.stdout).toContain('(not ready)')
    expect(result.stdout).toContain('8 template(s) are marked not ready')

    const bare = await run(['template'])
    expect(bare.stdout).toContain('login-card')

    const chinese = await run(['template', '--list', '--zh'])
    expect(chinese.stdout).toContain('登录卡片')
    expect(chinese.stdout).toContain('（不可用）')
  })

  it('returns a typed envelope and explains an empty block filter', async () => {
    const result = await run(['template', '--list', '--json'])
    const data = assertResponse(result.stdout, 'template.list').data as {
      templates: { slug: string, isReady: boolean, command: string, docsUrl: string, notReadyReason?: string }[]
      locale: string
    }
    expect(data.locale).toBe('en')
    expect(data.templates).toHaveLength(57)
    expect(data.templates[0]?.command).toBe(`astryx-vue template ${data.templates[0]?.slug}`)
    expect(data.templates[0]?.docsUrl).toContain('https://astryx-vue.pages.dev/en/playground/?template=')
    expect(data.templates.find(template => template.slug === 'dashboard-alert-rail')?.notReadyReason).toContain('playground-charts')
    const incident = data.templates.find(template => template.slug === 'incident-console')
    expect(incident?.isReady).toBe(false)
    expect(incident?.notReadyReason).toContain('work in progress')

    const blocks = await run(['template', '--list', '--type', 'block', '--json'])
    expect(blocks.exitCode).toBe(0)
    const empty = assertResponse(blocks.stdout, 'template.list').data as { templates: unknown[], note?: string }
    expect(empty.templates).toEqual([])
    expect(empty.note).toContain('block')

    const text = await run(['template', '--list', '--type', 'block'])
    expect(text.exitCode).toBe(0)
    expect(text.stdout).toContain('No block templates yet')
  })

  it('rejects a mode that cannot be combined', async () => {
    for (const argv of [
      ['template', '--list', '--skeleton'],
      ['template', '--list', 'login-card'],
      ['template', '--list', '--overwrite'],
      ['template', '--skeleton'],
      ['template', 'login-card', '--skeleton', './out'],
      ['template', 'login-card', 'about', 'extra'],
    ]) {
      const result = await run([...argv, '--json'])
      expect(result.exitCode).toBe(2)
      const envelope = parseResponse(result.stdout)
      expect(isError(envelope)).toBe(true)
      if (isError(envelope))
        expect(['ERR_INVALID_ARGUMENT', 'ERR_MISSING_ARGUMENT']).toContain(envelope.code)
    }
  })
})

describe('template show', () => {
  it('prints the description, the components, and the source', async () => {
    const result = await run(['template', 'login-card'])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('# Login Card')
    expect(result.stdout).toContain('A sign-in card')
    expect(result.stdout).toContain('Components: Button, Card')
    expect(result.stdout).toContain('## Source')
    expect(result.stdout).toContain('<script setup')

    const dense = await run(['template', 'login-card', '--dense'])
    expect(dense.stdout.length).toBeLessThan(result.stdout.length)

    const chinese = await run(['template', 'login-card', '--zh'])
    expect(chinese.stdout).toContain('# 登录卡片')
  })

  it('swaps the docs-site demo photos for a placeholder', async () => {
    const result = await run(['template', 'library', '--json'])
    const data = assertResponse(result.stdout, 'template.show').data as { source: string, demoMediaReplaced: number, components: string[], locale: string }
    expect(data.demoMediaReplaced).toBe(30)
    expect(data.source).not.toContain('/template-assets/')
    expect(data.source).toContain(MEDIA_PLACEHOLDER)
    expect(data.components).toContain('Card')
    expect(data.locale).toBe('en')
  })

  it('shows a template that is not ready, and says why', async () => {
    const result = await run(['template', 'dashboard-alert-rail'])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Status: not copyable')
    expect(result.stdout).toContain('@astryx-vue/playground-charts')

    const ready = await run(['template', 'documentation-technical'])
    expect(ready.stdout).toContain('Status: ready to copy')
  })

  it('suggests a close slug, and stays quiet when nothing is close', async () => {
    const typo = await run(['template', 'logn-card', '--json'])
    expect(typo.exitCode).toBe(1)
    const envelope = parseResponse(typo.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_TEMPLATE')
    expect(envelope.suggestions?.map(item => item.name)).toContain('login-card')

    const nothing = await run(['template', 'zzzzzzzz', '--json'])
    const empty = parseResponse(nothing.stdout)
    expect(isError(empty)).toBe(true)
    if (isError(empty))
      expect(empty.suggestions).toBeUndefined()
  })
})

describe('template --skeleton', () => {
  it('keeps layout tags and layout attributes and drops text and handlers', async () => {
    const result = await run(['template', 'login-card', '--skeleton', '--json'])
    const data = assertResponse(result.stdout, 'template.skeleton').data as { skeleton: string, components: string[], template: string }
    expect(data.template).toBe('login-card')
    expect(data.skeleton).toContain('<Center axis="both" :padding="6">')
    expect(data.skeleton).toContain('<Card :padding="8" width="100%">')
    expect(data.skeleton).toContain('</VStack>')
    expect(data.skeleton).not.toContain('Welcome back')
    expect(data.skeleton).not.toContain('@click')
    expect(data.skeleton).not.toContain('v-model')
    expect(data.skeleton).not.toContain('<script')
  })

  it('nests the page under its layout and stays readable', () => {
    const record = catalog.templates.find(template => template.slug === 'dashboard')!
    const skeleton = renderSkeleton(record.source)
    const lines = skeleton.split('\n')
    expect(lines[0]).toBe('<Layout height="fill">')
    expect(lines.length).toBeLessThanOrEqual(161)
    let depth = 0
    for (const line of lines) {
      const tag = line.trim()
      if (tag.startsWith('</'))
        depth -= 1
      expect(depth).toBeGreaterThanOrEqual(0)
      if (tag.endsWith('>') && !tag.startsWith('</') && !tag.endsWith('/>') && !tag.startsWith('...'))
        depth += 1
    }
    expect(depth).toBe(0)
  })

  it('prints a skeleton for a page with no template block', () => {
    expect(renderSkeleton('<script setup lang="ts">\nconst x = 1\n</script>\n')).toBe('')
  })
})

describe('template copy', () => {
  it('writes a directory target as <Name>.vue and reports what it changed', async () => {
    const cwd = await project()
    try {
      const result = await run(['template', 'library', './src/pages', '--json'], cwd)
      const data = assertResponse(result.stdout, 'template.copy').data as {
        outputPath: string
        fileName: string
        demoMediaReplaced: number
        missingPackages: string[]
        installCommand: string | null
        filesCopied: number
        locale: string
      }
      expect(data.outputPath).toBe('src/pages/Library.vue')
      expect(data.fileName).toBe('Library.vue')
      expect(data.filesCopied).toBe(1)
      expect(data.demoMediaReplaced).toBe(30)
      expect(data.missingPackages).toEqual(['@astryx-vue/core'])
      expect(data.installCommand).toBe('npm add @astryx-vue/core')
      expect(data.locale).toBe('en')

      const written = await readFile(join(cwd, 'src/pages/Library.vue'), 'utf8')
      expect(written).not.toContain('/template-assets/')
      expect(written).toContain('<script setup')
      expect((await stat(join(cwd, 'src/pages/Library.vue'))).isFile()).toBe(true)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes a file target, refuses to clobber, and honors --overwrite and -f', async () => {
    const cwd = await project()
    try {
      const first = await run(['template', 'login-card', './src/pages/SignIn.vue'], cwd)
      expect(first.exitCode).toBe(0)
      expect(first.stdout).toContain('Wrote src/pages/SignIn.vue')
      expect(first.stdout).toContain('Missing packages: @astryx-vue/core')

      const again = await run(['template', 'login-card', './src/pages/SignIn.vue', '--json'], cwd)
      expect(again.exitCode).toBe(1)
      const envelope = parseResponse(again.stdout)
      expect(isError(envelope)).toBe(true)
      if (isError(envelope))
        expect(envelope.code).toBe('ERR_FILE_EXISTS')

      const overwrite = await run(['template', 'login-card', './src/pages/SignIn.vue', '--overwrite'], cwd)
      expect(overwrite.exitCode).toBe(0)

      const short = await run(['template', 'login-card', './src/pages/SignIn.vue', '-f'], cwd)
      expect(short.exitCode).toBe(0)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('refuses a path outside the project', async () => {
    const cwd = await project()
    try {
      for (const argv of [
        ['template', '../../etc'],
        ['template', 'login-card', '../outside.vue'],
        ['template', 'login-card', '/tmp/elsewhere/Login.vue'],
      ]) {
        const result = await run([...argv, '--json'], cwd)
        expect(result.exitCode).toBe(2)
        const envelope = parseResponse(result.stdout)
        expect(isError(envelope)).toBe(true)
        if (isError(envelope))
          expect(envelope.code).toBe('ERR_PATH_TRAVERSAL')
      }
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('refuses a template that is not ready and says why', async () => {
    const cwd = await project()
    try {
      const result = await run(['template', 'dashboard-alert-rail', './src/pages', '--json'], cwd)
      expect(result.exitCode).toBe(1)
      const envelope = parseResponse(result.stdout)
      expect(isError(envelope)).toBe(true)
      if (isError(envelope)) {
        expect(envelope.code).toBe('ERR_TEMPLATE_NOT_READY')
        expect(envelope.error).toContain('playground-charts')
      }
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('skips the package check when the directory has no package.json', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-template-'))
    try {
      const result = await run(['template', 'blank', './out', '--json'], cwd)
      const data = assertResponse(result.stdout, 'template.copy').data as { notes: string[], missingPackages: string[], installCommand: string | null }
      expect(data.notes[0]).toContain('No package.json')
      expect(data.missingPackages).toEqual([])
      expect(data.installCommand).toBeNull()
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('names the local package manager when a lockfile is present', async () => {
    const cwd = await project()
    try {
      await writeFile(join(cwd, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n')
      const result = await run(['template', 'login-card', './src', '--json'], cwd)
      const data = assertResponse(result.stdout, 'template.copy').data as { installCommand: string | null }
      expect(data.installCommand).toBe('pnpm add @astryx-vue/core')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})

describe('template in search', () => {
  it('finds templates by slug and by prose', async () => {
    const byName = await run(['search', 'login', '--type', 'template', '--json'])
    const hits = assertResponse(byName.stdout, 'search').data as { results: { domain: string, name: string, command: string, score: number, reason: string }[] }
    expect(hits.results[0]).toMatchObject({ domain: 'template', name: 'login', command: 'astryx-vue template login' })
    expect(hits.results.map(hit => hit.name)).toContain('login-card')
    expect(hits.results.every(hit => hit.domain === 'template')).toBe(true)

    const byProse = await run(['search', 'kanban', '--type', 'template'])
    expect(byProse.stdout).toContain('kanban-board')
  })

  it('keeps the name hit above the prose hit', async () => {
    const result = await run(['search', 'settings', '--type', 'template', '--json'])
    const data = assertResponse(result.stdout, 'search').data as { results: { name: string, reason: string, score: number }[] }
    expect(data.results[0]).toMatchObject({ name: 'settings', reason: 'name' })
    expect(data.results[0]!.score).toBeGreaterThan(data.results[1]!.score)
  })
})

describe('template docs urls', () => {
  it('points at the playground page in the language the caller asked for', async () => {
    expect(catalog.templates.find(template => template.slug === 'blank')?.docsUrl).toEqual({
      en: 'https://astryx-vue.pages.dev/en/playground/?template=blank',
      zh: 'https://astryx-vue.pages.dev/playground/?template=blank',
    })
    const chinese = await run(['template', 'blank', '--json', '--zh'])
    expect(assertResponse(chinese.stdout, 'template.show').data).toMatchObject({ docsUrl: 'https://astryx-vue.pages.dev/playground/?template=blank' })
  })
})
