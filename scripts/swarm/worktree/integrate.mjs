/**
 * 把节点分支并回 swarm-tree：rebase 到最新基线，跑完整检查，fast-forward 合入，再删工作区。
 *
 * rebase 遇到冲突时，只有冲突全部落在 `pnpm sync` 生成的文件上才自动处理：
 * 取节点这一边的版本，再在工作区跑一次 `pnpm sync` 按当前代码重新生成，然后继续。
 * 生成文件清单取自 scripts/sync-exports.mjs 的 generatedFiles。
 * 还有别的冲突就放弃这次 rebase（分支回到 rebase 之前），报出冲突文件。
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { generatedFiles } from '../../sync-exports.mjs'
import { isPidAlive } from '../browser-lock.mjs'
import { conflictedFiles, dirtyEntries, exec, git, gitOk, gitText, isAncestor, listWorktrees, rebaseInProgress } from './git.mjs'
import { DEFAULT_BASE, listNodeWorktrees, removeWorktree, WorktreeError } from './workspaces.mjs'

export const DEFAULT_SYNC = Object.freeze(['pnpm', 'sync'])
/** merge 前要通过的检查，顺序同 `pnpm check`，测试一步限制并发。 */
export const DEFAULT_CHECKS = Object.freeze([
  ['pnpm', 'check:packages'],
  ['pnpm', 'lint'],
  ['pnpm', 'typecheck'],
  ['pnpm', 'vitest', 'run', '--maxWorkers=2'],
  ['pnpm', 'build'],
  ['pnpm', 'lint:pkg'],
])
/** `pnpm sync` 除了整份生成的文件，还会改写这个文件里的 exports 字段。 */
const SYNC_TOUCHED_EXTRA = 'packages/core/package.json'

export class RebaseConflictError extends WorktreeError {
  constructor(files, commit) {
    super(`rebase 在提交 ${commit} 上遇到冲突，已放弃这次 rebase，分支保持原样。冲突文件：\n${files.map(file => `  ${file}`).join('\n')}\n请在工作区里手动 git rebase ${DEFAULT_BASE} 解决`)
    this.files = files
    this.commit = commit
  }
}

/** 工作区里由 `pnpm sync` 整份生成的文件，路径相对工作区根目录。 */
export function generatedPaths(root) {
  return new Set([...generatedFiles(root).keys()].map(file => relative(root, file)))
}

function requireNodeWorktree(cwd, node) {
  const { layout, worktrees } = listNodeWorktrees(cwd)
  const entry = worktrees.find(item => item.node === node)
  if (!entry || entry.missing)
    throw new WorktreeError(`找不到节点 ${node} 的工作区`)
  if (!entry.branch)
    throw new WorktreeError(`节点 ${node} 的工作区不在任何分支上`)
  return { layout, entry }
}

function assertClean(path) {
  if (rebaseInProgress(path))
    throw new WorktreeError(`${path} 里有一次没做完的 rebase，先处理掉（git rebase --continue 或 --abort）`)
  const dirty = dirtyEntries(path)
  if (dirty.length > 0)
    throw new WorktreeError(`${path} 有没提交的改动，先提交或清理：\n${dirty.map(line => `  ${line}`).join('\n')}`)
}

/**
 * 冲突的生成文件取节点这一边（rebase 里的 theirs）并加进暂存区；节点这边删掉了就跟着删。
 * 之后工作区和暂存区一致，重新生成带来的改动都会体现为未暂存的改动。
 */
function takeNodeSide(path, files) {
  for (const file of files) {
    if (gitOk(path, ['checkout', '--theirs', '--', file]))
      git(path, ['add', '--', file])
    else
      git(path, ['rm', '--quiet', '-f', '--', file])
  }
}

/** 工作区里相对暂存区变化了的文件，含未跟踪的新文件。 */
function unstagedFiles(path) {
  const changed = git(path, ['diff', '--name-only']).stdout.split('\n')
  const untracked = git(path, ['ls-files', '--others', '--exclude-standard']).stdout.split('\n')
  return [...new Set([...changed, ...untracked].filter(Boolean))]
}

/** 跑完 sync 后把它改过的文件加进暂存区。出现生成范围以外的改动就停下。 */
function stageSyncOutputs(path, generated) {
  const allowed = new Set([...generated, SYNC_TOUCHED_EXTRA])
  const changed = unstagedFiles(path)
  const unexpected = changed.filter(file => !allowed.has(file))
  if (unexpected.length > 0)
    throw new WorktreeError(`pnpm sync 改到了生成范围以外的文件：${unexpected.join('、')}`)
  if (changed.length > 0)
    git(path, ['add', '-A', '--', ...changed])
}

function continueRebase(path) {
  const env = { ...process.env, GIT_EDITOR: 'true' }
  delete env.NODE_ENV
  const result = git(path, ['rebase', '--continue'], { allowFail: true, env })
  if (result.status === 0 || !rebaseInProgress(path))
    return result
  // 节点这一边的改动重新生成以后和基线完全一样，这个提交变成了空提交，跳过即可。
  if (conflictedFiles(path).length === 0 && gitOk(path, ['diff', '--cached', '--quiet']))
    return git(path, ['rebase', '--skip'], { allowFail: true, env })
  return result
}

/**
 * 把节点分支 rebase 到最新的基线。
 * @param {{ cwd: string, node: string, base?: string, sync?: string[], log?: (message: string) => void }} options
 *   sync 是重新生成文件的命令，默认 `pnpm sync`，测试时可以换掉
 * @returns {{ node: string, branch: string, before: string, after: string, autoResolved: { commit: string, files: string[] }[] }}
 *   rebase 前后的提交号，以及自动处理过的冲突
 */
export function rebaseWorktree({ cwd, node, base = DEFAULT_BASE, sync = DEFAULT_SYNC, log = () => {} }) {
  const { entry } = requireNodeWorktree(cwd, node)
  const path = entry.path
  assertClean(path)
  const before = gitText(path, ['rev-parse', 'HEAD'])
  const autoResolved = []
  if (isAncestor(path, base, 'HEAD')) {
    log(`[worktree] ${entry.branch} 已经在 ${base} 之上，不用 rebase`)
    return { node, branch: entry.branch, before, after: before, autoResolved }
  }
  log(`[worktree] 把 ${entry.branch} rebase 到 ${base}`)
  let result = git(path, ['rebase', base], { allowFail: true })
  while (result.status !== 0) {
    if (!rebaseInProgress(path))
      throw new WorktreeError(`rebase 失败：\n${result.stdout}${result.stderr}`)
    const commit = gitText(path, ['rev-parse', '--short', 'REBASE_HEAD'])
    const conflicts = conflictedFiles(path)
    let generated
    try {
      generated = generatedPaths(path)
    }
    catch (error) {
      // 源码里带着冲突标记时生成器可能读不懂，这种情况一定需要人来处理。
      git(path, ['rebase', '--abort'], { allowFail: true })
      const conflict = new RebaseConflictError(conflicts, commit)
      conflict.message += `\n（生成文件清单算不出来：${error.message}）`
      throw conflict
    }
    const manual = conflicts.filter(file => !generated.has(file))
    if (conflicts.length === 0 || manual.length > 0) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new RebaseConflictError(manual.length > 0 ? manual : ['（没有冲突文件，但 rebase 停下了）'], commit)
    }
    log(`[worktree]   提交 ${commit} 的生成文件冲突，取节点版本后重新生成：${conflicts.join('、')}`)
    takeNodeSide(path, conflicts)
    try {
      exec(sync[0], sync.slice(1), { cwd: path, inherit: false })
      stageSyncOutputs(path, generated)
    }
    catch (error) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new WorktreeError(`重新生成失败，已放弃这次 rebase：${error.message}`)
    }
    autoResolved.push({ commit, files: conflicts })
    result = continueRebase(path)
  }
  return { node, branch: entry.branch, before, after: gitText(path, ['rev-parse', 'HEAD']), autoResolved }
}

/** 同一时刻只允许一个 merge：`<git-common-dir>/swarm-locks/merge/owner.json`，持有进程不在了就回收。 */
function withMergeLock(commonDir, node, fn) {
  const dir = join(commonDir, 'swarm-locks', 'merge')
  mkdirSync(join(commonDir, 'swarm-locks'), { recursive: true })
  for (let attempt = 0; ; attempt++) {
    try {
      mkdirSync(dir)
      break
    }
    catch (error) {
      if (error.code !== 'EEXIST')
        throw error
      let owner = null
      try {
        owner = JSON.parse(readFileSync(join(dir, 'owner.json'), 'utf8'))
      }
      catch {}
      if (attempt === 0 && owner && !isPidAlive(owner.pid)) {
        rmSync(dir, { recursive: true, force: true })
        continue
      }
      throw new WorktreeError(`另一个 merge 正在进行（${owner ? `pid ${owner.pid}，节点 ${owner.node}` : dir}），等它结束再来`)
    }
  }
  writeFileSync(join(dir, 'owner.json'), `${JSON.stringify({ pid: process.pid, node, startedAt: new Date().toISOString() })}\n`)
  try {
    return fn()
  }
  finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/** 让基线分支 fast-forward 到 target。基线在某个工作区里检出时在那里 merge，否则直接改引用。 */
function fastForward(cwd, base, target, expectedOld) {
  const holder = listWorktrees(cwd).find(tree => tree.branch === base)
  if (holder) {
    git(holder.path, ['merge', '--ff-only', '--quiet', target])
    return
  }
  git(cwd, ['update-ref', `refs/heads/${base}`, target, expectedOld])
}

/**
 * 复核并合入：rebase → 全部检查 → fast-forward 合入基线 → 删工作区。任何一步失败都不合入。
 * @param {{ cwd: string, node: string, base?: string, checks?: string[][], sync?: string[],
 *   keep?: boolean, log?: (message: string) => void }} options checks 默认 DEFAULT_CHECKS；keep 为 true 时合入后保留工作区
 * @returns {{ node: string, branch: string, merged: string, rebase: object, removed: object | null }} 合入结果
 */
export function mergeWorktree({ cwd, node, base = DEFAULT_BASE, checks = DEFAULT_CHECKS, sync = DEFAULT_SYNC, keep = false, log = () => {} }) {
  const { layout, entry } = requireNodeWorktree(cwd, node)
  return withMergeLock(layout.commonDir, node, () => {
    const rebase = rebaseWorktree({ cwd, node, base, sync, log })
    const path = entry.path
    for (const command of checks) {
      log(`[worktree] 检查：${command.join(' ')}`)
      const result = exec(command[0], command.slice(1), { cwd: path, inherit: true, allowFail: true })
      if (result.status !== 0)
        throw new WorktreeError(`检查没通过（退出码 ${result.status}）：${command.join(' ')}。没有合入`)
    }
    const dirty = dirtyEntries(path)
    if (dirty.length > 0)
      throw new WorktreeError(`检查跑完后工作区多出了改动，说明有生成物没提交，没有合入：\n${dirty.map(line => `  ${line}`).join('\n')}`)
    const head = gitText(path, ['rev-parse', 'HEAD'])
    if (head !== rebase.after)
      throw new WorktreeError('检查期间节点分支又有了新提交，没有合入，请重跑 merge')
    const baseHead = gitText(cwd, ['rev-parse', base])
    if (!isAncestor(cwd, baseHead, head))
      throw new WorktreeError(`检查期间 ${base} 有了新提交，没有合入，请重跑 merge`)
    log(`[worktree] 合入：${base} fast-forward 到 ${head.slice(0, 9)}`)
    fastForward(cwd, base, head, baseHead)
    const removed = keep ? null : removeWorktree({ cwd: layout.mainRoot, node, base, log })
    return { node, branch: entry.branch, merged: head, rebase, removed }
  })
}
