// 生成 `packages/core/src/index.ts`（包的总入口）和 `composables/index.ts`。
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { compareDir, compareName, componentDirs, TS_BANNER } from './source-layout.mjs'
import { collectExports } from './ts-exports.mjs'

// 这些名字在改成自动生成之前就没有从包的总入口导出。
// 子路径仍然导出它们。新组件的导出会照常进入总入口。
const ROOT_NAME_OMISSIONS = new Set([
  'SkeletonProps',
  'SkeletonRadius',
  'SkeletonSizeValue',
  'formatCalendarMonth',
  'weekdayNames',
])

// 组件内部在用，但 composables/index.ts 原来没有收录。新文件会自动收录。
const COMPOSABLE_FILE_OMISSIONS = new Set([
  'useCalendar.ts',
  'usePagination.ts',
])

function isInjectionKey(name) {
  return name.endsWith('_KEY') || /^[a-z].*Key$/.test(name)
}

function sortedNames(names) {
  return [...names].sort(compareName)
}

function formatNamedExport(kind, names, from) {
  const keyword = kind === 'type' ? 'export type' : 'export'
  const oneLine = `${keyword} { ${names.join(', ')} } from '${from}'`
  if (oneLine.length <= 120)
    return oneLine
  return `${keyword} {\n${names.map(name => `  ${name},`).join('\n')}\n} from '${from}'`
}

/** 值导出和类型导出各写一行（太长就折行），哪类为空就不写。 */
function pushNamedExports(lines, values, types, from) {
  if (values.length > 0)
    lines.push(formatNamedExport('value', values, from))
  if (types.length > 0)
    lines.push(formatNamedExport('type', types, from))
}

function publicExports(file) {
  const collected = collectExports(file)
  const values = new Set([...collected.values].filter(name => !isInjectionKey(name) && !ROOT_NAME_OMISSIONS.has(name)))
  const types = new Set([...collected.types].filter(name => !isInjectionKey(name) && !ROOT_NAME_OMISSIONS.has(name)))
  return { values, types }
}

export function renderIndex(rootDir) {
  const lines = [TS_BANNER.trimEnd(), '']
  const entries = [
    ...componentDirs(rootDir).map(name => ({ kind: 'component', name })),
    { kind: 'composables', name: 'composables' },
  ].sort((a, b) => compareDir(a.name, b.name))

  const seen = new Map()
  function claim(name, owner) {
    const previous = seen.get(name)
    if (previous)
      throw new Error(`导出名字 ${name} 同时来自 ${previous} 和 ${owner}`)
    seen.set(name, owner)
  }

  for (const entry of entries) {
    if (entry.kind === 'composables') {
      const composableFile = join(rootDir, 'packages/core/src/composables/index.ts')
      if (!existsSync(dirname(composableFile)))
        continue
      lines.push('export * from \'./composables/index.js\'')
      const barrel = renderComposables(rootDir)
      for (const name of barrel.names)
        claim(name, 'composables')
      continue
    }

    const file = join(rootDir, 'packages/core/src', entry.name, 'index.ts')
    const exported = publicExports(file)
    for (const name of [...exported.values, ...exported.types])
      claim(name, entry.name)
    const values = sortedNames(exported.values)
    const types = sortedNames(exported.types)
    if (values.length === 0 && types.length === 0)
      throw new Error(`${entry.name}/index.ts 没有可以放进总入口的具名导出`)
    pushNamedExports(lines, values, types, `./${entry.name}/index.js`)
  }

  return `${lines.join('\n')}\n`
}

function composableSources(rootDir) {
  const dir = join(rootDir, 'packages/core/src/composables')
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.ts'))
    .filter(name => name !== 'index.ts' && !name.endsWith('.test.ts'))
    .filter(name => !COMPOSABLE_FILE_OMISSIONS.has(name))
    .sort(compareName)
}

/** 返回 composables 汇总文件的内容 `text`，以及它导出的全部名字 `names`。 */
export function renderComposables(rootDir) {
  const lines = [TS_BANNER.trimEnd(), '']
  const names = []
  for (const fileName of composableSources(rootDir)) {
    const exported = collectExports(join(rootDir, 'packages/core/src/composables', fileName))
    const values = sortedNames(exported.values)
    const types = sortedNames(exported.types)
    if (values.length === 0 && types.length === 0)
      throw new Error(`composables/${fileName} 没有具名导出`)
    pushNamedExports(lines, values, types, `./${fileName.replace(/\.ts$/, '.js')}`)
    lines.push('')
    names.push(...values, ...types)
  }
  return { text: `${lines.join('\n').replace(/\n+$/, '\n')}`, names }
}
