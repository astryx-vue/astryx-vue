#!/usr/bin/env node
// 落地守卫：CLI 的 `template <slug> <path>` 会把演练场页面原样复制给用户，用户项目只装得
// 下 vue 和 @astryx-vue/core。演练场的 tsconfig 有 @astryx-vue/playground-charts 之类的
// 别名，所以在这个仓库里通过类型检查不代表落地之后能过。
//
// 这个脚本把 catalog 里 isReady 的模板（不引用 playground-charts、除 vue / @astryx-vue/core
// 与相对路径外没有别的导入）用 CLI 自己逐个落到一个临时项目，只靠两个包的导出做
// `vue-tsc --noEmit`，断言全部通过。
//
// 用法：mise exec -- pnpm check:templates   （加 --keep 保留临时目录便于排查）

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: 'pipe', ...options })
}

function step(label) {
  process.stdout.write(`\u001B[2m${label}\u001B[0m\n`)
}

const cliBin = join(repoRoot, 'packages/cli/bin/astryx-vue.mjs')
const coreDir = join(repoRoot, 'packages/core')
const vueTscBin = join(repoRoot, 'apps/docs/node_modules/.bin/vue-tsc')
const catalogPath = join(repoRoot, 'packages/cli/src/generated/catalog.json')

if (!existsSync(vueTscBin)) {
  process.stderr.write(`缺少 ${vueTscBin}，先跑 pnpm install。\n`)
  process.exit(1)
}

step('构建 @astryx-vue/core 与 @astryx-vue/cli')
run('pnpm', ['--filter', '@astryx-vue/core', '--filter', '@astryx-vue/cli', 'build'], { cwd: repoRoot, stdio: 'inherit' })

if (!existsSync(catalogPath)) {
  process.stderr.write(`缺少 ${catalogPath}，先跑 pnpm --filter @astryx-vue/cli generate。\n`)
  process.exit(1)
}

/**
 * isReady 由 packages/cli/src/generate/build-catalog.ts 的 analyzeTemplateImports 算出，
 *  这里只读结果，不重复实现那套规则。
 */
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
const ready = catalog.templates.filter(template => template.isReady)
const skipped = catalog.templates.filter(template => !template.isReady)

if (ready.length === 0) {
  process.stderr.write('catalog 里没有 isReady 的模板，检查 catalog.json 是不是过期了。\n')
  process.exit(1)
}

const projectDir = mkdtempSync(join(tmpdir(), 'astryx-vue-templates-'))
const srcDir = join(projectDir, 'src')
mkdirSync(srcDir, { recursive: true })

writeFileSync(join(projectDir, 'package.json'), `${JSON.stringify({
  name: 'astryx-vue-template-landing',
  private: true,
  type: 'module',
  dependencies: { '@astryx-vue/core': '*', 'vue': '*' },
}, null, 2)}\n`)

// 用户项目里的样子：只有 vue 和 @astryx-vue/core 的包导出，没有任何演练场别名。
// noUnusedLocals / noUnusedParameters 也一并打开，和 apps/docs 的检查强度对齐。
writeFileSync(join(projectDir, 'tsconfig.json'), `${JSON.stringify({
  compilerOptions: {
    target: 'ES2022',
    module: 'ESNext',
    moduleResolution: 'bundler',
    lib: ['DOM', 'DOM.Iterable', 'ES2022'],
    jsx: 'preserve',
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    skipLibCheck: true,
    types: [],
    noEmit: true,
  },
  include: ['src/**/*.vue', 'src/**/*.ts'],
}, null, 2)}\n`)

function link(target, name) {
  const linkDir = join(projectDir, 'node_modules', dirname(name))
  mkdirSync(linkDir, { recursive: true })
  symlinkSync(target, join(projectDir, 'node_modules', name), 'dir')
}

link(join(repoRoot, 'node_modules/vue'), 'vue')
link(coreDir, '@astryx-vue/core')

step(`用 CLI 落地 ${ready.length} 个 isReady 模板`)
const failedCopies = []
for (const template of ready) {
  try {
    run(process.execPath, [cliBin, 'template', template.slug, 'src', '--overwrite'], { cwd: projectDir })
  }
  catch (error) {
    failedCopies.push({ slug: template.slug, message: (error.stderr || error.message || '').trim() })
  }
}

step('vue-tsc --noEmit')
let typecheckError = null
try {
  run(vueTscBin, ['--noEmit', '-p', 'tsconfig.json'], { cwd: projectDir })
}
catch (error) {
  typecheckError = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim() || error.message
}

const landed = ready.length - failedCopies.length
const passed = failedCopies.length === 0 && typecheckError === null

if (passed) {
  process.stdout.write(`\u001B[32m✓ ${landed} 个模板落地后 vue-tsc --noEmit 通过\u001B[0m\n`)
  if (skipped.length > 0)
    process.stdout.write(`\u001B[2m跳过 ${skipped.length} 个 isReady=false 的模板：${skipped.map(item => item.slug).join(', ')}\u001B[0m\n`)
}
else {
  process.stdout.write(`\u001B[31m✗ 落地守卫没通过\u001B[0m\n`)
  for (const failure of failedCopies)
    process.stdout.write(`  复制失败 ${failure.slug}:\n${failure.message}\n`)
  if (typecheckError)
    process.stdout.write(`${typecheckError}\n`)
  process.stdout.write(`  ${landed}/${ready.length} 个模板写成文件，临时项目在 ${projectDir}\n`)
}

if (keep)
  process.stdout.write(`临时项目保留在 ${projectDir}\n`)
else
  rmSync(projectDir, { recursive: true, force: true })

process.exit(passed ? 0 : 1)
