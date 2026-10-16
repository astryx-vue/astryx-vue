import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from './agents.ts'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
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
  })

  it('uses Simplified Chinese when --zh is set and keeps the full payload with --dense', async () => {
    const result = await run(['component', 'Button', '--json', '--zh', '--dense'])
    const data = assertResponse(result.stdout, 'component.detail').data as { summary: string, usage: string, locale: string, title: string }
    expect(data.locale).toBe('zh')
    expect(data.title).toBe('按钮')
    expect(data.summary).toContain('label')
    expect(data.usage.length).toBeGreaterThan(40)
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
      commands: { name: string, json: boolean, responseTypes: string[], exitCodes: { code: number }[] }[]
      jsonSupported: string[]
      globalOptions: { flag: string }[]
    }
    expect(data.name).toBe('astryx-vue')
    expect(data.package).toBe('@astryx-vue/cli')
    expect(data.commands.map(command => command.name)).toEqual(['component', 'search', 'manifest', 'init'])
    expect(data.commands.every(command => command.json)).toBe(true)
    expect(data.commands.find(command => command.name === 'component')?.responseTypes).toEqual(['component.list', 'component.detail'])
    expect(data.commands[0]?.exitCodes.map(exit => exit.code)).toEqual([0, 1, 2])
    expect(data.jsonSupported).toContain('component')
    expect(data.globalOptions.map(option => option.flag)).toEqual(expect.arrayContaining(['--json', '--dense', '--zh']))
  })

  it('embeds the manifest in a bare --json call', async () => {
    const result = await run(['--json'])
    const data = assertResponse(result.stdout, 'help').data as { manifest: { commands: unknown[] } }
    expect(data.manifest.commands).toHaveLength(4)
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
    expect(dense.stdout).not.toContain('## Usage')

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
      expect(first).toContain('astryx-vue search')
      expect(first).toContain('astryx-vue manifest --json')
      expect(first).not.toContain('CheckboxList')
      expect(first).toContain('own subpath')

      const withNotes = `# My agent notes\n\nLeave this paragraph alone.\n\n${first}\n## Team rules\n\nShip on Tuesday.\n`
      await writeFile(file, withNotes)

      const updated = await run(['init', '--features', 'agents', '--zh'], cwd)
      expect(updated.exitCode).toBe(0)
      expect(updated.stdout).toContain('Updated')
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
      expect(refreshed.stdout).toContain('Updated the managed block')
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
    expect(catalog.conventions.en.some(paragraph => paragraph.includes('own subpath'))).toBe(true)
    expect(catalog.topics.some(topic => topic.id === 'guide/installation')).toBe(true)
  })
})
