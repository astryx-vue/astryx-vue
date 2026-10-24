#!/usr/bin/env node
/**
 * 浏览器锁：整台电脑上同时最多开 2 个浏览器会话。
 *
 * 锁目录放在 git 公共目录下的 `swarm-locks/`，所有 worktree 共用。
 * 拿锁就是用 `mkdir` 原子地创建 `browser-1` 或 `browser-2`，
 * 成功的那个目录里写 `owner.json` 记录是谁拿的。
 *
 * 用法：
 *   import { withBrowserLock } from './browser-lock.mjs'
 *   await withBrowserLock('截图 Button', async () => { ... })
 *
 *   node scripts/swarm/browser-lock.mjs run --purpose <说明> [--timeout <分钟>] [--max-run <秒>] -- <命令...>
 *
 * `--timeout` 是排队等锁的上限。`--max-run` 是拿到锁之后命令最多跑多久，默认 180 秒，
 * 超时先发 SIGTERM，5 秒后还没退就 SIGKILL，并以 124 退出。浏览器脚本要拆成短小的单项探测，
 * 一次只验证一件事，不要写一个长时间跑的大脚本。
 *   node scripts/swarm/browser-lock.mjs status
 */
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

export const LOCK_SLOTS = ['browser-1', 'browser-2']
export const LOCK_RETRY_MS = 5_000
export const LOCK_DEFAULT_TIMEOUT_MS = 30 * 60 * 1000
/** 拿到锁后命令默认最多跑多久。 */
export const RUN_DEFAULT_MAX_MS = 180 * 1000
export const LOCK_STALE_MS = 2 * 60 * 60 * 1000

/** 所有 worktree 共用的锁根目录：`<git-common-dir>/swarm-locks`。 */
export function defaultLockRoot(cwd = process.cwd()) {
  const dir = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd, encoding: 'utf8' }).trim()
  return join(isAbsolute(dir) ? dir : resolve(cwd, dir), 'swarm-locks')
}

/** 进程是否还活着。EPERM 说明进程存在但不属于当前用户，也算活着。 */
export function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0)
    return false
  try {
    process.kill(pid, 0)
    return true
  }
  catch (error) {
    return error.code === 'EPERM'
  }
}

function readOwner(slotDir) {
  try {
    return JSON.parse(readFileSync(join(slotDir, 'owner.json'), 'utf8'))
  }
  catch {
    return null
  }
}

/**
 * 判断一个已存在的槽是否失效：持有进程已不存在，或已持有超过 staleMs。
 * owner.json 还没写完（刚 mkdir）时按目录存在时间之外的信息无法判断，视为有效。
 */
export function isLockStale(owner, { now = Date.now(), staleMs = LOCK_STALE_MS, pidAlive = isPidAlive } = {}) {
  if (owner == null)
    return false
  if (!pidAlive(owner.pid))
    return true
  const started = Date.parse(owner.startedAt)
  return Number.isFinite(started) && now - started > staleMs
}

/** 列出所有槽的当前状态，供 status 命令和排队提示使用。 */
export function lockStatus(root) {
  return LOCK_SLOTS.map((slot) => {
    const dir = join(root, slot)
    let held = false
    try {
      readdirSync(dir)
      held = true
    }
    catch {}
    return { slot, held, owner: held ? readOwner(dir) : null }
  })
}

/**
 * 尝试拿一次锁，拿不到返回 null。失效的槽会先回收再抢。
 * 返回值带 release()，可以重复调用。
 */
export function tryAcquire(root, purpose, options = {}) {
  const { pid = process.pid, cwd = process.cwd(), now = Date.now(), staleMs, pidAlive } = options
  mkdirSync(root, { recursive: true })
  for (const slot of LOCK_SLOTS) {
    const dir = join(root, slot)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        mkdirSync(dir)
      }
      catch (error) {
        if (error.code !== 'EEXIST')
          throw error
        if (attempt === 0 && isLockStale(readOwner(dir), { now, staleMs, pidAlive })) {
          rmSync(dir, { recursive: true, force: true })
          continue
        }
        break
      }
      const owner = { pid, cwd, purpose, startedAt: new Date(now).toISOString() }
      writeFileSync(join(dir, 'owner.json'), `${JSON.stringify(owner, null, 2)}\n`)
      let released = false
      return {
        slot,
        dir,
        owner,
        release() {
          if (released)
            return
          released = true
          // 只删自己的锁：防止被判失效回收后又被别人拿走的槽被误删。
          const current = readOwner(dir)
          if (current == null || (current.pid === owner.pid && current.startedAt === owner.startedAt))
            rmSync(dir, { recursive: true, force: true })
        },
      }
    }
  }
  return null
}

/** 排队拿锁：每 retryMs 重试一次，超过 timeoutMs 抛错。 */
export async function acquireBrowserLock(purpose, options = {}) {
  const {
    root = defaultLockRoot(),
    timeoutMs = LOCK_DEFAULT_TIMEOUT_MS,
    retryMs = LOCK_RETRY_MS,
    log = message => console.error(message),
  } = options
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const lock = tryAcquire(root, purpose, options)
    if (lock)
      return lock
    if (Date.now() + retryMs > deadline)
      throw new Error(`等了 ${Math.round(timeoutMs / 1000)} 秒仍拿不到浏览器锁（${root}）`)
    const holders = lockStatus(root)
      .map(s => `${s.slot}: ${s.owner ? `pid ${s.owner.pid} ${s.owner.purpose}` : '占用中'}`)
      .join('；')
    log(`[browser-lock] 排队中，${retryMs / 1000} 秒后重试（${holders}）`)
    await sleep(retryMs)
  }
}

/**
 * 拿到锁后执行 fn，结束（含抛错、进程退出）时释放。
 *
 * handleSignals 为 true（默认）时，收到 SIGINT/SIGTERM 会先等 onSignal 做完清理，
 * 再释放锁，最后以 128+信号值退出。调用方自己管信号时传 false，锁仍会在进程退出时释放。
 */
export async function withBrowserLock(purpose, fn, options = {}) {
  const { handleSignals = true } = options
  const lock = await acquireBrowserLock(purpose, options)
  const onExit = () => lock.release()
  const onSignal = (signal) => {
    Promise.resolve()
      .then(() => options.onSignal?.(signal))
      .finally(() => {
        lock.release()
        process.exit(signal === 'SIGINT' ? 130 : 143)
      })
  }
  process.on('exit', onExit)
  if (handleSignals) {
    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)
  }
  try {
    return await fn(lock)
  }
  finally {
    lock.release()
    process.off('exit', onExit)
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
  }
}

/** 解析 `run --purpose x --timeout 10 --max-run 120 -- cmd args` 形式的参数。 */
export function parseLockCli(argv) {
  const [command, ...rest] = argv
  const separator = rest.indexOf('--')
  const flags = separator === -1 ? rest : rest.slice(0, separator)
  const cmd = separator === -1 ? [] : rest.slice(separator + 1)
  const result = { command, purpose: undefined, timeoutMs: LOCK_DEFAULT_TIMEOUT_MS, maxRunMs: RUN_DEFAULT_MAX_MS, cmd }
  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === '--purpose')
      result.purpose = flags[++i]
    else if (flags[i] === '--timeout')
      result.timeoutMs = Number(flags[++i]) * 60 * 1000
    else if (flags[i] === '--max-run')
      result.maxRunMs = Number(flags[++i]) * 1000
  }
  return result
}

async function main() {
  const args = parseLockCli(process.argv.slice(2))
  if (args.command === 'status') {
    const root = defaultLockRoot()
    console.log(root)
    for (const s of lockStatus(root))
      console.log(`${s.slot}: ${s.held ? JSON.stringify(s.owner) : '空闲'}`)
    return
  }
  if (args.command !== 'run' || !args.purpose || args.cmd.length === 0) {
    console.error('用法: node scripts/swarm/browser-lock.mjs run --purpose <说明> [--timeout <分钟>] [--max-run <秒>] -- <命令...>')
    console.error('      node scripts/swarm/browser-lock.mjs status')
    process.exit(2)
  }
  let child
  const code = await withBrowserLock(args.purpose, lock => new Promise((resolvePromise) => {
    console.error(`[browser-lock] 已拿到 ${lock.slot}`)
    child = spawn(args.cmd[0], args.cmd.slice(1), { stdio: 'inherit', detached: true })
    let timedOut = false
    const killGroup = (sig) => {
      try {
        process.kill(-child.pid, sig)
      }
      catch {}
    }
    const timer = setTimeout(() => {
      timedOut = true
      console.error(`[browser-lock] 命令超过 ${Math.round(args.maxRunMs / 1000)} 秒，强制结束。请把它拆成更短的单项探测。`)
      killGroup('SIGTERM')
      setTimeout(killGroup, 5000, 'SIGKILL').unref()
    }, args.maxRunMs)
    child.on('exit', (exitCode, signal) => {
      clearTimeout(timer)
      resolvePromise(timedOut ? 124 : (exitCode ?? (signal ? 1 : 0)))
    })
    child.on('error', (error) => {
      console.error(error.message)
      resolvePromise(127)
    })
  }), {
    timeoutMs: args.timeoutMs,
    onSignal: (signal) => {
      try {
        process.kill(-child.pid, signal)
      }
      catch {
        child?.kill(signal)
      }
    },
  })
  process.exit(code)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  main()
