/**
 * worktree 工具用到的 git 和子进程操作。所有命令都同步执行，失败时抛出带输出的 Error。
 * 子进程环境里去掉 NODE_ENV，和 CI 一致（见 SWARM.md「跑检查时的环境」）。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'

/** 子进程用的环境：去掉 NODE_ENV，其它原样继承。 */
export function childEnv(env = process.env) {
  const next = { ...env }
  delete next.NODE_ENV
  return next
}

export class CommandError extends Error {
  constructor(cmd, args, result) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
    super(`命令失败（退出码 ${result.status}）：${[cmd, ...args].join(' ')}${output ? `\n${output}` : ''}`)
    this.status = result.status
    this.stdout = result.stdout
    this.stderr = result.stderr
  }
}

/**
 * 跑一条命令。inherit 为 true 时输出直接进终端（安装依赖、跑检查用），否则收集输出。
 * @returns {{ status: number, stdout: string, stderr: string }} 退出码和输出
 */
export function exec(cmd, args, { cwd, inherit = false, allowFail = false, env } = {}) {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    env: env ?? childEnv(),
    stdio: inherit ? 'inherit' : 'pipe',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (result.error)
    throw result.error
  const out = { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
  if (out.status !== 0 && !allowFail)
    throw new CommandError(cmd, args, out)
  return out
}

export function git(cwd, args, options = {}) {
  return exec('git', args, { cwd, ...options })
}

/** git 输出去掉末尾换行。 */
export function gitText(cwd, args) {
  return git(cwd, args).stdout.trim()
}

export function gitOk(cwd, args) {
  return git(cwd, args, { allowFail: true }).status === 0
}

/** 统一成真实路径，避免 macOS 上 /var 和 /private/var 对不上。 */
export function canonical(path) {
  return existsSync(path) ? realpathSync(path) : resolve(path)
}

/**
 * 仓库的几个关键位置：
 * - commonDir：所有 worktree 共用的 git 目录，槽位登记和锁都放这里；
 * - mainRoot：主工作区（commonDir 的上一级）；
 * - wtRoot：节点工作区的父目录，主工作区旁边的 `<仓库名>-wt/`。
 */
export function repoLayout(cwd) {
  const raw = gitText(cwd, ['rev-parse', '--git-common-dir'])
  const commonDir = canonical(isAbsolute(raw) ? raw : resolve(cwd, raw))
  const mainRoot = dirname(commonDir)
  return { commonDir, mainRoot, wtRoot: join(dirname(mainRoot), `${basename(mainRoot)}-wt`) }
}

/**
 * 解析 `git worktree list --porcelain`。
 * @returns {{ path: string, head: string, branch: string | null }[]} 每个工作区的路径、HEAD 和分支名
 */
export function listWorktrees(cwd) {
  const out = gitText(cwd, ['worktree', 'list', '--porcelain'])
  const entries = []
  let current = null
  for (const line of out.split('\n')) {
    if (line.startsWith('worktree ')) {
      current = { path: canonical(line.slice('worktree '.length)), head: '', branch: null }
      entries.push(current)
    }
    else if (current && line.startsWith('HEAD ')) {
      current.head = line.slice('HEAD '.length)
    }
    else if (current && line.startsWith('branch ')) {
      current.branch = line.slice('branch '.length).replace(/^refs\/heads\//, '')
    }
  }
  return entries
}

export function branchExists(cwd, branch) {
  return gitOk(cwd, ['show-ref', '--verify', '--quiet', `refs/heads/${branch}`])
}

/** a 是否是 b 的祖先（含相等）。 */
export function isAncestor(cwd, a, b) {
  return gitOk(cwd, ['merge-base', '--is-ancestor', a, b])
}

/** 工作区里没提交的改动（含未跟踪文件），`git status --porcelain` 的每一行。 */
export function dirtyEntries(cwd) {
  return git(cwd, ['status', '--porcelain']).stdout.split('\n').filter(Boolean)
}

/** 当前有冲突的文件。 */
export function conflictedFiles(cwd) {
  return git(cwd, ['diff', '--name-only', '--diff-filter=U']).stdout.split('\n').filter(Boolean)
}

/** 工作区是否停在一次没做完的 rebase 里。 */
export function rebaseInProgress(cwd) {
  const gitDir = gitText(cwd, ['rev-parse', '--absolute-git-dir'])
  return existsSync(join(gitDir, 'rebase-merge')) || existsSync(join(gitDir, 'rebase-apply'))
}
