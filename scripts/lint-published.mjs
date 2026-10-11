import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const packages = ['packages/core', 'packages/themes']

function run(command, args, options = {}) {
  try {
    const stdout = execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    })
    if (stdout)
      process.stdout.write(stdout.endsWith('\n') ? stdout : `${stdout}\n`)
    return { ok: true, stdout }
  }
  catch (error) {
    const stdout = error.stdout?.toString() ?? ''
    const stderr = error.stderr?.toString() ?? ''
    if (stdout)
      process.stdout.write(stdout.endsWith('\n') || stdout.length === 0 ? stdout : `${stdout}\n`)
    if (stderr)
      process.stderr.write(stderr.endsWith('\n') || stderr.length === 0 ? stderr : `${stderr}\n`)
    return { ok: false, stdout, stderr, status: error.status ?? 1 }
  }
}

function walkExportObjects(value, visit) {
  if (value == null || typeof value !== 'object')
    return
  if (!Array.isArray(value))
    visit(value)
  for (const child of Object.values(value))
    walkExportObjects(child, visit)
}

let failed = false

for (const relativeDir of packages) {
  const cwd = join(rootDir, relativeDir)
  const temp = mkdtempSync(join(tmpdir(), 'astryx-pack-'))
  console.log(`\n== ${relativeDir} ==`)
  try {
    const packed = run('pnpm', ['pack', '--pack-destination', temp, '--json'], { cwd })
    if (!packed.ok) {
      failed = true
      continue
    }
    const tarballName = readdirSync(temp).find(name => name.endsWith('.tgz'))
    if (!tarballName) {
      console.error(`${relativeDir} 没有生成 tarball`)
      failed = true
      continue
    }
    const tarball = join(temp, tarballName)
    console.log(`\n${tarballName}`)
    const listing = run('tar', ['-tvf', tarball])
    if (!listing.ok)
      failed = true
    const extracted = run('tar', ['-xzf', tarball, '-C', temp])
    if (!extracted.ok) {
      failed = true
      continue
    }
    const manifestPath = join(temp, 'package', 'package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const problems = []
    walkExportObjects(manifest.exports, (entry) => {
      if (Object.hasOwn(entry, 'source'))
        problems.push('发布后的 exports 仍包含 source')
    })
    const raw = JSON.stringify(manifest)
    if (raw.includes('catalog:') || raw.includes('workspace:'))
      problems.push('catalog: 或 workspace: 没有被改写成具体版本')
    if (manifest.peerDependencies?.vue !== undefined && manifest.peerDependencies.vue !== '^3.5.0')
      problems.push(`vue peerDependencies 是 ${manifest.peerDependencies.vue}，期望 ^3.5.0`)
    if (problems.length > 0) {
      failed = true
      console.error(problems.join('\n'))
    }
    else {
      console.log('packed manifest: 没有 source，catalog:/workspace: 已改写')
    }

    const publint = run('pnpm', ['exec', 'publint', 'run', tarball, '--level', 'error'])
    if (!publint.ok)
      failed = true
    const attw = run('pnpm', ['exec', 'attw', tarball, '--format', 'ascii', '--profile', 'esm-only'])
    if (!attw.ok)
      failed = true
  }
  finally {
    rmSync(temp, { recursive: true, force: true })
  }
}

if (failed)
  process.exitCode = 1
