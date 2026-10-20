// 生成器共用的目录约定和排序规则：组件目录怎么找、名字怎么排、生成的 TS 文件带什么文件头。
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export const TS_BANNER = '// 这个文件由 `pnpm sync` 生成，不要手改。\n'

export function compareName(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

export function compareDir(a, b) {
  return a.localeCompare(b, 'en', { sensitivity: 'base' }) || compareName(a, b)
}

function listDirectories(dir) {
  if (!existsSync(dir))
    return []
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

/** `packages/core/src` 下带 `index.ts` 的组件目录，不含 composables。 */
export function componentDirs(rootDir) {
  return listDirectories(join(rootDir, 'packages/core/src'))
    .filter(name => existsSync(join(rootDir, 'packages/core/src', name, 'index.ts')))
    .filter(name => name !== 'composables')
    .sort(compareDir)
}
