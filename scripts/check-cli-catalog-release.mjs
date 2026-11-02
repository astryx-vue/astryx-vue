import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'

const CLI_PACKAGE = '@astryx-vue/cli'
const CATALOG_PATH = 'packages/cli/src/generated/catalog.json'
const CLI_MANIFEST_PATH = 'packages/cli/package.json'

/** A catalog change must ship in a new CLI version, either now or in the version PR. */
export function cliCatalogReleaseProblem({ catalogChanged, cliVersionChanged, changesets }) {
  if (!catalogChanged || cliVersionChanged)
    return null
  const hasCliChangeset = changesets.some(text => /^['"]?@astryx-vue\/cli['"]?\s*:\s*(?:patch|minor|major)\s*$/m.test(text))
  return hasCliChangeset
    ? null
    : `${CATALOG_PATH} 变了，但没有 ${CLI_PACKAGE} 的 changeset。请补一个 patch changeset，让更新后的文档和模板真正发布到 npm。`
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function changed(base, head, path) {
  const result = execFileSync('git', ['diff', '--name-only', base, head, '--', path], { encoding: 'utf8' })
  return result.trim().length > 0
}

function cliVersion(revision) {
  return JSON.parse(git(['show', `${revision}:${CLI_MANIFEST_PATH}`])).version
}

if (process.argv[1]?.endsWith('check-cli-catalog-release.mjs')) {
  const [base = 'origin/main', head = 'HEAD'] = process.argv.slice(2)
  const mergeBase = git(['merge-base', base, head])
  const changesetPaths = git(['diff', '--name-only', '--diff-filter=ACMR', mergeBase, head, '--', '.changeset'])
    .split('\n')
    .filter(path => path.endsWith('.md'))
  const problem = cliCatalogReleaseProblem({
    catalogChanged: changed(mergeBase, head, CATALOG_PATH),
    cliVersionChanged: cliVersion(mergeBase) !== cliVersion(head),
    changesets: changesetPaths.map(path => readFileSync(path, 'utf8')),
  })
  if (problem) {
    console.error(problem)
    process.exitCode = 1
  }
  else {
    console.log('CLI catalog 发版检查通过。')
  }
}
