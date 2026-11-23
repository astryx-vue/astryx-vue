#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { resolveUpstreamDir } from './upstream-ledger.mjs'
import { updatePendingBranch } from './upstream-sync/branch.mjs'
import { validateFamilies } from './upstream-sync/families.mjs'
import { UpstreamSyncGitHub } from './upstream-sync/github.mjs'
import { buildSyncPlan, latestVersionTag } from './upstream-sync/plan.mjs'
import { PENDING_BRANCH, PENDING_FILE, renderPendingChecklist, renderPendingPullRequest } from './upstream-sync/render.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

export function parseArgs(argv) {
  const options = {
    apply: false,
    from: manifest.upstream.syncedTo,
    to: null,
    upstream: null,
    repo: process.env.GITHUB_REPOSITORY ?? 'astryx-vue/astryx-vue',
    owner: process.env.GITHUB_REPOSITORY_OWNER ?? 'astryx-vue',
    project: '1',
    base: 'main',
    help: false,
  }
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--apply') {
      options.apply = true
    }
    else if (arg === '--dry-run') {
      options.apply = false
    }
    else if (arg === '--help') {
      options.help = true
    }
    else {
      const key = { '--from': 'from', '--to': 'to', '--upstream': 'upstream', '--repo': 'repo', '--owner': 'owner', '--project': 'project', '--base': 'base' }[arg]
      if (!key || index + 1 >= argv.length || argv[index + 1].startsWith('--'))
        throw new Error(`无法识别的参数：${arg}`)
      options[key] = argv[++index]
    }
  }
  return options
}

export function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log('用法：node scripts/upstream-sync.mjs [--dry-run|--apply] [--from v0.7.1] [--to v0.7.5] [--upstream <目录>] [--base main]')
    return 0
  }
  const missing = validateFamilies()
  if (missing.length)
    throw new Error(`这些节点还没有登记长期组件族：${missing.join('、')}`)
  const upstream = resolveUpstreamDir(options.upstream)
  const to = options.to ?? latestVersionTag(upstream)
  const plan = buildSyncPlan({ upstream, from: options.from, to })
  const range = { from: options.from, to }
  const commits = plan.reduce((sum, release) => sum + release.families.reduce((n, family) => n + family.commits.length, 0), 0)
  if (!options.apply) {
    for (const release of plan) {
      const perRelease = release.families.reduce((n, family) => n + family.commits.length, 0)
      console.log(`${release.to}  ${release.families.length} 个组件族  ${perRelease} 个提交`)
    }
    console.log(`dry-run：${plan.length} 个版本，${commits} 个提交；会汇总进一个 PR（分支 ${PENDING_BRANCH}），没有访问或修改 GitHub。`)
    return 0
  }
  if (!plan.length) {
    console.log(`已经同步到 ${to}，没有待补的上游提交。`)
    return 0
  }

  // 所有待补提交收进一个滚动 PR：按版本开 issue 会一次冒出十几个，仓库里只剩同步噪音。
  const github = new UpstreamSyncGitHub(options)
  const existing = github.findOpenPullRequest(PENDING_BRANCH)
  const branch = updatePendingBranch({
    repoDir: root,
    branch: PENDING_BRANCH,
    base: options.base,
    file: PENDING_FILE,
    resume: Boolean(existing),
    message: `chore(upstream-sync): 更新 ${range.from}..${range.to} 待同步清单`,
    render: previous => renderPendingChecklist(plan, range, previous),
  })
  if (!branch.changed && !existing) {
    console.log(`清单和 ${options.base} 上的一致，没有可开的 PR。`)
    return 0
  }
  const pr = github.ensurePullRequest({ branch: PENDING_BRANCH, base: options.base, ...renderPendingPullRequest(plan, range, branch.content) }, existing)
  if (options.project !== '0')
    github.ensureProjectItem(pr, { to }, { id: 'upstream-sync', projectArea: '同步机制' })
  else
    console.log('未配置 PROJECTS_TOKEN，已跳过路线图；配置后重跑会把汇总 PR 加进去。')
  console.log(`${pr.created ? '已创建' : '已更新'} ${pr.url}（${plan.length} 个版本，${commits} 个提交${branch.changed ? '' : '，清单没变'}）`)
  return 0
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    process.exitCode = main()
  }
  catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
