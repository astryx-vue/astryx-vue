import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from './agents.ts'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
import { componentExportsMissingDocs } from './generate/build-catalog.ts'
import { extractPage } from './generate/markdown.ts'

async function run(argv: string[], cwd?: string) {
  return runCli(argv, cwd ? { cwd } : {})
}

describe('json envelopes', () => {
  it('lists components', async () => {
    const result = await run(['component', '--list', '--json'])
    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    const envelope = assertResponse(result.stdout, 'component.list')
    expect(envelope.apiVersion).toBe(1)
    expect(envelope.package).toBe('@astryx-vue/core')
    const data = envelope.data as { components: Record<string, { name: string, import: string | null }[]> }
    expect(data.components.Action?.some(item => item.name === 'Button' && item.import === '@astryx-vue/core/Button')).toBe(true)
    const names = Object.values(data.components).flat().map(item => item.name)
    expect(names).not.toContain('useClipboard')
    expect(names.some(name => name.startsWith('use'))).toBe(false)
    expect(data.components.Utility?.some(item => item.name === 'Theme')).toBe(true)
  })

  it('prints one component from the docs', async () => {
    const result = await run(['component', 'Button', '--json'])
    expect(result.exitCode).toBe(0)
    const envelope = assertResponse(result.stdout, 'component.detail')
    const data = envelope.data as { name: string, summary: string, usage: string, props: { rows: { name: string, description?: string }[] }[], locale: string }
    expect(data.name).toBe('Button')
    expect(data.locale).toBe('en')
    expect(data.summary).toContain('triggers an action')
    expect(data.usage).toContain('@astryx-vue/core/Button')
    const label = data.props.flatMap(group => group.rows).find(row => row.name === '`label`')
    expect(label?.description).toContain('Names the action')
    const examples = (envelope.data as { examples: { title: string, description: string, code: string }[] }).examples
    expect(examples.find(example => example.title === 'Floating')?.description).toContain('elevation')
    expect(examples.find(example => example.title === 'Floating')?.code).toContain('elevation="med"')
  })

  it('uses Simplified Chinese when --zh is set and keeps the full payload with --dense', async () => {
    const result = await run(['component', 'Button', '--json', '--zh', '--dense'])
    const data = assertResponse(result.stdout, 'component.detail').data as { summary: string, usage: string, locale: string, title: string }
    expect(data.locale).toBe('zh')
    expect(data.title).toBe('按钮')
    expect(data.summary).toContain('label')
    expect(data.usage.length).toBeGreaterThan(40)
  })

  it('ranks entries whose name contains the query above prose-only matches', async () => {
    const clipboard = await run(['search', 'clipboard', '--json', '--limit', '5'])
    const clipboardData = assertResponse(clipboard.stdout, 'search').data as { results: { domain: string, name: string, score: number, reason: string }[] }
    expect(clipboardData.results[0]).toMatchObject({ domain: 'composable', name: 'useClipboard', reason: 'name' })
    expect(clipboardData.results[0]?.score ?? 0).toBeGreaterThan(clipboardData.results[1]?.score ?? 0)

    const button = await run(['search', 'button', '--json', '--limit', '5'])
    const buttonData = assertResponse(button.stdout, 'search').data as { results: { domain: string, name: string, score: number }[] }
    expect(buttonData.results[0]).toMatchObject({ domain: 'component', name: 'Button', score: 100 })
  })

  it('searches components and docs', async () => {
    const result = await run(['search', 'button', '--json', '--limit', '5'])
    const data = assertResponse(result.stdout, 'search').data as { query: string, matchCount: number, results: { domain: string, name: string, command: string, score: number }[] }
    expect(data.query).toBe('button')
    expect(data.matchCount).toBeGreaterThanOrEqual(data.results.length)
    expect(data.results[0]).toMatchObject({ domain: 'component', name: 'Button', command: 'astryx-vue component Button' })
    expect(data.results[0]?.score).toBeGreaterThan(data.results[1]?.score ?? 0)
  })

  it('returns a capability manifest', async () => {
    const result = await run(['manifest', '--json'])
    const data = assertResponse(result.stdout, 'manifest').data as {
      name: string
      package: string
      commands: { name: string, json: boolean, responseTypes: string[], options: { flag: string, choices?: string[] }[], exitCodes: { code: number }[] }[]
      jsonSupported: string[]
      globalOptions: { flag: string }[]
    }
    expect(data.name).toBe('astryx-vue')
    expect(data.package).toBe('@astryx-vue/cli')
    expect(data.commands.map(command => command.name)).toEqual(['component', 'composable', 'docs', 'search', 'template', 'build', 'manifest', 'init'])
    expect(data.commands.every(command => command.json)).toBe(true)
    expect(data.commands.find(command => command.name === 'component')?.responseTypes).toEqual(['component.list', 'component.detail'])
    expect(data.commands.find(command => command.name === 'composable')?.responseTypes).toEqual(['composable.list', 'composable.detail'])
    expect(data.commands.find(command => command.name === 'docs')?.responseTypes).toEqual(['docs.list', 'docs.detail'])
    expect(data.commands.find(command => command.name === 'search')?.options.find(option => option.flag.startsWith('--type'))?.choices).toEqual(['component', 'composable', 'doc', 'template'])
    expect(data.commands.find(command => command.name === 'template')?.responseTypes).toEqual(['template.list', 'template.show', 'template.skeleton', 'template.copy'])
    expect(data.commands.find(command => command.name === 'template')?.exitCodes.map(exit => exit.code)).toEqual([0, 1, 2])
    expect(data.commands[0]?.exitCodes.map(exit => exit.code)).toEqual([0, 1, 2])
    expect(data.jsonSupported).toEqual(expect.arrayContaining(['component', 'composable', 'docs']))
    expect(data.globalOptions.map(option => option.flag)).toEqual(expect.arrayContaining(['--json', '--dense', '--zh']))
  })

  it('embeds the manifest in a bare --json call', async () => {
    const result = await run(['--json'])
    const data = assertResponse(result.stdout, 'help').data as { manifest: { commands: unknown[] } }
    expect(data.manifest.commands).toHaveLength(8)
  })

  it('lists composables apart from components', async () => {
    const result = await run(['composable', '--list', '--json'])
    expect(result.exitCode).toBe(0)
    const data = assertResponse(result.stdout, 'composable.list').data as {
      locale: string
      composables: Record<string, { name: string, slug: string, import: string | null }[]>
    }
    expect(data.locale).toBe('en')
    const all = Object.values(data.composables).flat()
    expect(all).toHaveLength(57)
    expect(all.map(item => item.name).every(name => name.startsWith('use'))).toBe(true)
    expect(all.find(item => item.name === 'useClipboard')).toMatchObject({ slug: 'use-clipboard', import: null })
  })

  it('prints one composable with its parameters and returns', async () => {
    const result = await run(['composable', 'useClipboard', '--json'])
    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    const data = assertResponse(result.stdout, 'composable.detail').data as {
      name: string
      kind: string
      slug: string
      locale: string
      props: { heading: string, rows: { name: string, description?: string }[] }[]
    }
    expect(data).toMatchObject({ name: 'useClipboard', kind: 'composable', slug: 'use-clipboard', locale: 'en' })
    const parameters = data.props.find(group => group.heading === 'Parameters')
    expect(parameters?.rows.map(row => row.name)).toEqual(expect.arrayContaining(['`options`', '`options.announce`']))
    const returns = data.props.find(group => group.heading === 'Returns')
    expect(returns?.rows.map(row => row.name)).toEqual(expect.arrayContaining(['`copy`', '`isCopied`']))

    const chinese = await run(['composable', 'use-clipboard', '--json', '--zh'])
    const zh = assertResponse(chinese.stdout, 'composable.detail').data as { locale: string, props: { heading: string }[] }
    expect(zh.locale).toBe('zh')
    expect(zh.props.map(group => group.heading)).toEqual(expect.arrayContaining(['参数', '返回值']))
  })

  it('reports unknown composables with suggestions and keeps the component hint', async () => {
    const unknown = await run(['composable', 'useClipbord', '--json'])
    expect(unknown.exitCode).toBe(1)
    const envelope = parseResponse(unknown.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_COMPOSABLE')
    expect(envelope.suggestions?.some(item => item.name === 'useClipboard')).toBe(true)

    const asComponent = await run(['component', 'useClipboard', '--json'])
    expect(asComponent.exitCode).toBe(0)
    const data = assertResponse(asComponent.stdout, 'component.detail').data as { name: string, hint?: string }
    expect(data.name).toBe('useClipboard')
    expect(data.hint).toContain('astryx-vue composable useClipboard')
  })

  it('lists guide and theme topics and prints one topic body', async () => {
    const list = await run(['docs', '--json'])
    const topics = assertResponse(list.stdout, 'docs.list').data as {
      topics: Record<string, { id: string, docsUrl: string }[]>
    }
    expect(topics.topics.guide?.map(topic => topic.id)).toEqual(expect.arrayContaining(['guide/dark-mode', 'guide/composables']))
    expect(topics.topics.theme?.map(topic => topic.id)).toEqual(expect.arrayContaining(['theme/tokens']))

    const prefixed = await run(['docs', 'themes/tokens', '--json'])
    const detail = assertResponse(prefixed.stdout, 'docs.detail').data as { id: string, title: string, body: string, locale: string, docsUrl: string }
    expect(detail).toMatchObject({ id: 'theme/tokens', title: 'Design tokens', locale: 'en' })
    expect(detail.body).toContain('design token')
    expect(detail.body.startsWith('---')).toBe(false)
    expect(detail.docsUrl).toBe('https://astryx-vue.pages.dev/en/themes/tokens')

    const bare = await run(['docs', 'dark-mode', '--json'])
    expect(assertResponse(bare.stdout, 'docs.detail').data).toMatchObject({ id: 'guide/dark-mode' })

    const chinese = await run(['docs', 'dark-mode', '--zh', '--json'])
    const zh = assertResponse(chinese.stdout, 'docs.detail').data as { locale: string, title: string, body: string }
    expect(zh).toMatchObject({ locale: 'zh', title: '深色模式' })
    expect(zh.body).toContain('深色')
  })

  it('stays quiet when no topic name is close, and still suggests a near miss', async () => {
    const nothing = await run(['docs', 'nope', '--json'])
    expect(nothing.exitCode).toBe(1)
    const empty = parseResponse(nothing.stdout)
    expect(isError(empty)).toBe(true)
    if (!isError(empty))
      return
    expect(empty.code).toBe('ERR_UNKNOWN_TOPIC')
    expect(empty.suggestions).toBeUndefined()

    const near = await run(['docs', 'dark-mod', '--json'])
    expect(near.exitCode).toBe(1)
    const envelope = parseResponse(near.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_TOPIC')
    expect(envelope.suggestions?.map(item => item.name)).toContain('guide/dark-mode')
  })

  it('reports unknown topics with suggestions', async () => {
    const result = await run(['docs', 'guide/darkmode', '--json'])
    expect(result.exitCode).toBe(1)
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_TOPIC')
    expect(envelope.suggestions?.some(item => item.name === 'guide/dark-mode')).toBe(true)
  })

  it('reports unknown components as JSON on stdout', async () => {
    const result = await run(['component', 'Buttn', '--json'])
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toBe('')
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_COMPONENT')
    expect(envelope.suggestions?.some(item => item.name === 'Button')).toBe(true)
  })

  it('rejects unknown commands and bad flags', async () => {
    const command = await run(['theme', '--json'])
    expect(command.exitCode).toBe(2)
    expect(parseResponse(command.stdout)).toMatchObject({ code: 'ERR_UNKNOWN_COMMAND' })

    const option = await run(['component', '--theme', '--json'])
    expect(option.exitCode).toBe(2)
    expect(parseResponse(option.stdout)).toMatchObject({ code: 'ERR_INVALID_OPTION' })
  })
})

describe('component text', () => {
  it('lists and prints a component, and dense text is shorter', async () => {
    const list = await run(['component', '--list'])
    expect(list.exitCode).toBe(0)
    expect(list.stdout).toContain('Button')
    expect(list.stdout).toContain('triggers an action')

    const detail = await run(['component', 'button-group'])
    expect(detail.stdout).toContain('# ButtonGroup')
    expect(detail.stdout).toContain('@astryx-vue/core/ButtonGroup')

    const dense = await run(['component', 'Button', '--dense'])
    const full = await run(['component', 'Button'])
    expect(dense.stdout.length).toBeLessThan(full.stdout.length)
    expect(dense.stdout).toContain('props:')
    expect(dense.stdout).toContain('examples: Floating')
    expect(dense.stdout).not.toContain('## Usage')
    expect(full.stdout).toContain('## Examples')
    expect(full.stdout).toContain('elevation="med"')

    const chinese = await run(['component', '--list', '--zh', '--dense'])
    expect(chinese.stdout).toContain('按钮')
    expect(chinese.stdout).not.toContain('triggers an action')
  })

  it('asks for a narrower name when several components match', async () => {
    const result = await run(['component', 'Menu'])
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('More than one component')
  })
})

describe('composable text', () => {
  it('lists composables, prints parameters and returns, and hints from component', async () => {
    const list = await run(['composable', '--list'])
    expect(list.exitCode).toBe(0)
    expect(list.stdout).toContain('useClipboard')
    expect(list.stdout).not.toContain('  Button  ')

    const detail = await run(['composable', 'useClipboard'])
    expect(detail.stdout).toContain('# useClipboard')
    expect(detail.stdout).toContain('## Parameters')
    expect(detail.stdout).toContain('## Returns')
    expect(detail.stdout).toContain('`options.announce`')
    expect(detail.stdout).not.toContain('## Slots')

    const dense = await run(['composable', 'useClipboard', '--dense'])
    expect(dense.stdout).toContain('Parameters: ')
    expect(dense.stdout).toContain('Returns: ')
    expect(dense.stdout.length).toBeLessThan(detail.stdout.length)

    const chinese = await run(['composable', '--list', '--zh', '--dense'])
    expect(chinese.stdout).toContain('工具')
    expect(chinese.stdout).toContain('useClipboard')

    const viaComponent = await run(['component', 'useClipboard'])
    expect(viaComponent.exitCode).toBe(0)
    expect(viaComponent.stdout.trimEnd().endsWith('This is a composable. Run `astryx-vue composable useClipboard`.')).toBe(true)
  })

  it('reports unknown composables on stderr', async () => {
    const result = await run(['composable', 'useClipbord'])
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('No composable named')
  })
})

describe('docs text', () => {
  it('lists topics and prints a topic body, with a shorter dense form', async () => {
    const list = await run(['docs'])
    expect(list.exitCode).toBe(0)
    expect(list.stdout).toContain('Guides')
    expect(list.stdout).toContain('guide/dark-mode')
    expect(list.stdout).toContain('Themes')
    expect(list.stdout).toContain('theme/tokens')

    const full = await run(['docs', 'guide/dark-mode'])
    expect(full.stdout).toContain('# Dark mode')
    expect(full.stdout).toContain('Topic: guide/dark-mode')
    expect(full.stdout).toContain('light-dark')

    const dense = await run(['docs', 'guide/dark-mode', '--dense'])
    expect(dense.stdout.length).toBeLessThan(full.stdout.length)
    expect(dense.stdout).toContain('```html')
    expect(dense.stdout).not.toContain('\n\n')

    const chinese = await run(['docs', 'dark-mode', '--zh', '--dense'])
    expect(chinese.stdout).toContain('深色模式')
  })

  it('asks for a narrower topic when a bare name is ambiguous', async () => {
    const result = await run(['docs', 'theme'])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Topic: theme')
  })
})

describe('init --features agents', () => {
  it('creates, preserves user text, and refreshes only the managed block', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      const created = await run(['init', '--features', 'agents', '--json'], cwd)
      expect(created.exitCode).toBe(0)
      const createdData = assertResponse(created.stdout, 'init.run').data as { features: string[], files: { path: string, action: string }[] }
      expect(createdData.features).toEqual(['agents'])
      expect(createdData.files).toEqual([{ path: 'AGENTS.md', action: 'created' }])

      const file = join(cwd, 'AGENTS.md')
      const first = await readFile(file, 'utf8')
      expect(first).toContain(MANAGED_BLOCK_START)
      expect(first).toContain(MANAGED_BLOCK_END)
      expect(first).toContain('astryx-vue component')
      expect(first).toContain('astryx-vue composable')
      expect(first).toContain('astryx-vue docs')
      expect(first).toContain('astryx-vue search')
      expect(first).toContain('astryx-vue manifest --json')
      expect(first).not.toContain('CheckboxList')
      expect(first).toContain('own subpath')

      const withNotes = `# My agent notes\n\nLeave this paragraph alone.\n\n${first}\n## Team rules\n\nShip on Tuesday.\n`
      await writeFile(file, withNotes)

      const updated = await run(['init', '--features', 'agents', '--zh'], cwd)
      expect(updated.exitCode).toBe(0)
      expect(updated.stdout).toContain('已更新')
      const next = await readFile(file, 'utf8')
      expect(next.startsWith('# My agent notes\n\nLeave this paragraph alone.\n\n')).toBe(true)
      expect(next).toContain('## Team rules\n\nShip on Tuesday.\n')
      expect(next).toContain('怎么查')
      expect(next).toContain('子路径')
      expect(next.match(new RegExp(MANAGED_BLOCK_START, 'g'))).toHaveLength(1)

      const again = await run(['init', '--features', 'agents', '--zh', '--json'], cwd)
      expect(assertResponse(again.stdout, 'init.run').data).toMatchObject({ files: [{ path: 'AGENTS.md', action: 'updated' }] })
      expect(again.stdout).not.toContain('Left unchanged')
      expect(await readFile(file, 'utf8')).toBe(next)

      const stale = next.replace('怎么查', '过期的查找说明')
      await writeFile(file, stale)
      const refreshed = await run(['init', '--features', 'agents', '--zh'], cwd)
      expect(refreshed.exitCode).toBe(0)
      expect(refreshed.stdout).toContain('已更新受管理区块')
      expect(refreshed.stdout).not.toContain('Left unchanged')
      const restored = await readFile(file, 'utf8')
      expect(restored.startsWith('# My agent notes\n\nLeave this paragraph alone.\n\n')).toBe(true)
      expect(restored).toContain('## Team rules\n\nShip on Tuesday.\n')
      expect(restored).toContain('怎么查')
      expect(restored).not.toContain('过期的查找说明')
      expect(restored.match(new RegExp(MANAGED_BLOCK_START, 'g'))).toHaveLength(1)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('appends when AGENTS.md has no markers, and writes CLAUDE.md for claude', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      const file = join(cwd, 'AGENTS.md')
      await writeFile(file, '# Existing\n')
      const appended = await run(['init', '--features', 'agents'], cwd)
      expect(appended.stdout).toContain('Appended')
      const text = await readFile(file, 'utf8')
      expect(text.startsWith('# Existing\n')).toBe(true)
      expect(text).toContain(MANAGED_BLOCK_START)

      const claude = await run(['init', '--features', 'agents', '--agent', 'claude', '--json'], cwd)
      expect(assertResponse(claude.stdout, 'init.run').data).toMatchObject({ files: [{ path: 'CLAUDE.md', action: 'created' }] })
      expect(await readFile(join(cwd, 'CLAUDE.md'), 'utf8')).toContain(MANAGED_BLOCK_END)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('rejects unknown features', async () => {
    const result = await run(['init', '--features', 'theme', '--json'])
    expect(result.exitCode).toBe(2)
    expect(parseResponse(result.stdout)).toMatchObject({ code: 'ERR_UNKNOWN_FEATURE' })
  })

  it('reuses an agent file the project already has', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      await writeFile(join(cwd, 'CLAUDE.md'), '# Claude notes\n\nKeep this.\n')
      const result = await run(['init', '--features', 'agents', '--json'], cwd)
      const data = assertResponse(result.stdout, 'init.run').data as { agent: string, files: { path: string, action: string }[] }
      expect(data.agent).toBe('auto')
      expect(data.files).toEqual([{ path: 'CLAUDE.md', action: 'appended' }])
      const written = await readFile(join(cwd, 'CLAUDE.md'), 'utf8')
      expect(written.startsWith('# Claude notes\n\nKeep this.\n')).toBe(true)
      expect(written).toContain(MANAGED_BLOCK_START)
      expect(await readFile(join(cwd, 'AGENTS.md'), 'utf8').catch(() => null)).toBeNull()
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes .hermes.md for the hermes target', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      const result = await run(['init', '--features', 'agents', '--agent', 'hermes', '--json'], cwd)
      expect(assertResponse(result.stdout, 'init.run').data).toMatchObject({ agent: 'hermes', files: [{ path: '.hermes.md', action: 'created' }] })
      expect(await readFile(join(cwd, '.hermes.md'), 'utf8')).toContain(MANAGED_BLOCK_END)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes every existing agent file with --agent all, and creates AGENTS.md when none exists', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      const empty = await run(['init', '--features', 'agents', '--agent', 'all', '--json'], cwd)
      expect(assertResponse(empty.stdout, 'init.run').data).toMatchObject({ files: [{ path: 'AGENTS.md', action: 'created' }] })

      await writeFile(join(cwd, 'CLAUDE.md'), '# Claude\n')
      const all = await run(['init', '--features', 'agents', '--agent', 'all', '--json'], cwd)
      const data = assertResponse(all.stdout, 'init.run').data as { files: { path: string, action: string }[] }
      expect(data.files.map(file => file.path)).toEqual(['AGENTS.md', 'CLAUDE.md'])
      expect(data.files.every(file => file.action === 'updated' || file.action === 'appended')).toBe(true)
      expect(await readFile(join(cwd, 'AGENTS.md'), 'utf8')).toContain(MANAGED_BLOCK_START)
      expect(await readFile(join(cwd, 'CLAUDE.md'), 'utf8')).toContain(MANAGED_BLOCK_START)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('writes an explicit --agent-docs-path, creates its directory, and refuses to escape', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-cli-'))
    try {
      const result = await run(['init', '--features', 'agents', '--agent-docs-path', 'docs/TEAM.md', '--json'], cwd)
      expect(assertResponse(result.stdout, 'init.run').data).toMatchObject({ files: [{ path: 'docs/TEAM.md', action: 'created' }] })
      expect(await readFile(join(cwd, 'docs/TEAM.md'), 'utf8')).toContain(MANAGED_BLOCK_START)

      const repeat = await run(['init', '--features', 'agents', '--agent-docs-path', 'docs/TEAM.md'], cwd)
      expect(repeat.stdout).toContain('Updated the managed block in docs/TEAM.md')
      expect((await readFile(join(cwd, 'docs/TEAM.md'), 'utf8')).match(new RegExp(MANAGED_BLOCK_START, 'g'))).toHaveLength(1)

      const escape = await run(['init', '--features', 'agents', '--agent-docs-path', '../escape.md', '--json'], cwd)
      expect(escape.exitCode).toBe(2)
      expect(parseResponse(escape.stdout)).toMatchObject({ code: 'ERR_PATH_TRAVERSAL' })
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('rejects an unknown agent target', async () => {
    const result = await run(['init', '--features', 'agents', '--agent', 'windsurf', '--json'])
    expect(result.exitCode).toBe(2)
    expect(parseResponse(result.stdout)).toMatchObject({ code: 'ERR_UNKNOWN_AGENT' })
  })
})

describe('catalog source', () => {
  it('stores the Button page text instead of a second copy', async () => {
    const index = await readFile(join(process.cwd(), 'apps/docs/docs/en/components/button/index.md'), 'utf8')
    const props = await readFile(join(process.cwd(), 'apps/docs/docs/en/components/button/props.md'), 'utf8')
    const extracted = extractPage(index, 'Button')
    const api = extractPage(props, 'Button')
    const button = catalog.components.find(component => component.slug === 'button')
    expect(button?.summary.en).toBe(extracted.summary)
    expect(button?.importPath).toBe('@astryx-vue/core/Button')
    expect(button?.props.en).toEqual(api.props)
    expect(button?.examples.find(example => example.title.en === 'Floating')?.description.en).toContain('floating action button')
    expect(button?.examples.find(example => example.title.zh === '悬浮')?.code).toContain('elevation="med"')
    const menu = catalog.components.find(component => component.slug === 'dropdown-menu')
    expect(menu?.props.en.flatMap(group => group.rows).some(row => row.name === '`button`')).toBe(true)
    const chat = catalog.components.find(component => component.slug === 'chat')
    expect(chat?.slots.en.flatMap(group => group.rows).some(row => row.name === '`composer`')).toBe(true)
    expect(catalog.conventions.en.some(paragraph => paragraph.includes('own subpath'))).toBe(true)
    expect(catalog.topics.some(topic => topic.id === 'guide/installation')).toBe(true)
  })

  it('marks composables and stores topic bodies without frontmatter', async () => {
    expect(catalog.components.filter(component => component.kind === 'composable')).toHaveLength(57)
    expect(catalog.components.filter(component => component.kind === 'component')).toHaveLength(187)
    const clipboard = catalog.components.find(component => component.slug === 'use-clipboard')
    expect(clipboard?.kind).toBe('composable')
    expect(clipboard?.name).toBe('UseClipboard')

    const darkMode = catalog.topics.find(topic => topic.id === 'guide/dark-mode')
    const source = await readFile(join(process.cwd(), 'apps/docs/docs/en/guide/dark-mode.md'), 'utf8')
    expect(darkMode?.body.en).not.toContain('title: Dark mode')
    expect(source).toContain(darkMode?.body.en.split('\n')[0] ?? '')
    expect(darkMode?.body.zh).toContain('深色')
  })

  it('fails the catalog check when a PascalCase core export has no docs page', async () => {
    const pkg = JSON.parse(await readFile(join(process.cwd(), 'packages/core/package.json'), 'utf8')) as { exports: Record<string, unknown> }
    expect(componentExportsMissingDocs(Object.keys(pkg.exports), catalog.components.map(component => component.importPath))).toEqual([])
    expect(componentExportsMissingDocs(['./Button', './icons', './NewWidget', '.'], ['@astryx-vue/core/Button'])).toEqual(['./NewWidget'])
  })
})
