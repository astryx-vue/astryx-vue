// 补齐 git tag 和 GitHub Release。
// 场景：某个版本已经在 npm 上（例如首发由仓库所有者手动发布，或上一次 workflow 在打 tag 前失败），
// changeset publish 认为“没有要发的包”，不会再打 tag，也不会建 Release。
// 这里检查每个包当前版本：npm 上已存在、但远端没有对应 tag 时，在当前 commit 上补 tag 和 Release，
// 并把这些包写进 GITHUB_OUTPUT 的 packages，交给 after-publish.mjs 继续核对 npm 和补 npm 链接。
import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import process from 'node:process'

const PACKAGES = ['core', 'themes']
const NPM_REGISTRY = 'https://registry.npmjs.org'

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...options })
}

function onNpm(name, version) {
  try {
    // 显式覆盖 scope registry，避免 .npmrc 里的 @astryx-vue:registry 把查询带到别的源。
    return run('npm', ['view', `${name}@${version}`, 'version', '--registry', NPM_REGISTRY, `--@astryx-vue:registry=${NPM_REGISTRY}`]).trim() === version
  }
  catch {
    return false
  }
}

function remoteTagExists(tag) {
  return run('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`]).trim() !== ''
}

function changelogSection(dir, version) {
  try {
    const text = readFileSync(`packages/${dir}/CHANGELOG.md`, 'utf8')
    const start = text.indexOf(`## ${version}`)
    if (start === -1)
      return ''
    const rest = text.slice(start + `## ${version}`.length)
    const next = rest.search(/\n## /)
    return (next === -1 ? rest : rest.slice(0, next)).trim()
  }
  catch {
    return ''
  }
}

const backfilled = []
for (const dir of PACKAGES) {
  const { name, version } = JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8'))
  const tag = `${name}@${version}`
  if (!onNpm(name, version)) {
    console.log(`${tag} 不在 npm 上，不补 tag。`)
    continue
  }
  if (remoteTagExists(tag)) {
    console.log(`${tag} 的 tag 已存在，跳过。`)
    continue
  }
  run('git', ['tag', tag])
  run('git', ['push', 'origin', `refs/tags/${tag}`])
  console.log(`已补 tag ${tag}`)

  let hasRelease = true
  try {
    run('gh', ['release', 'view', tag])
  }
  catch {
    hasRelease = false
  }
  if (!hasRelease) {
    const body = changelogSection(dir, version) || `${tag}`
    run('gh', ['release', 'create', tag, '--title', tag, '--verify-tag', '--notes-file', '-'], { input: `${body}\n` })
    console.log(`已建 GitHub Release ${tag}`)
  }
  backfilled.push({ name, version })
}

if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, `packages=${JSON.stringify(backfilled)}\n`)
console.log(backfilled.length ? `补齐了 ${backfilled.length} 个包。` : '没有需要补齐的 tag。')
