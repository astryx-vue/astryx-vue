/**
 * 节点工作区的建立、登记、列出和删除。
 *
 * 约定（SWARM.md「独立工作区与端口分配表」）：
 * - 工作区在主工作区旁边：`../<仓库名>-wt/<节点ID>`；
 * - 分支 `sync/<小写节点ID>-<简短名>`，从 swarm-tree 切出；
 * - 每个工作区占一个槽位（1–4），文档站端口 5170 + 槽位号。
 */
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { isPidAlive, LOCK_SLOTS } from '../browser-lock.mjs'
import { branchExists, canonical, dirtyEntries, exec, git, gitText, isAncestor, listWorktrees, repoLayout } from './git.mjs'
import { claimSlot, readSlots, releaseSlot, removeSlotFile } from './slots.mjs'

export const DEFAULT_BASE = 'swarm-tree'
export const DEFAULT_INSTALL = Object.freeze(['pnpm', 'install', '--frozen-lockfile'])
/** 节点 ID：大写字母开头，后面是字母和数字，例如 C12、D4a、F3e。测试用的假节点可以是 ZZ。 */
export const WORKTREE_NODE_ID = /^[A-Z][A-Z0-9]*[a-z]?$/
const SHORT_NAME = /^[a-z0-9][a-z0-9-]*$/

export class WorktreeError extends Error {}

export function branchName(node, short) {
  return `sync/${node.toLowerCase()}-${short}`
}

export function assertNodeId(node) {
  if (!WORKTREE_NODE_ID.test(node ?? ''))
    throw new WorktreeError(`节点 ID 看不懂：${node}。应该像 C12、D4a 这样`)
}

/**
 * 全部节点工作区：位于 wtRoot 下、目录名是节点 ID 的 git worktree，
 * 再合上槽位登记。登记了但工作区已经不在的条目标为 missing。
 */
export function listNodeWorktrees(cwd) {
  const layout = repoLayout(cwd)
  const wtRoot = canonical(layout.wtRoot)
  const slots = readSlots(layout.commonDir)
  const result = []
  for (const tree of listWorktrees(cwd)) {
    if (dirname(tree.path) !== wtRoot || !WORKTREE_NODE_ID.test(basename(tree.path)))
      continue
    const node = basename(tree.path)
    const slot = slots.find(entry => entry.node === node) ?? null
    result.push({ node, path: tree.path, branch: tree.branch, head: tree.head, slot: slot?.slot ?? null, port: slot?.port ?? null, missing: false })
  }
  for (const entry of slots) {
    if (!result.some(item => item.node === entry.node))
      result.push({ node: entry.node, path: entry.path, branch: entry.branch, head: null, slot: entry.slot, port: entry.port, missing: true, broken: entry.broken })
  }
  return { layout, worktrees: result.sort((a, b) => a.node.localeCompare(b.node)) }
}

function findWorktree(cwd, node) {
  assertNodeId(node)
  const { layout, worktrees } = listNodeWorktrees(cwd)
  return { layout, entry: worktrees.find(item => item.node === node) ?? null }
}

/**
 * 建一个节点工作区：占槽位 → 建 worktree 和分支 → 装依赖。任何一步失败都回滚前面做过的步骤。
 * @param {{ cwd: string, node: string, short: string, base?: string, slot?: number,
 *   install?: string[] | null, log?: (message: string) => void }} options install 传 null 跳过安装
 * @returns {{ node: string, path: string, branch: string, slot: number, port: number }} 新工作区的信息
 */
export function createWorktree({ cwd, node, short, base = DEFAULT_BASE, slot, install = DEFAULT_INSTALL, log = () => {} }) {
  assertNodeId(node)
  if (!SHORT_NAME.test(short ?? ''))
    throw new WorktreeError(`简短名只能用小写字母、数字和连字符：${short}`)
  const { layout, worktrees } = listNodeWorktrees(cwd)
  const path = join(layout.wtRoot, node)
  const branch = branchName(node, short)
  if (worktrees.some(item => item.node === node))
    throw new WorktreeError(`节点 ${node} 已经有工作区或槽位登记了，见 worktree.mjs ls`)
  if (existsSync(path))
    throw new WorktreeError(`目录已经存在：${path}`)
  if (branchExists(cwd, branch))
    throw new WorktreeError(`分支已经存在：${branch}`)
  if (!branchExists(cwd, base))
    throw new WorktreeError(`基线分支不存在：${base}`)

  const unregistered = worktrees.filter(item => item.slot === null).length
  const entry = claimSlot(layout.commonDir, { node, branch, path }, { slot, reserved: unregistered })
  let created = false
  try {
    log(`[worktree] 建工作区 ${path}（分支 ${branch}，从 ${base} 切出）`)
    git(layout.mainRoot, ['worktree', 'add', path, '-b', branch, base])
    created = true
    if (install) {
      log(`[worktree] 安装依赖：${install.join(' ')}`)
      exec(install[0], install.slice(1), { cwd: path, inherit: true })
    }
  }
  catch (error) {
    if (created) {
      git(layout.mainRoot, ['worktree', 'remove', '--force', path], { allowFail: true })
      git(layout.mainRoot, ['branch', '-D', branch], { allowFail: true })
    }
    releaseSlot(layout.commonDir, node)
    throw error
  }
  return { node, path, branch, slot: entry.slot, port: entry.port }
}

/** 给已经存在、但还没登记槽位的节点工作区补一条登记。 */
export function adoptWorktree({ cwd, node, slot }) {
  const { layout, entry } = findWorktree(cwd, node)
  if (!entry || entry.missing)
    throw new WorktreeError(`找不到节点 ${node} 的工作区`)
  if (entry.slot !== null)
    throw new WorktreeError(`节点 ${node} 已经登记在槽位 ${entry.slot}`)
  return claimSlot(layout.commonDir, { node, branch: entry.branch, path: entry.path }, { slot })
}

/** 每个工作区领先基线几个提交、落后几个。 */
export function aheadBehind(cwd, branch, base = DEFAULT_BASE) {
  if (!branch || !branchExists(cwd, branch) || !branchExists(cwd, base))
    return null
  const [behind, ahead] = gitText(cwd, ['rev-list', '--left-right', '--count', `${base}...${branch}`]).split(/\s+/).map(Number)
  return { ahead, behind }
}

/** 删掉工作区里由已经退出的进程留下的浏览器锁。还活着的锁原样保留，返回给调用方提示。 */
function cleanBrowserLocks(commonDir, path) {
  const root = join(commonDir, 'swarm-locks')
  const kept = []
  if (!existsSync(root))
    return kept
  for (const slot of LOCK_SLOTS.filter(name => readdirSync(root).includes(name))) {
    let owner = null
    try {
      owner = JSON.parse(readFileSync(join(root, slot, 'owner.json'), 'utf8'))
    }
    catch {}
    if (!owner?.cwd || relative(path, owner.cwd).startsWith('..'))
      continue
    if (isPidAlive(owner.pid))
      kept.push(slot)
    else
      rmSync(join(root, slot), { recursive: true, force: true })
  }
  return kept
}

/**
 * 删掉节点工作区、分支和槽位登记。
 * 分支没有合入基线、或者工作区有没提交的改动时拒绝，force 为 true 才删。
 * @returns {{ node: string, removedPath: string | null, removedBranch: string | null, releasedSlot: number | null, liveLocks: string[] }} 实际清理掉的东西
 */
export function removeWorktree({ cwd, node, base = DEFAULT_BASE, force = false, log = () => {} }) {
  const { layout, entry } = findWorktree(cwd, node)
  if (!entry)
    throw new WorktreeError(`没有节点 ${node} 的工作区，也没有它的槽位登记`)
  const here = canonical(cwd)
  if (!entry.missing && (here === entry.path || here.startsWith(`${entry.path}/`)))
    throw new WorktreeError(`不能在要删除的工作区里执行 rm，请先 cd 到主工作区`)
  const result = { node, removedPath: null, removedBranch: null, releasedSlot: null, liveLocks: [] }
  if (!entry.missing) {
    const branch = entry.branch
    if (!force) {
      const dirty = dirtyEntries(entry.path)
      if (dirty.length > 0)
        throw new WorktreeError(`工作区还有没提交的改动，确认不要了就加 --force：\n${dirty.map(line => `  ${line}`).join('\n')}`)
      if (branch && !isAncestor(cwd, branch, base))
        throw new WorktreeError(`分支 ${branch} 还没合入 ${base}，确认不要了就加 --force`)
    }
    result.liveLocks = cleanBrowserLocks(layout.commonDir, entry.path)
    log(`[worktree] 删除工作区 ${entry.path}`)
    git(layout.mainRoot, ['worktree', 'remove', ...(force ? ['--force'] : []), entry.path])
    result.removedPath = entry.path
    if (branch && branchExists(cwd, branch)) {
      git(layout.mainRoot, ['branch', force ? '-D' : '-d', branch])
      result.removedBranch = branch
    }
  }
  result.releasedSlot = releaseSlot(layout.commonDir, node)
  if (entry.missing && result.releasedSlot === null && entry.slot !== null) {
    removeSlotFile(layout.commonDir, entry.slot)
    result.releasedSlot = entry.slot
  }
  return result
}

/** ls 的表格文本。 */
export function formatList(cwd, { base = DEFAULT_BASE } = {}) {
  const { worktrees } = listNodeWorktrees(cwd)
  if (worktrees.length === 0)
    return '没有节点工作区。'
  const rows = worktrees.map((item) => {
    const counts = item.missing ? null : aheadBehind(cwd, item.branch, base)
    const delta = counts ? `领先 ${counts.ahead}${counts.behind > 0 ? `，落后 ${counts.behind}` : ''}` : '—'
    const slot = item.slot === null ? '未登记' : String(item.slot)
    const port = item.port === null ? '—' : String(item.port)
    const note = item.missing ? '  （工作区已不在，用 rm 清掉这条登记）' : item.slot === null ? '  （用 adopt 登记槽位）' : ''
    return `${item.node.padEnd(5)} 槽位 ${slot.padEnd(4)} 端口 ${port.padEnd(5)} ${String(item.branch ?? '（游离）').padEnd(32)} ${delta}\n      ${item.path}${note}`
  })
  return rows.join('\n')
}
