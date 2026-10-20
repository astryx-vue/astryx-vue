#!/usr/bin/env node
/**
 * 节点工作区工具：建、列、删、rebase、复核加合入。约定见 SWARM.md「独立工作区与端口分配表」。
 *
 *   node scripts/swarm/worktree.mjs new <节点ID> <简短名> [--slot N] [--no-install]
 *   node scripts/swarm/worktree.mjs ls
 *   node scripts/swarm/worktree.mjs rm <节点ID> [--force]
 *   node scripts/swarm/worktree.mjs adopt <节点ID> <槽位>
 *   node scripts/swarm/worktree.mjs rebase <节点ID>
 *   node scripts/swarm/worktree.mjs merge <节点ID> [--keep]
 *
 * 可以在主工作区或任何一个节点工作区里执行，都操作同一个仓库。
 * 退出码：0 成功；1 操作被拒绝或检查失败；2 参数不对。
 */
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { canonical, CommandError } from './worktree/git.mjs'
import { mergeWorktree, rebaseWorktree } from './worktree/integrate.mjs'
import { SlotError } from './worktree/slots.mjs'
import { adoptWorktree, createWorktree, DEFAULT_BASE, formatList, listNodeWorktrees, removeWorktree, WorktreeError } from './worktree/workspaces.mjs'

export const USAGE = `用法: node scripts/swarm/worktree.mjs <子命令> [参数]

  new <节点ID> <简短名>   从 ${DEFAULT_BASE} 切出 sync/<小写节点ID>-<简短名>，建到 ../<仓库名>-wt/<节点ID>，
                          分配槽位（端口 = 5170 + 槽位号），执行 pnpm install --frozen-lockfile
      --slot N            指定槽位 1–4
      --no-install        不装依赖
  ls                      列出节点工作区、槽位、端口、分支、领先 ${DEFAULT_BASE} 几个提交
  rm <节点ID>             删工作区、分支，释放槽位。分支没合入或有未提交改动时拒绝
      --force             不管合没合入都删
  adopt <节点ID> <槽位>   给已经存在、还没登记槽位的工作区补登记
  rebase <节点ID>         rebase 到最新的 ${DEFAULT_BASE}；只有生成文件冲突时自动重新生成
  merge <节点ID>          rebase → 完整检查 → fast-forward 合入 ${DEFAULT_BASE} → 删工作区
      --keep              合入后保留工作区`

class UsageError extends Error {}

const ARITY = { new: 2, ls: 0, rm: 1, adopt: 2, rebase: 1, merge: 1 }

export function parseWorktreeArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'slot': { type: 'string' },
      'no-install': { type: 'boolean', default: false },
      'force': { type: 'boolean', default: false },
      'keep': { type: 'boolean', default: false },
      'help': { type: 'boolean', short: 'h', default: false },
    },
  })
  const [command, ...rest] = positionals
  if (values.help || !command)
    return { command: 'help' }
  if (!(command in ARITY))
    throw new UsageError(`不认识的子命令：${command}`)
  if (rest.length !== ARITY[command])
    throw new UsageError(`${command} 需要 ${ARITY[command]} 个参数，收到 ${rest.length} 个`)
  const slotText = command === 'adopt' ? rest[1] : values.slot
  const slot = slotText === undefined ? undefined : Number(slotText)
  if (slotText !== undefined && !Number.isInteger(slot))
    throw new UsageError(`槽位需要整数，收到 ${slotText}`)
  return { command, node: rest[0], short: command === 'new' ? rest[1] : undefined, slot, install: !values['no-install'], force: values.force, keep: values.keep }
}

function describeRebase(result) {
  if (result.before === result.after)
    return `${result.branch} 已经在 ${DEFAULT_BASE} 之上。`
  const lines = [`${result.branch} 已 rebase 到 ${DEFAULT_BASE}，现在是 ${result.after.slice(0, 9)}。`]
  for (const item of result.autoResolved)
    lines.push(`  提交 ${item.commit} 的生成文件冲突已自动重新生成：${item.files.join('、')}`)
  return lines.join('\n')
}

function describeRemoval(result) {
  const lines = [`已清理节点 ${result.node}：`]
  lines.push(`  工作区：${result.removedPath ?? '（本来就不在）'}`)
  lines.push(`  分支：${result.removedBranch ?? '（没有）'}`)
  lines.push(`  槽位：${result.releasedSlot ?? '（没有登记）'}`)
  if (result.liveLocks.length > 0)
    lines.push(`  注意：${result.liveLocks.join('、')} 的浏览器锁还被这个工作区里的活进程拿着，没有删`)
  return lines.join('\n')
}

/** 执行一条命令，返回退出码。输出直接写终端，进度写 stderr。 */
export function runWorktree(argv, { cwd = process.cwd(), log = message => console.error(message), print = message => console.log(message) } = {}) {
  let options
  try {
    options = parseWorktreeArgs(argv)
  }
  catch (error) {
    log(`${error.message}\n\n${USAGE}`)
    return 2
  }
  try {
    switch (options.command) {
      case 'help':
        print(USAGE)
        return 0
      case 'new': {
        const created = createWorktree({ cwd, node: options.node, short: options.short, slot: options.slot, install: options.install ? undefined : null, log })
        print(`工作区：${created.path}\n分支：${created.branch}\n槽位：${created.slot}\n端口：${created.port}`)
        return 0
      }
      case 'ls':
        print(formatList(cwd))
        return 0
      case 'rm':
        print(describeRemoval(removeWorktree({ cwd, node: options.node, force: options.force, log })))
        return 0
      case 'adopt': {
        const entry = adoptWorktree({ cwd, node: options.node, slot: options.slot })
        print(`已把 ${options.node} 登记到槽位 ${entry.slot}（端口 ${entry.port}）`)
        return 0
      }
      case 'rebase':
        print(describeRebase(rebaseWorktree({ cwd, node: options.node, log })))
        return 0
      case 'merge': {
        const target = listNodeWorktrees(cwd).worktrees.find(item => item.node === options.node)
        const here = canonical(cwd)
        if (!options.keep && target && (here === target.path || here.startsWith(`${target.path}/`)))
          throw new WorktreeError('merge 结束时会删掉这个工作区，请在主工作区里执行，或者加 --keep')
        const result = mergeWorktree({ cwd, node: options.node, keep: options.keep, log })
        const lines = [describeRebase(result.rebase), `已合入 ${DEFAULT_BASE}：${result.merged.slice(0, 9)}`]
        if (result.removed)
          lines.push(describeRemoval(result.removed))
        print(lines.join('\n'))
        return 0
      }
    }
  }
  catch (error) {
    if (error instanceof WorktreeError || error instanceof SlotError || error instanceof CommandError) {
      log(error.message)
      return 1
    }
    throw error
  }
  return 2
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  process.exitCode = runWorktree(process.argv.slice(2))
