import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { assertResponse, parseResponse } from './envelope.ts'

async function suggestionsFor(topic: string): Promise<string[]> {
  const result = await runCli(['docs', topic, '--json'])
  const envelope = parseResponse(result.stdout) as { code?: string, suggestions?: { name: string }[] }
  expect(envelope.code).toBe('ERR_UNKNOWN_TOPIC')
  return (envelope.suggestions ?? []).map(suggestion => suggestion.name)
}

describe('docs --list', () => {
  it('reads the same as no topic', async () => {
    const bare = await runCli(['docs'])
    const listed = await runCli(['docs', '--list'])
    expect(listed.exitCode).toBe(0)
    expect(listed.stdout).toBe(bare.stdout)

    const bareJson = await runCli(['docs', '--json'])
    const listedJson = await runCli(['docs', '--list', '--json'])
    assertResponse(listedJson.stdout, 'docs.list')
    expect(listedJson.stdout).toBe(bareJson.stdout)
  })

  it('refuses a topic beside it', async () => {
    const result = await runCli(['docs', 'dark-mode', '--list', '--json'])
    expect(result.exitCode).toBe(2)
    expect(parseResponse(result.stdout)).toMatchObject({ code: 'ERR_INVALID_ARGUMENT' })
  })
})

describe('docs topic spelling', () => {
  it('opens a page typed with other separators or in another word order', async () => {
    for (const typed of ['mode dark', 'guide.dark-mode', 'guide dark mode', 'dark_mode']) {
      const result = await runCli(['docs', typed, '--json'])
      expect(assertResponse(result.stdout, 'docs.detail').data).toMatchObject({ id: 'guide/dark-mode' })
    }
    const theme = await runCli(['docs', 'tokens theme', '--json'])
    expect(assertResponse(theme.stdout, 'docs.detail').data).toMatchObject({ id: 'theme/tokens' })
  })

  it('does not accept a misspelling as the same words', async () => {
    const result = await runCli(['docs', 'dark-modee', '--json'])
    expect(parseResponse(result.stdout)).toMatchObject({ code: 'ERR_UNKNOWN_TOPIC' })
  })
})

describe('docs miss suggestions', () => {
  it('suggests the pages whose name or keywords carry the typed word, and nothing for an unrelated word', async () => {
    expect(await suggestionsFor('dark')).toContain('guide/dark-mode')
    expect(await suggestionsFor('zzzz-nope')).toEqual([])
  })

  it('keeps only the pages carrying every typed word when one does', async () => {
    const names = await suggestionsFor('dark theme nonsense-word')
    expect(names.length).toBeGreaterThan(0)
    const exact = await suggestionsFor('dark mode extra')
    expect(exact[0]).toBe('guide/dark-mode')
  })
})
