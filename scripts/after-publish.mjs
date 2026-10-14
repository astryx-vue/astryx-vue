import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { retryWithBackoff } from './npm-view-retry.mjs'

const packages = JSON.parse(process.env.PUBLISHED_PACKAGES ?? '[]')
const visibility = process.env.REPO_VISIBILITY ?? ''
// 补齐的版本可能是在本机手动发布的，本来就没有 provenance，这时传 REQUIRE_PROVENANCE=false。
const requireProvenance = process.env.REQUIRE_PROVENANCE !== 'false'

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  })
}

function parseMaxWaitMs() {
  const raw = process.env.NPM_VIEW_MAX_WAIT_MS
  if (raw == null || raw === '')
    return undefined
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0)
    throw new Error(`NPM_VIEW_MAX_WAIT_MS 无效：${raw}`)
  return parsed
}

async function viewPackage(spec) {
  const maxWaitMs = parseMaxWaitMs()
  return retryWithBackoff(
    () => JSON.parse(run('npm', ['view', spec, '--json'])),
    {
      ...(maxWaitMs != null ? { maxWaitMs } : {}),
      onRetry: ({ attempt, error, waitMs, elapsed }) => {
        const stderr = error.stderr?.toString() ?? ''
        const detail = stderr.trim() || String(error.message ?? error)
        console.log(
          `npm view ${spec} 第 ${attempt} 次没有查到（已等待约 ${Math.round(elapsed / 1000)}s），${waitMs}ms 后重试。${detail}`,
        )
      },
    },
  )
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

  if (visibility === 'public' && requireProvenance) {
    if (!hasProvenance(info)) {
      throw new Error(`${spec} 缺少 provenance。dist.attestations=${JSON.stringify(info.dist?.attestations ?? null)}`)
    }
    console.log(`${spec} 已在 npm 上，并且带有 provenance`)
  }
  else {
    console.log(`${spec} 已在 npm 上。仓库可见性是 ${visibility || '未知'}${requireProvenance ? '' : '，且是补齐的版本'}，这次不要求 provenance`)
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
