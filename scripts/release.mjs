import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
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

function pendingPackageNames() {
  return listPublicPackages(ROOT).filter((dir) => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'packages', dir, 'package.json'), 'utf8'))
    try {
      execFileSync('npm', ['view', `${manifest.name}@${manifest.version}`, 'version', '--registry', 'https://registry.npmjs.org'], { stdio: 'pipe' })
      return false
    }
    catch (error) {
      if (isRetryableNpmViewError(error))
        return true
      throw error
    }
  })
}

const LAB_MANIFEST = join(ROOT, 'packages', 'lab', 'package.json')

function run(args) {
  execFileSync('pnpm', args, { cwd: ROOT, stdio: 'inherit' })
}

function holdLabBack(publish) {
  const original = readFileSync(LAB_MANIFEST, 'utf8')
  const manifest = JSON.parse(original)
  manifest.private = true
  writeFileSync(LAB_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log('@astryx-vue/lab 这个版本还没在 npm 上。这次只发布稳定包，Lab 留到单独的 canary 发布。')
  try {
    publish()
  }
  finally {
    writeFileSync(LAB_MANIFEST, original)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const plan = releasePublishPlan(pendingPackageNames())
  run(['build:packages'])
  const publish = () => run(plan.args)
  if (plan.thenPublishLabAsCanary) {
    holdLabBack(publish)
    run(['changeset', 'publish', '--tag', 'canary'])
  }
  else {
    publish()
  }
}
