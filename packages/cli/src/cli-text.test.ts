import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { parseResponse } from './envelope.ts'

describe('text errors name a run that works', () => {
  it('lists the names that nearly match', async () => {
    const result = await runCli(['component', 'Butotn'])
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toBe('No component named "Butotn".\nDid you mean: Button\n')
  })

  it('names the command that reads a name another command owns', async () => {
    const result = await runCli(['component', 'library'])
    expect(result.stderr).toContain('Run: astryx-vue template library')
  })

  it('points a template or docs miss at the composable it nearly names', async () => {
    for (const command of ['template', 'docs']) {
      const result = await runCli([command, 'useMediaQuerry', '--json'])
      const envelope = parseResponse(result.stdout) as { suggestions?: { name: string }[] }
      expect(envelope.suggestions?.[0]?.name).toBe('astryx-vue composable useMediaQuery')
    }
  })

  it('keeps JSON on stdout and stderr empty', async () => {
    const result = await runCli(['component', 'Butotn', '--json'])
    expect(result.stderr).toBe('')
    expect(parseResponse(result.stdout)).toMatchObject({ code: 'ERR_UNKNOWN_COMPONENT' })
  })
})

describe('unknown commands from other command lines', () => {
  it('names the command meant', async () => {
    expect((await runCli(['components'])).stderr).toContain('Run: astryx-vue component --list')
    expect((await runCli(['templates', 'list'])).stderr).toContain('Run: astryx-vue template --list')
    expect((await runCli(['props', 'Button'])).stderr).toContain('Run: astryx-vue component Button')
    expect((await runCli(['migrate', '--cwd', '/tmp'])).stderr).toContain('Run: astryx-vue upgrade')
  })

  it('still lists commands that start with the typed word', async () => {
    expect((await runCli(['comp'])).stderr).toContain('Did you mean: component, composable')
  })
})

describe('stray options', () => {
  it('turns an output-format option into --json', async () => {
    const spaced = await runCli(['component', 'Button', '--format', 'json'])
    expect(spaced.exitCode).toBe(2)
    expect(spaced.stderr).toContain('Run: astryx-vue component Button --json')
    const joined = await runCli(['component', 'Button', '--output=json'])
    expect(joined.stderr).toContain('Run: astryx-vue component Button --json')
  })
})

describe('component text', () => {
  it('prints props one per line and practices under one label per run', async () => {
    const result = await runCli(['component', 'Button'])
    expect(result.stdout).toMatch(/^- `variant`: `'primary' \| .*` = `'secondary'` - /m)
    expect(result.stdout).toMatch(/## Button Props\n\n- /)
    expect(result.stdout).toMatch(/## Best practices\n\nDo:\n- /)
    expect(result.stdout).not.toMatch(/^- Do: /m)
  })

  it('keeps a composable\'s parameters and returns as tables with a short rule', async () => {
    const result = await runCli(['composable', 'useClipboard'])
    expect(result.stdout).toContain('| Name | Type | Default | Description |\n| --- | --- | --- | --- |')
  })
})

describe('ambiguous names', () => {
  it('lists a name that holds the typed word, fewest extra words first, before one that only starts with it', async () => {
    const result = await runCli(['component', 'time', '--json'])
    const envelope = parseResponse(result.stdout) as { suggestions: { name: string }[] }
    const names = envelope.suggestions.map(item => item.name)
    expect(names.indexOf('TimeInput')).toBeLessThan(names.indexOf('DateTimeInput'))
    expect(names.indexOf('DateTimeInput')).toBeLessThan(names.indexOf('Timestamp'))
  })
})
