import { execFileSync, spawnSync } from 'node:child_process'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { listPublicPackages } from './list-public-packages.mjs'
import { isRetryableNpmViewError } from './npm-view-retry.mjs'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const CANARY_PACKAGE = '@astryx-vue/lab'

export function changesetPublishArgs(pendingNames) {
  if (!pendingNames.includes(CANARY_PACKAGE))
    return ['changeset', 'publish']
  return ['changeset', 'publish', '--tag', 'canary']
}

// Lab 还没发到 npm 时，changeset 会把它和稳定包放进同一批。
// 新包第一次上传会 404，整次发布失败。这里把 Lab 从这一批拿掉，只发稳定包。
export function releasePublishPlan(pendingNames) {
  const hasLab = pendingNames.includes(CANARY_PACKAGE)
  const hasStable = pendingNames.some(name => name !== CANARY_PACKAGE)
  if (hasLab && hasStable) {
    return {
      args: changesetPublishArgs(pendingNames.filter(name => name !== CANARY_PACKAGE)),
      // 先发稳定包，再把 Lab 单独发到 canary：Changesets 一次只能用一个 dist-tag，
      // 混在一批会把稳定包也推到 canary，或者把 Lab 推到 latest。
      thenPublishLabAsCanary: true,
    }
  }
  return {
    args: changesetPublishArgs(pendingNames),
    thenPublishLabAsCanary: false,
  }
}

/** `npm view` 查不到某个版本时，它就是这次要发布的包。 */
function unpublishedPackages() {
  const result = []
  for (const dir of listPublicPackages(ROOT)) {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'packages', dir, 'package.json'), 'utf8'))
    try {
      execFileSync('npm', ['view', `${manifest.name}@${manifest.version}`, 'version', '--registry', 'https://registry.npmjs.org'], { stdio: 'pipe' })
    }
    catch (error) {
      if (!isRetryableNpmViewError(error))
        throw error
      result.push({ name: manifest.name, version: manifest.version })
    }
  }
  return result
}

function pendingPackageNames() {
  return unpublishedPackages().map(entry => entry.name)
}

/**
 * 发布失败后把还没上 npm 的包列出来：重跑只需要补发这些，
 * 不用重跑整批。写到 Actions 摘要里，失败页面直接能看到。
 */
function reportUnpublishedPackages() {
  const missing = unpublishedPackages()
  if (missing.length === 0)
    return
  const lines = [
    `还有 ${missing.length} 个包没发上 npm：`,
    ...missing.map(entry => `- ${entry.name}@${entry.version}`),
    '重跑这个任务即可，已发布的版本会被自动跳过。',
  ]
  console.log(`\n${lines.join('\n')}`)
  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (summaryPath)
    appendFileSync(summaryPath, `${lines.map(line => `${line}\n`).join('')}\n`)
}

function run(args, env = {}) {
  // 捕获输出再转发：发布失败时要看清是哪一类错误，才知道能不能重试。
  const result = spawnSync('pnpm', args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env } })
  if (result.stdout)
    process.stdout.write(result.stdout)
  if (result.stderr)
    process.stderr.write(result.stderr)
  if (result.status !== 0) {
    const error = new Error(`pnpm ${args.join(' ')} 失败`)
    error.output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    throw error
  }
}

/**
 * 签名账本的冲突只有在“这次发布要去登记指纹”时才会发生。
 * 同一份产物在账本里已经存在（409），再试一次签名多半还是撞。
 */
export function isSignatureLogConflict(output) {
  return String(output).includes('TLOG_CREATE_ENTRY_ERROR')
}

/**
 * 发布。第一次带 provenance；如果账本说这份产物已经登记过，就关掉补签直接上传：
 * 包内容不变，只是不再新增一条账本记录，避免卡在这里永远发不出去。
 */
function runPublish(args) {
  try {
    run(args)
  }
  catch (error) {
    if (!isSignatureLogConflict(error.output))
      throw error
    console.log('签名账本里已经有同一份产物，这次不再签名，直接上传。')
    run(args, { NPM_CONFIG_PROVENANCE: 'false' })
  }
}

/** 发布期间临时把指定包标成 private，回调结束后恢复清单原文。 */
export function withPackagesMarkedPrivate(root, packageDirs, publish) {
  const originals = packageDirs.map((dir) => {
    const path = join(root, 'packages', dir, 'package.json')
    return { path, source: readFileSync(path, 'utf8') }
  })
  for (const { path, source } of originals) {
    const manifest = JSON.parse(source)
    manifest.private = true
    writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`)
  }
  try {
    return publish()
  }
  finally {
    for (const { path, source } of originals)
      writeFileSync(path, source)
  }
}

function holdLabBack(publish) {
  console.log('@astryx-vue/lab 这个版本还没在 npm 上。这次只发布稳定包，Lab 留到单独的 canary 发布。')
  return withPackagesMarkedPrivate(ROOT, ['lab'], publish)
}

function holdStableBack(publish) {
  // 稳定包已经发完，不能让第二次 changeset publish 再碰它们；npm 的传播
  // 或 staged 状态可能让它误以为还需要发。只留下 Lab。
  const stableDirs = listPublicPackages(ROOT).filter(dir => dir !== 'lab')
  console.log('稳定包已经发布，canary 阶段只保留 @astryx-vue/lab。')
  return withPackagesMarkedPrivate(ROOT, stableDirs, publish)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const plan = releasePublishPlan(pendingPackageNames())
  run(['build:packages'])
  const publish = () => runPublish(plan.args)
  try {
    if (plan.thenPublishLabAsCanary) {
      holdLabBack(publish)
      holdStableBack(() => runPublish(['changeset', 'publish', '--tag', 'canary']))
    }
    else {
      publish()
    }
  }
  catch (error) {
    reportUnpublishedPackages()
    // 上一次尝试其实已经把包传上去了，后面那一步重复发布才会被拒。
    // 只要 npm 上什么都不缺，这次就算成功，不让流水线白白变红。
    if (unpublishedPackages().length === 0) {
      console.log('npm 上已经没有任何未发布的版本，忽略这次的重复发布错误。')
      process.exit(0)
    }
    throw error
  }
}
