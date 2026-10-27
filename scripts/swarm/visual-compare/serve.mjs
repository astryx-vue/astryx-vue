/**
 * 在固定端口上起我们的文档站开发服务，多个 `pnpm visual` 进程共用一份。
 *
 * 租约目录 `<tmpdir>/astryx-visual-serve-<port>/`：
 *   server.json      服务进程组 pid、所属工作区
 *   users/<pid>      每个正在用服务的进程一个文件
 *   .mutex/          改租约时的互斥目录
 * 第一个使用者启动服务，最后一个离开的使用者把整个进程组关掉。
 * 所有释放操作都是同步的，进程 exit 钩子里也能调用。
 */
import { execFileSync, spawn } from 'node:child_process'
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { isPidAlive } from '../browser-lock.mjs'

const MUTEX_STALE_MS = 2 * 60 * 1000
const READY_TIMEOUT_MS = 180_000

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

export function leaseDir(port) {
  return join(tmpdir(), `astryx-visual-serve-${port}`)
}

function withMutex(dir, fn) {
  mkdirSync(dir, { recursive: true })
  const mutex = join(dir, '.mutex')
  const deadline = Date.now() + 30_000
  for (;;) {
    try {
      mkdirSync(mutex)
      break
    }
    catch (error) {
      if (error.code !== 'EEXIST')
        throw error
      try {
        if (Date.now() - statSync(mutex).mtimeMs > MUTEX_STALE_MS)
          rmSync(mutex, { recursive: true, force: true })
      }
      catch {}
      if (Date.now() > deadline)
        throw new Error(`拿不到文档站租约互斥锁：${mutex}`)
      sleepSync(100)
    }
  }
  try {
    return fn()
  }
  finally {
    rmSync(mutex, { recursive: true, force: true })
  }
}

function readServer(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, 'server.json'), 'utf8'))
  }
  catch {
    return null
  }
}

function liveUsers(dir) {
  const users = join(dir, 'users')
  mkdirSync(users, { recursive: true })
  return readdirSync(users).filter((name) => {
    if (isPidAlive(Number(name)))
      return true
    rmSync(join(users, name), { force: true })
    return false
  })
}

/** 关掉整个进程组：先 SIGTERM，3 秒内没退就 SIGKILL。 */
export function killProcessGroup(pid) {
  if (!isPidAlive(pid))
    return
  try {
    process.kill(-pid, 'SIGTERM')
  }
  catch {}
  for (let i = 0; i < 30 && isPidAlive(pid); i++)
    sleepSync(100)
  try {
    process.kill(-pid, 'SIGKILL')
  }
  catch {}
}

function portIsListening(port) {
  try {
    return execFileSync('lsof', ['-tiTCP:'.concat(port), '-sTCP:LISTEN'], { encoding: 'utf8' }).trim() !== ''
  }
  catch {
    return false
  }
}

async function waitForReady(origin, server, logFile) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (!isPidAlive(server.pid)) {
      const log = existsSync(logFile) ? readFileSync(logFile, 'utf8').slice(-2000) : ''
      throw new Error(`文档站服务启动失败，日志末尾：\n${log}`)
    }
    try {
      const res = await fetch(`${origin}/`)
      if (res.ok)
        return
    }
    catch {}
    await sleep(500)
  }
  throw new Error(`文档站服务 ${READY_TIMEOUT_MS / 1000} 秒内没有就绪，日志：${logFile}`)
}

/** 配置文件从 dist 加载图标插件，dist 不在就先构建一次。 */
function ensurePackagesBuilt(root, log) {
  if (existsSync(join(root, 'packages/core/dist/Icon/plugin.js')))
    return
  log('[visual] 没有找到 packages/core/dist，先跑 pnpm build:packages')
  execFileSync('pnpm', ['build:packages'], { cwd: root, stdio: 'inherit' })
}

/**
 * 拿到一份可用的文档站服务。返回 release()，同步、可重复调用。
 * @param {{ root: string, port: number, log?: (msg: string) => void }} options
 */
export async function acquireDocsServer({ root, port, log = message => console.error(message) }) {
  const dir = leaseDir(port)
  const origin = `http://localhost:${port}`
  const logFile = join(dir, 'server.log')
  const userFile = join(dir, 'users', String(process.pid))
  let started = false

  const server = withMutex(dir, () => {
    const users = liveUsers(dir)
    const current = readServer(dir)
    if (current && isPidAlive(current.pid) && users.length > 0) {
      if (current.root !== root)
        throw new Error(`端口 ${port} 上的文档站属于另一个工作区（${current.root}）`)
      writeFileSync(userFile, '')
      return current
    }
    if (current)
      killProcessGroup(current.pid)
    rmSync(join(dir, 'server.json'), { force: true })
    if (portIsListening(port))
      throw new Error(`端口 ${port} 已被别的进程占用。若那是本工作区的文档站，改用 --no-serve`)
    ensurePackagesBuilt(root, log)
    const fd = openSync(logFile, 'w')
    // 外部环境常带 NODE_ENV=production，会让 VitePress 开发服务按生产模式找页面而全部 404。
    const child = spawn('pnpm', ['--filter', '@astryx-vue/docs', 'dev', '--port', String(port), '--strictPort'], {
      cwd: root,
      detached: true,
      stdio: ['ignore', fd, fd],
      env: { ...process.env, NODE_ENV: 'development' },
    })
    closeSync(fd)
    child.unref()
    const info = { pid: child.pid, root, startedAt: new Date().toISOString() }
    writeFileSync(join(dir, 'server.json'), `${JSON.stringify(info)}\n`)
    writeFileSync(userFile, '')
    started = true
    return info
  })

  let released = false
  const release = () => {
    if (released)
      return
    released = true
    process.off('exit', release)
    withMutex(dir, () => {
      rmSync(userFile, { force: true })
      if (liveUsers(dir).length > 0)
        return
      const current = readServer(dir)
      if (current)
        killProcessGroup(current.pid)
      rmSync(join(dir, 'server.json'), { force: true })
    })
  }

  // 等就绪期间进程被信号打断时，调用方还拿不到 release，靠这个钩子兆底。
  process.on('exit', release)
  log(started ? `[visual] 正在启动文档站 ${origin}（日志 ${logFile}）` : `[visual] 复用已在跑的文档站 ${origin}`)
  try {
    await waitForReady(origin, server, logFile)
  }
  catch (error) {
    release()
    throw error
  }
  return { origin, release }
}
