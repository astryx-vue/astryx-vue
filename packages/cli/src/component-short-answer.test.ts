import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { parseResponse } from './envelope.ts'
import { shortUsage } from './format-component.ts'
import { resolveComponent } from './query.ts'

async function read(...argv: string[]): Promise<string> {
  const result = await runCli(argv)
  expect(result.exitCode).toBe(0)
  return result.stdout
}

describe('component short answer', () => {
  it('is the default: what it is, import, usage, accessibility, every prop on one line, and the next commands', async () => {
    const out = await read('component', 'Button')
    expect(out).toMatch(/^# Button\n/)
    expect(out).toContain('Import: `import { Button } from \'@astryx-vue/core/Button\'`')
    expect(out).toContain('## Usage')
    expect(out).toContain('## Accessibility')
    expect(out).toMatch(/^- `label`: `string` \*\*\(required\)\*\* - /m)
    expect(out).toMatch(/^- `variant`: .* = `'secondary'` - /m)
    expect(out).toContain('`astryx-vue component Button --props`')
    expect(out).toContain('`astryx-vue component Button --detail full`')
    // What only the full read holds.
    expect(out).not.toContain('## Best practices')
    expect(out).not.toContain('## Examples')
  })

  it('is shorter than the full read, and --detail compact says the same thing', async () => {
    const compact = await read('component', 'Button')
    const full = await read('component', 'Button', '--detail', 'full')
    expect(compact.length).toBeLessThan(full.length)
    expect(full).toContain('## Best practices')
    expect(full).toContain('## Examples')
    expect(await read('component', 'Button', '--detail', 'compact')).toBe(compact)
  })

  it('cuts each prop description to its first sentence, and --props prints them whole', async () => {
    const compact = await read('component', 'Card')
    const whole = await read('component', 'Card', '--props')
    // The elevation description has a second sentence only the whole view prints.
    expect(compact).toContain('Resting shadow depth: none, low, med, or high.')
    expect(compact).not.toContain('Raise a card only when it has to float')
    expect(whole).toContain('Raise a card only when it has to float')
    expect(whole).not.toContain('## Usage')
  })

  it('prints descriptions whole when the cut would not pay for the pointer line', async () => {
    const out = await read('component', 'Toolbar')
    expect(out).not.toContain('--props')
    expect(out).toContain('--detail full')
  })

  it('leaves theme-variable tables to the full read', async () => {
    const compact = await read('component', 'Card', '--zh')
    expect(compact).not.toContain('## 主题变量')
    expect(await read('component', 'Card', '--zh', '--detail', 'full')).toContain('## 主题变量')
  })

  it('keeps --json and --dense as they were', async () => {
    const envelope = parseResponse(await read('component', 'Button', '--json')) as { data?: Record<string, unknown> }
    const data = (envelope.data ?? envelope) as Record<string, unknown>
    expect(data.practices).toBeDefined()
    expect(data.examples).toBeDefined()
    const dense = await read('component', 'Button', '--dense')
    expect(dense).toContain('props:')
    expect(dense).not.toContain('## Usage')
  })

  it('reads several components in turn, each as a short answer', async () => {
    const out = await read('component', 'Button', 'Card')
    expect(out).toContain('# Button')
    expect(out).toContain('# Card')
    expect(out).toContain('\n---\n')
    expect(out).not.toContain('## Best practices')
  })

  it('refuses an unknown --detail level', async () => {
    const result = await runCli(['component', 'Button', '--detail', 'brief'])
    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('--detail must be one of compact, full')
  })

  it('builds a usage line from the required props when the first example is long', () => {
    const record = resolveComponent('Button')
    const usage = shortUsage({ ...record, examples: [] }, 'en')
    expect(usage).toContain('<Button label="..."')
  })
})
