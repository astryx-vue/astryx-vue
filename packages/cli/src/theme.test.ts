import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'

async function run(argv: string[]) {
  return runCli(argv)
}

describe('theme catalog', () => {
  it('has one record per theme stylesheet, with its own docs page', () => {
    const slugs = catalog.themes.map(theme => theme.slug)
    expect(slugs).toEqual(['butter', 'chocolate', 'gothic', 'matcha', 'neutral', 'stone', 'y2k'])
    for (const theme of catalog.themes) {
      expect(theme.cssImport).toBe(`@astryx-vue/themes/${theme.slug}.css`)
      expect(theme.attributeValue).toBe(theme.slug)
      expect(theme.summary.en.length).toBeGreaterThan(10)
      expect(theme.summary.zh.length).toBeGreaterThan(5)
      expect(theme.body.en).not.toContain('---')
      expect(theme.body.en).not.toContain('<ThemeStage')
      expect(theme.docsUrl.en).toContain(`/en/themes/${theme.slug}`)
    }
  })
})

describe('theme', () => {
  it('lists every theme, one line each', async () => {
    const list = await run(['theme'])
    expect(list.exitCode).toBe(0)
    expect(list.stdout).toContain('butter')
    expect(list.stdout).toContain('Golden surfaces')
    expect(list.stdout).toContain('astryx-vue theme butter')

    const dense = await run(['theme', '--dense'])
    expect(dense.stdout.length).toBeLessThan(list.stdout.length)

    const json = await run(['theme', '--json'])
    const data = assertResponse(json.stdout, 'theme.list').data as { themes: { slug: string, cssImport: string, attributeValue: string }[] }
    expect(data.themes.map(theme => theme.slug)).toContain('neutral')
    expect(data.themes[0]).toMatchObject({ cssImport: '@astryx-vue/themes/butter.css', attributeValue: 'butter' })
  })

  it('prints the four steps for loading one theme', async () => {
    const result = await run(['theme', 'butter'])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('# Butter')
    expect(result.stdout).toContain('import \'@astryx-vue/themes/butter.css\'')
    expect(result.stdout).toContain('<html data-astryx-theme="butter">')
    // The scoping rules are the themes index page, not a second write-up.
    expect(result.stdout).toContain('data-astryx-theme')
    expect(result.stdout).toContain('astryx-vue doctor')

    const json = await run(['theme', 'butter', '--json'])
    const data = assertResponse(json.stdout, 'theme.detail').data as { steps: { id: string, code?: string }[], body: string, locale: string }
    expect(data.locale).toBe('en')
    expect(data.steps.map(step => step.id)).toEqual(['import-css', 'set-attribute', 'scope', 'verify'])
    expect(data.steps[0]?.code).toBe('import \'@astryx-vue/themes/butter.css\'')
    expect(data.body).toContain('Golden surfaces')
  })

  it('accepts the display name and speaks Chinese with --zh', async () => {
    expect((await run(['theme', 'Neutral'])).stdout).toContain('data-astryx-theme="neutral"')
    const chinese = await run(['theme', 'butter', '--zh'])
    expect(chinese.stdout).toContain('在应用入口引一次主题样式')
    const data = assertResponse((await run(['theme', 'butter', '--json', '--zh'])).stdout, 'theme.detail').data as { title: string, steps: { title: string }[] }
    expect(data.title).toBe('Butter 主题')
    expect(data.steps.map(step => step.title)).toContain('把主题加到该用它的元素上')
  })

  it('reports an unknown theme with the code agents branch on', async () => {
    const result = await run(['theme', 'nope', '--json'])
    expect(result.exitCode).toBe(1)
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_THEME')
  })
})
