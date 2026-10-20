import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { parseWorktreeArgs, runWorktree } from '../scripts/swarm/worktree.mjs'
import { mergeWorktree, RebaseConflictError, rebaseWorktree } from '../scripts/swarm/worktree/integrate.mjs'
import { claimSlot, readSlots, SlotError } from '../scripts/swarm/worktree/slots.mjs'
import { adoptWorktree, branchName, createWorktree, formatList, listNodeWorktrees, removeWorktree, WorktreeError } from '../scripts/swarm/worktree/workspaces.mjs'
import { syncExports } from '../scripts/sync-exports.mjs'

const INDEX = 'packages/core/src/index.ts'
/** 假的 `pnpm sync`：按 packages/core/src 下的组件目录重写总入口，和真的 sync 一样只看源码目录。 */
const FAKE_SYNC = ['node', '-e', `
const fs = require('fs')
const dirs = fs.readdirSync('packages/core/src', { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()
fs.writeFileSync('${INDEX}', dirs.map(d => "export * from './" + d + "'").join('\\n') + '\\n')
`]
const PKG = 'packages/core/package.json'
/** 真的 sync 生成器（只是不跑 eslint），package.json 的 exports 由它写。 */
const REAL_SYNC = ['node', '--input-type=module', '-e', `
import { syncExports } from ${JSON.stringify(resolve('scripts/sync-exports.mjs'))}
await syncExports({ rootDir: process.cwd(), eslint: false })
`]
const PASS = ['node', '-e', 'process.exit(0)']
const FAIL = ['node', '-e', 'process.exit(3)']
const NO_INSTALL = ['node', '-e', '']

let sandbox: string
let repo: string
let wtRoot: string

function git(cwd: string, ...args: string[]) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function write(cwd: string, file: string, content: string) {
  mkdirSync(dirname(join(cwd, file)), { recursive: true })
  writeFileSync(join(cwd, file), content)
}

/** 在某个工作区里加一个组件目录，跑假的 sync，一起提交。 */
function addComponent(cwd: string, name: string, extra: Record<string, string> = {}) {
  write(cwd, `packages/core/src/${name}/index.ts`, `export const ${name} = 1\n`)
  for (const [file, content] of Object.entries(extra))
    write(cwd, file, content)
  execFileSync(FAKE_SYNC[0], FAKE_SYNC.slice(1), { cwd })
  git(cwd, 'add', '-A')
  git(cwd, 'commit', '-q', '-m', `add ${name}`)
}

function newNode(node: string, short = 'test') {
  return createWorktree({ cwd: repo, node, short, install: NO_INSTALL })
}

beforeEach(() => {
  sandbox = realpathSync(mkdtempSync(join(tmpdir(), 'swarm-worktree-')))
  repo = join(sandbox, 'repo')
  wtRoot = join(sandbox, 'repo-wt')
  mkdirSync(repo)
  git(repo, 'init', '-q', '-b', 'main')
  git(repo, 'config', 'user.name', 'test')
  git(repo, 'config', 'user.email', 'test@example.com')
  git(repo, 'config', 'commit.gpgsign', 'false')
  addComponent(repo, 'Button', { 'README.md': '基线\n' })
  git(repo, 'checkout', '-q', '-b', 'swarm-tree')
})

afterEach(() => {
  rmSync(sandbox, { recursive: true, force: true })
})

describe('new、ls、rm', () => {
  it('从 swarm-tree 切出分支，建到 ../<仓库名>-wt/<节点ID>，登记槽位和端口', () => {
    const created = newNode('C1', 'inputs')
    expect(created).toEqual({ node: 'C1', path: join(wtRoot, 'C1'), branch: 'sync/c1-inputs', slot: 1, port: 5171 })
    expect(git(created.path, 'rev-parse', '--abbrev-ref', 'HEAD')).toBe('sync/c1-inputs')
    expect(git(created.path, 'rev-parse', 'HEAD')).toBe(git(repo, 'rev-parse', 'swarm-tree'))
    const slots = readSlots(join(repo, '.git'))
    expect(slots).toMatchObject([{ slot: 1, port: 5171, node: 'C1', branch: 'sync/c1-inputs', path: join(wtRoot, 'C1') }])
    expect(existsSync(join(repo, '.git/swarm-slots/1.json'))).toBe(true)
  })

  it('ls 列出槽位、端口、分支和领先提交数，在节点工作区里执行结果一样', () => {
    const c1 = newNode('C1')
    newNode('D4a', 'cli')
    addComponent(c1.path, 'Card')
    const listing = formatList(repo)
    expect(listing).toMatch(/C1 +槽位 1 +端口 5171 +sync\/c1-test +领先 1/)
    expect(listing).toMatch(/D4a +槽位 2 +端口 5172 +sync\/d4a-cli +领先 0/)
    expect(formatList(c1.path)).toBe(listing)
  })

  it('rm 删工作区、分支、槽位；分支没合入时拒绝，--force 才删', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    expect(() => removeWorktree({ cwd: repo, node: 'C1' })).toThrow(/还没合入 swarm-tree/)
    expect(existsSync(c1.path)).toBe(true)
    const removed = removeWorktree({ cwd: repo, node: 'C1', force: true })
    expect(removed).toMatchObject({ removedPath: c1.path, removedBranch: 'sync/c1-test', releasedSlot: 1 })
    expect(existsSync(c1.path)).toBe(false)
    expect(git(repo, 'branch', '--list', 'sync/*')).toBe('')
    expect(readSlots(join(repo, '.git'))).toEqual([])
  })

  it('释放最后一个槽位时删掉空的 swarm-slots/，还有登记时保留，之后可以再占', () => {
    const dir = join(repo, '.git/swarm-slots')
    newNode('C1')
    newNode('C2')
    removeWorktree({ cwd: repo, node: 'C1' })
    expect(readdirSync(dir)).toEqual(['2.json'])
    removeWorktree({ cwd: repo, node: 'C2' })
    expect(existsSync(dir)).toBe(false)
    expect(newNode('C3').slot).toBe(1)
    expect(readdirSync(dir)).toEqual(['1.json'])
  })

  it('rm 遇到没提交的改动时拒绝；已合入的分支不用 --force', () => {
    const c1 = newNode('C1')
    write(c1.path, 'scratch.txt', 'x')
    expect(() => removeWorktree({ cwd: repo, node: 'C1' })).toThrow(/没提交的改动/)
    rmSync(join(c1.path, 'scratch.txt'))
    expect(removeWorktree({ cwd: repo, node: 'C1' }).removedBranch).toBe('sync/c1-test')
  })

  it('rm 能清掉工作区已经不在的旧登记', () => {
    claimSlot(join(repo, '.git'), { node: 'ZZ', branch: 'sync/zz-gone', path: join(wtRoot, 'ZZ') }, { slot: 3 })
    expect(listNodeWorktrees(repo).worktrees).toMatchObject([{ node: 'ZZ', missing: true, slot: 3 }])
    expect(removeWorktree({ cwd: repo, node: 'ZZ' }).releasedSlot).toBe(3)
    expect(readSlots(join(repo, '.git'))).toEqual([])
  })

  it('不合规的参数被拒绝', () => {
    expect(() => newNode('c1')).toThrow(WorktreeError)
    expect(() => createWorktree({ cwd: repo, node: 'C1', short: 'Bad Name', install: NO_INSTALL })).toThrow(/简短名/)
    newNode('C1')
    expect(() => newNode('C1', 'again')).toThrow(/已经有工作区/)
    expect(branchName('D4a', 'cli')).toBe('sync/d4a-cli')
  })

  it('安装依赖失败时回滚：工作区、分支、槽位都不留', () => {
    expect(() => createWorktree({ cwd: repo, node: 'C1', short: 'x', install: FAIL })).toThrow(/退出码 3/)
    expect(existsSync(join(wtRoot, 'C1'))).toBe(false)
    expect(git(repo, 'branch', '--list', 'sync/*')).toBe('')
    expect(readSlots(join(repo, '.git'))).toEqual([])
  })
})

describe('槽位', () => {
  it('依次分配 1–4，释放后复用最小的空槽，占满时报错', () => {
    for (const node of ['C1', 'C2', 'C3', 'C4'])
      newNode(node)
    expect(readSlots(join(repo, '.git')).map(s => s.slot)).toEqual([1, 2, 3, 4])
    expect(() => newNode('C5')).toThrow(/4 个槽位都被占了/)
    expect(existsSync(join(wtRoot, 'C5'))).toBe(false)
    removeWorktree({ cwd: repo, node: 'C2' })
    expect(newNode('C5').slot).toBe(2)
  })

  it('已经存在、但没有登记槽位的节点工作区也算占位', () => {
    for (const node of ['E2', 'E4', 'A4'])
      git(repo, 'worktree', 'add', '-q', join(wtRoot, node), '-b', `sync/${node.toLowerCase()}-old`, 'swarm-tree')
    // 3 个旧工作区没登记，剩 1 个空位，但不知道哪个号空着，要求先登记。
    expect(() => newNode('C1')).toThrow(/还没登记槽位/)
    expect(formatList(repo)).toContain('槽位 未登记')
    adoptWorktree({ cwd: repo, node: 'E2', slot: 3 })
    adoptWorktree({ cwd: repo, node: 'E4', slot: 4 })
    expect(() => newNode('C1')).toThrow(/还没登记槽位/)
    adoptWorktree({ cwd: repo, node: 'A4', slot: 2 })
    expect(newNode('C1').slot).toBe(1)
    expect(() => newNode('C2')).toThrow(/4 个槽位都被占了/)
  })

  it('有未登记工作区时可以用 --slot 指定，空位不够照样报错', () => {
    git(repo, 'worktree', 'add', '-q', join(wtRoot, 'E2'), '-b', 'sync/e2-old', 'swarm-tree')
    expect(createWorktree({ cwd: repo, node: 'C1', short: 'x', slot: 4, install: NO_INSTALL }).slot).toBe(4)
    expect(() => createWorktree({ cwd: repo, node: 'C2', short: 'x', slot: 4, install: NO_INSTALL })).toThrow(/槽位 4 已经被占了/)
    const commonDir = join(repo, '.git')
    claimSlot(commonDir, { node: 'X1', branch: 'b', path: 'p' }, { slot: 1 })
    claimSlot(commonDir, { node: 'X2', branch: 'b', path: 'p' }, { slot: 2 })
    expect(() => claimSlot(commonDir, { node: 'X3', branch: 'b', path: 'p' }, { slot: 3, reserved: 1 })).toThrow(SlotError)
  })
})

describe('rebase', () => {
  it('基线前进、没有冲突时直接 rebase', () => {
    const c1 = newNode('C1')
    write(c1.path, 'packages/core/src/Button/extra.ts', 'export {}\n')
    git(c1.path, 'add', '-A')
    git(c1.path, 'commit', '-q', '-m', 'node work')
    write(repo, 'README.md', '基线前进\n')
    git(repo, 'commit', '-qam', 'base moves')
    const result = rebaseWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC })
    expect(result.autoResolved).toEqual([])
    expect(git(c1.path, 'merge-base', '--is-ancestor', 'swarm-tree', 'HEAD')).toBe('')
    expect(readFileSync(join(c1.path, 'README.md'), 'utf8')).toBe('基线前进\n')
  })

  it('只有生成文件冲突时取节点版本、重新生成，然后继续', () => {
    const c1 = newNode('C1')
    // 两边都在 Button 后面加了一行，生成的总入口在同一处冲突。
    addComponent(c1.path, 'Card')
    addComponent(repo, 'Dialog')
    const result = rebaseWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC })
    expect(result.autoResolved).toEqual([{ commit: expect.any(String), files: [INDEX] }])
    expect(readFileSync(join(c1.path, INDEX), 'utf8')).toBe(`export * from './Button'\nexport * from './Card'\nexport * from './Dialog'\n`)
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
    expect(git(c1.path, 'log', '--format=%s', 'swarm-tree..HEAD')).toBe('add Card')
  })

  it('还有别的冲突时放弃 rebase，分支回到原样，报出冲突文件', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card', { 'README.md': '节点改了\n' })
    const before = git(c1.path, 'rev-parse', 'HEAD')
    addComponent(repo, 'Avatar', { 'README.md': '基线也改了\n' })
    let error: unknown
    try {
      rebaseWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC })
    }
    catch (caught) {
      error = caught
    }
    expect(error).toBeInstanceOf(RebaseConflictError)
    expect((error as RebaseConflictError).files).toEqual(['README.md'])
    expect(git(c1.path, 'rev-parse', 'HEAD')).toBe(before)
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
  })

  it('工作区有没提交的改动时不 rebase', () => {
    const c1 = newNode('C1')
    write(c1.path, 'scratch.txt', 'x')
    expect(() => rebaseWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC })).toThrow(/没提交的改动/)
  })
})

describe('rebase 时 package.json 的冲突', () => {
  type Pkg = Record<string, any>

  function readPkg(cwd: string): Pkg {
    return JSON.parse(readFileSync(join(cwd, PKG), 'utf8'))
  }

  /** 加一个组件（可以顺手改 package.json 的其它字段），跑真的 sync，一起提交。 */
  function addReal(cwd: string, name: string | null, editPkg?: (pkg: Pkg) => void) {
    if (name)
      write(cwd, `packages/core/src/${name}/index.ts`, `export const ${name} = 1\n`)
    if (editPkg) {
      const pkg = readPkg(cwd)
      editPkg(pkg)
      write(cwd, PKG, `${JSON.stringify(pkg, null, 2)}\n`)
    }
    execFileSync(REAL_SYNC[0], REAL_SYNC.slice(1), { cwd })
    git(cwd, 'add', '-A')
    git(cwd, 'commit', '-q', '-m', `add ${name ?? 'pkg edit'}`)
  }

  async function expectSyncClean(cwd: string) {
    expect((await syncExports({ rootDir: cwd, check: true, eslint: false })).ok).toBe(true)
  }

  beforeEach(() => {
    write(repo, PKG, `${JSON.stringify({
      name: '@astryx-vue/core',
      description: '旧描述',
      exports: { '.': { source: './src/index.ts', types: './dist/index.d.ts', import: './dist/index.js' }, './package.json': './package.json' },
      publishConfig: { access: 'public' },
      dependencies: { a: '1.0.0' },
    }, null, 2)}\n`)
    addReal(repo, null)
  })

  it('两边各新增一个组件：自动合并，两个组件都在 exports 里，sync --check 通过', async () => {
    const c1 = newNode('C1')
    addReal(c1.path, 'Zzzz')
    addReal(repo, 'Zzaa')
    const result = rebaseWorktree({ cwd: repo, node: 'C1', sync: REAL_SYNC })
    expect(result.autoResolved).toHaveLength(1)
    expect(result.autoResolved[0].files).toEqual(expect.arrayContaining([INDEX, PKG]))
    const pkg = readPkg(c1.path)
    expect(Object.keys(pkg.exports)).toEqual(['.', './Button', './Zzaa', './Zzzz', './package.json'])
    expect(Object.keys(pkg.publishConfig.exports)).toEqual(['.', './Button', './Zzaa', './Zzzz', './package.json'])
    expect(pkg.publishConfig.access).toBe('public')
    const index = readFileSync(join(c1.path, INDEX), 'utf8')
    expect(index).toContain('./Zzaa/index.js')
    expect(index).toContain('./Zzzz/index.js')
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
    expect(git(c1.path, 'log', '--format=%s', 'swarm-tree..HEAD')).toBe('add Zzzz')
    await expectSyncClean(c1.path)
  })

  it('基线改了 description、节点改了依赖并新增组件：两边的改动都保留', async () => {
    const c1 = newNode('C1')
    addReal(c1.path, 'Zzzz', (pkg) => {
      pkg.dependencies.b = '2.0.0'
    })
    addReal(repo, 'Zzaa', (pkg) => {
      pkg.description = '新描述'
      pkg.publishConfig.access = 'restricted'
    })
    const result = rebaseWorktree({ cwd: repo, node: 'C1', sync: REAL_SYNC })
    expect(result.autoResolved[0].files).toContain(PKG)
    const pkg = readPkg(c1.path)
    expect(pkg.description).toBe('新描述')
    expect(pkg.publishConfig.access).toBe('restricted')
    expect(pkg.dependencies).toEqual({ a: '1.0.0', b: '2.0.0' })
    expect(Object.keys(pkg.exports)).toEqual(['.', './Button', './Zzaa', './Zzzz', './package.json'])
    expect(Object.keys(pkg)).toEqual(['name', 'description', 'exports', 'publishConfig', 'dependencies'])
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
    await expectSyncClean(c1.path)
  })

  it('两边把同一个非 sync 字段改成不同的值：停下、报出字段，分支回到原样', () => {
    const c1 = newNode('C1')
    addReal(c1.path, 'Zzzz', (pkg) => {
      pkg.description = '节点的描述'
    })
    const before = git(c1.path, 'rev-parse', 'HEAD')
    addReal(repo, 'Zzaa', (pkg) => {
      pkg.description = '基线的描述'
    })
    let error: unknown
    try {
      rebaseWorktree({ cwd: repo, node: 'C1', sync: REAL_SYNC })
    }
    catch (caught) {
      error = caught
    }
    expect(error).toBeInstanceOf(RebaseConflictError)
    const conflict = error as RebaseConflictError
    expect(conflict.files).toEqual([PKG])
    expect(conflict.message).toContain('两边都改了 description，改法不同')
    expect(git(c1.path, 'rev-parse', 'HEAD')).toBe(before)
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
    expect(readPkg(c1.path).description).toBe('节点的描述')
  })

  it('exports 里手写的条目不归 sync 管，两边改法不同也要停下', () => {
    const c1 = newNode('C1')
    addReal(c1.path, 'Zzzz', (pkg) => {
      pkg.exports['./locale'] = './src/locale/node.ts'
    })
    addReal(repo, 'Zzaa', (pkg) => {
      pkg.exports['./locale'] = './src/locale/base.ts'
    })
    expect(() => rebaseWorktree({ cwd: repo, node: 'C1', sync: REAL_SYNC })).toThrow(/exports\["\.\/locale"\]/)
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
  })
})

describe('merge', () => {
  it('检查全部通过后 fast-forward 合入 swarm-tree，再删工作区', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    addComponent(repo, 'Avatar')
    const ran: string[] = []
    const marker = ['node', '-e', `require('fs').appendFileSync(${JSON.stringify(join(sandbox, 'ran.txt'))}, process.cwd() + '\\n')`]
    const result = mergeWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC, checks: [marker, PASS], log: m => ran.push(m) })
    expect(readFileSync(join(sandbox, 'ran.txt'), 'utf8')).toBe(`${c1.path}\n`)
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(result.merged)
    expect(git(repo, 'log', '--format=%s', '-2', 'swarm-tree')).toBe('add Card\nadd Avatar')
    // 主工作区检出的就是 swarm-tree，合入后它的文件也跟着更新。
    expect(readFileSync(join(repo, INDEX), 'utf8')).toContain('./Card')
    expect(existsSync(c1.path)).toBe(false)
    expect(readSlots(join(repo, '.git'))).toEqual([])
    expect(readdirSync(join(repo, '.git/swarm-locks'))).toEqual([])
    expect(ran.some(m => m.includes('合入'))).toBe(true)
  })

  it('任何一步检查失败都不合入，工作区保留', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    const base = git(repo, 'rev-parse', 'swarm-tree')
    expect(() => mergeWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC, checks: [PASS, FAIL, PASS] })).toThrow(/检查没通过（退出码 3）/)
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(base)
    expect(existsSync(c1.path)).toBe(true)
    expect(readSlots(join(repo, '.git'))).toHaveLength(1)
  })

  it('检查跑完多出没提交的生成物时不合入', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    const dirtying = ['node', '-e', `require('fs').writeFileSync('leftover.txt', 'x')`]
    expect(() => mergeWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC, checks: [dirtying] })).toThrow(/多出了改动/)
  })

  it('rebase 有手动冲突时不跑检查也不合入', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card', { 'README.md': '节点\n' })
    addComponent(repo, 'Avatar', { 'README.md': '基线又改了\n' })
    const base = git(repo, 'rev-parse', 'swarm-tree')
    expect(() => mergeWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC, checks: [FAIL] })).toThrow(RebaseConflictError)
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(base)
  })

  it('在要删的工作区里执行时一开始就拒绝：不 rebase、不跑检查、不拿锁，什么都不变', () => {
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    addComponent(repo, 'Avatar')
    const nodeHead = git(c1.path, 'rev-parse', 'HEAD')
    const baseHead = git(repo, 'rev-parse', 'swarm-tree')
    const marker = ['node', '-e', `require('fs').writeFileSync(${JSON.stringify(join(sandbox, 'ran.txt'))}, 'x')`]
    for (const cwd of [c1.path, join(c1.path, 'packages/core')])
      expect(() => mergeWorktree({ cwd, node: 'C1', sync: FAKE_SYNC, checks: [marker] })).toThrow(/请在主工作区里执行.*什么都没有改/)
    expect(existsSync(join(sandbox, 'ran.txt'))).toBe(false)
    expect(git(c1.path, 'rev-parse', 'HEAD')).toBe(nodeHead)
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(baseHead)
    expect(git(c1.path, 'status', '--porcelain')).toBe('')
    expect(existsSync(join(repo, '.git/swarm-locks/merge'))).toBe(false)
    expect(readSlots(join(repo, '.git'))).toHaveLength(1)
    // 加 keep 就可以在节点工作区里合入。
    const result = mergeWorktree({ cwd: c1.path, node: 'C1', sync: FAKE_SYNC, checks: [PASS], keep: true })
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(result.merged)
    expect(existsSync(c1.path)).toBe(true)
  })

  it('基线没有在任何工作区检出时直接更新引用', () => {
    git(repo, 'checkout', '-q', 'main')
    const c1 = newNode('C1')
    addComponent(c1.path, 'Card')
    const result = mergeWorktree({ cwd: repo, node: 'C1', sync: FAKE_SYNC, checks: [PASS], keep: true })
    expect(git(repo, 'rev-parse', 'swarm-tree')).toBe(result.merged)
    expect(existsSync(c1.path)).toBe(true)
  })
})

describe('命令行', () => {
  it('参数解析', () => {
    expect(parseWorktreeArgs(['new', 'C1', 'inputs', '--slot', '2', '--no-install'])).toMatchObject({ command: 'new', node: 'C1', short: 'inputs', slot: 2, install: false })
    expect(parseWorktreeArgs(['adopt', 'E2', '3'])).toMatchObject({ command: 'adopt', node: 'E2', slot: 3 })
    expect(parseWorktreeArgs(['rm', 'C1', '--force'])).toMatchObject({ command: 'rm', node: 'C1', force: true })
    expect(parseWorktreeArgs([])).toEqual({ command: 'help' })
    expect(() => parseWorktreeArgs(['new', 'C1'])).toThrow(/需要 2 个参数/)
  })

  it('runWorktree 的退出码：成功 0、被拒绝 1、参数不对 2', () => {
    const out: string[] = []
    const io = { cwd: repo, log: (m: string) => out.push(m), print: (m: string) => out.push(m) }
    expect(runWorktree(['new', 'C1', 'x', '--no-install'], io)).toBe(0)
    expect(out.at(-1)).toBe(`工作区：${join(wtRoot, 'C1')}\n分支：sync/c1-x\n槽位：1\n端口：5171`)
    expect(runWorktree(['ls'], io)).toBe(0)
    expect(runWorktree(['rm', 'Z9'], io)).toBe(1)
    expect(runWorktree(['bogus'], io)).toBe(2)
    expect(runWorktree(['merge', 'C1'], { ...io, cwd: join(wtRoot, 'C1') })).toBe(1)
    expect(out.at(-1)).toMatch(/请在主工作区里执行/)
    expect(runWorktree(['rm', 'C1'], io)).toBe(0)
  })
})
