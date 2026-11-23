import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { parseArgs } from '../scripts/upstream-sync.mjs'
import { updatePendingBranch } from '../scripts/upstream-sync/branch.mjs'
import { validateFamilies } from '../scripts/upstream-sync/families.mjs'
import { buildSyncPlan, latestVersionTag } from '../scripts/upstream-sync/plan.mjs'
import { readProgress, renderPendingChecklist, renderPendingPullRequest } from '../scripts/upstream-sync/render.mjs'

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

  it('所有版本收进一份按组件族分组的清单，带勾选框和上游链接', () => {
    const plan = buildSyncPlan({ upstream: repo, from: 'v1.0.0' })
    const checklist = renderPendingChecklist(plan, { from: 'v1.0.0', to: 'v1.2.0' })

    expect(checklist).toContain('上游范围：`v1.0.0..v1.2.0`，2 个组件族，2 个提交。')
    expect(checklist).toContain('## 选择器家族（area:core）')
    expect(checklist).toContain('## 富文本编辑器（area:richtext）')
    expect(checklist).toContain('### v1.1.0')
    expect(checklist).toMatch(/- \[ \] \[`[0-9a-f]{9}`\]\(https:\/\/github\.com\/meta\/astryx\/commit\/[0-9a-f]{9}\) fix\(Selector\): keep focus \(#1\)/)
  })

  it('重新生成清单时保留已勾选的条目和条目下的备注', () => {
    const plan = buildSyncPlan({ upstream: repo, from: 'v1.0.0' })
    const range = { from: 'v1.0.0', to: 'v1.2.0' }
    const first = renderPendingChecklist(plan, range)
    const hash = /\[`([0-9a-f]{9})`\]/.exec(first)![1]
    const edited = first.replace(`- [ ] [\`${hash}\``, `- [x] [\`${hash}\``)
      .replace(/(fix\(Selector\): keep focus \(#1\))/, '$1\n  - 不适用：Vue 版没有这段逻辑')

    const second = renderPendingChecklist(plan, range, edited)
    expect(second).toBe(edited)
    expect(readProgress(second).get(hash)).toEqual({ checked: true, notes: ['  - 不适用：Vue 版没有这段逻辑'] })
  })

  it('汇总 PR 正文只放统计和收尾说明，进度从清单里数', () => {
    const plan = buildSyncPlan({ upstream: repo, from: 'v1.0.0' })
    const range = { from: 'v1.0.0', to: 'v1.2.0' }
    const checklist = renderPendingChecklist(plan, range).replace('- [ ] ', '- [x] ')
    const pr = renderPendingPullRequest(plan, range, checklist)

    expect(pr.title).toBe('上游同步：v1.0.0 → v1.2.0')
    expect(pr.labels).toEqual(['upstream-sync'])
    expect(pr.body).toContain('共 2 个提交，已核对 1 个')
    expect(pr.body).toContain('| 选择器家族 | core | 1 | — |')
    expect(pr.body).toContain('| v1.2.0 | 1 | 1 |')
    expect(pr.body).toContain('`upstream.syncedTo` 改成 `v1.2.0`')
    expect(pr.body).not.toContain('- [ ]')
  })

  it('默认只 dry-run，只有 --apply 才写 GitHub', () => {
    expect(parseArgs([])).toMatchObject({ apply: false, from: 'v0.7.1' })
    expect(parseArgs(['--apply', '--to', 'v0.7.5'])).toMatchObject({ apply: true, to: 'v0.7.5' })
    expect(() => parseArgs(['--to'])).toThrow('无法识别的参数')
  })
})

describe('汇总 PR 的清单分支', () => {
  let origin: string
  let work: string
  const branch = 'upstream-sync/pending'
  const file = 'docs/upstream-sync/pending.md'

  function git(cwd: string, ...args: string[]) {
    return execFileSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  }

  function update(resume: boolean, render: (previous: string) => string) {
    return updatePendingBranch({ repoDir: work, branch, base: 'main', file, resume, message: 'chore: update', render })
  }

  function remoteFile() {
    return git(work, 'show', `origin/${branch}:${file}`)
  }

  beforeAll(() => {
    origin = mkdtempSync(join(tmpdir(), 'upstream-sync-origin-'))
    work = mkdtempSync(join(tmpdir(), 'upstream-sync-work-'))
    git(origin, 'init', '-q', '--bare', '-b', 'main')
    git(work, 'init', '-q', '-b', 'main')
    writeFileSync(join(work, 'README.md'), 'readme\n')
    git(work, 'add', '-A')
    git(work, 'commit', '-q', '-m', 'init')
    git(work, 'remote', 'add', 'origin', origin)
    git(work, 'push', '-q', 'origin', 'main')
  })

  afterAll(() => {
    rmSync(origin, { recursive: true, force: true })
    rmSync(work, { recursive: true, force: true })
  })

  it('没有开着的 PR 时从 base 新开分支，不动当前工作区', () => {
    const result = update(false, previous => `${previous}first\n`)
    git(work, 'fetch', '-q', 'origin')

    expect(result.changed).toBe(true)
    expect(remoteFile()).toBe('first\n')
    expect(git(work, 'rev-parse', '--abbrev-ref', 'HEAD').trim()).toBe('main')
    expect(git(work, 'status', '--porcelain')).toBe('')
  })

  it('汇总 PR 开着时接着远端分支提交，保留 PR 里别人的改动', () => {
    const other = mkdtempSync(join(tmpdir(), 'upstream-sync-other-'))
    git(other, 'clone', '-q', '-b', branch, origin, '.')
    writeFileSync(join(other, 'package.json'), '{"upstream":{"syncedTo":"v1.2.0"}}\n')
    git(other, 'add', '-A')
    git(other, 'commit', '-q', '-m', 'bump syncedTo')
    git(other, 'push', '-q', 'origin', branch)
    rmSync(other, { recursive: true, force: true })

    const result = update(true, previous => `${previous}second\n`)
    git(work, 'fetch', '-q', 'origin')

    expect(result.changed).toBe(true)
    expect(remoteFile()).toBe('first\nsecond\n')
    expect(git(work, 'show', `origin/${branch}:package.json`)).toContain('v1.2.0')
  })

  it('清单没变时不提交也不推送', () => {
    const before = git(work, 'rev-parse', `origin/${branch}`)
    const result = update(true, previous => previous)
    git(work, 'fetch', '-q', 'origin')

    expect(result.changed).toBe(false)
    expect(git(work, 'rev-parse', `origin/${branch}`)).toBe(before)
  })

  it('上一轮 PR 合并后从 base 重开，旧分支被覆盖', () => {
    const result = update(false, () => 'fresh\n')
    git(work, 'fetch', '-q', 'origin')

    expect(result.changed).toBe(true)
    expect(remoteFile()).toBe('fresh\n')
    expect(git(work, 'rev-list', '--count', `origin/main..origin/${branch}`).trim()).toBe('1')
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
