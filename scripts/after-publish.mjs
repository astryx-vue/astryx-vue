import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { setTimeout } from 'node:timers/promises'

const packages = JSON.parse(process.env.PUBLISHED_PACKAGES ?? '[]')
const visibility = process.env.REPO_VISIBILITY ?? ''

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  })
}

async function viewPackage(spec) {
  let lastError
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      return JSON.parse(run('npm', ['view', spec, '--json']))
    }
    catch (error) {
      lastError = error
      const stderr = error.stderr?.toString() ?? ''
      console.log(`npm view ${spec} 第 ${attempt} 次没有查到。${stderr.trim()}`)
      if (attempt < 6)
        await setTimeout(10_000)
    }
  }
  throw lastError
}

function repositoryUrl(info) {
  if (typeof info.repository === 'string')
    return info.repository
  return info.repository?.url ?? ''
}

function hasProvenance(info) {
  return info?.dist?.attestations?.provenance != null
}

function readReleaseBody(tag) {
  try {
    return run('gh', ['release', 'view', tag, '--json', 'body', '--jq', '.body']).trim()
  }
  catch {
    return null
  }
}

function writeRelease(tag, body, exists) {
  const args = exists
    ? ['release', 'edit', tag, '--notes-file', '-']
    : ['release', 'create', tag, '--title', tag, '--notes-file', '-']
  run('gh', args, { input: body })
}

if (!Array.isArray(packages) || packages.length === 0)
  throw new Error('PUBLISHED_PACKAGES 为空，没有可以核对的包')

for (const pkg of packages) {
  const spec = `${pkg.name}@${pkg.version}`
  const info = await viewPackage(spec)
  const version = Array.isArray(info.version) ? info.version.at(-1) : info.version
  if (version !== pkg.version)
    throw new Error(`${spec} 在 npm 上查到的版本是 ${version ?? '空'}`)

  const url = repositoryUrl(info)
  if (!url.includes('github.com/astryx-vue/astryx-vue'))
    throw new Error(`${spec} 的 repository 没有指向 astryx-vue/astryx-vue：${url}`)

  if (visibility === 'public') {
    if (!hasProvenance(info)) {
      throw new Error(`${spec} 缺少 provenance。dist.attestations=${JSON.stringify(info.dist?.attestations ?? null)}`)
    }
    console.log(`${spec} 已在 npm 上，并且带有 provenance`)
  }
  else {
    console.log(`${spec} 已在 npm 上。仓库可见性是 ${visibility || '未知'}，这次不要求 provenance`)
  }

  const tag = `${pkg.name}@${pkg.version}`
  const npmUrl = `https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`
  const current = readReleaseBody(tag)
  if (current?.includes(npmUrl)) {
    console.log(`${tag} 的 GitHub Release 已经有 npm 链接`)
    continue
  }
  const nextBody = `${current ?? ''}\n\n## npm\n\n${npmUrl}\n`.trim()
  writeRelease(tag, `${nextBody}\n`, current != null)
  console.log(`已把 ${npmUrl} 写到 GitHub Release ${tag}`)
}
