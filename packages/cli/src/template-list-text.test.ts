import type { TemplateRecord } from './catalog-types.ts'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'
import { formatTemplateList } from './format.ts'

describe('template --list text', () => {
  it('prints the first sentence of each description and nothing after it', () => {
    const first = catalog.templates[0]!
    const wordy: TemplateRecord = {
      ...first,
      description: { en: 'A page that shows orders. It also lists refunds and returns.', zh: 'A page that shows orders. It also lists refunds and returns.' },
    }
    const english = formatTemplateList([wordy], 'en', false)
    expect(english).toContain('A page that shows orders.')
    expect(english).not.toContain('refunds and returns')
  })

  it('marks a template that cannot be copied in search results, and carries isReady in JSON', async () => {
    const text = await runCli(['search', 'dashboard alert rail', '--type', 'template'])
    expect(text.stdout).toContain('[template] dashboard-alert-rail (not ready)')
    expect(text.stdout).toContain('[template] dashboard  ')
    const json = await runCli(['search', 'dashboard alert rail', '--type', 'template', '--json'])
    const results = (assertResponse(json.stdout, 'search').data as { results: { name: string, isReady?: boolean }[] }).results
    expect(results.find(hit => hit.name === 'dashboard-alert-rail')?.isReady).toBe(false)
    expect(results.find(hit => hit.name === 'dashboard')?.isReady).toBe(true)
  })
})
