import { describe, expect, it } from 'vitest'
import { buildKit, ideaTerms, rankTemplates } from './build.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'

async function run(argv: string[]) {
  return runCli(argv)
}

async function kitFor(idea: string, locale: 'en' | 'zh' = 'en') {
  const result = await run(['build', idea, '--json', ...(locale === 'zh' ? ['--zh'] : [])])
  expect(result.exitCode).toBe(0)
  return assertResponse(result.stdout, 'build.kit').data as {
    idea: string
    locale: string
    template: { slug: string, title: string, description: string, isReady: boolean, command: string, copyCommand: string, matchedTerms: string[] } | null
    otherTemplates: { slug: string }[]
    components: { name: string, command: string, reason: string, description: string }[]
    composables: { name: string, command: string }[]
    notes: string[]
  }
}

describe('build ranking', () => {
  it('sends a Chinese login idea to the login pages', async () => {
    const kit = await kitFor('登录页', 'zh')
    expect(kit.template?.slug.startsWith('login')).toBe(true)
    expect(kit.template?.slug).toBe('login-card')
    expect(kit.otherTemplates.map(match => match.slug)).toEqual(['login-split', 'login-sso'])
    expect(kit.template?.command).toBe('astryx-vue template login-card')
    expect(kit.template?.copyCommand).toBe('astryx-vue template login-card ./src/pages')
    expect(kit.locale).toBe('zh')
  })

  it('sends 数据看板 to a dashboard and 任务看板 to the kanban board', async () => {
    const data = await kitFor('数据看板', 'zh')
    expect(data.template?.slug.startsWith('dashboard')).toBe(true)
    // A bare 看板 is ambiguous; it leans to the dashboards. 任务看板 names the kanban.
    const tasks = await kitFor('任务看板', 'zh')
    expect(tasks.template?.slug).toBe('kanban-board')
  })

  it('sends an admin dashboard idea to a dashboard, and the ready one wins the tie', async () => {
    const kit = await kitFor('admin dashboard with charts')
    // Observed: the base analytics dashboard leads. `dashboard` and
    // `dashboard-comparison` are the two dashboards a project can copy; the
    // chart-heavy variants import the playground-only chart alias, so their
    // score is cut and they rank below.
    expect(kit.template?.slug).toBe('dashboard')
    expect(kit.template?.isReady).toBe(true)
    expect(kit.template?.matchedTerms).toEqual(expect.arrayContaining(['admin', 'dashboard', 'charts']))
  })

  it('sends a Chinese settings idea to the settings pages', async () => {
    const kit = await kitFor('设置页面', 'zh')
    expect(kit.template?.slug).toBe('settings')
    expect(kit.otherTemplates.map(match => match.slug)).toEqual(['settings-dialog', 'settings-sidebar'])
  })

  it('sends a checkout idea to checkout or payment', async () => {
    const kit = await kitFor('checkout flow')
    expect(['checkout-wizard', 'payment-form']).toContain(kit.template?.slug)
    expect(kit.template?.slug).toBe('checkout-wizard')
  })

  it('sends a Chinese chat idea to the AI chat page', async () => {
    const kit = await kitFor('聊天', 'zh')
    expect(kit.template?.slug).toBe('ai-chat')
  })

  it('recommends nothing for a string that names nothing', async () => {
    const kit = await kitFor('asdfgh')
    expect(kit.template).toBeNull()
    expect(kit.otherTemplates).toEqual([])
    expect(kit.components).toEqual([])
    expect(kit.notes[0]).toContain('No template matched')
  })

  it('is deterministic and offline', () => {
    const first = rankTemplates('kanban board').map(match => [match.slug, match.matchedTerms.join(',')])
    const second = rankTemplates('kanban board').map(match => [match.slug, match.matchedTerms.join(',')])
    expect(first).toEqual(second)
    expect(first[0]?.[0]).toBe('kanban-board')
  })

  it('still names the closest page when that page cannot be copied, and says so', async () => {
    const kit = await kitFor('funnel cohort dashboard')
    expect(kit.template?.slug).toBe('dashboard-cohort-funnel')
    expect(kit.template?.isReady).toBe(false)
    expect(kit.notes.join(' ')).toContain('not copyable')
  })

  it('caps the component lists and keeps composables apart', async () => {
    const kit = await kitFor('dashboard with tables and clipboard')
    expect(kit.components.length).toBeLessThanOrEqual(6)
    expect(kit.composables.length).toBeLessThanOrEqual(4)
    expect(kit.components.every(item => item.command.startsWith('astryx-vue component '))).toBe(true)
    expect(kit.composables.every(item => item.command.startsWith('astryx-vue composable '))).toBe(true)
    expect(kit.components.every(item => item.description.length > 0)).toBe(true)
  })
})

describe('build terms', () => {
  it('splits Chinese into character pairs plus the whole short run, and drops English filler', () => {
    expect(ideaTerms('登录页')).toEqual(['登录页', '登录', '录页'])
    expect(ideaTerms('登录')).toEqual(['登录'])
    expect(ideaTerms('build an admin dashboard with charts')).toEqual(['admin', 'dashboard', 'charts'])
    expect(ideaTerms('   ')).toEqual([])
  })
})

describe('build command', () => {
  it('prints the workflow when there is no idea', async () => {
    const text = await run(['build'])
    expect(text.exitCode).toBe(0)
    expect(text.stdout).toContain('astryx-vue build "<one sentence>"')
    expect(text.stdout).toContain('astryx-vue template <slug> ./src/pages')
    expect(text.stdout).toContain('astryx-vue component <Name>')

    const json = await run(['build', '--json'])
    const data = assertResponse(json.stdout, 'build.help').data as { steps: string[], rules: string[], commands: string[] }
    expect(data.steps).toHaveLength(3)
    expect(data.rules.length).toBeGreaterThan(2)
    expect(data.commands).toContain('astryx-vue template --list')

    const chinese = await run(['build', '--zh'])
    expect(chinese.stdout).toContain('步骤：')
  })

  it('prints the three blocks for a person', async () => {
    const result = await run(['build', 'login page'])
    expect(result.stdout).toContain('TEMPLATE')
    expect(result.stdout).toContain('login-card')
    expect(result.stdout).toContain('OTHER TEMPLATES')
    expect(result.stdout).toContain('COMPONENTS')
    expect(result.stdout).toContain('Next: astryx-vue template login ./src/pages')
    expect(result.stdout).toContain('→ astryx-vue component ')
    const json = await run(['build', 'login page', '--json'])
    const kit = assertResponse(json.stdout, 'build.kit').data as { template: { copyCommand: string } }
    expect(kit.template.copyCommand).toBe('astryx-vue template login ./src/pages')

    const dense = await run(['build', 'login page', '--dense'])
    expect(dense.stdout.length).toBeLessThan(result.stdout.length)
  })

  it('rejects an idea that is only whitespace', async () => {
    const result = await run(['build', '', '--json'])
    expect(result.exitCode).toBe(2)
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (isError(envelope))
      expect(envelope.code).toBe('ERR_INVALID_ARGUMENT')
  })

  it('reaches buildKit directly for the same answer', () => {
    const kit = buildKit('登录页', 'en')
    expect(kit.template?.slug).toBe('login-card')
    expect(kit.template?.title).toBe('Login Card')
  })
})
