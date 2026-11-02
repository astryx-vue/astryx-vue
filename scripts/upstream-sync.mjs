#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { resolveUpstreamDir } from './upstream-ledger.mjs'
import { validateFamilies } from './upstream-sync/families.mjs'
import { UpstreamSyncGitHub } from './upstream-sync/github.mjs'
import { buildSyncPlan, latestVersionTag } from './upstream-sync/plan.mjs'
import { renderReleaseIssue } from './upstream-sync/render.mjs'

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
      const key = { '--from': 'from', '--to': 'to', '--upstream': 'upstream', '--repo': 'repo', '--owner': 'owner', '--project': 'project' }[arg]
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
    console.log('用法：node scripts/upstream-sync.mjs [--dry-run|--apply] [--from v0.7.1] [--to v0.7.5] [--upstream <目录>]')
    return 0
  }
  const missing = validateFamilies()
  if (missing.length)
    throw new Error(`这些节点还没有登记长期组件族：${missing.join('、')}`)
  const upstream = resolveUpstreamDir(options.upstream)
  const plan = buildSyncPlan({ upstream, from: options.from, to: options.to ?? latestVersionTag(upstream) })
  const commits = plan.reduce((sum, release) => sum + release.families.reduce((n, family) => n + family.commits.length, 0), 0)
  if (!options.apply) {
    for (const release of plan) {
      const perRelease = release.families.reduce((n, family) => n + family.commits.length, 0)
      console.log(`${release.to}  ${release.families.length} 个组件族  ${perRelease} 个提交`)
    }
    console.log(`dry-run：${plan.length} 个版本，${commits} 个提交；每个版本一个 issue，没有访问或修改 GitHub。`)
    return 0
  }

  const github = new UpstreamSyncGitHub(options)
  for (const release of plan) {
    const input = renderReleaseIssue(release)
    const issue = github.ensureIssue(input)
    // 路线图上一张卡片代表一个上游版本；原来的按族拆分会让路线图长出几十张同义卡片。
    if (options.project !== '0')
      github.ensureProjectItem(issue, release, release.families[0])
    console.log(`${issue.created ? '已创建' : '已存在'} ${issue.url}`)
  }
  if (options.project === '0')
    console.log('未配置 PROJECTS_TOKEN，已跳过路线图；配置后重跑会补齐现有 issue 的卡片。')
  console.log(`同步完成：${plan.length} 个版本 issue。`)
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
