/**
 * 从磁盘读生成 llms 产物要用的素材：演示源码和组件目录。
 */
import type { CatalogEntry } from '../../components/demo-infra/demoMeta.ts'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { assembleCatalog, parseDemoMetaFields } from '../../components/demo-infra/demoMeta.ts'

async function listFolders(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
}

const DEMO_IMPORT = /import[ \t]+(\w+)[ \t]+from[ \t]+'(\.[^']*?)\.vue\?raw&highlighted'/g
const DEMO_EXPORT = /export\s+const\s+(\w+)\s*=\s*defineDemo\(\s*(\w+)\s*,\s*(\w+)/g

/**
 * 演示组件的导出名 → `.vue` 源码。
 * 页面里只写 `<DemoExample :demo="buttonFloating" />`，靠这张表找回源码。
 */
export async function loadDemoSources(demosDir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const folder of await listFolders(demosDir)) {
    addDemoExports(map, await readFile(join(demosDir, folder, 'index.ts'), 'utf8').catch(() => null), join(demosDir, folder))
  }
  return map
}

/**
 * 不属于某个组件的演示（比如扩展包的文档）放在 `components/` 下名字以 `-demos` 结尾的目录里，
 * 每个目录一个 `index.ts`，不进组件目录，但页面里照样用 `<DemoExample :demo="…" />`。
 * 这里把它们全部找出来，新增一个扩展包的演示目录不用再改这个脚本。
 */
export async function loadStandaloneDemoSources(componentsDir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const entries = await readdir(componentsDir, { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.endsWith('-demos'))
      continue
    const dir = join(componentsDir, entry.name)
    addDemoExports(map, await readFile(join(dir, 'index.ts'), 'utf8').catch(() => null), dir)
  }
  return map
}

function addDemoExports(map: Map<string, string>, index: string | null, folder: string): void {
  if (index === null)
    return
  const imports = new Map(Array.from(index.matchAll(DEMO_IMPORT), match => [match[1], match[2]]))
  for (const match of index.matchAll(DEMO_EXPORT)) {
    const file = imports.get(match[3])
    if (file !== undefined)
      map.set(match[1], join(folder, `${file}.vue`))
  }
}

export async function loadDemoContents(sources: Map<string, string>): Promise<Map<string, string>> {
  const entries = await Promise.all(Array.from(sources, async ([name, path]) => {
    const source = await readFile(path, 'utf8').catch(() => null)
    return source === null ? null : [name, source] as const
  }))
  return new Map(entries.filter(entry => entry !== null))
}

export async function loadCatalog(demosDir: string): Promise<CatalogEntry[]> {
  const metas = await Promise.all((await listFolders(demosDir)).map(async (folder) => {
    const source = await readFile(join(demosDir, folder, 'meta.ts'), 'utf8').catch(() => null)
    return source === null ? null : parseDemoMetaFields(source)
  }))
  return assembleCatalog(metas.filter(meta => meta !== null))
}
