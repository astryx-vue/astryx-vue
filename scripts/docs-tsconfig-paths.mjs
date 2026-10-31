// 生成文档站 tsconfig 里「本仓库各包 → 源码」的路径映射。
//
// 文档站要读本仓库各包的源码（改了组件，文档站立刻跟着变），做法有两种：
// 开 `customConditions: ['source']`，或者逐个写路径映射。前者是全局的：第三方包的 package.json
// 里如果也有一个叫 `source` 的条件（Lexical 每个包都有，指向它自己的 `src/*.ts`），
// 它们的源码就会被当成我们的代码检查，报出上百条和我们无关的错误。
// 所以这里用后者：只把本仓库的包映射到源码，第三方包按发布的类型声明解析。
//
// 用法：node scripts/docs-tsconfig-paths.mjs        检查 tsconfig 里的映射和各包 `source` 字段是否一致
//       node scripts/docs-tsconfig-paths.mjs --write 把最新的映射写进 apps/docs/tsconfig.json
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const TSCONFIG = join(ROOT, 'apps/docs/tsconfig.json')

/** 本仓库各包的 `exports` 里带 `source` 的入口，换成相对 apps/docs 的源码路径。 */
export function ownPackagePaths(root = ROOT) {
  const paths = {}
  const packagesDir = join(root, 'packages')
  for (const dir of readdirSync(packagesDir).sort()) {
    let manifest
    try {
      manifest = JSON.parse(readFileSync(join(packagesDir, dir, 'package.json'), 'utf8'))
    }
    catch {
      continue
    }
    for (const [key, value] of Object.entries(manifest.exports ?? {})) {
      if (value == null || typeof value !== 'object' || typeof value.source !== 'string')
        continue
      const specifier = key === '.' ? manifest.name : `${manifest.name}/${key.slice(2)}`
      paths[specifier] = [`../../packages/${dir}/${value.source.slice(2)}`]
    }
  }
  return paths
}

function load() {
  return JSON.parse(readFileSync(TSCONFIG, 'utf8'))
}

/** tsconfig 里不属于本仓库包的映射（比如演练场的别名），原样保留。 */
function foreignPaths(config, own) {
  return Object.fromEntries(Object.entries(config.compilerOptions.paths ?? {}).filter(([key]) => !key.startsWith('@astryx-vue/') || (!(key in own) && key === '@astryx-vue/playground-charts')))
}

export function nextConfig() {
  const config = load()
  const own = ownPackagePaths()
  delete config.compilerOptions.customConditions
  config.compilerOptions.paths = { ...foreignPaths(config, own), ...own }
  config.compilerOptions.paths = Object.fromEntries(Object.entries(config.compilerOptions.paths).sort(([a], [b]) => a.localeCompare(b)))
  return `${JSON.stringify(config, null, 2)}\n`
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const next = nextConfig()
  if (process.argv.includes('--write')) {
    writeFileSync(TSCONFIG, next)
    process.stdout.write('已写入 apps/docs/tsconfig.json\n')
  }
  else if (readFileSync(TSCONFIG, 'utf8') !== next) {
    process.stderr.write('apps/docs/tsconfig.json 里的包路径映射和各包 package.json 的 `source` 对不上，请运行：node scripts/docs-tsconfig-paths.mjs --write\n')
    process.exit(1)
  }
  else {
    process.stdout.write('文档站 tsconfig 的包路径映射和各包 `source` 一致。\n')
  }
}
