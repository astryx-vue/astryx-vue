import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { parseArgs } from '../scripts/upstream-sync.mjs'
import { validateFamilies } from '../scripts/upstream-sync/families.mjs'
import { buildSyncPlan, latestVersionTag } from '../scripts/upstream-sync/plan.mjs'
import { renderIssue, renderReleaseIssue } from '../scripts/upstream-sync/render.mjs'

describe('上游持续同步', () => {
  let repo: string
  let seconds = 0

  function git(...args: string[]) {
    return execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_DATE: `@${1_700_000_000 + seconds} +0000`, GIT_COMMITTER_DATE: `@${1_700_000_000 + seconds} +0000` },
    }).trim()
  }

  function commit(message: string, files: string[]) {
    seconds += 60
    for (const file of files) {
      mkdirSync(dirname(join(repo, file)), { recursive: true })
      writeFileSync(join(repo, file), `${message}\n`)
    }
    git('add', '-A')
    git('commit', '-q', '-m', message)
  }

  beforeAll(() => {
    repo = mkdtempSync(join(tmpdir(), 'upstream-sync-'))
    git('init', '-q', '-b', 'main')
    commit('chore: start', ['README.md'])
    git('tag', 'v1.0.0')
    commit('fix(Selector): keep focus (#1)', ['packages/core/src/Selector/Selector.tsx', 'packages/native/src/components/Selector.ts'])
    git('tag', 'v1.1.0')
    commit('feat(richtext): add editor (#2)', ['packages/richtext/src/markdown.ts', 'packages/richtext/src/RichTextEditor.tsx'])
    git('tag', 'v1.2.0')
  })

  afterAll(() => {
    rmSync(repo, { recursive: true, force: true })
  })

  it('每个旧任务节点都有长期组件族', () => {
    expect(validateFamilies()).toEqual([])
  })

  it('逐版本生成计划，原生文件不适用', () => {
    const plan = buildSyncPlan({ upstream: repo, from: 'v1.0.0' })
    expect(latestVersionTag(repo)).toBe('v1.2.0')
    expect(plan.map(release => release.to)).toEqual(['v1.1.0', 'v1.2.0'])
    expect(plan[0].families).toHaveLength(1)
    expect(plan[0].families[0].id).toBe('selectors')
    expect(plan[0].families[0].commits[0].files).toEqual(['packages/core/src/Selector/Selector.tsx'])
  })

  it('同一包的多个旧节点合并成一个 issue', () => {
    const plan = buildSyncPlan({ upstream: repo, from: 'v1.1.0', to: 'v1.2.0' })
    expect(plan[0].families).toHaveLength(1)
    expect(plan[0].families[0].id).toBe('richtext')
    expect(plan[0].families[0].commits).toHaveLength(1)
    expect(plan[0].families[0].commits[0].files).toHaveLength(2)
  })

  it('没有新版本时不产生 issue', () => {
    expect(buildSyncPlan({ upstream: repo, from: 'v1.2.0' })).toEqual([])
  })

  it('issue 含稳定去重标题、勾选清单和上游链接', () => {
    const release = buildSyncPlan({ upstream: repo, from: 'v1.0.0', to: 'v1.1.0' })[0]
    const issue = renderIssue(release, release.families[0])
    expect(issue.title).toBe('上游 v1.1.0：选择器家族')
    expect(issue.labels).toEqual(['upstream-sync', 'area:core'])
    expect(issue.body).toContain('<!-- upstream-sync:v1.1.0:selectors -->')
    expect(issue.body).toContain('- [ ] `')
    expect(issue.body).toContain('https://github.com/meta/astryx/commit/')
  })

  it('每个上游版本只开一个 issue，组件族收在小节里', () => {
    const release = buildSyncPlan({ upstream: repo, from: 'v1.0.0', to: 'v1.1.0' })[0]
    const issue = renderReleaseIssue(release)

    expect(issue.title).toBe('上游 v1.1.0：同步清单')
    expect(issue.body).toContain('<!-- upstream-sync:v1.1.0:all -->')
    for (const family of release.families)
      expect(issue.body).toContain(family.title)
    // 每族收在一个可折叠小节里，整版清单才不会超过 GitHub 的正文长度上限。
    expect(issue.body).toContain('<details>')
    expect(issue.body).toContain('<summary>')
    expect(issue.labels).toContain('upstream-sync')
  })

  it('默认只 dry-run，只有 --apply 才写 GitHub', () => {
    expect(parseArgs([])).toMatchObject({ apply: false, from: 'v0.7.1' })
    expect(parseArgs(['--apply', '--to', 'v0.7.5'])).toMatchObject({ apply: true, to: 'v0.7.5' })
    expect(() => parseArgs(['--to'])).toThrow('无法识别的参数')
  })
})

describe('pr 测试范围', () => {
  it('只改一个包时只跑那个包', async () => {
    const { scopeForFiles } = await import('../scripts/affected-checks.mjs')
    expect(scopeForFiles(['packages/core/src/Button/Button.vue'])).toEqual({ mode: 'narrow', paths: ['packages/core/src'] })
    expect(scopeForFiles(['packages/core/src/Link/Link.vue', 'apps/docs/docs/zh/guide/cli.md']).paths).toEqual(['apps/docs', 'packages/core/src'])
  })

  it('改到共享文件时退回全量', async () => {
    const { scopeForFiles } = await import('../scripts/affected-checks.mjs')
    for (const file of ['pnpm-lock.yaml', 'scripts/release.mjs', 'vitest.config.ts', '.github/workflows/release.yml', 'package.json'])
      expect(scopeForFiles([file])).toEqual({ mode: 'all' })
  })
})
