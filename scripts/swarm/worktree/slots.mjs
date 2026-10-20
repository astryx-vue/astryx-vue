/**
 * 槽位登记：`<git-common-dir>/swarm-slots/<槽位>.json`，所有 worktree 共用一份。
 *
 * 一个槽位对应一个活跃的节点工作区，文档站端口是 5170 + 槽位号。
 * 占槽用 `wx` 方式创建文件：文件已存在就失败，两个进程不会抢到同一个槽。
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'

export const SLOT_NUMBERS = Object.freeze([1, 2, 3, 4])
export const PORT_BASE = 5170

export function portOf(slot) {
  return PORT_BASE + slot
}

export function slotsDir(commonDir) {
  return join(commonDir, 'swarm-slots')
}

function slotFile(commonDir, slot) {
  return join(slotsDir(commonDir), `${slot}.json`)
}

/** 读出全部登记，按槽位号排序。读不懂的文件当作占用，字段留空，交给 ls 报出来。 */
export function readSlots(commonDir) {
  const dir = slotsDir(commonDir)
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .map(name => /^(\d+)\.json$/.exec(name))
    .filter(match => match && SLOT_NUMBERS.includes(Number(match[1])))
    .map((match) => {
      const slot = Number(match[1])
      try {
        return { ...JSON.parse(readFileSync(slotFile(commonDir, slot), 'utf8')), slot }
      }
      catch {
        return { slot, node: null, broken: true }
      }
    })
    .sort((a, b) => a.slot - b.slot)
}

export class SlotError extends Error {}

/**
 * 占一个槽位并写好登记。
 * @param {string} commonDir
 * @param {{ node: string, branch: string, path: string }} info
 * @param {{ slot?: number, reserved?: number, now?: Date }} options
 *   slot 指定槽位；reserved 是已经存在、但没有登记槽位的节点工作区个数，它们也算占位。
 * @returns {object} 写进文件的登记内容
 */
export function claimSlot(commonDir, info, { slot, reserved = 0, now = new Date() } = {}) {
  const taken = new Set(readSlots(commonDir).map(entry => entry.slot))
  const free = SLOT_NUMBERS.filter(n => !taken.has(n))
  if (free.length - reserved <= 0) {
    const extra = reserved > 0 ? `，另有 ${reserved} 个工作区还没登记槽位` : ''
    throw new SlotError(`4 个槽位都被占了（已登记 ${taken.size} 个${extra}）。先用 worktree.mjs rm 清理用完的工作区`)
  }
  if (slot !== undefined && !SLOT_NUMBERS.includes(slot))
    throw new SlotError(`槽位只能是 ${SLOT_NUMBERS.join('、')}，收到 ${slot}`)
  if (slot !== undefined && taken.has(slot))
    throw new SlotError(`槽位 ${slot} 已经被占了`)
  if (slot === undefined && reserved > 0)
    throw new SlotError(`有 ${reserved} 个节点工作区还没登记槽位，猜不出哪个槽位是空的。先用 worktree.mjs adopt <节点> <槽位> 登记它们，或者用 --slot 指定`)
  mkdirSync(slotsDir(commonDir), { recursive: true })
  for (const candidate of slot === undefined ? free : [slot]) {
    const entry = { slot: candidate, port: portOf(candidate), node: info.node, branch: info.branch, path: info.path, createdAt: now.toISOString() }
    try {
      writeFileSync(slotFile(commonDir, candidate), `${JSON.stringify(entry, null, 2)}\n`, { flag: 'wx' })
      return entry
    }
    catch (error) {
      if (error.code !== 'EEXIST')
        throw error
    }
  }
  throw new SlotError('槽位刚被别的进程抢走了，请重试')
}

/** 释放某个节点占的槽位。返回释放掉的槽位号，没有登记时返回 null。 */
export function releaseSlot(commonDir, node) {
  const entry = readSlots(commonDir).find(item => item.node === node)
  if (!entry)
    return null
  rmSync(slotFile(commonDir, entry.slot), { force: true })
  return entry.slot
}

/** 按槽位号直接删除登记，用于清理指向已不存在的工作区的旧登记。 */
export function removeSlotFile(commonDir, slot) {
  rmSync(slotFile(commonDir, slot), { force: true })
}

/**
 * 某个工作区登记的槽位端口。不在 git 仓库里、或者没登记时返回 null。
 * 视觉对照等工具用它挑文档站端口，不同工作区不会抢同一个端口。
 */
export function slotPortFor(root) {
  try {
    const raw = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    const commonDir = isAbsolute(raw) ? raw : resolve(root, raw)
    const here = realpathSync(root)
    return readSlots(commonDir).find(entry => entry.path && existsSync(entry.path) && realpathSync(entry.path) === here)?.port ?? null
  }
  catch {
    return null
  }
}
