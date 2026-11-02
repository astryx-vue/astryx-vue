import process from 'node:process'

/**
 * 按改动范围决定 PR 要跑哪些测试。
 *
 * 输出一行 shell 可用的赋值：`mode=narrow paths='packages/core/src'` 或 `mode=all`。
 * 只改一个组件时不必跑全仓库；改到配置、脚本、锁文件这类谁都可能受影响的东西，
 * 就退回全量，避免漏测。
 */

const SHARED_PREFIXES = [
  '.github/',
  'scripts/',
  'tests/',
  'vitest.config',
  'tsconfig',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'package.json',
  'eslint.config',
]

/** 每个工作区自己的测试目录。改到哪里就只跑哪里。 */
const PACKAGE_ROOTS = {
  'packages/core/': 'packages/core/src',
  'packages/richtext/': 'packages/richtext/src',
  'packages/charts/': 'packages/charts/src',
  'packages/lab/': 'packages/lab/src',
  'packages/cli/': 'packages/cli/src',
  'packages/themes/': 'packages/themes',
  'apps/docs/': 'apps/docs',
}

export function scopeForFiles(files) {
  if (files.length === 0)
    return { mode: 'narrow', paths: [] }
  const shared = files.some(file => SHARED_PREFIXES.some(prefix => file.startsWith(prefix)) || prefixMatchesRoot(file))
  if (shared)
    return { mode: 'all' }

  const paths = new Set()
  for (const file of files) {
    for (const [prefix, root] of Object.entries(PACKAGE_ROOTS)) {
      if (file.startsWith(prefix))
        paths.add(root)
    }
  }
  // 只动了文档正文时没有可跑的源码测试，仍然跑一遍固定守卫。
  return { mode: 'narrow', paths: [...paths].sort() }
}

function prefixMatchesRoot(file) {
  return !Object.keys(PACKAGE_ROOTS).some(prefix => file.startsWith(prefix)) && !file.includes('/')
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const base = process.argv[2]
  if (!base) {
    console.error('用法：node scripts/affected-checks.mjs <base-ref>')
    process.exit(2)
  }
  const { execFileSync } = await import('node:child_process')
  const output = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' })
  const files = output.split('\n').map(line => line.trim()).filter(Boolean)
  const scope = scopeForFiles(files)
  console.log(`mode=${scope.mode}`)
  console.log(`paths=${scope.paths.join(' ')}`)
  console.log(`changed=${files.length}`)
}
