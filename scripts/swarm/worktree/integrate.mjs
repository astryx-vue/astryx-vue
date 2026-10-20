/**
 * 把节点分支并回 swarm-tree：rebase 到最新基线，跑完整检查，fast-forward 合入，再删工作区。
 *
 * rebase 遇到冲突时，只有冲突全部能交给 `pnpm sync` 重新生成才自动处理（规则见 sync-conflicts.mjs）：
 * 整份生成的文件取节点版本，package.json 做 JSON 三方合并，再在工作区跑一次 `pnpm sync`
 * 按当前代码重新生成，然后继续。
 * 还有别的冲突就放弃这次 rebase（分支回到 rebase 之前），报出冲突文件和原因。
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { isPidAlive } from '../browser-lock.mjs'
import { canonical, conflictedFiles, dirtyEntries, exec, git, gitOk, gitText, isAncestor, listWorktrees, rebaseInProgress } from './git.mjs'
import { manualConflicts, resolveSyncConflicts, stageSyncOutputs, syncManagedFiles } from './sync-conflicts.mjs'
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
export class RebaseConflictError extends WorktreeError {
  /**
   * @param {string[]} files 要人处理的冲突文件
   * @param {string} commit 停下来的提交
   * @param {Map<string, string[]>} [reasons] 部分文件不能自动合并的原因
   */
  constructor(files, commit, reasons = new Map()) {
    const lines = files.map(file => `  ${file}${reasons.has(file) ? `：${reasons.get(file).join('；')}` : ''}`)
    super(`rebase 在提交 ${commit} 上遇到冲突，已放弃这次 rebase，分支保持原样。冲突文件：\n${lines.join('\n')}\n请在工作区里手动 git rebase ${DEFAULT_BASE} 解决`)
    this.files = files
    this.commit = commit
    this.reasons = reasons
  }
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
    let managed
    try {
      managed = syncManagedFiles(path)
    }
    catch (error) {
      // 源码里带着冲突标记时生成器可能读不懂，这种情况一定需要人来处理。
      git(path, ['rebase', '--abort'], { allowFail: true })
      const conflict = new RebaseConflictError(conflicts, commit)
      conflict.message += `\n（生成文件清单算不出来：${error.message}）`
      throw conflict
    }
    const manual = manualConflicts(conflicts, managed)
    if (conflicts.length === 0 || manual.length > 0) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new RebaseConflictError(manual.length > 0 ? manual : ['（没有冲突文件，但 rebase 停下了）'], commit)
    }
    const resolved = resolveSyncConflicts(path, conflicts, managed)
    if (!resolved.ok) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new RebaseConflictError([...resolved.problems.keys()], commit, resolved.problems)
    }
    log(`[worktree]   提交 ${commit} 的生成文件冲突已合并，重新生成：${conflicts.join('、')}`)
    let unexpected
    try {
      exec(sync[0], sync.slice(1), { cwd: path, inherit: false })
      unexpected = stageSyncOutputs(path, managed)
    }
    catch (error) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new WorktreeError(`重新生成失败，已放弃这次 rebase：${error.message}`)
    }
    if (unexpected.length > 0) {
      git(path, ['rebase', '--abort'], { allowFail: true })
      throw new WorktreeError(`pnpm sync 改到了生成范围以外的文件，已放弃这次 rebase：${unexpected.join('、')}`)
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
 * 不带 keep 时不能在要删的工作区里执行：一开始就拒绝，不拿锁、不 rebase。
 * @param {{ cwd: string, node: string, base?: string, checks?: string[][], sync?: string[],
 *   keep?: boolean, log?: (message: string) => void }} options checks 默认 DEFAULT_CHECKS；keep 为 true 时合入后保留工作区
 * @returns {{ node: string, branch: string, merged: string, rebase: object, removed: object | null }} 合入结果
 */
export function mergeWorktree({ cwd, node, base = DEFAULT_BASE, checks = DEFAULT_CHECKS, sync = DEFAULT_SYNC, keep = false, log = () => {} }) {
  const { layout, entry } = requireNodeWorktree(cwd, node)
  const here = canonical(cwd)
  if (!keep && (here === entry.path || here.startsWith(`${entry.path}/`)))
    throw new WorktreeError('merge 结束时会删掉这个工作区，请在主工作区里执行，或者加 --keep。什么都没有改')
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
