import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
  if (pendingNames.length > 1) {
    throw new Error('Lab 必须和稳定包分开发版，避免 Changesets 把 stable 包也发到 canary。请拆开 Version Packages PR 后再发布。')
  }
  return ['changeset', 'publish', '--tag', 'canary']
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

function run(args) {
  execFileSync('pnpm', args, { cwd: ROOT, stdio: 'inherit' })
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const publishArgs = changesetPublishArgs(pendingPackageNames())
  run(['build:packages'])
  run(publishArgs)
}
