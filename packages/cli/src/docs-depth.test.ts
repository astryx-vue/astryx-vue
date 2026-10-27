import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { limitBodyDepth, parseDepth } from './docs-depth.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'

const BODY = [
  '# Topic',
  '',
  'Intro.',
  '',
  '## Setup',
  '',
  'Install it.',
  '',
  '```bash',
  '## not a heading',
  '```',
  '',
  '### Deeper',
  '',
  'More detail.',
  '',
  '## Usage',
  '',
  'Use it.',
].join('\n')

describe('docs --depth', () => {
  it('keeps headings down to the level asked for and drops what is below', () => {
    const limited = limitBodyDepth(BODY, 2, ['Setup', 'Deeper', 'Usage'])
    expect(limited.body).not.toContain('### Deeper')
    expect(limited.body).not.toContain('More detail.')
    expect(limited.body).toContain('## Setup')
    expect(limited.body).toContain('## Usage')
    // A comment inside a code fence stays put: it is not a heading.
    expect(limited.body).toContain('## not a heading')
    expect(limited.headings).toEqual(['Setup', 'Usage'])
  })

  it('keeps everything above the requested level', () => {
    expect(limitBodyDepth(BODY, 6, ['Setup', 'Deeper', 'Usage']).body).toBe(BODY)
  })

  it('accepts a positive whole number only', () => {
    expect(parseDepth(undefined)).toBeNull()
    expect(parseDepth('2')).toBe(2)
    expect(parseDepth('0')).toBeNaN()
    expect(parseDepth('1.5')).toBeNaN()
    expect(parseDepth('two')).toBeNaN()
  })

  it('limits the topic the CLI prints, in text and in JSON', async () => {
    const full = await runCli(['docs', 'guide/styling', '--json'])
    const fullBody = (assertResponse(full.stdout, 'docs.detail').data as { body: string }).body
    expect(fullBody).toContain('### UnoCSS')

    const limited = await runCli(['docs', 'guide/styling', '--depth', '2', '--json'])
    const data = assertResponse(limited.stdout, 'docs.detail').data as { body: string, depth: number, headings: string[] }
    expect(data.depth).toBe(2)
    expect(data.body).not.toContain('### UnoCSS')
    expect(data.body).toContain('## Using CSS Modules or plain CSS')
    expect(data.headings).toEqual(['Using Tailwind or UnoCSS alongside', 'Using CSS Modules or plain CSS'])

    const text = await runCli(['docs', 'guide/styling', '--depth', '2'])
    expect(text.stdout).not.toContain('### UnoCSS')
    expect(text.stdout).toContain('## Using CSS Modules or plain CSS')
  })

  it('refuses a depth that is not a level, and a depth without a topic', async () => {
    const bad = await runCli(['docs', 'guide/styling', '--depth', '0', '--json'])
    expect(bad.exitCode).toBe(2)
    const envelope = parseResponse(bad.stdout)
    expect(isError(envelope) && envelope.code).toBe('ERR_INVALID_ARGUMENT')

    const list = await runCli(['docs', '--depth', '2', '--json'])
    expect(list.exitCode).toBe(2)
    expect(parseResponse(list.stdout)).toMatchObject({ code: 'ERR_INVALID_ARGUMENT' })
  })
})
